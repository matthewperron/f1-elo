# F1 Elo Ratings

A simplistic driver strength calculation for every F1 driver (current and historical) using the chess ELO algorithm.

## Overview

This project calculates Elo ratings for Formula 1 drivers by comparing their performance against their teammates in both qualifying and race sessions. Each driver receives three separate ELO scores:

- **Qualifying Elo**: Based on qualifying position comparisons with teammates
- **Race Elo**: Based on race finishing position comparisons with teammates  
- **Global Elo**: Combined rating using 30% qualifying performance + 70% race performance

See the [GitHub Pages here](https://matthewperron.github.io/f1-elo) to browse the results.

## Methodology

The Elo calculation follows the classic chess Elo formula, comparing each driver directly with their teammate(s) for each race weekend. Key rules:

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

## Elo Formula

The standard chess Elo rating system is used with the following parameters:
- **Starting Elo**: 1500 points (or carried over from previous season)
- **K-factor**: 64 (determines rating change magnitude)
- **Expected Score**: E = 1 / (1 + 10^((opponent_elo - player_elo) / 400))
- **New Rating**: new_elo = old_elo + K × (Actual_Score - Expected_Score)

### How It Works

Each race weekend, teammates are compared head-to-head in three categories:

#### 1. Qualifying Elo
Compares grid positions between teammates.

**Example**: Charles Leclerc (1600 Elo) vs Lewis Hamilton (1500 Elo) - Ferrari teammates
- Leclerc qualifies P3, Hamilton qualifies P5
- Expected score for Leclerc: 1/(1+10^((1500-1600)/400)) = 0.64
- Leclerc wins (better grid position): Actual score = 1
- Leclerc's new Elo: 1600 + 64 × (1 - 0.64) = **1623**
- Hamilton's new Elo: 1500 + 64 × (0 - 0.36) = **1477**

#### 2. Race Elo  
Compares finishing positions between teammates.

**Example**: George Russell (1550 Elo) vs Andrea Kimi Antonelli (1450 Elo) - Mercedes teammates
- Russell finishes P2, Antonelli finishes P4
- Expected score for Russell: 1/(1+10^((1450-1550)/400)) = 0.64
- Russell wins (better finish): Actual score = 1
- Russell's new Elo: 1550 + 64 × (1 - 0.64) = **1573**
- Antonelli's new Elo: 1450 + 64 × (0 - 0.36) = **1427**

#### 3. Global Elo
Combines qualifying (30%) and race (70%) Elo changes with weighted calculation.

**Example**: Max Verstappen (1700 Elo) vs Yuki Tsunoda (1600 Elo) - Red Bull teammates
- **Qualifying**: Verstappen P1, Tsunoda P3 (Verstappen wins)
  - Expected score for Verstappen: 1/(1+10^((1600-1700)/400)) = 0.64
  - Qualifying Elo change for Verstappen: 64 × (1 - 0.64) = **+23**
  - Qualifying Elo change for Tsunoda: 64 × (0 - 0.36) = **-23**

- **Race**: Verstappen P2, Tsunoda P1 (Tsunoda wins)  
  - Expected score for Verstappen: 1/(1+10^((1600-1700)/400)) = 0.64
  - Race Elo change for Verstappen: 64 × (0 - 0.64) = **-41**
  - Race Elo change for Tsunoda: 64 × (1 - 0.36) = **+41**

- **Global Elo Change** (30% qualifying + 70% race):
  - Verstappen: (23 × 0.3) + (-41 × 0.7) = 6.9 - 28.7 = **-22**
  - Tsunoda: (-23 × 0.3) + (41 × 0.7) = -6.9 + 28.7 = **+22**

- **Final Global Elo**:
  - Verstappen: 1700 + (-22) = **1678**
  - Tsunoda: 1600 + 22 = **1622**

## Results

The following table shows current Elo ratings for all F1 drivers (updated automatically):

<!-- ELO_RESULTS_START -->
### Current Elo Ratings (during the 2025 season)
*Last updated: 2025-07-31*

- This table shows the current Elo ratings of drivers currently on the grid for the 2025 season. Some drivers may have peaked earlier in their careers, so this is not a comprehensive list of the best drivers of all time.

- For the all-time best drivers, see: [Best Qualifying Elo](docs/peak-elo.md#best-qualifying-elo) | [Best Race Elo](docs/peak-elo.md#best-race-elo) | [Best Global Elo](docs/peak-elo.md#best-global-elo)

- The Global Elo combines qualifying (30%) and race (70%) Elo changes using a weighted calculation to provide a comprehensive driver rating.

| Rank | Driver | Constructor | Qualifying Elo | Race Elo | Global Elo |
|------|--------|-------------|----------------|----------|------------|
| 1 | [<img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg" alt="Netherlands" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇱'; this.style.marginRight='5px';"/> Max Verstappen](docs/drivers/max-verstappen.md) | Red Bull | 1963 **<span style="color: green;">▲ +2</span>** | 2045 **<span style="color: green;">▲ +84</span>** | 2021 **<span style="color: green;">▲ +60</span>** |
| 2 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> George Russell](docs/drivers/george-russell.md) | Mercedes | 1953 **<span style="color: green;">▲ +103</span>** | 1872 **<span style="color: green;">▲ +22</span>** | 1893 **<span style="color: green;">▲ +43</span>** |
| 3 | [<img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" alt="Thailand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇹🇭'; this.style.marginRight='5px';"/> Alexander Albon](docs/drivers/alexander-albon.md) | Williams | 1783 **<span style="color: red;">▼ -11</span>** | 1843 **<span style="color: green;">▲ +49</span>** | 1828 **<span style="color: green;">▲ +34</span>** |
| 4 | [<img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg" alt="Monaco" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇨'; this.style.marginRight='5px';"/> Charles Leclerc](docs/drivers/charles-leclerc.md) | Ferrari | 1738 **<span style="color: green;">▲ +93</span>** | 1773 **<span style="color: green;">▲ +128</span>** | 1761 **<span style="color: green;">▲ +116</span>** |
| 5 | [<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso](docs/drivers/fernando-alonso.md) | Aston Martin | 1767 **<span style="color: red;">▼ -2</span>** | 1711 **<span style="color: red;">▼ -58</span>** | 1726 **<span style="color: red;">▼ -43</span>** |
| 6 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Pierre Gasly](docs/drivers/pierre-gasly.md) | Alpine F1 Team | 1709 **<span style="color: green;">▲ +84</span>** | 1677 **<span style="color: green;">▲ +52</span>** | 1687 **<span style="color: green;">▲ +62</span>** |
| 7 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lando Norris](docs/drivers/lando-norris.md) | McLaren | 1703 **<span style="color: red;">▼ -38</span>** | 1620 **<span style="color: red;">▼ -121</span>** | 1645 **<span style="color: red;">▼ -96</span>** |
| 8 | [<img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Oscar Piastri](docs/drivers/oscar-piastri.md) | McLaren | 1675 **<span style="color: green;">▲ +151</span>** | 1597 **<span style="color: green;">▲ +73</span>** | 1621 **<span style="color: green;">▲ +97</span>** |
| 9 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lewis Hamilton](docs/drivers/lewis-hamilton.md) | Ferrari | 1657 **<span style="color: red;">▼ -77</span>** | 1593 **<span style="color: red;">▼ -141</span>** | 1618 **<span style="color: red;">▼ -116</span>** |
| 10 | [<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Carlos Sainz](docs/drivers/carlos-sainz.md) | Williams | 1667 **<span style="color: green;">▲ +51</span>** | 1543 **<span style="color: red;">▼ -73</span>** | 1582 **<span style="color: red;">▼ -34</span>** |
| 11 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Esteban Ocon](docs/drivers/esteban-ocon.md) | Haas F1 Team | 1588 **<span style="color: green;">▲ +36</span>** | 1555 **<span style="color: green;">▲ +3</span>** | 1563 **<span style="color: green;">▲ +11</span>** |
| 12 | [<img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Gabriel Bortoleto](docs/drivers/gabriel-bortoleto.md) | Sauber | 1599 **<span style="color: green;">▲ +99</span>** | 1527 **<span style="color: green;">▲ +27</span>** | 1550 **<span style="color: green;">▲ +50</span>** |
| 13 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Isack Hadjar](docs/drivers/isack-hadjar.md) | RB F1 Team | 1570 **<span style="color: green;">▲ +70</span>** | 1536 **<span style="color: green;">▲ +36</span>** | 1545 **<span style="color: green;">▲ +45</span>** |
| 14 | [<img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg" alt="Japan" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇯🇵'; this.style.marginRight='5px';"/> Yuki Tsunoda](docs/drivers/yuki-tsunoda.md) | RB F1 Team | 1555 **<span style="color: red;">▼ -79</span>** | 1530 **<span style="color: red;">▼ -104</span>** | 1539 **<span style="color: red;">▼ -95</span>** |
| 15 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Oliver Bearman](docs/drivers/oliver-bearman.md) | Haas F1 Team | 1521 **<span style="color: red;">▼ -16</span>** | 1528 **<span style="color: red;">▼ -9</span>** | 1526 **<span style="color: red;">▼ -11</span>** |
| 16 | [<img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Nico Hülkenberg](docs/drivers/nico-hlkenberg.md) | Sauber | 1475 **<span style="color: red;">▼ -75</span>** | 1513 **<span style="color: red;">▼ -37</span>** | 1500 **<span style="color: red;">▼ -50</span>** |
| 17 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Lance Stroll](docs/drivers/lance-stroll.md) | Aston Martin | 1398 **<span style="color: red;">▼ -49</span>** | 1530 **<span style="color: green;">▲ +83</span>** | 1490 **<span style="color: green;">▲ +43</span>** |
| 18 | [<img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg" alt="Argentina" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇷'; this.style.marginRight='5px';"/> Franco Colapinto](docs/drivers/franco-colapinto.md) | Alpine F1 Team | 1427 **<span style="color: red;">▼ -87</span>** | 1502 **<span style="color: red;">▼ -12</span>** | 1480 **<span style="color: red;">▼ -34</span>** |
| 19 | [<img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Andrea Kimi Antonelli](docs/drivers/andrea-kimi-antonelli.md) | Mercedes | 1501 **<span style="color: green;">▲ +1</span>** | 1438 **<span style="color: red;">▼ -62</span>** | 1457 **<span style="color: red;">▼ -43</span>** |
| 20 | [<img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Jack Doohan](docs/drivers/jack-doohan.md) | Alpine F1 Team | 1477 ↔ 0 | 1436 **<span style="color: red;">▼ -41</span>** | 1449 **<span style="color: red;">▼ -28</span>** |
| 21 | [<img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg" alt="New Zealand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇿'; this.style.marginRight='5px';"/> Liam Lawson](docs/drivers/liam-lawson.md) | Red Bull | 1328 **<span style="color: red;">▼ -93</span>** | 1446 **<span style="color: green;">▲ +25</span>** | 1412 **<span style="color: red;">▼ -9</span>** |




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
2. Load starting Elo ratings from previous season (defaults to 1500 for new drivers)
3. Calculate qualifying, race, and global Elo ratings using teammate comparisons
4. Save final Elo ratings for use as starting ratings in next season
5. Generate rankings table and update this README with results

---

## About This Project

This project was created using [AmpCode](https://ampcode.com) with the Claude 4 Sonnet model. AmpCode is an AI-powered coding platform that enables rapid development of complex projects through intelligent code generation and analysis.
