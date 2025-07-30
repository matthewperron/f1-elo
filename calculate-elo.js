import fs from 'fs/promises';

/**
 * Load starting ELO ratings from previous season
 */
async function loadStartingELOs(season) {
    const previousYear = parseInt(season) - 1;
    const previousFile = `data/${previousYear}-race-results.json`;
    
    try {
        const data = await fs.readFile(previousFile, 'utf8');
        const previousData = JSON.parse(data);
        
        if (previousData.finalELOs) {
            console.log(`✓ Loaded starting ELOs from ${previousYear} season`);
            return new Map(Object.entries(previousData.finalELOs));
        }
    } catch (error) {
        console.log(`No previous season data found for ${previousYear}, using default starting ELOs`);
    }
    
    return new Map();
}

/**
 * Calculate ELO ratings for F1 drivers
 */
async function calculateELO(raceData, season) {
    const drivers = new Map(); // Map of driverId -> { qualifyingElo, raceElo, globalElo, name, constructor, startingElo }
    const K_FACTOR = 32; // ELO K-factor
    const INITIAL_ELO = 1000; // Starting ELO rating
    const raceEvents = []; // Store detailed race-by-race ELO changes
    
    // Load starting ELOs from previous season
    const startingELOs = await loadStartingELOs(season);
    
    console.log('Calculating ELO ratings...');
    
    // Process each race in chronological order
    raceData.races.forEach((race, raceIndex) => {
        console.log(`Processing race ${raceIndex + 1}/${raceData.races.length}: ${race.raceName}`);
        
        const raceEvent = {
            raceIndex: raceIndex + 1,
            raceName: race.raceName,
            date: race.date,
            round: race.round,
            eloChanges: []
        };
        
        // Group drivers by constructor (team)
        const teamGroups = new Map();
        race.results.forEach(result => {
            const constructorId = result.constructor.constructorId;
            if (!teamGroups.has(constructorId)) {
                teamGroups.set(constructorId, []);
            }
            teamGroups.get(constructorId).push(result);
        });
        
        // Process each team's drivers
        teamGroups.forEach((teammates, constructorId) => {
            if (teammates.length < 2) return; // Skip teams with only one driver
            
            // Calculate qualifying ELO changes
            const qualifyingChanges = processTeammateComparisonWithDetails(teammates, drivers, 'qualifying', K_FACTOR, INITIAL_ELO, startingELOs);
            if (qualifyingChanges) raceEvent.eloChanges.push(...qualifyingChanges);
            
            // Calculate race ELO changes
            const raceChanges = processTeammateComparisonWithDetails(teammates, drivers, 'race', K_FACTOR, INITIAL_ELO, startingELOs);
            if (raceChanges) raceEvent.eloChanges.push(...raceChanges);
            
            // Calculate global ELO changes (combines qualifying and race)
            const globalChanges = processTeammateComparisonWithDetails(teammates, drivers, 'global', K_FACTOR, INITIAL_ELO, startingELOs);
            if (globalChanges) raceEvent.eloChanges.push(...globalChanges);
        });
        
        // Only add race event if there were ELO changes
        if (raceEvent.eloChanges.length > 0) {
            raceEvents.push(raceEvent);
        }
    });
    
    // Convert to sorted array
    const driverRatings = Array.from(drivers.entries()).map(([driverId, data]) => ({
        driverId,
        name: data.name,
        constructor: data.constructor,
        startingElo: Math.round(data.startingElo),
        qualifyingElo: Math.round(data.qualifyingElo),
        raceElo: Math.round(data.raceElo),
        globalElo: Math.round(data.globalElo)
    }));
    
    // Sort by global ELO (highest first)
    driverRatings.sort((a, b) => b.globalElo - a.globalElo);
    
    console.log(`✓ ELO calculations completed for ${driverRatings.length} drivers`);
    return { driverRatings, raceEvents };
}

/**
 * Process ELO changes between teammates for qualifying, race, or global (with detailed tracking)
 */
function processTeammateComparisonWithDetails(teammates, drivers, type, kFactor, initialElo, startingELOs) {
    const changes = processTeammateComparison(teammates, drivers, type, kFactor, initialElo, startingELOs);
    return changes;
}

/**
 * Process ELO changes between teammates for qualifying, race, or global
 */
