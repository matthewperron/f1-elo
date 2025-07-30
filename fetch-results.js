import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const API_BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const RATE_LIMIT_DELAY = 8000; // 8 seconds between API calls (API limits: 4/sec, 500/hour)
// Output file will be determined dynamically based on season

/**
 * Sleep utility function for rate limiting
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch a single page of results from the Ergast API with rate limit handling
 */
async function fetchResultsPage(season, offset = 0, limit = 30, retryCount = 0) {
    const url = `${API_BASE_URL}/${season}/results/?offset=${offset}&limit=${limit}`;
    const maxRetries = 3;
    
    console.log(`Fetching: ${url}`);
    
    try {
        const response = await fetch(url);
        
        if (response.status === 429) {
            // Rate limited - calculate retry delay
            const retryAfter = response.headers.get('retry-after');
            const delaySeconds = retryAfter ? parseInt(retryAfter) : Math.max(RATE_LIMIT_DELAY / 1000, Math.pow(2, retryCount) * 10);
            
            if (retryCount < maxRetries) {
                console.log(`⚠ Rate limited (429). API requests exceeded limit.`);
                console.log(`⚠ Waiting ${delaySeconds} seconds before retry ${retryCount + 1}/${maxRetries}...`);
                console.log(`⚠ Consider reducing request frequency if this happens frequently.`);
                await sleep(delaySeconds * 1000);
                return fetchResultsPage(season, offset, limit, retryCount + 1);
            } else {
                throw new Error(`Rate limit exceeded after ${maxRetries} retries. API limits: 4 req/sec, 500 req/hour. Please try again later.`);
            }
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.MRData;
    } catch (error) {
        // If it's a rate limit error that we've already handled, re-throw
        if (error.message.includes('Rate limit exceeded')) {
            throw error;
        }
        
        // For other errors, retry with exponential backoff
        if (retryCount < maxRetries) {
            const delaySeconds = Math.pow(2, retryCount) * 5; // 5s, 10s, 20s
            console.log(`⚠ Request failed. Retrying in ${delaySeconds} seconds... (${retryCount + 1}/${maxRetries})`);
            await sleep(delaySeconds * 1000);
            return fetchResultsPage(season, offset, limit, retryCount + 1);
        }
        
        console.error(`Error fetching results from ${url}:`, error);
        throw error;
    }
}

/**
 * Fetch all results for a given season with pagination
 */
async function fetchAllSeasonResults(season) {
    const allRaces = [];
    let offset = 0;
    const limit = 30;
    let total = null;
    let requestCount = 0;
    
    console.log(`Starting to fetch all results for ${season} season...`);
    console.log(`API Rate Limits: 4 requests/second, 500 requests/hour`);
    console.log(`Using ${RATE_LIMIT_DELAY / 1000}s delay between requests to stay within limits`);
    
    do {
        requestCount++;
        
        // Fetch current page
        const pageData = await fetchResultsPage(season, offset, limit);
        
        // Set total on first request
        if (total === null) {
            total = parseInt(pageData.total);
            const estimatedRequests = Math.ceil(total / limit);
            console.log(`Total individual results available: ${total}`);
            console.log(`Estimated API requests needed: ${estimatedRequests}`);
            
            // Check if no results available
            if (total === 0) {
                console.log(`No results found for ${season} season`);
                return [];
            }
        }
        
        // Extract races from current page
        if (pageData.RaceTable && pageData.RaceTable.Races) {
            const racesThisPage = pageData.RaceTable.Races.length;
            allRaces.push(...pageData.RaceTable.Races);
            const resultsProcessed = Math.min(offset + limit, total);
            console.log(`Request ${requestCount}: Fetched ${racesThisPage} race events (${resultsProcessed}/${total} individual results processed)`);
        }
        
        // Move to next page
        offset += limit;
        
        // Rate limiting - wait before next request
        if (offset < total) {
            const delaySeconds = RATE_LIMIT_DELAY / 1000;
            const remainingRequests = Math.ceil((total - offset) / limit);
            const estimatedTimeMinutes = (remainingRequests * delaySeconds) / 60;
            console.log(`Rate limiting: waiting ${delaySeconds}s before next request...`);
            console.log(`Estimated time remaining: ${estimatedTimeMinutes.toFixed(1)} minutes for ${remainingRequests} more requests`);
            await sleep(RATE_LIMIT_DELAY);
        }
        
    } while (offset < total);
    
    console.log(`✓ Successfully fetched all data for ${season} season`);
    console.log(`✓ Raw race events collected: ${allRaces.length} (includes duplicates)`);
    return allRaces;
}

/**
 * Transform and aggregate race data
 */
function transformRaceData(races, season) {
    // Merge races by round number to handle pagination splits
    const mergedRaces = races.reduce((acc, race) => {
        const key = race.round;
        if (!acc[key]) {
            // First occurrence of this race
            acc[key] = { ...race };
        } else {
            // Merge results from paginated responses
            const existingResults = acc[key].Results || [];
            const newResults = race.Results || [];
            
            // Combine results and remove duplicates by position
            const allResults = [...existingResults, ...newResults];
            const uniqueResults = allResults.reduce((resultAcc, result) => {
                const posKey = result.position;
                if (!resultAcc[posKey]) {
                    resultAcc[posKey] = result;
                }
                return resultAcc;
            }, {});
            
            acc[key].Results = Object.values(uniqueResults);
        }
        return acc;
    }, {});
    
    // Convert back to array and sort by date to ensure chronological order
    const sortedRaces = Object.values(mergedRaces).sort((a, b) => {
        const dateA = new Date(a.date + (a.time ? ` ${a.time}` : ''));
        const dateB = new Date(b.date + (b.time ? ` ${b.time}` : ''));
        return dateA - dateB;
    });
    
    return {
        season: season,
        totalRaces: sortedRaces.length,
        races: sortedRaces.map(race => ({
            round: parseInt(race.round),
            raceName: race.raceName,
            circuitName: race.Circuit.circuitName,
            country: race.Circuit.Location.country,
            date: race.date,
            time: race.time || null,
            results: race.Results.map(result => ({
                position: result.position,
                positionText: result.positionText,
                points: parseFloat(result.points),
                driver: {
                    driverId: result.Driver.driverId,
                    code: result.Driver.code,
                    givenName: result.Driver.givenName,
                    familyName: result.Driver.familyName,
                    nationality: result.Driver.nationality
                },
                constructor: {
                    constructorId: result.Constructor.constructorId,
                    name: result.Constructor.name,
                    nationality: result.Constructor.nationality
                },
                grid: parseInt(result.grid),
                laps: parseInt(result.laps),
                status: result.status,
                time: result.Time ? result.Time.time : null,
                fastestLap: result.FastestLap ? {
                    rank: parseInt(result.FastestLap.rank),
                    lap: parseInt(result.FastestLap.lap),
                    time: result.FastestLap.Time.time
                } : null
            }))
        }))
    };
}

/**
 * Save aggregated data to JSON file
 */
async function saveToFile(data, filename) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(filename, jsonString, 'utf8');
        console.log(`✓ Data saved to ${filename}`);
        console.log(`File size: ${(jsonString.length / 1024).toFixed(2)} KB`);
    } catch (error) {
        console.error(`Error saving to ${filename}:`, error);
        throw error;
    }
}

