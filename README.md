# F1 ELO Rating System

A simplistic driver strength calculation for every F1 driver (current and historical) using the chess ELO algorithm.

## Overview

This project calculates ELO ratings for Formula 1 drivers by comparing their performance against their teammates in both qualifying and race sessions. Each driver receives three separate ELO scores:

- **Qualifying ELO**: Based on qualifying position comparisons with teammates
- **Race ELO**: Based on race finishing position comparisons with teammates  
- **Global ELO**: Combined rating using 30% qualifying performance + 70% race performance

## Methodology

The ELO calculation follows the classic chess ELO formula, comparing each driver directly with their teammate(s) for each race weekend. Key rules:

1. **Data Source**: Historical race results from `data/YYYY-race-results.json` files (fetched from [Ergast API](https://api.jolpi.ca/ergast/f1/))
2. **Teammate Comparison**: Only head-to-head comparisons between teammates are considered
3. **Exclusions**: Races where no teammate participated or either driver had a DNF are excluded from calculations
4. **Chronological Processing**: Race history is processed in chronological order to maintain accurate ELO progression

## ELO Formula

The standard chess ELO rating system is used with the following parameters:
- **Starting ELO**: 1000 points (or carried over from previous season)
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
*Last updated: 2025-07-30 18:17*

| Rank | Starting ELO | Driver | Constructor | Qualifying ELO | Race ELO | ELO |
|------|--------------|--------|-------------|----------------|----------|-----|
| 1 | 1959 | [<img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg" alt="Netherlands" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇱'; this.style.marginRight='5px';"/> Max Verstappen](docs/drivers/max-verstappen) | Red Bull | 1957 | 2037 | 2013 |
| 2 | 1818 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> George Russell](docs/drivers/george-russell.md) | Mercedes | 1897 | 1856 | 1866 |
| 3 | 1780 | [<img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" alt="Thailand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇹🇭'; this.style.marginRight='5px';"/> Alexander Albon](docs/drivers/alexander-albon.md) | Williams | 1786 | 1823 | 1812 |
| 4 | 1667 | [<img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg" alt="Monaco" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇨'; this.style.marginRight='5px';"/> Charles Leclerc](docs/drivers/charles-leclerc.md) | Ferrari | 1696 | 1790 | 1759 |
| 5 | 1736 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lando Norris](docs/drivers/lando-norris.md) | McLaren | 1691 | 1617 | 1637 |
| 6 | 1515 | [<img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Oscar Piastri](docs/drivers/oscar-piastri.md) | McLaren | 1662 | 1591 | 1614 |
| 7 | 1702 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lewis Hamilton](docs/drivers/lewis-hamilton.md) | Ferrari | 1609 | 1604 | 1610 |
| 8 | 1627 | [<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Carlos Sainz](docs/drivers/carlos-sainz.md) | Williams | 1667 | 1563 | 1595 |
| 9 | 1641 | [<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso](docs/drivers/fernando-alonso.md) | Aston Martin | 1616 | 1581 | 1593 |
| 10 | 1500 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Isack Hadjar](docs/drivers/isack-hadjar.md) | RB F1 Team | 1571 | 1599 | 1591 |
| 11 | 1456 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Pierre Gasly](docs/drivers/pierre-gasly.md) | Alpine F1 Team | 1639 | 1567 | 1588 |
| 12 | 1613 | [<img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg" alt="Japan" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇯🇵'; this.style.marginRight='5px';"/> Yuki Tsunoda](docs/drivers/yuki-tsunoda.md) | RB F1 Team | 1552 | 1553 | 1553 |
| 13 | 1560 | [<img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Nico Hülkenberg](docs/drivers/nico-hlkenberg.md) | Sauber | 1459 | 1585 | 1546 |
| 14 | 1538 | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Oliver Bearman](docs/drivers/oliver-bearman.md) | Haas F1 Team | 1480 | 1564 | 1539 |
| 15 | 1500 | [<img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Gabriel Bortoleto](docs/drivers/gabriel-bortoleto.md) | Sauber | 1585 | 1483 | 1514 |
| 16 | 1513 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Esteban Ocon](docs/drivers/esteban-ocon.md) | Haas F1 Team | 1540 | 1499 | 1512 |
| 17 | 1500 | [<img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Andrea Kimi Antonelli](docs/drivers/andrea-kimi-antonelli.md) | Mercedes | 1481 | 1440 | 1452 |
| 18 | 1387 | [<img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Lance Stroll](docs/drivers/lance-stroll.md) | Aston Martin | 1251 | 1519 | 1435 |
| 19 | 1491 | [<img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Jack Doohan](docs/drivers/jack-doohan.md) | Alpine F1 Team | 1429 | 1428 | 1429 |
| 20 | 1470 | [<img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg" alt="Argentina" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇷'; this.style.marginRight='5px';"/> Franco Colapinto](docs/drivers/franco-colapinto.md) | Alpine F1 Team | 1400 | 1400 | 1400 |
| 21 | 1427 | [<img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg" alt="New Zealand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇿'; this.style.marginRight='5px';"/> Liam Lawson](docs/drivers/liam-lawson.md) | Red Bull | 1330 | 1350 | 1343 |



<!-- ELO_RESULTS_END -->


## Detailed Season Reports

Race-by-race ELO changes and detailed analysis for each season:

| Decades | Season Reports |
|---------|----------------|
| **2020s** | [2025](results/2025-season-report.md) \| [2024](results/2024-season-report.md) \| [2023](results/2023-season-report.md) \| [2022](results/2022-season-report.md) \| [2021](results/2021-season-report.md) \| [2020](results/2020-season-report.md) |
| **2010s** | [2019](results/2019-season-report.md) \| [2018](results/2018-season-report.md) \| [2017](results/2017-season-report.md) \| [2016](results/2016-season-report.md) \| [2015](results/2015-season-report.md) \| [2014](results/2014-season-report.md) \| [2013](results/2013-season-report.md) \| [2012](results/2012-season-report.md) \| [2011](results/2011-season-report.md) \| [2010](results/2010-season-report.md) |
| **2000s** | [2009](results/2009-season-report.md) \| [2008](results/2008-season-report.md) \| [2007](results/2007-season-report.md) \| [2006](results/2006-season-report.md) \| [2005](results/2005-season-report.md) \| [2004](results/2004-season-report.md) \| [2003](results/2003-season-report.md) \| [2002](results/2002-season-report.md) \| [2001](results/2001-season-report.md) \| [2000](results/2000-season-report.md) |
| **1990s** | [1999](results/1999-season-report.md) \| [1998](results/1998-season-report.md) \| [1997](results/1997-season-report.md) \| [1996](results/1996-season-report.md) \| [1995](results/1995-season-report.md) \| [1994](results/1994-season-report.md) \| [1993](results/1993-season-report.md) \| [1992](results/1992-season-report.md) \| [1991](results/1991-season-report.md) \| [1990](results/1990-season-report.md) |
| **1980s** | [1989](results/1989-season-report.md) \| [1988](results/1988-season-report.md) \| [1987](results/1987-season-report.md) \| [1986](results/1986-season-report.md) \| [1985](results/1985-season-report.md) \| [1984](results/1984-season-report.md) \| [1983](results/1983-season-report.md) \| [1982](results/1982-season-report.md) \| [1981](results/1981-season-report.md) \| [1980](results/1980-season-report.md) |
| **1970s** | [1979](results/1979-season-report.md) \| [1978](results/1978-season-report.md) \| [1977](results/1977-season-report.md) \| [1976](results/1976-season-report.md) \| [1975](results/1975-season-report.md) \| [1974](results/1974-season-report.md) \| [1973](results/1973-season-report.md) \| [1972](results/1972-season-report.md) \| [1971](results/1971-season-report.md) \| [1970](results/1970-season-report.md) |
| **1960s** | [1969](results/1969-season-report.md) \| [1968](results/1968-season-report.md) \| [1967](results/1967-season-report.md) \| [1966](results/1966-season-report.md) \| [1965](results/1965-season-report.md) \| [1964](results/1964-season-report.md) \| [1963](results/1963-season-report.md) \| [1962](results/1962-season-report.md) \| [1961](results/1961-season-report.md) \| [1960](results/1960-season-report.md) |
| **1950s** | [1959](results/1959-season-report.md) \| [1958](results/1958-season-report.md) \| [1957](results/1957-season-report.md) \| [1956](results/1956-season-report.md) \| [1955](results/1955-season-report.md) \| [1954](results/1954-season-report.md) \| [1953](results/1953-season-report.md) \| [1952](results/1952-season-report.md) \| [1951](results/1951-season-report.md) \| [1950](results/1950-season-report.md) |

*Each season report contains the final ELO table plus detailed race-by-race analysis showing how each driver's ELO changed after every qualifying session and race.*

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

# Calculate for specific seasons - fetch data + calculate
npm run calculate -- 2024
npm run calculate -- 2023
npm run calculate -- 2022

# Calculate ELO only (from existing data files)
npm run elo-only          # 2025 (default)
npm run elo-only -- 2024  # any specific year
npm run elo-only -- 2023
npm run elo-only -- 1990

# Just fetch data without calculating (for debugging)
npm run fetch-only        # 2025 (default)
npm run fetch-only -- 2024

# Bulk calculate all seasons (generates all season reports)
npm run rebuild-all        # 1950 to current year
npm run bulk-calculate -- 1980 2000  # specific year range

# Note: If you get rate-limited during bulk processing, the script will:
# - Stop processing and show exactly which year failed
# - Provide the exact command to resume from that year
# - Wait 5-10 minutes before retrying to respect API limits
```

This script will:
1. Check for existing race data in `data/` folder or fetch from Ergast API if needed
2. Load starting ELO ratings from previous season (defaults to 1000 for new drivers)
3. Calculate qualifying, race, and global ELO ratings using teammate comparisons
4. Save final ELO ratings for use as starting ratings in next season
5. Generate rankings table and update this README with results

---

## About This Project

This project was created using [AmpCode](https://ampcode.com) with the Claude 4 Sonnet model. AmpCode is an AI-powered coding platform that enables rapid development of complex projects through intelligent code generation and analysis.