function processTeammateComparison(teammates, drivers, type, kFactor, initialElo, startingELOs) {
    if (teammates.length !== 2) return null; // Only handle 2-driver teams for now
    
    const [driver1, driver2] = teammates;
    
    // Skip if either driver had issues (DNF, DNS, etc.)
    const validStatuses = ['Finished', '+1 Lap', '+2 Laps', '+3 Laps'];
    if (type === 'race' || type === 'global') {
        if (!validStatuses.some(status => driver1.status.includes(status)) ||
            !validStatuses.some(status => driver2.status.includes(status))) {
            return null; // Skip this comparison
        }
    }
    
    // Initialize drivers if not seen before
    if (!drivers.has(driver1.driver.driverId)) {
        const startingElo = startingELOs.get(driver1.driver.driverId) || initialElo;
        drivers.set(driver1.driver.driverId, {
            name: `${driver1.driver.givenName} ${driver1.driver.familyName}`,
            constructor: driver1.constructor.name,
            startingElo: startingElo,
            qualifyingElo: startingElo,
            raceElo: startingElo,
            globalElo: startingElo
        });
    }
    if (!drivers.has(driver2.driver.driverId)) {
        const startingElo = startingELOs.get(driver2.driver.driverId) || initialElo;
        drivers.set(driver2.driver.driverId, {
            name: `${driver2.driver.givenName} ${driver2.driver.familyName}`,
            constructor: driver2.constructor.name,
            startingElo: startingElo,
            qualifyingElo: startingElo,
            raceElo: startingElo,
            globalElo: startingElo
        });
    }
    
    const driver1Data = drivers.get(driver1.driver.driverId);
    const driver2Data = drivers.get(driver2.driver.driverId);
    
    // Get current ELO ratings
    let elo1, elo2;
    if (type === 'qualifying') {
        elo1 = driver1Data.qualifyingElo;
        elo2 = driver2Data.qualifyingElo;
    } else if (type === 'race') {
        elo1 = driver1Data.raceElo;
        elo2 = driver2Data.raceElo;
    } else { // global
        elo1 = driver1Data.globalElo;
        elo2 = driver2Data.globalElo;
    }
    
    // Determine positions to compare
    let pos1, pos2;
    if (type === 'qualifying') {
        pos1 = parseInt(driver1.grid);
        pos2 = parseInt(driver2.grid);
    } else if (type === 'race') {
        pos1 = parseInt(driver1.position);
        pos2 = parseInt(driver2.position);
    } else { // global - use combined score (qualifying weight 0.3, race weight 0.7)
        const qual1 = parseInt(driver1.grid);
        const qual2 = parseInt(driver2.grid);
        const race1 = parseInt(driver1.position);
        const race2 = parseInt(driver2.position);
        
        if (isNaN(qual1) || isNaN(qual2) || isNaN(race1) || isNaN(race2)) return;
        
        // Lower combined score is better (smaller positions are better)
        const combined1 = (qual1 * 0.3) + (race1 * 0.7);
        const combined2 = (qual2 * 0.3) + (race2 * 0.7);
        
        // For comparison, we need discrete positions, so whoever has better combined score "wins"
        pos1 = combined1 < combined2 ? 1 : 2;
        pos2 = combined1 < combined2 ? 2 : 1;
    }
    
    // Skip if positions are invalid
    if (isNaN(pos1) || isNaN(pos2)) return null;
    
    // Store starting ELOs before changes
    const startingElo1 = type === 'qualifying' ? driver1Data.qualifyingElo : 
                        type === 'race' ? driver1Data.raceElo : driver1Data.globalElo;
    const startingElo2 = type === 'qualifying' ? driver2Data.qualifyingElo : 
                        type === 'race' ? driver2Data.raceElo : driver2Data.globalElo;
    
    // Calculate expected scores
    const expectedScore1 = 1 / (1 + Math.pow(10, (elo2 - elo1) / 400));
    const expectedScore2 = 1 - expectedScore1;
    
    // Determine actual scores (1 for better position, 0 for worse)
    const actualScore1 = pos1 < pos2 ? 1 : 0;
    const actualScore2 = 1 - actualScore1;
    
    // Calculate ELO changes
    const eloChange1 = kFactor * (actualScore1 - expectedScore1);
    const eloChange2 = kFactor * (actualScore2 - expectedScore2);
    
    // Update ELO ratings
    if (type === 'qualifying') {
        driver1Data.qualifyingElo += eloChange1;
        driver2Data.qualifyingElo += eloChange2;
    } else if (type === 'race') {
        driver1Data.raceElo += eloChange1;
        driver2Data.raceElo += eloChange2;
    } else { // global
        driver1Data.globalElo += eloChange1;
        driver2Data.globalElo += eloChange2;
    }
    
    // Return detailed change information
    return [
        {
            type: type,
            driverId: driver1.driver.driverId,
            driverName: driver1Data.name,
            constructor: driver1Data.constructor,
            position: pos1,
            startingElo: Math.round(startingElo1),
            eloChange: Math.round(eloChange1),
            newElo: Math.round(startingElo1 + eloChange1),
            won: actualScore1 === 1,
            opponent: driver2Data.name,
            opponentPosition: pos2
        },
        {
            type: type,
            driverId: driver2.driver.driverId,
            driverName: driver2Data.name,
            constructor: driver2Data.constructor,
            position: pos2,
            startingElo: Math.round(startingElo2),
            eloChange: Math.round(eloChange2),
            newElo: Math.round(startingElo2 + eloChange2),
            won: actualScore2 === 1,
            opponent: driver1Data.name,
            opponentPosition: pos1
        }
    ];
}

