import fs from 'fs/promises';

/**
 * Country flag SVG mapping for drivers using Wikipedia URLs with emoji fallbacks
 */
const COUNTRY_FLAGS = {
    'Argentina': { url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg', alt: 'Argentina', emoji: '🇦🇷' },
    'Argentine': { url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg', alt: 'Argentina', emoji: '🇦🇷' },
    'Australia': { url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg', alt: 'Australia', emoji: '🇦🇺' },
    'Australian': { url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg', alt: 'Australia', emoji: '🇦🇺' },
    'Austria': { url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Austria.svg', alt: 'Austria', emoji: '🇦🇹' },
    'Austrian': { url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Austria.svg', alt: 'Austria', emoji: '🇦🇹' },
    'Belgium': { url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg', alt: 'Belgium', emoji: '🇧🇪' },
    'Belgian': { url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg', alt: 'Belgium', emoji: '🇧🇪' },
    'Brazil': { url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg', alt: 'Brazil', emoji: '🇧🇷' },
    'Brazilian': { url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg', alt: 'Brazil', emoji: '🇧🇷' },
    'Britain': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817', alt: 'United Kingdom', emoji: '🇬🇧' },
    'British': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817', alt: 'United Kingdom', emoji: '🇬🇧' },
    'Canada': { url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg', alt: 'Canada', emoji: '🇨🇦' },
    'Canadian': { url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg', alt: 'Canada', emoji: '🇨🇦' },
    'Chile': { url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_Chile.svg', alt: 'Chile', emoji: '🇨🇱' },
    'Colombia': { url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg', alt: 'Colombia', emoji: '🇨🇴' },
    'Czech Republic': { url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg', alt: 'Czech Republic', emoji: '🇨🇿' },
    'Czechoslovakia': { url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg', alt: 'Czech Republic', emoji: '🇨🇿' },
    'Denmark': { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Denmark.svg', alt: 'Denmark', emoji: '🇩🇰' },
    'Danish': { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Denmark.svg', alt: 'Denmark', emoji: '🇩🇰' },
    'Finland': { url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg', alt: 'Finland', emoji: '🇫🇮' },
    'Finnish': { url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg', alt: 'Finland', emoji: '🇫🇮' },
    'France': { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg', alt: 'France', emoji: '🇫🇷' },
    'French': { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg', alt: 'France', emoji: '🇫🇷' },
    'Germany': { url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg', alt: 'Germany', emoji: '🇩🇪' },
    'German': { url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg', alt: 'Germany', emoji: '🇩🇪' },
    'Hungary': { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Hungary.svg', alt: 'Hungary', emoji: '🇭🇺' },
    'India': { url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg', alt: 'India', emoji: '🇮🇳' },
    'Ireland': { url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Ireland.svg', alt: 'Ireland', emoji: '🇮🇪' },
    'Italy': { url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg', alt: 'Italy', emoji: '🇮🇹' },
    'Italian': { url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg', alt: 'Italy', emoji: '🇮🇹' },
    'Japan': { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg', alt: 'Japan', emoji: '🇯🇵' },
    'Japanese': { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg', alt: 'Japan', emoji: '🇯🇵' },
    'Malaysia': { url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg', alt: 'Malaysia', emoji: '🇲🇾' },
    'Mexico': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg', alt: 'Mexico', emoji: '🇲🇽' },
    'Mexican': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg', alt: 'Mexico', emoji: '🇲🇽' },
    'Monaco': { url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg', alt: 'Monaco', emoji: '🇲🇨' },
    'Monegasque': { url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg', alt: 'Monaco', emoji: '🇲🇨' },
    'Netherlands': { url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg', alt: 'Netherlands', emoji: '🇳🇱' },
    'Dutch': { url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg', alt: 'Netherlands', emoji: '🇳🇱' },
    'New Zealand': { url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg', alt: 'New Zealand', emoji: '🇳🇿' },
    'New Zealander': { url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg', alt: 'New Zealand', emoji: '🇳🇿' },
    'Poland': { url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_Poland.svg', alt: 'Poland', emoji: '🇵🇱' },
    'Polish': { url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_Poland.svg', alt: 'Poland', emoji: '🇵🇱' },
    'Portugal': { url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg', alt: 'Portugal', emoji: '🇵🇹' },
    'Russia': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg', alt: 'Russia', emoji: '🇷🇺' },
    'South Africa': { url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg', alt: 'South Africa', emoji: '🇿🇦' },
    'Spain': { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg', alt: 'Spain', emoji: '🇪🇸' },
    'Spanish': { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg', alt: 'Spain', emoji: '🇪🇸' },
    'Sweden': { url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Sweden.svg', alt: 'Sweden', emoji: '🇸🇪' },
    'Swedish': { url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Sweden.svg', alt: 'Sweden', emoji: '🇸🇪' },
    'Switzerland': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg', alt: 'Switzerland', emoji: '🇨🇭' },
    'Swiss': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg', alt: 'Switzerland', emoji: '🇨🇭' },
    'Thai': { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg', alt: 'Thailand', emoji: '🇹🇭' },
    'Thailand': { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg', alt: 'Thailand', emoji: '🇹🇭' },
    'UK': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817', alt: 'United Kingdom', emoji: '🇬🇧' },
    'USA': { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg', alt: 'United States', emoji: '🇺🇸' },
    'American': { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg', alt: 'United States', emoji: '🇺🇸' },
    'Uruguay': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Uruguay.svg', alt: 'Uruguay', emoji: '🇺🇾' },
    'Venezuela': { url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Venezuela.svg', alt: 'Venezuela', emoji: '🇻🇪' }
};

const VALID_STATUSES = ['Finished', '+1 Lap', '+2 Laps', '+3 Laps', '+4 Laps', '+5 Laps', '+6 Laps', 'Lapped', 'Accident', 'Collision', 'Spun off', 'Not classified'];

/**
 * Get country flag image for a driver with emoji fallback
 */
function getCountryFlag(driver) {
    if (driver.nationality && COUNTRY_FLAGS[driver.nationality]) {
        const flag = COUNTRY_FLAGS[driver.nationality];
        // Primary: SVG image with emoji fallback using onerror
        return `<img src="${flag.url}" alt="${flag.alt}" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='${flag.emoji}'; this.style.marginRight='5px';"/>`;
    }
    return '';
}

/**
 * Get country flag emoji only for console output
 */
function getCountryFlagEmoji(driver) {
    if (driver.nationality && COUNTRY_FLAGS[driver.nationality]) {
        const flag = COUNTRY_FLAGS[driver.nationality];
        return flag.emoji;
    }
    return '';
}

/**
 * Format ELO change with color coding
 */
function formatEloChange(change) {
    if (change === null || change === undefined) {
        return 'N/A';
    }
    
    const changeStr = change >= 0 ? `+${change}` : `${change}`;
    if (change > 0) {
        return `<span style="color: green">${changeStr}</span>`;
    } else if (change < 0) {
        return `<span style="color: red">${changeStr}</span>`;
    } else {
        return changeStr;
    }
}

/**
 * Format ELO with delta and arrow
 * @param {number} finalElo - The final ELO rating
 * @param {number} eloChange - The ELO change (can be positive or negative)
 * @returns {string} Formatted ELO string with HTML styling
 */
function formatEloWithDelta(finalElo, eloChange) {
    if (eloChange === 0) {
        return `${finalElo} ↔ 0`;
    }
    
    const arrow = eloChange > 0 ? '▲' : '▼';
    const color = eloChange > 0 ? 'green' : 'red';
    const sign = eloChange > 0 ? '+' : '';
    
    return `${finalElo} **<span style="color: ${color};">${arrow} ${sign}${eloChange}</span>**`;
}

/**
 * Clean driver name for filename (same logic as bulk-calculate.js)
 */
function cleanDriverNameForFilename(driverName) {
    return driverName
        .replace(/<img[^>]*>/g, '') // Remove entire img tags
        .replace(/🏁|🇦🇷|🇦🇺|🇦🇹|🇧🇪|🇧🇷|🇬🇧|🇨🇦|🇨🇱|🇨🇴|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇭🇺|🇮🇳|🇮🇪|🇮🇹|🇯🇵|🇲🇾|🇲🇽|🇲🇨|🇳🇱|🇳🇿|🇵🇱|🇵🇹|🇷🇺|🇿🇦|🇪🇸|🇸🇪|🇨🇭|🇹🇭|🇺🇸|🇺🇾|🇻🇪/g, '') // Remove flag emojis
        .trim() // Trim whitespace first
        .replace(/[^\w\s-]/g, '') // Keep only alphanumeric, spaces, and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
        .toLowerCase();
}

/**
 * Create driver link for season reports
 */
function createDriverLink(driverName) {
    const cleanName = cleanDriverNameForFilename(driverName);
    return `[${driverName}](../drivers/${cleanName})`;
}

/**
 * Track individual driver results for per-driver markdown files
 */
function trackDriverResult(driverResults, change, race, season) {
    const driverId = change.driverId;
    
    if (!driverResults.has(driverId)) {
        driverResults.set(driverId, {
            driverName: change.driverName,
            results: []
        });
    }
    
    driverResults.get(driverId).results.push({
        season: season,
        raceName: race.raceName,
        round: race.round,
        date: race.date,
        session: change.type,
        constructor: change.constructor,
        position: change.position,
        startingElo: change.startingElo,
        eloChange: change.eloChange,
        newElo: change.newElo,
        result: change.result,
        teammate: change.opponent,
        teammatePosition: change.opponentPosition,
        teammateStartingElo: null, // Will be filled from teammate's data
        teammateEloChange: null, // Will be filled from teammate's data
        teammateNewElo: null // Will be filled from teammate's data
    });
}

/**
 * Load starting ELO ratings for a specific season (looks back through previous seasons only)
 */
async function loadStartingELOs(season) {
    const currentYear = parseInt(season);
    const startingELOs = new Map();
    let seasonsChecked = 0;
    
    console.log(`Loading starting ELOs for ${season} season...`);
    
    // Look back through ONLY previous seasons (not current or future)
    for (let year = currentYear - 1; year >= 1950; year--) {
        const seasonFile = `data/${year}-race-results.json`;
        
        try {
            const data = await fs.readFile(seasonFile, 'utf8');
            const seasonData = JSON.parse(data);
            
            if (seasonData.finalELOs) {
                let newDriversAdded = 0;
                
                // Add ELOs for drivers we haven't seen yet (most recent ELO wins)
                Object.entries(seasonData.finalELOs).forEach(([driverId, eloData]) => {
                    if (!startingELOs.has(driverId)) {
                        startingELOs.set(driverId, eloData);
                        newDriversAdded++;
                    }
                });
                
                seasonsChecked++;
                if (seasonsChecked <= 3 || newDriversAdded > 0) {
                    console.log(`✓ ${year} season: ${newDriversAdded} new drivers, ${startingELOs.size} total`);
                }
            }
        } catch (error) {
            // File doesn't exist or can't be read - continue to next year
            continue;
        }
        
        // Performance optimization: stop after finding sufficient historical data
        if (seasonsChecked >= 10 && startingELOs.size > 50) {
            console.log(`✓ Stopped after checking ${seasonsChecked} seasons (sufficient data found)`);
            break;
        }
    }
    
    if (startingELOs.size === 0) {
        console.log(`✓ No historical ELO data found for ${season} - all drivers will start at 1500`);
    } else {
        console.log(`✓ Starting ELOs for ${season}: ${startingELOs.size} drivers with historical data`);
    }
    
    return startingELOs;
}

/**
 * Calculate global ELO changes using weighted approach (30% qualifying + 70% race)
 */
function calculateGlobalELOChanges(qualifyingChanges, raceChanges, teammates, drivers, raceEvent) {
    if (!qualifyingChanges || !raceChanges) return null;
    if (teammates.length < 2) return null;
    
    const globalChanges = [];
    
    // For each pair of teammates, calculate global ELO changes
    for (let i = 0; i < teammates.length; i++) {
        for (let j = i + 1; j < teammates.length; j++) {
            const driver1 = teammates[i];
            const driver2 = teammates[j];
            
            const driver1Id = driver1.driver.driverId;
            const driver2Id = driver2.driver.driverId;
            
            // Find the qualifying and race changes for each driver in this pair
            const driver1QualChanges = qualifyingChanges.filter(c => c.driverId === driver1Id && c.opponent === drivers.get(driver2Id)?.name);
            const driver1RaceChanges = raceChanges.filter(c => c.driverId === driver1Id && c.opponent === drivers.get(driver2Id)?.name);
            const driver2QualChanges = qualifyingChanges.filter(c => c.driverId === driver2Id && c.opponent === drivers.get(driver1Id)?.name);
            const driver2RaceChanges = raceChanges.filter(c => c.driverId === driver2Id && c.opponent === drivers.get(driver1Id)?.name);
            
            if (driver1QualChanges.length > 0 && driver1RaceChanges.length > 0 && 
                driver2QualChanges.length > 0 && driver2RaceChanges.length > 0) {
                
                const driver1QualChange = driver1QualChanges[0];
                const driver1RaceChange = driver1RaceChanges[0];
                const driver2QualChange = driver2QualChanges[0];
                const driver2RaceChange = driver2RaceChanges[0];
                
                // Calculate weighted global ELO changes: 30% qualifying + 70% race
                // Note: These already use scaled ELO changes from individual teammate comparisons
                const driver1GlobalELOChange = (driver1QualChange.eloChange * 0.3) + (driver1RaceChange.eloChange * 0.7);
                const driver2GlobalELOChange = (driver2QualChange.eloChange * 0.3) + (driver2RaceChange.eloChange * 0.7);
                
                // Apply the changes to each driver's global ELO
                const driver1Data = drivers.get(driver1Id);
                const driver2Data = drivers.get(driver2Id);
                
                const driver1OldGlobalElo = driver1Data.globalElo;
                const driver2OldGlobalElo = driver2Data.globalElo;
                
                driver1Data.globalElo += driver1GlobalELOChange;
                driver2Data.globalElo += driver2GlobalELOChange;
                
                globalChanges.push({
                    type: 'global',
                    driverId: driver1Id,
                    driverName: driver1Data.name,
                    constructor: driver1Data.constructor,
                    position: `Q:${driver1QualChange.position}/R:${driver1RaceChange.position}`,
                    startingElo: Math.round(driver1OldGlobalElo),
                    eloChange: Math.round(driver1GlobalELOChange),
                    newElo: Math.round(driver1Data.globalElo),
                    result: driver1GlobalELOChange > 0 ? 'Won' : driver1GlobalELOChange < 0 ? 'Lost' : 'Tied',
                    opponent: driver2Data.name,
                    opponentPosition: `Q:${driver2QualChange.position}/R:${driver2RaceChange.position}`
                });
                
                globalChanges.push({
                    type: 'global',
                    driverId: driver2Id,
                    driverName: driver2Data.name,
                    constructor: driver2Data.constructor,
                    position: `Q:${driver2QualChange.position}/R:${driver2RaceChange.position}`,
                    startingElo: Math.round(driver2OldGlobalElo),
                    eloChange: Math.round(driver2GlobalELOChange),
                    newElo: Math.round(driver2Data.globalElo),
                    result: driver2GlobalELOChange > 0 ? 'Won' : driver2GlobalELOChange < 0 ? 'Lost' : 'Tied',
                    opponent: driver1Data.name,
                    opponentPosition: `Q:${driver1QualChange.position}/R:${driver1RaceChange.position}`
                });
            }
        }
    }
    
    return globalChanges.length > 0 ? globalChanges : null;
}

/**
 * Calculate ELO ratings for F1 drivers
 */
async function calculateELO(raceData, season) {
    const drivers = new Map(); // Map of driverId -> { qualifyingElo, raceElo, globalElo, name, constructor, startingElo }
    const K_FACTOR = 64; // ELO K-factor
    const INITIAL_ELO = 1500; // Starting ELO rating
    const raceEvents = []; // Store detailed race-by-race ELO changes
    const driverResults = new Map(); // Track all results per driver for individual files
    
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
            if (qualifyingChanges) {
                raceEvent.eloChanges.push(...qualifyingChanges);
                // Track driver results
                qualifyingChanges.forEach(change => {
                    trackDriverResult(driverResults, change, race, season);
                });
            }
            
            // Calculate race ELO changes
            const raceChanges = processTeammateComparisonWithDetails(teammates, drivers, 'race', K_FACTOR, INITIAL_ELO, startingELOs);
            if (raceChanges) {
                raceEvent.eloChanges.push(...raceChanges);
                // Track driver results
                raceChanges.forEach(change => {
                    trackDriverResult(driverResults, change, race, season);
                });
            }
            
            // Calculate global ELO changes using weighted approach (30% qualifying + 70% race)
            const globalChanges = calculateGlobalELOChanges(qualifyingChanges, raceChanges, teammates, drivers, raceEvent);
            if (globalChanges) {
                raceEvent.eloChanges.push(...globalChanges);
                // Track driver results
                globalChanges.forEach(change => {
                    trackDriverResult(driverResults, change, race, season);
                });
            }
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
        consoleName: data.consoleName,
        constructor: data.constructor,
        startingElo: Math.round(data.startingElo),
        qualifyingElo: Math.round(data.qualifyingElo),
        raceElo: Math.round(data.raceElo),
        globalElo: Math.round(data.globalElo)
    }));
    
    // Sort by global ELO (highest first)
    driverRatings.sort((a, b) => b.globalElo - a.globalElo);
    
    console.log(`✓ ELO calculations completed for ${driverRatings.length} drivers`);
    return { driverRatings, raceEvents, driverResults };
}

/**
 * Process ELO changes between teammates for qualifying, race, or global (with detailed tracking)
 */
function processTeammateComparisonWithDetails(teammates, drivers, type, kFactor, initialElo, startingELOs) {
    const changes = processTeammateComparison(teammates, drivers, type, kFactor, initialElo, startingELOs);
    return changes;
}

/**
 * Process ELO changes between teammates for qualifying, race, or global (supports multiple teammates)
 */
function processTeammateComparison(teammates, drivers, type, kFactor, initialElo, startingELOs) {
    if (teammates.length < 2) return null; // Need at least 2 drivers for comparisons
    
    const allChanges = [];
    const teammateCount = teammates.length;
    
    // For each pair of teammates, calculate ELO changes (scaled by number of teammates)
    for (let i = 0; i < teammates.length; i++) {
        for (let j = i + 1; j < teammates.length; j++) {
            const driver1 = teammates[i];
            const driver2 = teammates[j];
            
            // Process this pair of teammates with scaled ELO changes
            const pairChanges = processPairComparison(driver1, driver2, drivers, type, kFactor, initialElo, startingELOs, teammateCount);
            if (pairChanges) {
                allChanges.push(...pairChanges);
            }
        }
    }
    
    return allChanges.length > 0 ? allChanges : null;
}

/**
 * Process ELO changes between a specific pair of teammates
 */
function processPairComparison(driver1, driver2, drivers, type, kFactor, initialElo, startingELOs, teammateCount = 2) {
    
    // Check if either driver had issues (DNF, DNS, etc.)
    const driver1DNF = (type === 'race' || type === 'global') && !VALID_STATUSES.some(status => driver1.status.includes(status));
    const driver2DNF = (type === 'race' || type === 'global') && !VALID_STATUSES.some(status => driver2.status.includes(status));
    const anyDNF = driver1DNF || driver2DNF;
    
    // Initialize drivers if not seen before
    if (!drivers.has(driver1.driver.driverId)) {
        const startingELOData = startingELOs.get(driver1.driver.driverId);
        const qualifyingElo = startingELOData?.qualifyingElo || initialElo;
        const raceElo = startingELOData?.raceElo || initialElo;
        const globalElo = startingELOData?.globalElo || initialElo;
        const flag = getCountryFlag(driver1.driver);
        const flagEmoji = getCountryFlagEmoji(driver1.driver);
        drivers.set(driver1.driver.driverId, {
            name: `${flag} ${driver1.driver.givenName} ${driver1.driver.familyName}`.trim(),
            consoleName: `${flagEmoji} ${driver1.driver.givenName} ${driver1.driver.familyName}`.trim(),
            constructor: driver1.constructor.name,
            startingElo: globalElo, // Use global ELO as the main starting ELO for display
            qualifyingElo: qualifyingElo,
            raceElo: raceElo,
            globalElo: globalElo
        });
    }
    if (!drivers.has(driver2.driver.driverId)) {
        const startingELOData = startingELOs.get(driver2.driver.driverId);
        const qualifyingElo = startingELOData?.qualifyingElo || initialElo;
        const raceElo = startingELOData?.raceElo || initialElo;
        const globalElo = startingELOData?.globalElo || initialElo;
        const flag = getCountryFlag(driver2.driver);
        const flagEmoji = getCountryFlagEmoji(driver2.driver);
        drivers.set(driver2.driver.driverId, {
            name: `${flag} ${driver2.driver.givenName} ${driver2.driver.familyName}`.trim(),
            consoleName: `${flagEmoji} ${driver2.driver.givenName} ${driver2.driver.familyName}`.trim(),
            constructor: driver2.constructor.name,
            startingElo: globalElo, // Use global ELO as the main starting ELO for display
            qualifyingElo: qualifyingElo,
            raceElo: raceElo,
            globalElo: globalElo
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
        pos1 = pos1 == 0 ? 999 : pos1;
        pos2 = parseInt(driver2.grid);
        pos2 = pos2 == 0 ? 999 : pos2;
    } else if (type === 'race') {
        pos1 = parseInt(driver1.position);
        pos2 = parseInt(driver2.position);
    } else {
        // Global ELO is now handled separately in calculateGlobalELOChanges function
        return null;
    }
    
    // Skip if positions are invalid (but allow DNF cases to be shown)
    if ((isNaN(pos1) || isNaN(pos2)) && !anyDNF) return null;
    
    // Store starting ELOs before changes
    const startingElo1 = type === 'qualifying' ? driver1Data.qualifyingElo : 
                        type === 'race' ? driver1Data.raceElo : driver1Data.globalElo;
    const startingElo2 = type === 'qualifying' ? driver2Data.qualifyingElo : 
                        type === 'race' ? driver2Data.raceElo : driver2Data.globalElo;
    
    let actualScore1, actualScore2, eloChange1, eloChange2;
    
    // Handle DNF cases - no ELO changes, just track the matchup
    if (anyDNF) {
        actualScore1 = null;
        actualScore2 = null;
        eloChange1 = null;
        eloChange2 = null;
    } else {
        // Calculate expected scores
        const expectedScore1 = 1 / (1 + Math.pow(10, (elo2 - elo1) / 400));
        const expectedScore2 = 1 - expectedScore1;
        
        // Determine actual scores (1 for better position, 0 for worse)
        actualScore1 = pos1 < pos2 ? 1 : 0;
        actualScore2 = 1 - actualScore1;
        
        // Calculate ELO changes (scaled by number of opponents to normalize total ELO gain/loss)
        const numOpponents = teammateCount - 1; // Number of opponents each driver faces
        const scalingFactor = 1 / numOpponents; // Divide ELO change by number of opponents
        
        eloChange1 = kFactor * (actualScore1 - expectedScore1) * scalingFactor;
        eloChange2 = kFactor * (actualScore2 - expectedScore2) * scalingFactor;
        
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
    }
    
    // Determine result status
    function getResultStatus(driverPos, opponentPos, driverDNF, opponentDNF, actualScore) {
        if (driverDNF) return 'DNF';
        if (opponentDNF) return 'Won (opponent DNF)';
        if (actualScore === null) return 'N/A';
        return actualScore === 1 ? 'Won' : 'Lost';
    }
    
    // Return detailed change information
    return [
        {
            type: type,
            driverId: driver1.driver.driverId,
            driverName: driver1Data.name,
            constructor: driver1Data.constructor,
            position: driver1DNF ? 'DNF' : pos1,
            startingElo: Math.round(startingElo1),
            eloChange: eloChange1 !== null ? Math.round(eloChange1) : null,
            newElo: eloChange1 !== null ? Math.round(startingElo1 + eloChange1) : Math.round(startingElo1),
            result: getResultStatus(pos1, pos2, driver1DNF, driver2DNF, actualScore1),
            opponent: driver2Data.name,
            opponentPosition: driver2DNF ? 'DNF' : pos2
        },
        {
            type: type,
            driverId: driver2.driver.driverId,
            driverName: driver2Data.name,
            constructor: driver2Data.constructor,
            position: driver2DNF ? 'DNF' : pos2,
            startingElo: Math.round(startingElo2),
            eloChange: eloChange2 !== null ? Math.round(eloChange2) : null,
            newElo: eloChange2 !== null ? Math.round(startingElo2 + eloChange2) : Math.round(startingElo2),
            result: getResultStatus(pos2, pos1, driver2DNF, driver1DNF, actualScore2),
            opponent: driver1Data.name,
            opponentPosition: driver1DNF ? 'DNF' : pos1
        }
    ];
}

/**
 * Generate ELO table for season reports (links to comprehensive driver files)
 */
function generateSeasonReportELOTable(driverRatings) {
    let table = '| Rank | Starting Elo | Driver | Constructor | Qualifying Elo | Race Elo | Final ELO |\n';
    table    += '|------|--------------|--------|-------------|----------------|----------|-----------|\n';
    
    driverRatings.slice(0, 50).forEach((driver, index) => { // Show top 50
        // Create driver file link (comprehensive files, no season suffix)
        const cleanDriverName = cleanDriverNameForFilename(driver.name);
        
        // Season reports are in docs/seasons/, linking to comprehensive driver files in docs/drivers/
        const driverLink = `[${driver.name}](../drivers/${cleanDriverName})`;
        
        // Calculate ELO delta
        const eloDelta = driver.globalElo - driver.startingElo;
        let eloDisplay;
        
        if (eloDelta > 0) {
            // Positive delta - green with up arrow
            eloDisplay = `<span style="color: green">${driver.globalElo} ▲ ${eloDelta}</span>`;
        } else if (eloDelta < 0) {
            // Negative delta - red with down arrow
            eloDisplay = `<span style="color: red">${driver.globalElo} ▼ ${Math.abs(eloDelta)}</span>`;
        } else {
            // No change
            eloDisplay = `${driver.globalElo}`;
        }
        
        table += `| ${index + 1} | ${driver.startingElo} | ${driverLink} | ${driver.constructor} | ${driver.qualifyingElo} | ${driver.raceElo} | ${eloDisplay} |\n`;
    });
    
    table += "\n";

    return table;
}

/**
 * Generate detailed season markdown file
 */
async function generateSeasonReport(driverRatings, raceEvents, season) {
    const timestamp = new Date().toISOString().split('T')[0];
    
    let content = `# ${season} F1 Season - Elo Analysis\n\n`;
    content += `*Last updated: ${timestamp}*\n\n`;
    
    // Add quick navigation to race sections
    content += `## Quick Navigation\n\n`;
    const raceNavigation = raceEvents.map(race => 
        `[Round ${race.round} – ${race.raceName}](#round-${race.round}-${race.raceName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')})`
    ).join(' • ');
    content += `${raceNavigation}\n\n`;
    content += `📊 **[View Complete F1 ${season} Season Results](https://www.formula1.com/en/results.html/${season}/races.html)** | **[Wikipedia ${season} F1 Season](https://en.wikipedia.org/wiki/${season}_Formula_One_World_Championship)**\n\n`;
    
    // Final ELO Table
    content += `## Final Elo Ratings\n\n`;
    content += `📊 **[View Complete F1 ${season} Season Results](https://www.formula1.com/en/results.html/${season}/races.html)**\n\n`;
    content += generateSeasonReportELOTable(driverRatings); // Generate table for season report
    
    // Race-by-race details
    content += `## Race-by-Race ELO Changes\n\n`;
    
    // Load race data to get all participants
    const raceDataFile = `data/${season}-race-results.json`;
    let allRaceData;
    try {
        const raceDataContent = await fs.readFile(raceDataFile, 'utf8');
        allRaceData = JSON.parse(raceDataContent);
    } catch (error) {
        console.error('Could not load race data for complete participant list');
        allRaceData = null;
    }
    
    raceEvents.forEach(race => {
        content += `### Round ${race.round} – ${race.raceName}\n`;
        content += `*Date: ${race.date}*\n\n`;
        
        // Group changes by type
        const qualifyingChanges = race.eloChanges.filter(c => c.type === 'qualifying');
        const raceChanges = race.eloChanges.filter(c => c.type === 'race');
        const globalChanges = race.eloChanges.filter(c => c.type === 'global');
        
        // Show all qualifying participants
        if (allRaceData) {
            const raceDetail = allRaceData.races.find(r => r.round == race.round);
            if (raceDetail && raceDetail.results.length > 0) {
                content += `#### Qualifying Results\n\n`;
                content += `| Driver | Constructor | Grid | Starting Elo | Change | New Elo | vs Teammate |\n`;
                content += `|--------|-------------|------|--------------|--------|---------|-------------|\n`;
                
                // Sort by grid position
                const sortedByGrid = raceDetail.results.sort((a, b) => {
                    const aGrid = parseInt(a.grid) || 999;
                    const bGrid = parseInt(b.grid) || 999;
                    return aGrid - bGrid;
                });
                
                sortedByGrid.forEach(result => {
                    const flag = getCountryFlag(result.driver);
                    const driverName = `${flag} ${result.driver.givenName} ${result.driver.familyName}`.trim();
                    const driverLink = createDriverLink(driverName);
                    const gridPos = result.grid || 'N/A';
                    
                    // Find if this driver had qualifying ELO changes
                    const qualifyingChange = qualifyingChanges.find(c => c.driverId === result.driver.driverId);
                    const startingElo = qualifyingChange ? qualifyingChange.startingElo : 'N/A';
                    const eloChangeStr = qualifyingChange ? formatEloChange(qualifyingChange.eloChange) : 'N/A';
                    const newElo = qualifyingChange ? qualifyingChange.newElo : 'N/A';
                    const teammate = qualifyingChange ? createDriverLink(qualifyingChange.opponent) + ` (P${qualifyingChange.opponentPosition})` : 'N/A';
                    
                    content += `| ${driverLink} | ${result.constructor.name} | ${gridPos} | ${startingElo} | ${eloChangeStr} | ${newElo} | ${teammate} |\n`;
                });
                content += '\n';
            }
        }
        
        // Show all race participants
        if (allRaceData) {
            const raceDetail = allRaceData.races.find(r => r.round == race.round);
            if (raceDetail && raceDetail.results.length > 0) {
                content += `#### Race Results\n\n`;
                content += `| Driver | Constructor | Position | Status | Starting Elo | Change | New Elo | vs Teammate |\n`;
                content += `|--------|-------------|----------|--------|--------------|--------|---------|-------------|\n`;
                
                // Sort by finishing position (finished drivers first, then DNFs)
                const sortedResults = raceDetail.results.sort((a, b) => {
                    const aFinished = !isNaN(parseInt(a.position));
                    const bFinished = !isNaN(parseInt(b.position));
                    
                    if (aFinished && bFinished) {
                        return parseInt(a.position) - parseInt(b.position);
                    } else if (aFinished && !bFinished) {
                        return -1;
                    } else if (!aFinished && bFinished) {
                        return 1;
                    } else {
                        return 0; // Both DNF, keep original order
                    }
                });
                
                sortedResults.forEach(result => {
                    const flag = getCountryFlag(result.driver);
                    const driverName = `${flag} ${result.driver.givenName} ${result.driver.familyName}`.trim();
                    const driverLink = createDriverLink(driverName);
                    const finishPos = !isNaN(parseInt(result.position)) ? result.position : 'DNF';
                    const status = result.status || 'Unknown';
                    
                    // Find if this driver had race ELO changes
                    const raceChange = raceChanges.find(c => c.driverId === result.driver.driverId);
                    const startingElo = raceChange ? raceChange.startingElo : 'N/A';
                    const eloChangeStr = raceChange ? formatEloChange(raceChange.eloChange) : 'N/A';
                    const newElo = raceChange ? raceChange.newElo : 'N/A';
                    const teammate = raceChange ? createDriverLink(raceChange.opponent) + ` (P${raceChange.opponentPosition})` : 'N/A';
                    
                    content += `| ${driverLink} | ${result.constructor.name} | ${finishPos} | ${status} | ${startingElo} | ${eloChangeStr} | ${newElo} | ${teammate} |\n`;
                });
                content += '\n';
            }
        }
        

        
        content += '---\n\n';
    });
    
    // Save to docs/seasons folder
    const filePath = `docs/seasons/${season}-season-report.md`;
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`✓ Season report saved to ${filePath}`);
    
    return filePath;
}

/**
 * Update homepage files (README.md and docs/index.md) with ELO results
 * @param {Array} driverRatings - Array of driver rating objects
 * @param {string} season - Season year
 * @param {boolean} useComprehensiveLinks - Whether to use comprehensive driver links (for bulk processing)
 */
async function updateHomepageFiles(driverRatings, season, useComprehensiveLinks = false) {
    try {
        const files = [
            { path: './README.md', isGithubPages: false },
            { path: './docs/index.md', isGithubPages: true }
        ];
        
        const now = new Date();
        const timestamp = `${now.toISOString().split('T')[0]}`;
        
        for (const file of files) {
            try {
                // Use comprehensive table generator if requested (for bulk processing)
                const table = generateELOTable(driverRatings, season, file.isGithubPages);
                
                const newContent = `### Current Elo Ratings (during the ${season} season)
*Last updated: ${timestamp}*

- This table shows the current Elo ratings of drivers currently on the grid for the ${season} season. Some drivers may have peaked earlier in their careers, so this is not a comprehensive list of the best drivers of all time.

- For the all-time best drivers, see: [Best Qualifying Elo](${file.isGithubPages ? 'peak-elo#best-qualifying-elo' : 'docs/peak-elo.md#best-qualifying-elo'}) | [Best Race Elo](${file.isGithubPages ? 'peak-elo#best-race-elo' : 'docs/peak-elo.md#best-race-elo'}) | [Best Global Elo](${file.isGithubPages ? 'peak-elo#best-global-elo' : 'docs/peak-elo.md#best-global-elo'})

- The Global Elo combines qualifying (30%) and race (70%) Elo changes using a weighted calculation to provide a comprehensive driver rating.

${table}

`;
                
                const fileContent = await fs.readFile(file.path, 'utf8');
                
                // Replace content between markers
                const updatedContent = fileContent.replace(
                    /<!-- ELO_RESULTS_START -->.*?<!-- ELO_RESULTS_END -->/s,
                    `<!-- ELO_RESULTS_START -->\n${newContent}\n<!-- ELO_RESULTS_END -->`
                );
                
                await fs.writeFile(file.path, updatedContent, 'utf8');
                console.log(`✓ ${file.path} updated with ELO ratings`);
            } catch (error) {
                console.error(`Error updating ${file.path}:`, error);
                // Continue with other files even if one fails
            }
        }
        
    } catch (error) {
        console.error('Error updating homepage files:', error);
        throw error;
    }
}

/**
 * Generate comprehensive ELO table for README (links to comprehensive driver files)
 */
function generateComprehensiveELOTable(driverRatings) {
    let table = '| Rank | Driver | Constructor | Qualifying Elo | Race Elo | Global Elo |\n';
    table    += '|------|--------|-------------|----------------|----------|------------|\n';
    
    driverRatings.slice(0, 50).forEach((driver, index) => { // Show top 50
        // Create driver file link (comprehensive, no season)
        const cleanDriverName = cleanDriverNameForFilename(driver.name);
        
        const driverLink = `[${driver.name}](docs/drivers/${cleanDriverName}.md)`;
        
        // Calculate changes from starting Elo
        const qualifyingChange = driver.qualifyingElo - driver.startingElo;
        const raceChange = driver.raceElo - driver.startingElo;
        const globalChange = driver.globalElo - driver.startingElo;
        
        // Format Elo values with deltas
        const qualifyingEloFormatted = formatEloWithDelta(driver.qualifyingElo, qualifyingChange);
        const raceEloFormatted = formatEloWithDelta(driver.raceElo, raceChange);
        const globalEloFormatted = formatEloWithDelta(driver.globalElo, globalChange);
        
        table += `| ${index + 1} | ${driverLink} | ${driver.constructor} | ${qualifyingEloFormatted} | ${raceEloFormatted} | ${globalEloFormatted} |\n`;
    });
    
    return table + "\n";
}


/**
 * Generate markdown table for README or index
 */
function generateELOTable(driverRatings, season, isGithubPages = false) {
    let table = '| Rank | Driver | Constructor | Qualifying Elo | Race Elo | Global Elo |\n';
    table    += '|------|--------|-------------|----------------|----------|------------|\n';
    
    driverRatings.slice(0, 50).forEach((driver, index) => { // Show top 50
        // Create driver file link
        const cleanDriverName = cleanDriverNameForFilename(driver.name);
        
        // Different link formats for README vs GitHub Pages
        const driverLink = isGithubPages ? `[${driver.name}](drivers/${cleanDriverName})` : `[${driver.name}](docs/drivers/${cleanDriverName}.md)`;
        
        // Calculate changes from starting Elo
        const qualifyingChange = driver.qualifyingElo - driver.startingElo;
        const raceChange = driver.raceElo - driver.startingElo;
        const globalChange = driver.globalElo - driver.startingElo;
        
        // Format Elo values with deltas
        const qualifyingEloFormatted = formatEloWithDelta(driver.qualifyingElo, qualifyingChange);
        const raceEloFormatted = formatEloWithDelta(driver.raceElo, raceChange);
        const globalEloFormatted = formatEloWithDelta(driver.globalElo, globalChange);
        
        table += `| ${index + 1} | ${driverLink} | ${driver.constructor} | ${qualifyingEloFormatted} | ${raceEloFormatted} | ${globalEloFormatted} |\n`;
    });
    
    return table + "\n";
}

/**
 * Save final ELOs to race data file for next season
 */
async function saveFinalELOs(driverRatings, raceData, season) {
    const finalELOs = {};
    driverRatings.forEach(driver => {
        finalELOs[driver.driverId] = {
            qualifyingElo: driver.qualifyingElo,
            raceElo: driver.raceElo,
            globalElo: driver.globalElo
        };
    });
    
    // Update race data with final ELOs
    raceData.finalELOs = finalELOs;
    
    const outputFile = `data/${season}-race-results.json`;
    const jsonString = JSON.stringify(raceData, null, 2);
    await fs.writeFile(outputFile, jsonString, 'utf8');
    
    console.log(`✓ Final ELOs (qualifying, race, global) saved to ${outputFile}`);
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
        const { driverRatings, raceEvents, driverResults } = await calculateELO(raceData, season);
        
        // Generate detailed season report
        await generateSeasonReport(driverRatings, raceEvents, season);
        
        // Save final ELOs
        await saveFinalELOs(driverRatings, raceData, season);
        
        // Update README
        await updateHomepageFiles(driverRatings, season);
        
        console.log('\n' + '='.repeat(60));
        console.log('✓ ELO calculation completed successfully!');
        console.log(`✓ Season: ${season}`);
        console.log(`✓ Total races: ${raceData.totalRaces}`);
        console.log(`✓ Drivers rated: ${driverRatings.length}`);
        console.log(`✓ Top driver: ${driverRatings[0].consoleName} (${driverRatings[0].globalElo} ELO)`);
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
export { calculateELO, updateHomepageFiles, saveFinalELOs, calculateELOFromData, generateSeasonReport, cleanDriverNameForFilename };

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
