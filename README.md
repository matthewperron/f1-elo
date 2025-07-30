# F1 ELO Rating System

A simplistic driver strength calculation for every F1 driver (current and historical) using the chess ELO algorithm.

## Overview

This project calculates ELO ratings for Formula 1 drivers by comparing their performance against their teammates in both qualifying and race sessions. Each driver receives two separate ELO scores:

- **Qualifying ELO**: Based on qualifying position comparisons with teammates
- **Race ELO**: Based on race finishing position comparisons with teammates

## Methodology

The ELO calculation follows the classic chess ELO formula, comparing each driver directly with their teammate(s) for each race weekend. Key rules:

1. **Data Source**: Historical race results from `data/YYYY-race-results.json` files (fetched from [Ergast API](https://api.jolpi.ca/ergast/f1/))
2. **Teammate Comparison**: Only head-to-head comparisons between teammates are considered
3. **Exclusions**: Races where no teammate participated or either driver had a DNF are excluded from calculations
4. **Chronological Processing**: Race history is processed in chronological order to maintain accurate ELO progression

## ELO Formula

The standard chess ELO rating system is used:
- **Starting ELO**: 1000 points (or carried over from previous season)
- **K-factor**: 32 (determines rating change magnitude)
- Expected score calculation based on rating difference
- Separate calculations for qualifying, race, and global performance
- Global ELO combines qualifying (30%) and race (70%) results

## Results

The following table shows current ELO ratings for all F1 drivers (updated automatically):

<!-- ELO_RESULTS_START -->
### ELO Ratings (2025 Season)
*Last updated: 2025-07-30*

| Rank | Starting ELO | Driver | Constructor | Qualifying ELO | Race ELO | ELO |
|------|--------------|--------|-------------|----------------|----------|-----|
| 1 | 1228 | Max Verstappen | Red Bull | 1291 | 1271 | 1271 |
| 2 | 1130 | George Russell | Mercedes | 1188 | 1188 | 1188 |
| 3 | 1157 | Alexander Albon | Williams | 1137 | 1186 | 1186 |
| 4 | 1077 | Charles Leclerc | Ferrari | 1106 | 1141 | 1117 |
| 5 | 1129 | Lando Norris | McLaren | 1050 | 1099 | 1077 |
| 6 | 1000 | Isack Hadjar | RB F1 Team | 1103 | 1054 | 1054 |
| 7 | 1051 | Fernando Alonso | Aston Martin | 1086 | 1021 | 1051 |
| 8 | 973 | Pierre Gasly | Alpine F1 Team | 1075 | 1047 | 1047 |
| 9 | 973 | Oscar Piastri | McLaren | 1052 | 1003 | 1025 |
| 10 | 996 | Nico Hülkenberg | Sauber | 968 | 1020 | 1020 |
| 11 | 1003 | Oliver Bearman | Haas F1 Team | 985 | 1014 | 1014 |
| 12 | 1047 | Lewis Hamilton | Ferrari | 1018 | 983 | 1007 |
| 13 | 1050 | Yuki Tsunoda | RB F1 Team | 987 | 1007 | 1007 |
| 14 | 1002 | Esteban Ocon | Haas F1 Team | 1020 | 991 | 991 |
| 15 | 1005 | Carlos Sainz | Williams | 1025 | 976 | 976 |
| 16 | 1000 | Gabriel Bortoleto | Sauber | 1028 | 976 | 976 |
| 17 | 1000 | Jack Doohan | Alpine F1 Team | 949 | 967 | 967 |
| 18 | 1000 | Andrea Kimi Antonelli | Mercedes | 942 | 942 | 942 |
| 19 | 981 | Franco Colapinto | Alpine F1 Team | 929 | 940 | 940 |
| 20 | 989 | Liam Lawson | Red Bull | 886 | 935 | 935 |
| 21 | 886 | Lance Stroll | Aston Martin | 851 | 916 | 886 |


*Showing top 50 drivers by global ELO rating*
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
```

This script will:
1. Check for existing race data in `data/` folder or fetch from Ergast API if needed
2. Load starting ELO ratings from previous season (defaults to 1000 for new drivers)
3. Calculate qualifying, race, and global ELO ratings using teammate comparisons
4. Save final ELO ratings for use as starting ratings in next season
5. Generate rankings table and update this README with results
