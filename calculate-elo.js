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
    'Portugal': { url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg', alt: 'Portugal', emoji: '🇵🇹' },
    'Russia': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg', alt: 'Russia', emoji: '🇷🇺' },
    'South Africa': { url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg', alt: 'South Africa', emoji: '🇿🇦' },
    'Spain': { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg', alt: 'Spain', emoji: '🇪🇸' },
    'Spanish': { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg', alt: 'Spain', emoji: '🇪🇸' },
    'Sweden': { url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Sweden.svg', alt: 'Sweden', emoji: '🇸🇪' },
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
    const K_FACTOR = 64; // ELO K-factor
    const INITIAL_ELO = 1500; // Starting ELO rating
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
    
    // Check if either driver had issues (DNF, DNS, etc.)
    const validStatuses = ['Finished', '+1 Lap', '+2 Laps', '+3 Laps'];
    const driver1DNF = (type === 'race' || type === 'global') && !validStatuses.some(status => driver1.status.includes(status));
    const driver2DNF = (type === 'race' || type === 'global') && !validStatuses.some(status => driver2.status.includes(status));
    const anyDNF = driver1DNF || driver2DNF;
    
    // Initialize drivers if not seen before
    if (!drivers.has(driver1.driver.driverId)) {
        const startingElo = startingELOs.get(driver1.driver.driverId) || initialElo;
        const flag = getCountryFlag(driver1.driver);
        const flagEmoji = getCountryFlagEmoji(driver1.driver);
        drivers.set(driver1.driver.driverId, {
            name: `${flag} ${driver1.driver.givenName} ${driver1.driver.familyName}`.trim(),
            consoleName: `${flagEmoji} ${driver1.driver.givenName} ${driver1.driver.familyName}`.trim(),
            constructor: driver1.constructor.name,
            startingElo: startingElo,
            qualifyingElo: startingElo,
            raceElo: startingElo,
            globalElo: startingElo
        });
    }
    if (!drivers.has(driver2.driver.driverId)) {
        const startingElo = startingELOs.get(driver2.driver.driverId) || initialElo;
        const flag = getCountryFlag(driver2.driver);
        const flagEmoji = getCountryFlagEmoji(driver2.driver);
        drivers.set(driver2.driver.driverId, {
            name: `${flag} ${driver2.driver.givenName} ${driver2.driver.familyName}`.trim(),
            consoleName: `${flagEmoji} ${driver2.driver.givenName} ${driver2.driver.familyName}`.trim(),
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
        
        if (isNaN(qual1) || isNaN(qual2) || (isNaN(race1) && !driver1DNF) || (isNaN(race2) && !driver2DNF)) return null;
        
        // Lower combined score is better (smaller positions are better)
        const combined1 = (qual1 * 0.3) + (race1 * 0.7);
        const combined2 = (qual2 * 0.3) + (race2 * 0.7);
        
        // For comparison, we need discrete positions, so whoever has better combined score "wins"
        pos1 = combined1 < combined2 ? 1 : 2;
        pos2 = combined1 < combined2 ? 2 : 1;
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
        
        // Calculate ELO changes
        eloChange1 = kFactor * (actualScore1 - expectedScore1);
        eloChange2 = kFactor * (actualScore2 - expectedScore2);
        
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
        content += `### Round ${race.round}: ${race.raceName}\n`;
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
                content += `| Driver | Constructor | Grid | Status | Starting ELO | Change | New ELO | vs Teammate |\n`;
                content += `|--------|-------------|------|--------|--------------|--------|---------|-------------|\n`;
                
                // Sort by grid position
                const sortedByGrid = raceDetail.results.sort((a, b) => {
                    const aGrid = parseInt(a.grid) || 999;
                    const bGrid = parseInt(b.grid) || 999;
                    return aGrid - bGrid;
                });
                
                sortedByGrid.forEach(result => {
                    const flag = getCountryFlag(result.driver);
                    const driverName = `${flag} ${result.driver.givenName} ${result.driver.familyName}`.trim();
                    const gridPos = result.grid || 'N/A';
                    const status = result.status || 'Unknown';
                    
                    // Find if this driver had qualifying ELO changes
                    const qualifyingChange = qualifyingChanges.find(c => c.driverId === result.driver.driverId);
                    const startingElo = qualifyingChange ? qualifyingChange.startingElo : 'N/A';
                    const eloChangeStr = qualifyingChange ? formatEloChange(qualifyingChange.eloChange) : 'N/A';
                    const newElo = qualifyingChange ? qualifyingChange.newElo : 'N/A';
                    const teammate = qualifyingChange ? `${qualifyingChange.opponent} (P${qualifyingChange.opponentPosition})` : 'N/A';
                    
                    content += `| ${driverName} | ${result.constructor.name} | ${gridPos} | ${status} | ${startingElo} | ${eloChangeStr} | ${newElo} | ${teammate} |\n`;
                });
                content += '\n';
            }
        }
        
        // Show all race participants
        if (allRaceData) {
            const raceDetail = allRaceData.races.find(r => r.round == race.round);
            if (raceDetail && raceDetail.results.length > 0) {
                content += `#### Race Results\n\n`;
                content += `| Driver | Constructor | Position | Status | Starting ELO | Change | New ELO | vs Teammate |\n`;
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
                    const finishPos = !isNaN(parseInt(result.position)) ? result.position : 'DNF';
                    const status = result.status || 'Unknown';
                    
                    // Find if this driver had race ELO changes
                    const raceChange = raceChanges.find(c => c.driverId === result.driver.driverId);
                    const startingElo = raceChange ? raceChange.startingElo : 'N/A';
                    const eloChangeStr = raceChange ? formatEloChange(raceChange.eloChange) : 'N/A';
                    const newElo = raceChange ? raceChange.newElo : 'N/A';
                    const teammate = raceChange ? `${raceChange.opponent} (P${raceChange.opponentPosition})` : 'N/A';
                    
                    content += `| ${driverName} | ${result.constructor.name} | ${finishPos} | ${status} | ${startingElo} | ${eloChangeStr} | ${newElo} | ${teammate} |\n`;
                });
                content += '\n';
            }
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
        const now = new Date();
        const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
        
        const newContent = `### ELO Ratings (${season} Season)
*Last updated: ${timestamp}*

${table}

`;
        
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
export { calculateELO, updateREADME, saveFinalELOs, calculateELOFromData, generateSeasonReport };

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