/**
 * Generate markdown table for README
 */
function generateELOTable(driverRatings) {
    let table = '| Rank | Starting ELO | Driver | Constructor | Qualifying ELO | Race ELO | ELO |\n';
    table += '|------|--------------|--------|-------------|----------------|----------|-----|\n';
    
    driverRatings.slice(0, 50).forEach((driver, index) => { // Show top 50
        table += `| ${index + 1} | ${driver.startingElo} | ${driver.name} | ${driver.constructor} | ${driver.qualifyingElo} | ${driver.raceElo} | ${driver.globalElo} |\n`;
    });
    
    return table;
}

/**
 * Generate detailed season markdown file
 */
async function generateSeasonReport(driverRatings, raceEvents, season) {
    const timestamp = new Date().toISOString().split('T')[0];
    
    let content = `# ${season} F1 Season - ELO Analysis\n\n`;
    content += `*Generated: ${timestamp}*\n\n`;
    
    // Final ELO Table
    content += `## Final ELO Ratings\n\n`;
    content += generateELOTable(driverRatings);
    content += `\n\n*Showing top 50 drivers by global ELO rating*\n\n`;
    
    // Race-by-race details
    content += `## Race-by-Race ELO Changes\n\n`;
    
    raceEvents.forEach(race => {
        content += `### Round ${race.round}: ${race.raceName}\n`;
        content += `*Date: ${race.date}*\n\n`;
        
        // Group changes by type
        const qualifyingChanges = race.eloChanges.filter(c => c.type === 'qualifying');
        const raceChanges = race.eloChanges.filter(c => c.type === 'race');
        const globalChanges = race.eloChanges.filter(c => c.type === 'global');
        
        if (qualifyingChanges.length > 0) {
            content += `#### Qualifying ELO Changes\n\n`;
            content += `| Driver | Constructor | Position | Starting ELO | Change | New ELO | Result | vs Teammate |\n`;
            content += `|--------|-------------|----------|--------------|--------|---------|--------|--------------|\n`;
            
            qualifyingChanges.forEach(change => {
                const result = change.won ? 'Won' : 'Lost';
                const changeStr = change.eloChange >= 0 ? `+${change.eloChange}` : `${change.eloChange}`;
                content += `| ${change.driverName} | ${change.constructor} | ${change.position} | ${change.startingElo} | ${changeStr} | ${change.newElo} | ${result} | ${change.opponent} (P${change.opponentPosition}) |\n`;
            });
            content += '\n';
        }
        
        if (raceChanges.length > 0) {
            content += `#### Race ELO Changes\n\n`;
            content += `| Driver | Constructor | Position | Starting ELO | Change | New ELO | Result | vs Teammate |\n`;
            content += `|--------|-------------|----------|--------------|--------|---------|--------|--------------|\n`;
            
            raceChanges.forEach(change => {
                const result = change.won ? 'Won' : 'Lost';
                const changeStr = change.eloChange >= 0 ? `+${change.eloChange}` : `${change.eloChange}`;
                content += `| ${change.driverName} | ${change.constructor} | ${change.position} | ${change.startingElo} | ${changeStr} | ${change.newElo} | ${result} | ${change.opponent} (P${change.opponentPosition}) |\n`;
            });
            content += '\n';
        }
        
        content += '---\n\n';
    });
    
    // Save to results folder
    const filePath = `results/${season}-season-report.md`;
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`✓ Season report saved to ${filePath}`);
    
    return filePath;
}

