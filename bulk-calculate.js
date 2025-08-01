import { fetchAllSeasonResults, transformRaceData, saveToFile } from './fetch-results.js';
import { calculateELO, updateHomepageFiles, saveFinalELOs, generateSeasonReport, cleanDriverNameForFilename } from './calculate-elo.js';
import fs from 'fs/promises';
import { readFileSync } from 'fs';

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

            // Find teammate info from the same race event - use more robust lookup
            let teammateChange = raceEvent.eloChanges.find(c =>
                c.driverId !== driverId &&
                c.type === change.type &&
                c.constructor === change.constructor
            );

            // If no teammate found in Elo changes (missing data), try to find from race results
            if (!teammateChange && raceEvent.results) {
                const driverResult = raceEvent.results.find(r => r.driver.driverId === driverId);
                if (driverResult) {
                    const teammateResult = raceEvent.results.find(r =>
                        r.driver.driverId !== driverId &&
                        r.constructor.name === driverResult.constructor.name
                    );

                    if (teammateResult) {
                        teammateChange = {
                            driverId: teammateResult.driver.driverId,
                            driverName: teammateResult.driver.givenName + ' ' + teammateResult.driver.familyName,
                            newElo: null,
                            type: change.type,
                            constructor: driverResult.constructor.name
                        };
                    }
                }
            }

            // Verify teammate is from same constructor and fix if needed
            if (teammateChange && raceEvent.results) {
                const driverResult = raceEvent.results.find(r => r.driver.driverId === driverId);
                const teammateResult = raceEvent.results.find(r => r.driver.driverId === teammateChange.driverId);

                if (driverResult && teammateResult &&
                    driverResult.constructor.name !== teammateResult.constructor.name) {

                    // Find correct teammate from same constructor
                    const correctTeammate = raceEvent.results.find(r =>
                        r.driver.driverId !== driverId &&
                        r.constructor.name === driverResult.constructor.name
                    );

                    if (correctTeammate) {
                        const correctTeammateChange = raceEvent.eloChanges.find(c =>
                            c.driverId === correctTeammate.driver.driverId &&
                            c.type === change.type
                        );

                        if (correctTeammateChange) {
                            teammateChange = correctTeammateChange;
                        }
                    }
                }
            }

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
    function createPeakTable(peakMap, eloType, title, description) {
        const peakDrivers = Array.from(peakMap.entries())
            .map(([driverId, data]) => ({ driverId, ...data }))
            .sort((a, b) => b.peak - a.peak);

        let tableContent = `## ${title}\n\n`;
        tableContent += `${description}\n\n`;
        tableContent += `| Rank | Driver | Peak Elo | Constructor | Season | Race | Teammate | Teammate Elo |\n`;
        tableContent += `|------|--------|----------|-------------|--------|------|----------|--------------|\n`;

        peakDrivers.forEach((driver, index) => {
            // Create driver file link (remove flags and clean name for URL)
            const cleanDriverName = cleanDriverNameForFilename(driver.name);

            const driverLink = `[${driver.name}](./drivers/${cleanDriverName})`;

            // Load race data to get correct teammate info when needed
            let correctTeammate = driver.teammate;
            let correctTeammateElo = driver.teammateElo;
            try {
                const seasonData = JSON.parse(readFileSync(`data/${driver.season}-race-results.json`, 'utf8'));
                const raceEvent = seasonData.races.find(race => race.round === driver.round);

                if (raceEvent && raceEvent.results) {
                    // Find the driver's result using flexible name matching
                    let driverResult = raceEvent.results.find(r =>
                        (r.driver.givenName + ' ' + r.driver.familyName) === driver.name ||
                        driver.name.includes(r.driver.familyName) ||
                        r.driver.familyName.toLowerCase() === driver.name.split(' ').pop().toLowerCase()
                    );

                    if (driverResult) {
                        // Find their teammate (same constructor, different driver)
                        const teammateResult = raceEvent.results.find(r =>
                            r.driver.driverId !== driverResult.driver.driverId &&
                            r.constructor.name === driverResult.constructor.name
                        );

                        if (teammateResult) {
                            correctTeammate = teammateResult.driver.givenName + ' ' + teammateResult.driver.familyName;

                            // Find teammate's Elo from the race event data - match the Elo type
                            if (raceEvent.eloChanges) {
                                // Convert table type to data type: 'global' -> 'global', 'qualifying' -> 'qualifying', 'race' -> 'race'
                                const dataEloType = eloType.toLowerCase();

                                const teammateEloChange = raceEvent.eloChanges.find(c =>
                                    c.driverId === teammateResult.driver.driverId &&
                                    c.type === dataEloType
                                );

                                if (teammateEloChange) {
                                    correctTeammateElo = teammateEloChange.newElo;
                                } else {
                                    // Reset to null if we can't find the teammate's Elo for this type
                                    correctTeammateElo = null;
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                // If we can't load the data, use the original teammate info
            }

            // Create anchor link for the specific race (format: round-{number}-{racename})
            const roundNumber = driver.round || 'unknown';
            const raceTitle = `Round ${roundNumber} – ${driver.race}`;
            const raceAnchor = raceTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
            const raceLink = `[${raceTitle}](./seasons/${driver.season}-season-report#${raceAnchor})`;
            tableContent += `| ${index + 1} | ${driverLink} | **\`${driver.peak}\`** | ${driver.constructor} | ${driver.season} | ${raceLink} | ${correctTeammate} | \`${correctTeammateElo || 'N/A'}\` |\n`;
        });

        return { content: tableContent, drivers: peakDrivers };
    }

    // Create content with explanation and navigation
    let content = `# F1 Driver Peak Elo Ratings\n\n`;
    content += `This file contains the highest Elo ratings ever achieved by each Formula 1 driver across three categories:\n\n`;

    // Navigation links
    content += `## Quick Navigation\n\n`;
    content += `- [Peak Overall Elo Rankings](#peak-overall-elo-rankings) - Combined performance (30% qualifying + 70% race)\n`;
    content += `- [Peak Qualifying Elo Rankings](#peak-qualifying-elo-rankings) - Grid position performance vs teammates\n`;
    content += `- [Peak Race Elo Rankings](#peak-race-elo-rankings) - Finishing position performance vs teammates\n\n`;

    // Generate all three tables with descriptions
    const globalTable = createPeakTable(
        globalPeakELOs,
        'global',
        'Peak Overall Elo Rankings',
        'This list ranks drivers by **PEAK** Global Elo ratings. It combines qualifying (30%) and race (70%) ELO changes with weighted calculation.'
    );
    const qualifyingTable = createPeakTable(
        qualifyingPeakELOs,
        'qualifying',
        'Peak Qualifying Elo Rankings',
        'Based solely on qualifying performance (grid positions) compared to teammates.'
    );
    const raceTable = createPeakTable(
        racePeakELOs,
        'race',
        'Peak Race Elo Rankings',
        'Based solely on race finishing positions compared to teammates.'
    );

    // Add tables to content (Global first as it's most important)
    content += globalTable.content + '\n';
    content += qualifyingTable.content + '\n';
    content += raceTable.content + '\n';

    // Statistics
    content += `## Statistics\n\n`;
    content += `### Global Elo\n`;
    content += `- **Total drivers tracked**: ${globalTable.drivers.length}\n`;
    content += `- **Highest peak**: ${globalTable.drivers[0]?.peak || 'N/A'} (${globalTable.drivers[0]?.name || 'N/A'})\n`;
    content += `- **Average peak**: ${Math.round(globalTable.drivers.reduce((sum, d) => sum + d.peak, 0) / globalTable.drivers.length) || 'N/A'}\n\n`;

    content += `### Qualifying Elo\n`;
    content += `- **Total drivers tracked**: ${qualifyingTable.drivers.length}\n`;
    content += `- **Highest peak**: ${qualifyingTable.drivers[0]?.peak || 'N/A'} (${qualifyingTable.drivers[0]?.name || 'N/A'})\n`;
    content += `- **Average peak**: ${Math.round(qualifyingTable.drivers.reduce((sum, d) => sum + d.peak, 0) / qualifyingTable.drivers.length) || 'N/A'}\n\n`;

    content += `### Race Elo\n`;
    content += `- **Total drivers tracked**: ${raceTable.drivers.length}\n`;
    content += `- **Highest peak**: ${raceTable.drivers[0]?.peak || 'N/A'} (${raceTable.drivers[0]?.name || 'N/A'})\n`;
    content += `- **Average peak**: ${Math.round(raceTable.drivers.reduce((sum, d) => sum + d.peak, 0) / raceTable.drivers.length) || 'N/A'}\n\n`;

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]}`;
    content += `*Last updated: ${timestamp}*\n`;

    await fs.writeFile('docs/peak-elo.md', content, 'utf8');
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
async function updateIndexWithTop30(peakDriversData) {
    try {
        const indexContent = await fs.readFile('docs/index.md', 'utf8');

        // Helper function to create a table
        function createTop30Table(drivers, eloType, title, description) {
            const top30 = drivers.slice(0, 30);
            let tableContent = `## ${title}\n\n`;
            tableContent += `${description}\n\n`;

            // Add season navigation based on seasons represented in top 30
            const seasonsInTop30 = [...new Set(top30.map(d => d.season))].sort();
            if (seasonsInTop30.length > 1) {
                const seasonLinks = seasonsInTop30.map(season =>
                    `[${season}](seasons/${season}-season-report) ([F1.com](https://www.formula1.com/en/results.html/${season}/races.html))`
                ).join(' • ');
                tableContent += `**Seasons represented**: ${seasonLinks}\n\n`;
            }

            tableContent += `| Rank | Driver | Peak ${eloType} Elo | Constructor | Season | Race | Teammate | Teammate Elo |\n`;
            tableContent += `|------|--------|----------|-------------|--------|------|----------|--------------||\n`;

            top30.forEach((driver, index) => {
                // Create driver link
                const cleanDriverName = cleanDriverNameForFilename(driver.name);
                const driverLink = `[${driver.name}](drivers/${cleanDriverName})`;

                // Create season link
                const seasonLink = `[${driver.season}](seasons/${driver.season}-season-report)`;

                // Load race data to get correct teammate info when needed
                let correctTeammate = driver.teammate;
                let correctTeammateElo = driver.teammateElo;
                try {
                    const seasonData = JSON.parse(readFileSync(`data/${driver.season}-race-results.json`, 'utf8'));
                    const raceEvent = seasonData.races.find(race => race.round === driver.round);

                    if (raceEvent && raceEvent.results) {
                        // Find the driver's result using flexible name matching
                        let driverResult = raceEvent.results.find(r =>
                            (r.driver.givenName + ' ' + r.driver.familyName) === driver.name ||
                            driver.name.includes(r.driver.familyName) ||
                            r.driver.familyName.toLowerCase() === driver.name.split(' ').pop().toLowerCase()
                        );

                        if (driverResult) {
                            // Find their teammate (same constructor, different driver)
                            const teammateResult = raceEvent.results.find(r =>
                                r.driver.driverId !== driverResult.driver.driverId &&
                                r.constructor.name === driverResult.constructor.name
                            );

                            if (teammateResult) {
                                correctTeammate = teammateResult.driver.givenName + ' ' + teammateResult.driver.familyName;

                                // Find teammate's Elo from the race event data - match the Elo type
                                if (raceEvent.eloChanges) {
                                    // Convert table type to data type: 'Race' -> 'race', 'Qualifying' -> 'qualifying', 'Global' -> 'global'
                                    const dataEloType = eloType.toLowerCase();
                                    
                                    const teammateEloChange = raceEvent.eloChanges.find(c =>
                                        c.driverId === teammateResult.driver.driverId &&
                                        c.type === dataEloType
                                    );
                                    
                                    if (teammateEloChange) {
                                        correctTeammateElo = teammateEloChange.newElo;
                                    } else {
                                        // Reset to null if we can't find the teammate's Elo for this type
                                        correctTeammateElo = null;
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    // If we can't load the data, use the original teammate info
                }

                // Create teammate link
                const cleanTeammateName = cleanDriverNameForFilename(correctTeammate);
                const teammateLink = `[${correctTeammate}](drivers/${cleanTeammateName})`;

                // Create anchor link for the specific race (format: round-{number}-{racename})
                const roundNumber = driver.round || 'unknown';
                const raceTitle = `Round ${roundNumber} – ${driver.race}`;
                const raceAnchor = raceTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                const raceLink = `[${raceTitle}](./seasons/${driver.season}-season-report#${raceAnchor})`;

                tableContent += `| ${index + 1} | ${driverLink} | **${driver.peak}** | ${driver.constructor} | ${seasonLink} | ${raceLink} | ${teammateLink} | ${correctTeammateElo || 'N/A'} |\n`;
            });

            return tableContent + "\n\n";
        }

        // Create all three tables
        let allTablesContent = '';
        allTablesContent += createTop30Table(
            peakDriversData.race,
            'Race',
            '[Top 30 F1 Drivers of All Time](peak-elo#peak-race-elo-rankings) - Race Performance',
            'Based on peak **Race Elo** ratings (race finishing positions vs teammates) • [See complete list here](peak-elo#peak-race-elo-rankings)'
        );
        allTablesContent += createTop30Table(
            peakDriversData.qualifying,
            'Qualifying',
            '[Top 30 F1 Drivers of All Time](peak-elo#peak-qualifying-elo-rankings) - Qualifying Performance',
            'Based on peak **Qualifying Elo** ratings (qualifying positions vs teammates) • [See complete list here](peak-elo#peak-qualifying-elo-rankings)'
        );
        allTablesContent += createTop30Table(
            peakDriversData.global,
            'Global',
            '[Top 30 F1 Drivers of All Time](peak-elo#peak-overall-elo-rankings) - Global Performance',
            'Based on peak **Global Elo** ratings (30% qualifying + 70% race performance vs teammates) • [See complete list here](peak-elo#peak-overall-elo-rankings)'
        );

        const now = new Date();
        const timestamp = `${now.toISOString().split('T')[0]}`;
        allTablesContent += `\n*Based on peak Elo ratings achieved during their F1 careers. Last updated: ${timestamp}*\n`;

        // Replace content between TOP30_TABLES markers
        const updatedContent = indexContent.replace(
            /<!-- TOP30_TABLES_START -->.*?<!-- TOP30_TABLES_END -->/s,
            `<!-- TOP30_TABLES_START -->\n${allTablesContent}<!-- TOP30_TABLES_END -->`
        );

        await fs.writeFile('docs/index.md', updatedContent, 'utf8');
        console.log(`✓ Updated 3 top 30 drivers tables in docs/index.md using markers`);
    } catch (error) {
        console.error(`⚠ Error updating docs/index.md with top 30 tables:`, error.message);
    }
}

/**
 * Format ELO score with delta and color coding
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

    return `${finalElo} **<span style="color: ${color};">${arrow}&nbsp;\`${sign}${eloChange}\`</span>**`;
}

/**
 * Calculate teammate win statistics for a driver in a specific season
 */
function calculateTeammateStats(driverName, seasonResults, raceData) {
    const teammateStats = new Map(); // teammate -> { races: [], qualifying: [], raceEloImpact: 0, qualEloImpact: 0 }

    // Process each race result for this driver
    seasonResults.forEach(result => {
        if (!result.teammate) return;

        if (!teammateStats.has(result.teammate)) {
            teammateStats.set(result.teammate, {
                races: [],
                qualifying: [],
                raceEloImpact: 0,
                qualEloImpact: 0
            });
        }

        const stats = teammateStats.get(result.teammate);

        if (result.session === 'race') {
            if (result.result === 'DNF') {
                // Track DNF - no win/loss determination
                stats.races.push({ type: 'dnf', round: result.round, raceName: result.raceName });
            } else if (result.eloChange !== null) {
                // Use ELO change to determine win/loss (positive = win, negative = loss)
                const won = result.eloChange > 0;
                stats.races.push({
                    type: won ? 'win' : 'loss',
                    round: result.round,
                    raceName: result.raceName
                });
                stats.raceEloImpact += result.eloChange || 0;
            }
        } else if (result.session === 'qualifying') {
            // Use ELO change to determine win/loss (positive = win, negative = loss)
            if (result.eloChange !== null) {
                const won = result.eloChange > 0;
                stats.qualifying.push({
                    type: won ? 'win' : 'loss',
                    round: result.round,
                    raceName: result.raceName
                });
                stats.qualEloImpact += result.eloChange || 0;
            }
        }
    });

    return teammateStats;
}

/**
 * Calculate DNF statistics for a driver in a specific season
 */
function calculateDNFStats(driverName, seasonResults) {
    const raceResults = seasonResults.filter(r => r.session === 'race');

    const dnfCount = raceResults.filter(r => r.result === 'DNF').length;
    const totalRaces = raceResults.length;
    const dnfPercentage = totalRaces > 0 ? ((dnfCount / totalRaces) * 100).toFixed(1) : '0.0';

    return { dnfCount, totalRaces, dnfPercentage };
}

/**
 * Generate comprehensive driver files across all processed seasons
 */
async function generateComprehensiveDriverFiles() {
    console.log('Generating comprehensive driver files across all seasons...');

    // Find all processed season data files
    const dataDir = 'data';
    const files = await fs.readdir(dataDir);
    const dataFiles = files
        .filter(file => file.endsWith('-race-results.json'))
        .map(file => `${dataDir}/${file}`);
    const allDriverResults = new Map(); // driverId -> { driverName, allResults: [] }

    // Process each season file
    for (const dataFile of dataFiles) {
        try {
            const season = dataFile.match(/(\d{4})-race-results\.json$/)?.[1];
            if (!season) continue;

            console.log(`Processing ${season} for driver files...`);

            const raceDataContent = await fs.readFile(dataFile, 'utf8');
            const raceData = JSON.parse(raceDataContent);

            // Calculate Elo for this season to get driver results
            const { driverRatings, raceEvents, driverResults } = await calculateELO(raceData, season);

            // Merge driver results into comprehensive map
            for (const [driverId, driverData] of driverResults) {
                if (!allDriverResults.has(driverId)) {
                    allDriverResults.set(driverId, {
                        driverName: driverData.driverName,
                        allResults: []
                    });
                }

                // Add this season's results
                allDriverResults.get(driverId).allResults.push(...driverData.results);
            }
        } catch (error) {
            console.error(`Error processing ${dataFile}:`, error.message);
        }
    }

    // Generate comprehensive driver files
    for (const [driverId, driverData] of allDriverResults) {
        const results = driverData.allResults;
        if (results.length === 0) continue;

        // Clean driver name for filename (remove flags and special characters)
        const cleanDriverName = cleanDriverNameForFilename(driverData.driverName);

        let content = `# ${driverData.driverName} - Complete F1 Career Results\n\n`;
        content += `*Last updated: ${new Date().toISOString().split('T')[0]}*\n\n`;

        // Get unique seasons and sort chronologically
        const seasons = [...new Set(results.map(r => r.season))].sort();

        // Quick navigation to season sections
        content += `## Season Navigation\n\n`;
        seasons.forEach(season => {
            content += `- [${season} Season](#${season}-season) - [📊 Full Season Report](../seasons/${season}-season-report)\n`;
        });
        content += `\n`;

        // Sort results for statistics calculation
        const sortedResults = results.sort((a, b) => {
            if (a.season !== b.season) return parseInt(a.season) - parseInt(b.season);
            if (a.round !== b.round) return a.round - b.round;
            // Order: qualifying, race, global
            const sessionOrder = { 'qualifying': 1, 'race': 2, 'global': 3 };
            return sessionOrder[a.session] - sessionOrder[b.session];
        });

        // Add career statistics at the top
        content += `## Career Statistics\n\n`;

        content += `**Total Race Events**: ${Math.ceil(results.length / 3)} (${results.length} individual Elo calculations)\n\n`;

        // Calculate DNF statistics (only for race results)
        const raceResultsForDNF = results.filter(r => r.session === 'race');
        const dnfCount = raceResultsForDNF.filter(r => r.result === 'DNF').length;
        const totalRaces = raceResultsForDNF.length;
        const dnfPercentage = totalRaces > 0 ? ((dnfCount / totalRaces) * 100).toFixed(1) : '0.0';

        content += `**DNF Statistics**: ${dnfCount} DNFs out of ${totalRaces} races (${dnfPercentage}%)\n\n`;

        // ELO progression by type
        const qualifyingResults = sortedResults.filter(r => r.session === 'qualifying' && r.eloChange !== null);
        const raceResults = sortedResults.filter(r => r.session === 'race' && r.eloChange !== null);
        const globalResults = sortedResults.filter(r => r.session === 'global' && r.eloChange !== null);

        // Add peak and low ELO statistics in table format
        content += `### 📊 Peak & Lowest Elo Ratings\n\n`;
        content += `| &nbsp; | Qualifying | Race | Global |\n`;
        content += `|-------|------------|------|--------|\n`;

        // Initialize cells with default values
        let peakQualCell = 'N/A';
        let peakRaceCell = 'N/A';
        let peakGlobalCell = 'N/A';
        let lowQualCell = 'N/A';
        let lowRaceCell = 'N/A';
        let lowGlobalCell = 'N/A';

        // Populate qualifying cells if data available
        if (qualifyingResults.length > 0) {
            const qualPeakResult = qualifyingResults.reduce((max, r) => r.newElo > max.newElo ? r : max);
            const qualLowResult = qualifyingResults.reduce((min, r) => r.newElo < min.newElo ? r : min);

            // Create links for peak and low qualifying results
            const qualPeakTitle = `Round ${qualPeakResult.round} – ${qualPeakResult.raceName}`;
            const qualPeakAnchor = qualPeakTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
            const qualPeakLink = `[${qualPeakResult.season} Round ${qualPeakResult.round} – ${qualPeakResult.raceName}](../seasons/${qualPeakResult.season}-season-report#${qualPeakAnchor})`;

            const qualLowTitle = `Round ${qualLowResult.round} – ${qualLowResult.raceName}`;
            const qualLowAnchor = qualLowTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
            const qualLowLink = `[${qualLowResult.season} Round ${qualLowResult.round} – ${qualLowResult.raceName}](../seasons/${qualLowResult.season}-season-report#${qualLowAnchor})`;

            peakQualCell = `<center> ${qualPeakResult.newElo} <br/><small> ${qualPeakLink} </small></center>`;
            lowQualCell = `<center> ${qualLowResult.newElo} <br/><small> ${qualLowLink} </small></center>`;
        }

        // Populate race cells if data available
        if (raceResults.length > 0) {
            const racePeakResult = raceResults.reduce((max, r) => r.newElo > max.newElo ? r : max);
            const raceLowResult = raceResults.reduce((min, r) => r.newElo < min.newElo ? r : min);

            // Create links for peak and low race results
            const racePeakTitle = `Round ${racePeakResult.round} – ${racePeakResult.raceName}`;
            const racePeakAnchor = racePeakTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
            const racePeakLink = `[${racePeakResult.season} Round ${racePeakResult.round} – ${racePeakResult.raceName}](../seasons/${racePeakResult.season}-season-report#${racePeakAnchor})`;

            const raceLowTitle = `Round ${raceLowResult.round} – ${raceLowResult.raceName}`;
            const raceLowAnchor = raceLowTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
            const raceLowLink = `[${raceLowResult.season} Round ${raceLowResult.round} – ${raceLowResult.raceName}](../seasons/${raceLowResult.season}-season-report#${raceLowAnchor})`;

            peakRaceCell =  `<center> ${racePeakResult.newElo} <br/><small> ${racePeakLink} </small></center>`;
            lowRaceCell =  `<center> ${raceLowResult.newElo} <br/><small> ${raceLowLink} </small></center>`;
        }

        // Populate global cells if data available
        if (globalResults.length > 0) {
            const globalPeakResult = globalResults.reduce((max, r) => r.newElo > max.newElo ? r : max);
            const globalLowResult = globalResults.reduce((min, r) => r.newElo < min.newElo ? r : min);

            // Create links for peak and low global results
            const globalPeakTitle = `Round ${globalPeakResult.round} – ${globalPeakResult.raceName}`;
            const globalPeakAnchor = globalPeakTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
            const globalPeakLink = `[${globalPeakResult.season} Round ${globalPeakResult.round} – ${globalPeakResult.raceName}](../seasons/${globalPeakResult.season}-season-report#${globalPeakAnchor})`;

            const globalLowTitle = `Round ${globalLowResult.round} – ${globalLowResult.raceName}`;
            const globalLowAnchor = globalLowTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
            const globalLowLink = `[${globalLowResult.season} Round ${globalLowResult.round} – ${globalLowResult.raceName}](../seasons/${globalLowResult.season}-season-report#${globalLowAnchor})`;

            peakGlobalCell = `<center> ${globalPeakResult.newElo}  <br/><small> ${globalPeakLink} </small></center>`;
            lowGlobalCell = `<center> ${globalLowResult.newElo} <br/><small> ${globalLowLink} </small></center>`;
        }

        // Add the table rows
        content += `| **Peak** | ${peakQualCell} | ${peakRaceCell} | ${peakGlobalCell} |\n`;
        content += `| **Lowest** | ${lowQualCell} | ${lowRaceCell} | ${lowGlobalCell} |\n\n`;

        content += `\n`;

        // Fill in teammate data by finding teammate results in allDriverResults
        sortedResults.forEach(result => {
            if (!result.teammate) return;

            // Find the teammate's driver data
            const teammateDriverData = Array.from(allDriverResults.values())
                .find(d => d.driverName === result.teammate);

            if (teammateDriverData) {
                // Find teammate's corresponding result for the same round and session
                const teammateResult = teammateDriverData.allResults.find(r =>
                    r.season === result.season &&
                    r.round === result.round &&
                    r.session === result.session &&
                    r.constructor === result.constructor
                );

                if (teammateResult) {
                    result.teammateStartingElo = teammateResult.startingElo;
                    result.teammateEloChange = teammateResult.eloChange;
                    result.teammateNewElo = teammateResult.newElo;
                }
            }
        });

        // Generate results split by season
        content += `## Complete Career Results by Season\n\n`;

        seasons.forEach(season => {
            const seasonResults = sortedResults.filter(r => r.season === season);
            if (seasonResults.length === 0) return;

            content += `### ${season} Season\n\n`;
            content += `📊 **[View Full ${season} Season Report](../seasons/${season}-season-report)**\n\n`;

            // Calculate and display teammate statistics for this season
            const teammateStats = calculateTeammateStats(driverData.driverName, seasonResults, null);
            const dnfStats = calculateDNFStats(driverData.driverName, seasonResults);

            // Calculate season ELO changes
            const raceResults = seasonResults.filter(r => r.session === 'race');
            const qualResults = seasonResults.filter(r => r.session === 'qualifying');
            const globalResults = seasonResults.filter(r => r.session === 'global');

            const getSeasonEloSummary = (results) => {
                if (results.length === 0) return { startElo: 1500, endElo: 1500, change: 0 };
                const startElo = results[0].startingElo;
                const endElo = results[results.length - 1].newElo;
                const change = endElo - startElo;
                return { startElo, endElo, change };
            };

            const raceSummary = getSeasonEloSummary(raceResults);
            const qualSummary = getSeasonEloSummary(qualResults);
            const globalSummary = getSeasonEloSummary(globalResults);

            // Add season ELO summary table
            content += `#### Season Elo Summary\n\n`;
            content += `| Race | Qualifying | Global |\n`;
            content += `|------|------------|--------|\n`;
            content += `| ${formatEloWithDelta(raceSummary.endElo, raceSummary.change)} | ${formatEloWithDelta(qualSummary.endElo, qualSummary.change)} | ${formatEloWithDelta(globalSummary.endElo, globalSummary.change)} |\n\n`;

            // Add teammate win statistics
            if (teammateStats.size > 0) {
                content += `#### Teammate Head-to-Head Statistics\n\n`;

                for (const [teammate, stats] of teammateStats) {
                    const cleanTeammateName = cleanDriverNameForFilename(teammate);
                    const teammateLink = `[${teammate}](${cleanTeammateName})`;

                    // Get teammate's ELO values for this season from available data
                    const teammateSeasonResults = seasonResults.filter(r => r.teammate === teammate);

                    // Get final teammate ELO values from the teammate data if available
                    const teammateRaceResults = teammateSeasonResults.filter(r => r.session === 'race' && r.teammateNewElo != null);
                    const teammateQualResults = teammateSeasonResults.filter(r => r.session === 'qualifying' && r.teammateNewElo != null);

                    const teammateRaceElo = teammateRaceResults.length > 0 ?
                        Math.round(teammateRaceResults[teammateRaceResults.length - 1].teammateNewElo) : 'N/A';
                    const teammateQualElo = teammateQualResults.length > 0 ?
                        Math.round(teammateQualResults[teammateQualResults.length - 1].teammateNewElo) : 'N/A';

                    // Race statistics
                    const raceWins = stats.races.filter(r => r.type === 'win').length;
                    const raceLosses = stats.races.filter(r => r.type === 'loss').length;
                    const raceDNFs = stats.races.filter(r => r.type === 'dnf').length;
                    const totalRaces = raceWins + raceLosses + raceDNFs;

                    const raceWinPercent = totalRaces > 0 ? ((raceWins / totalRaces) * 100).toFixed(1) : '0.0';
                    const raceLossPercent = totalRaces > 0 ? ((raceLosses / totalRaces) * 100).toFixed(1) : '0.0';
                    const raceDNFPercent = totalRaces > 0 ? ((raceDNFs / totalRaces) * 100).toFixed(1) : '0.0';
                    const raceEloImpact = Math.round(stats.raceEloImpact);
                    const raceEloFormatted = raceEloImpact === 0 ? '↔ 0' :
                        raceEloImpact > 0 ? `<span style="color: green;">▲&nbsp;\`+${raceEloImpact}\`</span>` :
                            `<span style="color: red;">▼&nbsp;\`${raceEloImpact}\`</span>`;

                    // Qualifying statistics  
                    const qualWins = stats.qualifying.filter(q => q.type === 'win').length;
                    const qualLosses = stats.qualifying.filter(q => q.type === 'loss').length;
                    const totalQual = qualWins + qualLosses;

                    const qualWinPercent = totalQual > 0 ? ((qualWins / totalQual) * 100).toFixed(1) : '0.0';
                    const qualLossPercent = totalQual > 0 ? ((qualLosses / totalQual) * 100).toFixed(1) : '0.0';
                    const qualEloImpact = Math.round(stats.qualEloImpact);
                    const qualEloFormatted = qualEloImpact === 0 ? '↔ 0' :
                        qualEloImpact > 0 ? `<span style="color: green;">▲&nbsp;\`+${qualEloImpact}\`</span>` :
                            `<span style="color: red;">▼&nbsp;\`${qualEloImpact}\`</span>`;

                    content += `- **Races vs ${teammateLink} \`${teammateRaceElo}\`**: **\`${raceWins}\`** wins <small>\`${raceWinPercent}%\`</small> • **\`${raceLosses}\`** losses <small>\`${raceLossPercent}%\`</small> • **\`${raceDNFs}\`** DNFs <small>\`${raceDNFPercent}%\`</small> • **Elo ${raceEloFormatted}**\n`;
                    content += `- **Qualifying vs ${teammateLink} \`${teammateQualElo}\`**: **\`${qualWins}\`** wins <small>\`${qualWinPercent}%\`</small> • **\`${qualLosses}\`** losses <small>\`${qualLossPercent}%\`</small> • **Elo ${qualEloFormatted}**\n\n`;
                }
            }

            // Add DNF statistics
            content += `#### DNF Statistics\n\n`;
            content += `- **DNFs**: \`${dnfStats.dnfCount}\` out of \`${dnfStats.totalRaces}\` races <small>\`${dnfStats.dnfPercentage}%\`</small>\n\n`;

            content += `#### Detailed Results\n\n`;
            content += `| Race | Constructor | Positions | Qualifying Elo | Race Elo | Global Elo | Teammate |\n`;
            content += `|------|-------------|-----------|----------------|----------|------------|----------|\n`;

            // Group results by race (round) to consolidate sessions
            const raceGroups = new Map();

            seasonResults.forEach(result => {
                const raceKey = `${result.round}-${result.raceName}`;

                if (!raceGroups.has(raceKey)) {
                    raceGroups.set(raceKey, {
                        round: result.round,
                        raceName: result.raceName,
                        date: result.date,
                        constructor: result.constructor,
                        teammate: result.teammate,
                        qualifying: null,
                        race: null,
                        global: null
                    });
                }

                const raceGroup = raceGroups.get(raceKey);
                raceGroup[result.session] = result;
            });

            // Convert map to array and sort by round number
            const sortedRaceGroups = Array.from(raceGroups.values()).sort((a, b) => a.round - b.round);

            sortedRaceGroups.forEach(raceGroup => {
                // Create race link to season report
                const raceTitle = `Round ${raceGroup.round} - ${raceGroup.raceName}`;
                const raceAnchor = raceTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                const raceLink = `[${raceTitle}](../seasons/${season}-season-report#${raceAnchor})`;

                // Build positions string with line breaks
                const qualPos = raceGroup.qualifying?.position || 'N/A';
                const racePos = raceGroup.race?.position || 'N/A';
                const positionsStr = `<small>Q:&nbsp;**\`${qualPos}\`**&nbsp;•&nbsp;R:&nbsp;**\`${racePos}\`**</small>`;

                // Format Elo with delta using existing function, or show N/A
                const formatEloColumn = (sessionData) => {
                    if (!sessionData || sessionData.eloChange === null) return 'N/A';
                    return formatEloWithDelta(sessionData.newElo, sessionData.eloChange);
                };

                const qualEloStr = formatEloColumn(raceGroup.qualifying);
                const raceEloStr = formatEloColumn(raceGroup.race);
                const globalEloStr = formatEloColumn(raceGroup.global);

                // Format teammate with positions below
                const cleanTeammateName = cleanDriverNameForFilename(raceGroup.teammate);
                const teammateLink = `[${raceGroup.teammate}](${cleanTeammateName})`;

                // Find teammate positions for the same race by looking at teammate's results
                let teammateQualPos = 'N/A';
                let teammateRacePos = 'N/A';

                if (raceGroup.teammate) {
                    const teammateDriverData = Array.from(allDriverResults.values())
                        .find(d => d.driverName === raceGroup.teammate);

                    if (teammateDriverData) {
                        const teammateQualResult = teammateDriverData.allResults.find(r =>
                            r.season === season &&
                            r.round === raceGroup.round &&
                            r.session === 'qualifying' &&
                            r.constructor === raceGroup.constructor
                        );

                        const teammateRaceResult = teammateDriverData.allResults.find(r =>
                            r.season === season &&
                            r.round === raceGroup.round &&
                            r.session === 'race' &&
                            r.constructor === raceGroup.constructor
                        );

                        teammateQualPos = teammateQualResult?.position || 'N/A';
                        teammateRacePos = teammateRaceResult?.position || 'N/A';
                    }
                }

                const teammateStr = `${teammateLink}<br/><small>Q:&nbsp;**\`${teammateQualPos}\`**&nbsp;•&nbsp;R:&nbsp;**\`${teammateRacePos}\`**</small>`;

                content += `| ${raceLink} | ${raceGroup.constructor} | ${positionsStr} | ${qualEloStr} | ${raceEloStr} | ${globalEloStr} | ${teammateStr} |\n`;
            });

            content += `\n`;
        });


        // Save driver file
        const fileName = `docs/drivers/${cleanDriverName}.md`;
        await fs.writeFile(fileName, content, 'utf8');
    }

    console.log(`✓ Generated ${allDriverResults.size} comprehensive driver files`);
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
        console.log(`  - Top driver: ${driverRatings[0].consoleName} (${driverRatings[0].globalElo} Elo)`);

        return {
            success: true,
            season,
            races: raceData.totalRaces,
            drivers: driverRatings.length,
            topDriver: `${driverRatings[0].consoleName} (${driverRatings[0].globalElo} Elo)`
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
            console.log(`Waiting 1ms seconds before next season...`);
            await new Promise(resolve => setTimeout(resolve, 1));
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

    // Generate comprehensive outputs
    if (successful.length > 0) {
        console.log(`\nGenerating comprehensive driver files...`);
        await generateComprehensiveDriverFiles();

        console.log(`\nGenerating peak ELO file...`);
        const peakDrivers = await generatePeakELOFile();

        console.log(`\nUpdating README with ${endYear} season results and top 30 driver tables...`);

        // Load the latest season data to update README
        try {
            const latestFile = `data/${endYear}-race-results.json`;
            const latestData = await fs.readFile(latestFile, 'utf8');
            const raceData = JSON.parse(latestData);
            const { driverRatings } = await calculateELO(raceData, endYear.toString());
            await updateHomepageFiles(driverRatings, endYear.toString(), true);
            await updateIndexWithTop30(peakDrivers);
            console.log(`✓ Homepage files updated with ${endYear} season and 3 top 30 driver tables`);
        } catch (error) {
            console.error(`⚠ Could not update homepage files:`, error.message);
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
