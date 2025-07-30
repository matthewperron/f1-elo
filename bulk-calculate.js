import { fetchAllSeasonResults, transformRaceData, saveToFile } from './fetch-results.js';
import { calculateELO, updateREADME, saveFinalELOs, generateSeasonReport } from './calculate-elo.js';
import fs from 'fs/promises';

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
        
        // Step 3: Generate detailed season report
        await generateSeasonReport(driverRatings, raceEvents, season);
        
        // Step 4: Save final ELOs (but don't update README for each season)
        await saveFinalELOs(driverRatings, raceData, season);
        
        console.log(`✓ Season ${season} completed successfully!`);
        console.log(`  - Total races: ${raceData.totalRaces}`);
        console.log(`  - Drivers rated: ${driverRatings.length}`);
        console.log(`  - Top driver: ${driverRatings[0].name} (${driverRatings[0].globalElo} ELO)`);
        
        return { 
            success: true, 
            season, 
            races: raceData.totalRaces, 
            drivers: driverRatings.length,
            topDriver: `${driverRatings[0].name} (${driverRatings[0].globalElo} ELO)`
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
            console.log(`Waiting 2 seconds before next season...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
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
    
    // Update README with the latest (current) season
    if (successful.length > 0) {
        console.log(`\nUpdating README with ${endYear} season results...`);
        
        // Load the latest season data to update README
        try {
            const latestFile = `data/${endYear}-race-results.json`;
            const latestData = await fs.readFile(latestFile, 'utf8');
            const raceData = JSON.parse(latestData);
            const { driverRatings } = await calculateELO(raceData, endYear.toString());
            await updateREADME(driverRatings, endYear.toString());
            console.log(`✓ README updated with ${endYear} season`);
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
