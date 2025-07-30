import { fetchAllSeasonResults, transformRaceData, saveToFile } from './fetch-results.js';
import { calculateELO, updateREADME, saveFinalELOs, generateSeasonReport } from './calculate-elo.js';
import fs from 'fs/promises';

/**
 * Global peak ELO trackers across all seasons (separate for each ELO type)
 */
const qualifyingPeakELOs = new Map(); // driverId -> { peak, date, race, round, season, constructor, teammate, teammateElo, name }
const racePeakELOs = new Map();       // driverId -> { peak, date, race, round, season, constructor, teammate, teammateElo, name }
const globalPeakELOs = new Map();     // driverId -> { peak, date, race, round, season, constructor, teammate, teammateElo, name }

/**
 * Update peak ELO tracking for drivers in this season
 */
function updatePeakELOs(driverRatings, raceEvents, season) {
    // Track peak ELO by processing race events chronologically
    raceEvents.forEach(raceEvent => {
        raceEvent.eloChanges.forEach(change => {
            const driverId = change.driverId;
            const currentElo = change.newElo;
            const eloType = change.type;
            
            // Find teammate info from the same race event
            const teammateChange = raceEvent.eloChanges.find(c => 
                c.driverId !== driverId && 
                c.type === change.type && 
                c.constructor === change.constructor
            );
            
            const peakData = {
                peak: currentElo,
                date: raceEvent.date,
                race: raceEvent.raceName,
                round: raceEvent.round,
                season: season,
                constructor: change.constructor,
                teammate: teammateChange ? teammateChange.driverName : 'Unknown',
                teammateElo: teammateChange ? teammateChange.newElo : null,
                name: change.driverName
            };
            
            // Update the appropriate peak tracker based on ELO type
            let peakMap;
            switch (eloType) {
                case 'qualifying':
                    peakMap = qualifyingPeakELOs;
                    break;
                case 'race':
                    peakMap = racePeakELOs;
                    break;
                case 'global':
                    peakMap = globalPeakELOs;
                    break;
                default:
                    return; // Skip unknown types
            }
            
            // Check if this is a new peak for this driver in this ELO type
            if (!peakMap.has(driverId) || currentElo > peakMap.get(driverId).peak) {
                peakMap.set(driverId, peakData);
            }
        });
    });
}

/**
 * Generate peak ELO markdown file with 3 separate tables
 */
