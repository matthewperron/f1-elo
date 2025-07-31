# F1 ELO Ratings

A simplistic driver strength calculation for every F1 driver (current and historical) using the chess ELO algorithm.

## Overview

This project calculates ELO ratings for Formula 1 drivers by comparing their performance against their teammates in both qualifying and race sessions. Each driver receives three separate ELO scores:

- **Qualifying ELO**: Based on qualifying position comparisons with teammates
- **Race ELO**: Based on race finishing position comparisons with teammates  
- **Global ELO**: Combined rating using 30% qualifying performance + 70% race performance

See the [GitHub Pages here](https://matthewperron.github.io/f1-elo) to browse the results.

## Methodology

The ELO calculation follows the classic chess ELO formula, comparing each driver directly with their teammate(s) for each race weekend. Key rules:

1. **Data Source**: Historical race results from `data/YYYY-race-results.json` files (fetched from [Ergast API](https://api.jolpi.ca/ergast/f1/))
2. **Teammate Comparison**: Only head-to-head comparisons between teammates are considered
3. **Exclusions**: Races where no teammate participated or either driver had a DNF are excluded from calculations. The DNFs are defined by races where one of the drivers cannot finish the race for mechanical reasons. The valid status are the following: 
    - Finished
    - +1 Lap
    - +2 Laps
    - +3 Laps
    - +4 Laps
    - +5 Laps
    - +6 Laps
    - Lapped
    - Accident
    - Collision
    - Spun off
4. **Chronological Processing**: Race history is processed in chronological order to maintain accurate ELO progression

## ELO Formula

The standard chess ELO rating system is used with the following parameters:
- **Starting ELO**: 1500 points (or carried over from previous season)
- **K-factor**: 64 (determines rating change magnitude)
- **Expected Score**: E = 1 / (1 + 10^((opponent_elo - player_elo) / 400))
- **New Rating**: New_ELO = Old_ELO + K × (Actual_Score - Expected_Score)

### How It Works

Each race weekend, teammates are compared head-to-head in three categories:

#### 1. Qualifying ELO
Compares grid positions between teammates.

**Example**: Charles Leclerc (1600 ELO) vs Lewis Hamilton (1500 ELO) - Ferrari teammates
- Leclerc qualifies P3, Hamilton qualifies P5
- Expected score for Leclerc: 1/(1+10^((1500-1600)/400)) = 0.64
- Leclerc wins (better grid position): Actual score = 1
- Leclerc's new ELO: 1600 + 64 × (1 - 0.64) = **1623**
- Hamilton's new ELO: 1500 + 64 × (0 - 0.36) = **1477**

#### 2. Race ELO  
Compares finishing positions between teammates.

**Example**: George Russell (1550 ELO) vs Andrea Kimi Antonelli (1450 ELO) - Mercedes teammates
- Russell finishes P2, Antonelli finishes P4
- Expected score for Russell: 1/(1+10^((1450-1550)/400)) = 0.64
- Russell wins (better finish): Actual score = 1
- Russell's new ELO: 1550 + 64 × (1 - 0.64) = **1573**
- Antonelli's new ELO: 1450 + 64 × (0 - 0.36) = **1427**

#### 3. Global ELO
Combines qualifying (30%) and race (70%) ELO changes with weighted calculation.

**Example**: Max Verstappen (1700 ELO) vs Yuki Tsunoda (1600 ELO) - Red Bull teammates
- **Qualifying**: Verstappen P1, Tsunoda P3 (Verstappen wins)
  - Expected score for Verstappen: 1/(1+10^((1600-1700)/400)) = 0.64
  - Qualifying ELO change for Verstappen: 64 × (1 - 0.64) = **+23**
  - Qualifying ELO change for Tsunoda: 64 × (0 - 0.36) = **-23**

- **Race**: Verstappen P2, Tsunoda P1 (Tsunoda wins)  
  - Expected score for Verstappen: 1/(1+10^((1600-1700)/400)) = 0.64
  - Race ELO change for Verstappen: 64 × (0 - 0.64) = **-41**
  - Race ELO change for Tsunoda: 64 × (1 - 0.36) = **+41**

- **Global ELO Change** (30% qualifying + 70% race):
  - Verstappen: (23 × 0.3) + (-41 × 0.7) = 6.9 - 28.7 = **-22**
  - Tsunoda: (-23 × 0.3) + (41 × 0.7) = -6.9 + 28.7 = **+22**

- **Final Global ELO**:
  - Verstappen: 1700 + (-22) = **1678**
  - Tsunoda: 1600 + 22 = **1622**

## Results

The following table shows current ELO ratings for all F1 drivers (updated automatically):

<!-- ELO_RESULTS_START -->
### ELO Ratings (2025 Season)
*Last updated: 2025-07-31*

| Rank | Starting ELO | Driver | Constructor | Qualifying ELO | Race ELO | ELO |
|------|--------------|--------|-------------|----------------|----------|-----|
| 1 | 1957 | [<img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg" alt="Netherlands" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇱'; this.style.marginRight='5px';"/> Max Verstappen](docs/drivers/max-verstappen.md) | Red Bull | 1958 | 2045 | 2018 |
| 2 | 1844 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> George Russell](docs/drivers/george-russell.md) | Mercedes | 1941 | 1872 | 1888 |
| 3 | 1792 | [<img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" alt="Thailand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇹🇭'; this.style.marginRight='5px';"/> Alexander Albon](docs/drivers/alexander-albon.md) | Williams | 1779 | 1843 | 1826 |
| 4 | 1646 | [<img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg" alt="Monaco" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇨'; this.style.marginRight='5px';"/> Charles Leclerc](docs/drivers/charles-leclerc.md) | Ferrari | 1731 | 1773 | 1760 |
| 5 | 1764 | [<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso](docs/drivers/fernando-alonso.md) | Aston Martin | 1749 | 1711 | 1722 |
| 6 | 1613 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Pierre Gasly](docs/drivers/pierre-gasly.md) | Alpine F1 Team | 1687 | 1677 | 1680 |
| 7 | 1741 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lando Norris](docs/drivers/lando-norris.md) | McLaren | 1702 | 1620 | 1645 |
| 8 | 1524 | [<img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Oscar Piastri](docs/drivers/oscar-piastri.md) | McLaren | 1674 | 1597 | 1621 |
| 9 | 1728 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lewis Hamilton](docs/drivers/lewis-hamilton.md) | Ferrari | 1648 | 1593 | 1614 |
| 10 | 1613 | [<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Carlos Sainz](docs/drivers/carlos-sainz.md) | Williams | 1665 | 1543 | 1579 |
| 11 | 1560 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Esteban Ocon](docs/drivers/esteban-ocon.md) | Haas F1 Team | 1603 | 1555 | 1567 |
| 12 | 1500 | [<img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Gabriel Bortoleto](docs/drivers/gabriel-bortoleto.md) | Sauber | 1599 | 1527 | 1550 |
| 13 | 1500 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Isack Hadjar](docs/drivers/isack-hadjar.md) | RB F1 Team | 1574 | 1536 | 1546 |
| 14 | 1637 | [<img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg" alt="Japan" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇯🇵'; this.style.marginRight='5px';"/> Yuki Tsunoda](docs/drivers/yuki-tsunoda.md) | RB F1 Team | 1557 | 1530 | 1540 |
| 15 | 1537 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Oliver Bearman](docs/drivers/oliver-bearman.md) | Haas F1 Team | 1534 | 1528 | 1530 |
| 16 | 1548 | [<img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Nico Hülkenberg](docs/drivers/nico-hlkenberg.md) | Sauber | 1474 | 1513 | 1498 |
| 17 | 1442 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Lance Stroll](docs/drivers/lance-stroll.md) | Aston Martin | 1381 | 1530 | 1484 |
| 18 | 1512 | [<img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg" alt="Argentina" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇷'; this.style.marginRight='5px';"/> Franco Colapinto](docs/drivers/franco-colapinto.md) | Alpine F1 Team | 1416 | 1502 | 1476 |
| 19 | 1500 | [<img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Andrea Kimi Antonelli](docs/drivers/andrea-kimi-antonelli.md) | Mercedes | 1497 | 1438 | 1456 |
| 20 | 1476 | [<img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Jack Doohan](docs/drivers/jack-doohan.md) | Alpine F1 Team | 1465 | 1436 | 1445 |
| 21 | 1424 | [<img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg" alt="New Zealand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇿'; this.style.marginRight='5px';"/> Liam Lawson](docs/drivers/liam-lawson.md) | Red Bull | 1333 | 1446 | 1414 |



<!-- ELO_RESULTS_END -->

## Usage

### Install Dependencies

```bash
npm install
```

### Calculate ELO Ratings

Run the main script to fetch F1 data and calculate ELO ratings:

```bash
# Calculate ELO for 2025 season (default) - fetch data + calculate
npm start
# or
npm run calculate

# Bulk calculate all seasons (generates all season reports)
npm run rebuild-all                  # 1950 to current year

# IMPORTANT: `rebuild-all` is the main script used when changing logic
#            and regenerating all the markdown files from 1950 to today.
#            This runs super quickly if all the data has already been 
#            fetched (in the /data folder)

npm run bulk-calculate -- 1980 2000  # specific year range

# Note: If you get rate-limited during bulk processing, the script will:
# - Stop processing and show exactly which year failed
# - Provide the exact command to resume from that year
# - Wait 5-10 minutes before retrying to respect API limits

# Calculate for specific seasons - fetch data + calculate
npm run calculate -- 2024
npm run calculate -- 2023
npm run calculate -- 2022

# Calculate ELO only (from existing data files)
npm run elo-only                     # 2025 (default)
npm run elo-only -- 2024             # any specific year
npm run elo-only -- 2023
npm run elo-only -- 1990

# Just fetch data without calculating (for debugging)
npm run fetch-only                   # 2025 (default)
npm run fetch-only -- 2024
```

This script will:
1. Check for existing race data in `data/` folder or fetch from Ergast API if needed
2. Load starting ELO ratings from previous season (defaults to 1500 for new drivers)
3. Calculate qualifying, race, and global ELO ratings using teammate comparisons
4. Save final ELO ratings for use as starting ratings in next season
5. Generate rankings table and update this README with results

---

## About This Project

This project was created using [AmpCode](https://ampcode.com) with the Claude 4 Sonnet model. AmpCode is an AI-powered coding platform that enables rapid development of complex projects through intelligent code generation and analysis.