/**
 * Main function to fetch and aggregate F1 data
 */
async function main() {
    // Get season from command line argument or default to 2025
    const season = process.argv[2] || '2025';
    console.log(`Using season: ${season}`);
    
    try {
        console.log('='.repeat(50));
        console.log('F1 ELO Data Fetcher');
        console.log('='.repeat(50));
        
        // Validate season format
        if (!/^\d{4}$/.test(season)) {
            throw new Error(`Invalid season format: ${season}. Please use a 4-digit year (e.g., 2024)`);
        }
        
        // Fetch all results for the season
        const races = await fetchAllSeasonResults(season);
        
        // Transform and aggregate the data
        console.log('\\nTransforming race data...');
        const aggregatedData = transformRaceData(races, season);
        
        // Save to file
        console.log('\\nSaving data to file...');
        const outputFile = `data/${season}-race-results.json`;
        await saveToFile(aggregatedData, outputFile);
        
        console.log('\\n' + '='.repeat(50));
        console.log('✓ Data fetch completed successfully!');
        console.log(`✓ Season: ${season}`);
        console.log(`✓ Total races: ${aggregatedData.totalRaces}`);
        console.log(`✓ Output file: ${outputFile}`);
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('\\n' + '='.repeat(50));
        console.error('✗ Error during data fetch:');
        console.error(error);
        console.error('='.repeat(50));
        process.exit(1);
    }
}

// Export functions for use in other modules
export { fetchAllSeasonResults, transformRaceData, saveToFile };

// Run the script if called directly
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
    main().catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
