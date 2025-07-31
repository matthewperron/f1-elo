import { fetchAllSeasonResults, transformRaceData, saveToFile } from './fetch-results.js';
import { calculateELO, updateHomepageFiles, saveFinalELOs, generateSeasonReport } from './calculate-elo.js';
import fs from 'fs/promises';

/**
 * Main orchestration function
 */
async function main() {
    // Get season from command line argument or default to 2025
    const season = process.argv[2] || '2025';
    
    try {
        console.log('='.repeat(60));
        console.log('F1 ELO Rating Calculator');
        console.log('='.repeat(60));
        console.log(`Season: ${season}\n`);
        
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
            console.log('Fetching race data...');
            
            // Validate season format
            if (!/^\d{4}$/.test(season)) {
                throw new Error(`Invalid season format: ${season}. Please use a 4-digit year (e.g., 2024)`);
            }
            
            // Fetch data
            const races = await fetchAllSeasonResults(season);
            
            if (races.length === 0) {
                console.log(`No race data found for ${season} season`);
                return;
            }
            
            // Transform and save data
            raceData = transformRaceData(races, season);
            await saveToFile(raceData, outputFile);
        }
        
        // Step 2: Calculate ELO ratings
        const { driverRatings, raceEvents, driverResults } = await calculateELO(raceData, season);
        
        // Step 3: Generate detailed season report
        await generateSeasonReport(driverRatings, raceEvents, season);
        
        // Step 4: Save final ELOs and update README
        await saveFinalELOs(driverRatings, raceData, season);
        await updateHomepageFiles(driverRatings, season);
        
        console.log('\n' + '='.repeat(60));
        console.log('✓ F1 ELO calculation completed successfully!');
        console.log(`✓ Season: ${season}`);
        console.log(`✓ Total races: ${raceData.totalRaces}`);
        console.log(`✓ Drivers rated: ${driverRatings.length}`);
        console.log(`✓ Top driver: ${driverRatings[0].consoleName} (${driverRatings[0].globalElo} ELO)`);
        console.log('='.repeat(60));
        
    } catch (error) {
        console.error('\n' + '='.repeat(60));
        console.error('✗ Error during ELO calculation:');
        console.error(error.message);
        console.error('='.repeat(60));
        process.exit(1);
    }
}

// Run the script
main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
