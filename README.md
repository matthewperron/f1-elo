# F1 ELO Rating System

A simplistic driver strength calculation for every F1 driver (current and historical) using the chess ELO algorithm.

## Overview

This project calculates ELO ratings for Formula 1 drivers by comparing their performance against their teammates in both qualifying and race sessions. Each driver receives two separate ELO scores:

- **Qualifying ELO**: Based on qualifying position comparisons with teammates
- **Race ELO**: Based on race finishing position comparisons with teammates

## Methodology

The ELO calculation follows the classic chess ELO formula, comparing each driver directly with their teammate(s) for each race weekend. Key rules:

1. **Data Source**: Historical race results from `data/YYYY-race-results.json` files (fetched from Ergast API)
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