async function generatePeakELOFile() {
    // Helper function to create a table for a specific ELO type
    function createPeakTable(peakMap, eloType, title) {
        const peakDrivers = Array.from(peakMap.entries())
            .map(([driverId, data]) => ({ driverId, ...data }))
            .sort((a, b) => b.peak - a.peak);
        
        let tableContent = `## ${title}\n\n`;
        tableContent += `| Rank | Driver | Peak ELO | Constructor | Date | Season | Teammate | Teammate ELO | Race |\n`;
        tableContent += `|------|--------|----------|-------------|------|--------|----------|--------------|------|\n`;
        
        peakDrivers.forEach((driver, index) => {
            // Create anchor link for the specific race (format: round-{number}-{racename})
            const roundNumber = driver.round || 'unknown';
            const raceTitle = `Round ${roundNumber}: ${driver.race}`;
            const raceAnchor = raceTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
            const raceLink = `[${raceTitle}](./results/${driver.season}-season-report.md#${raceAnchor})`;
            tableContent += `| ${index + 1} | ${driver.name} | **${driver.peak}** | ${driver.constructor} | ${driver.date} | ${driver.season} | ${driver.teammate} | ${driver.teammateElo || 'N/A'} | ${raceLink} |\n`;
        });
        
        return { content: tableContent, drivers: peakDrivers };
    }
    
    // Create content with explanation
    let content = `# F1 Driver Peak ELO Ratings\n\n`;
    content += `This file contains the highest ELO ratings ever achieved by each Formula 1 driver across three categories:\n\n`;
    content += `- **Qualifying ELO**: Based solely on qualifying performance vs teammates\n`;
    content += `- **Race ELO**: Based solely on race finishing position vs teammates\n`;
    content += `- **Global ELO**: Combined rating (30% qualifying + 70% race performance)\n\n`;
    
    // Generate all three tables
    const globalTable = createPeakTable(globalPeakELOs, 'global', 'Peak Global ELO Rankings (30% Qualifying + 70% Race)');
    const qualifyingTable = createPeakTable(qualifyingPeakELOs, 'qualifying', 'Peak Qualifying ELO Rankings');
    const raceTable = createPeakTable(racePeakELOs, 'race', 'Peak Race ELO Rankings');
    
    // Add tables to content (Global first as it's most important)
    content += globalTable.content + '\n';
    content += qualifyingTable.content + '\n';
    content += raceTable.content + '\n';
    
    // Statistics
    content += `## Statistics\n\n`;
    content += `### Global ELO\n`;
    content += `- **Total drivers tracked**: ${globalTable.drivers.length}\n`;
    content += `- **Highest peak**: ${globalTable.drivers[0]?.peak || 'N/A'} (${globalTable.drivers[0]?.name || 'N/A'})\n`;
    content += `- **Average peak**: ${Math.round(globalTable.drivers.reduce((sum, d) => sum + d.peak, 0) / globalTable.drivers.length) || 'N/A'}\n\n`;
    
    content += `### Qualifying ELO\n`;
    content += `- **Total drivers tracked**: ${qualifyingTable.drivers.length}\n`;
    content += `- **Highest peak**: ${qualifyingTable.drivers[0]?.peak || 'N/A'} (${qualifyingTable.drivers[0]?.name || 'N/A'})\n`;
    content += `- **Average peak**: ${Math.round(qualifyingTable.drivers.reduce((sum, d) => sum + d.peak, 0) / qualifyingTable.drivers.length) || 'N/A'}\n\n`;
    
    content += `### Race ELO\n`;
    content += `- **Total drivers tracked**: ${raceTable.drivers.length}\n`;
    content += `- **Highest peak**: ${raceTable.drivers[0]?.peak || 'N/A'} (${raceTable.drivers[0]?.name || 'N/A'})\n`;
    content += `- **Average peak**: ${Math.round(raceTable.drivers.reduce((sum, d) => sum + d.peak, 0) / raceTable.drivers.length) || 'N/A'}\n\n`;
    
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    content += `*Generated on: ${timestamp}*\n`;
    
    await fs.writeFile('peak-elo.md', content, 'utf8');
    console.log(`✓ Generated peak-elo.md with 3 ELO type tables`);
    
    // Return all three driver arrays for README tables
    return {
        global: globalTable.drivers,
        qualifying: qualifyingTable.drivers, 
        race: raceTable.drivers
    };
}

/**
 * Update README with top 30 drivers tables (3 separate tables)
 */
