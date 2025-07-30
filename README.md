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
### ELO Ratings (1983 Season)
*Last updated: 2025-07-30*

| Rank | Starting ELO | Driver | Constructor | Qualifying ELO | Race ELO | ELO |
|------|--------------|--------|-------------|----------------|----------|-----|
| 1 | 1100 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="30"/> Nelson Piquet | Brabham | 1123 | 1111 | 1111 |
| 2 | 1067 | Keke Rosberg | Williams | 1148 | 1102 | 1102 |
| 3 | 1021 | 🇫🇷 Alain Prost | Renault | 1079 | 1064 | 1064 |
| 4 | 1033 | Niki Lauda | McLaren | 1095 | 1047 | 1047 |
| 5 | 1030 | 🇮🇹 Michele Alboreto | Tyrrell | 1081 | 1015 | 1044 |
| 6 | 1013 | 🇮🇹 Elio de Angelis | Team Lotus | 1093 | 1029 | 1029 |
| 7 | 1017 | 🇮🇹 Andrea de Cesaris | Alfa Romeo | 1104 | 1017 | 1017 |
| 8 | 1000 | Roberto Guerrero | Theodore | 1056 | 984 | 1016 |
| 9 | 1000 | Thierry Boutsen | Arrows | 997 | 1016 | 1016 |
| 10 | 1015 | Marc Surer | Arrows | 1044 | 1015 | 1015 |
| 11 | 1000 | 🇬🇧 Derek Warwick | Toleman | 1085 | 1041 | 1014 |
| 12 | 1018 | 🇬🇧 Nigel Mansell | Team Lotus | 938 | 1002 | 1002 |
| 13 | 1000 | Raul Boesel | Ligier | 909 | 1000 | 1000 |
| 14 | 1000 | Alan Jones | Arrows | 1017 | 1000 | 1000 |
| 15 | 1000 | 🇮🇹 Piercarlo Ghinzani | Osella | 1000 | 1000 | 1000 |
| 16 | 1000 | 🇮🇹 Corrado Fabi | Osella | 1000 | 1000 | 1000 |
| 17 | 1000 | 🇬🇧 Jonathan Palmer | Williams | 990 | 1000 | 1000 |
| 18 | 1000 | 🇺🇸 Danny Sullivan | Tyrrell | 949 | 1015 | 986 |
| 19 | 1000 | Chico Serra | Arrows | 957 | 985 | 985 |
| 20 | 985 | 🇮🇹 Mauro Baldi | Alfa Romeo | 898 | 985 | 985 |
| 21 | 1000 | Johnny Cecotto | Theodore | 944 | 1016 | 984 |
| 22 | 992 | 🇬🇧 John Watson | McLaren | 930 | 978 | 978 |
| 23 | 987 | 🇮🇹 Riccardo Patrese | Brabham | 964 | 976 | 976 |
| 24 | 1016 | 🇺🇸 Eddie Cheever | Renault | 958 | 973 | 973 |
| 25 | 953 | 🇫🇷 Patrick Tambay | Ferrari | 981 | 937 | 966 |
| 26 | 998 | 🇫🇷 Jacques Laffite | Williams | 928 | 963 | 963 |
| 27 | 976 | 🇮🇹 Bruno Giacomelli | Toleman | 891 | 935 | 962 |
| 28 | 963 | 🇫🇷 René Arnoux | Ferrari | 935 | 979 | 950 |
| 29 | 944 | 🇫🇷 Jean-Pierre Jarier | Ligier | 1035 | 944 | 944 |


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