/**
 * Update README with ELO results
 */
async function updateREADME(driverRatings, season) {
    try {
        const readmePath = './README.md';
        const readmeContent = await fs.readFile(readmePath, 'utf8');
        
        const table = generateELOTable(driverRatings);
        const timestamp = new Date().toISOString().split('T')[0];
        
        const newContent = `### ELO Ratings (${season} Season)
*Last updated: ${timestamp}*

${table}

*Showing top 50 drivers by global ELO rating*`;
        
        // Replace content between markers
        const updatedContent = readmeContent.replace(
            /<!-- ELO_RESULTS_START -->.*?<!-- ELO_RESULTS_END -->/s,
            `<!-- ELO_RESULTS_START -->\n${newContent}\n<!-- ELO_RESULTS_END -->`
        );
        
        await fs.writeFile(readmePath, updatedContent, 'utf8');
        console.log('✓ README updated with ELO ratings');
        
    } catch (error) {
        console.error('Error updating README:', error);
        throw error;
    }
}

/**
 * Save final ELOs to race data file for next season
 */
async function saveFinalELOs(driverRatings, raceData, season) {
    const finalELOs = {};
    driverRatings.forEach(driver => {
        finalELOs[driver.driverId] = driver.globalElo;
    });
    
    // Update race data with final ELOs
    raceData.finalELOs = finalELOs;
    
    const outputFile = `data/${season}-race-results.json`;
    const jsonString = JSON.stringify(raceData, null, 2);
    await fs.writeFile(outputFile, jsonString, 'utf8');
    
    console.log(`✓ Final ELOs saved to ${outputFile}`);
}

/**
 * Calculate ELO ratings from existing race data
 */
async function calculateELOFromData(season = '2025') {
    try {
        console.log('='.repeat(60));
        console.log('F1 ELO Calculator (Calculation Only)');
        console.log('='.repeat(60));
        console.log(`Season: ${season}\n`);
        
        // Load race data
        const dataFile = `data/${season}-race-results.json`;
        console.log(`Loading race data from ${dataFile}...`);
        
        const raceDataContent = await fs.readFile(dataFile, 'utf8');
        const raceData = JSON.parse(raceDataContent);
        
        if (raceData.season !== season) {
            throw new Error(`Data file contains ${raceData.season} season data, expected ${season}`);
        }
        
        console.log(`✓ Loaded ${raceData.totalRaces} races for ${season} season`);
        
        // Calculate ELO ratings
        const { driverRatings, raceEvents } = await calculateELO(raceData, season);
        
        // Generate detailed season report
        await generateSeasonReport(driverRatings, raceEvents, season);
        
        // Save final ELOs
        await saveFinalELOs(driverRatings, raceData, season);
        
        // Update README
        await updateREADME(driverRatings, season);
        
        console.log('\n' + '='.repeat(60));
        console.log('✓ ELO calculation completed successfully!');
        console.log(`✓ Season: ${season}`);
        console.log(`✓ Total races: ${raceData.totalRaces}`);
        console.log(`✓ Drivers rated: ${driverRatings.length}`);
        console.log(`✓ Top driver: ${driverRatings[0].name} (${driverRatings[0].globalElo} ELO)`);
        console.log('='.repeat(60));
        
        return driverRatings;
        
    } catch (error) {
        console.error('\n' + '='.repeat(60));
        console.error('✗ Error during ELO calculation:');
        console.error(error.message);
        console.error('='.repeat(60));
        throw error;
    }
}

// Export functions
export { calculateELO, updateREADME, saveFinalELOs, calculateELOFromData };

// Run if called directly (check if this file is the main module being executed)
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
    const season = process.argv[2] || '2025';
    calculateELOFromData(season).catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