async function updateREADMEWithTop30(peakDriversData) {
    try {
        const readmeContent = await fs.readFile('README.md', 'utf8');
        
        // Helper function to create a table
        function createTop30Table(drivers, title, description) {
            const top30 = drivers.slice(0, 30);
            let tableContent = `\n## ${title}\n\n`;
            tableContent += `${description}\n\n`;
            tableContent += `| Rank | Driver | Peak ELO | Constructor | Teammate | Teammate ELO | Season | Race |\n`;
            tableContent += `|------|--------|----------|-------------|----------|--------------|--------|------|\n`;
            
            top30.forEach((driver, index) => {
                // Create anchor link for the specific race (format: round-{number}-{racename})
                const roundNumber = driver.round || 'unknown';
                const raceTitle = `Round ${roundNumber}: ${driver.race}`;
                const raceAnchor = raceTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                const raceLink = `[${raceTitle}](./results/${driver.season}-season-report.md#${raceAnchor})`;
                tableContent += `| ${index + 1} | ${driver.name} | **${driver.peak}** | ${driver.constructor} | ${driver.teammate} | ${driver.teammateElo || 'N/A'} | ${driver.season} | ${raceLink} |\n`;
            });
            
            return tableContent;
        }
        
        // Create all three tables
        let allTablesContent = '';
        allTablesContent += createTop30Table(
            peakDriversData.race, 
            'Top 30 F1 Drivers of All Time - Race Performance',
            'Based on peak **Race ELO** ratings (race finishing positions vs teammates).'
        );
        allTablesContent += createTop30Table(
            peakDriversData.qualifying, 
            'Top 30 F1 Drivers of All Time - Qualifying Performance', 
            'Based on peak **Qualifying ELO** ratings (qualifying positions vs teammates).'
        );
        allTablesContent += createTop30Table(
            peakDriversData.global, 
            'Top 30 F1 Drivers of All Time - Overall Performance',
            'Based on peak **Global ELO** ratings (30% qualifying + 70% race performance vs teammates).'
        );
        
        const now = new Date();
        const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
        allTablesContent += `\n*Based on peak ELO ratings achieved during their F1 careers. Updated: ${timestamp}*\n`;
        
        // Find the position to insert the tables (after the current season results)
        const eloResultsEndPattern = /<!-- ELO_RESULTS_END -->/;
        const match = readmeContent.match(eloResultsEndPattern);
        
        if (match) {
            const insertPosition = match.index + match[0].length;
            const beforeTables = readmeContent.substring(0, insertPosition);
            const afterTables = readmeContent.substring(insertPosition);
            
            // Remove any existing top 30 tables
            const cleanAfterTables = afterTables.replace(/\n## Top 30 F1 Drivers of All Time.*?\*Based on peak ELO ratings.*?\*\n/s, '');
            
            const newContent = beforeTables + allTablesContent + cleanAfterTables;
            await fs.writeFile('README.md', newContent, 'utf8');
            console.log(`✓ Added 3 top 30 drivers tables to README`);
        } else {
            console.log(`⚠ Could not find ELO_RESULTS_END marker in README`);
        }
    } catch (error) {
        console.error(`⚠ Error updating README with top 30 tables:`, error.message);
    }
}

/**
 * Calculate ELO for a single season with rate limit handling
 */
async function calculateSeason(season, retryCount = 0) {
    const maxRetries = 2;
    
    try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Processing Season: ${season}${retryCount > 0 ? ` (Retry ${retryCount})` : ''}`);
        console.log(`${'='.repeat(60)}`);
        
        // Step 1: Check if we need to fetch data
        let raceData;
        const outputFile = `data/${season}-race-results.json`;
        
        try {
            const existingData = await fs.readFile(outputFile, 'utf8');
            raceData = JSON.parse(existingData);
            
            if (raceData.season === season) {
                console.log(`✓ Using existing ${season} season data`);
            } else {
                throw new Error('Different season data found');
            }
        } catch {
            console.log(`Fetching race data for ${season}...`);
            
            try {
                // Fetch data
                const races = await fetchAllSeasonResults(season);
                
                if (races.length === 0) {
                    console.log(`⚠ No race data found for ${season} season - skipping`);
                    return { success: false, reason: 'No race data' };
                }
                
                // Transform and save data
                raceData = transformRaceData(races, season);
                await saveToFile(raceData, outputFile);
            } catch (fetchError) {
                // Check if it's a rate limit error
                if (fetchError.message.includes('Rate limit exceeded')) {
                    console.log(`🛑 RATE LIMIT ERROR for season ${season}`);
                    console.log(`   Ergast API has blocked further requests.`);
                    console.log(`   Please wait a few minutes and re-run with:`);
                    console.log(`   npm run bulk-calculate -- ${season} [end_year]`);
                    
                    return { 
                        success: false, 
                        season, 
                        error: 'Rate limited', 
                        retryCommand: `npm run bulk-calculate -- ${season}`,
                        needsRetry: true 
                    };
                }
                
                // For other fetch errors, throw to be caught by outer try-catch
                throw fetchError;
            }
        }
        
        // Step 2: Calculate ELO ratings
        const { driverRatings, raceEvents } = await calculateELO(raceData, season);
        
        // Step 2.5: Update peak ELO tracking for each driver
        updatePeakELOs(driverRatings, raceEvents, season);
        
        // Step 3: Generate detailed season report
        await generateSeasonReport(driverRatings, raceEvents, season);
        
        // Step 4: Save final ELOs (but don't update README for each season)
        await saveFinalELOs(driverRatings, raceData, season);
        
        console.log(`✓ Season ${season} completed successfully!`);
        console.log(`  - Total races: ${raceData.totalRaces}`);
        console.log(`  - Drivers rated: ${driverRatings.length}`);
        console.log(`  - Top driver: ${driverRatings[0].consoleName} (${driverRatings[0].globalElo} ELO)`);
        
        return { 
            success: true, 
            season, 
            races: raceData.totalRaces, 
            drivers: driverRatings.length,
            topDriver: `${driverRatings[0].consoleName} (${driverRatings[0].globalElo} ELO)`
        };
        
    } catch (error) {
        // Check if it's a rate limit error that wasn't caught in the fetch block
        if (error.message.includes('Rate limit') || error.message.includes('429')) {
            console.log(`🛑 RATE LIMIT ERROR for season ${season}`);
            console.log(`   Please wait a few minutes and re-run with:`);
            console.log(`   npm run bulk-calculate -- ${season} [end_year]`);
            
            return { 
                success: false, 
                season, 
                error: 'Rate limited', 
                retryCommand: `npm run bulk-calculate -- ${season}`,
                needsRetry: true 
            };
        }
        
        console.error(`✗ Error processing season ${season}:`, error.message);
        return { success: false, season, error: error.message };
    }
}

/**
 * Bulk calculate ELO for all seasons from start to end year
 */
async function bulkCalculate() {
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(process.argv[2]) || 1950;
    const endYear = parseInt(process.argv[3]) || currentYear;
    
    // Validate arguments
    if (startYear < 1950 || startYear > currentYear) {
        console.error(`Start year must be between 1950 and ${currentYear}`);
        process.exit(1);
    }
    
    if (endYear < startYear || endYear > currentYear) {
        console.error(`End year must be between ${startYear} and ${currentYear}`);
        process.exit(1);
    }
    
    console.log(`${'='.repeat(80)}`);
    console.log(`F1 ELO BULK CALCULATOR`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Processing seasons: ${startYear} to ${endYear}`);
    console.log(`Total seasons: ${endYear - startYear + 1}`);
    console.log(`${'='.repeat(80)}`);
    
    const results = [];
    const startTime = Date.now();
    
    // Process each season sequentially to respect API rate limits
    for (let year = startYear; year <= endYear; year++) {
        const result = await calculateSeason(year.toString());
        results.push(result);
        
        // Check if we hit a rate limit - stop processing and provide recovery info
        if (result.needsRetry) {
            console.log(`\n${'⚠'.repeat(20)}`);
            console.log(`RATE LIMIT REACHED - STOPPING BULK PROCESSING`);
            console.log(`${'⚠'.repeat(20)}`);
            console.log(`\nProcessed years: ${startYear} to ${year - 1} (${year - startYear} seasons)`);
            console.log(`Stopped at year: ${year} due to rate limiting`);
            console.log(`\nTo continue from where you left off, run:`);
            console.log(`${result.retryCommand} ${endYear}`);
            console.log(`\nWait 5-10 minutes before retrying to respect API limits.`);
            break;
        }
        
        // Add a delay between seasons to be respectful to API
        if (year < endYear && !result.needsRetry) {
            console.log(`Waiting 100ms seconds before next season...`);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // Generate final summary
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`BULK CALCULATION COMPLETE`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Total time: ${duration} seconds`);
    console.log(`Successful: ${successful.length}/${results.length} seasons`);
    
    if (failed.length > 0) {
        console.log(`Failed seasons: ${failed.map(f => f.season).join(', ')}`);
    }
    
    // Generate peak ELO file and update README
    if (successful.length > 0) {
        console.log(`\nGenerating peak ELO file...`);
        const peakDrivers = await generatePeakELOFile();
        
        console.log(`\nUpdating README with ${endYear} season results and top 30 driver tables...`);
        
        // Load the latest season data to update README
        try {
            const latestFile = `data/${endYear}-race-results.json`;
            const latestData = await fs.readFile(latestFile, 'utf8');
            const raceData = JSON.parse(latestData);
            const { driverRatings } = await calculateELO(raceData, endYear.toString());
            await updateREADME(driverRatings, endYear.toString());
            await updateREADMEWithTop30(peakDrivers);
            console.log(`✓ README updated with ${endYear} season and 3 top 30 driver tables`);
        } catch (error) {
            console.error(`⚠ Could not update README:`, error.message);
        }
    }
    
    console.log(`${'='.repeat(80)}`);
    
    // Print detailed summary
    if (successful.length > 0) {
        console.log(`\nSUCCESSFUL SEASONS:`);
        successful.forEach(s => {
            console.log(`  ${s.season}: ${s.races} races, ${s.drivers} drivers, top: ${s.topDriver}`);
        });
    }
    
    if (failed.length > 0) {
        console.log(`\nFAILED SEASONS:`);
        failed.forEach(f => {
            if (f.needsRetry) {
                console.log(`  ${f.season}: ${f.error} - Resume with: ${f.retryCommand} ${endYear}`);
            } else {
                console.log(`  ${f.season}: ${f.error || f.reason}`);
            }
        });
    }
}

// Run the bulk calculation
bulkCalculate().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
