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
### ELO Ratings (2024 Season)
*Last updated: 2025-07-30*

| Rank | Starting ELO | Driver | Constructor | Qualifying ELO | Race ELO | ELO |
|------|--------------|--------|-------------|----------------|----------|-----|
| 1 | 1000 | Max Verstappen | Red Bull | 1103 | 1124 | 1102 |
| 2 | 1000 | Lando Norris | McLaren | 1131 | 1070 | 1070 |
| 3 | 1000 | Alexander Albon | Williams | 1141 | 1070 | 1070 |
| 4 | 1000 | George Russell | Mercedes | 1076 | 1017 | 1049 |
| 5 | 1000 | Yuki Tsunoda | RB F1 Team | 1122 | 1042 | 1042 |
| 6 | 1000 | Charles Leclerc | Ferrari | 1026 | 1031 | 1031 |
| 7 | 1000 | Fernando Alonso | Aston Martin | 1108 | 1025 | 1025 |
| 8 | 1000 | Nico Hülkenberg | Haas F1 Team | 1049 | 1043 | 1024 |
| 9 | 1000 | Guanyu Zhou | Sauber | 895 | 1015 | 1015 |
| 10 | 1000 | Daniel Ricciardo | RB F1 Team | 943 | 1001 | 1001 |
| 11 | 1000 | Oliver Bearman | Ferrari | 1024 | 1002 | 1001 |
| 12 | 1000 | Esteban Ocon | Alpine F1 Team | 987 | 1000 | 1000 |
| 13 | 1000 | Pierre Gasly | Alpine F1 Team | 1029 | 1000 | 1000 |
| 14 | 1000 | Jack Doohan | Alpine F1 Team | 985 | 1000 | 1000 |
| 15 | 1000 | Carlos Sainz | Ferrari | 990 | 985 | 985 |
| 16 | 1000 | Valtteri Bottas | Sauber | 1105 | 985 | 985 |
| 17 | 1000 | Lance Stroll | Aston Martin | 892 | 975 | 975 |
| 18 | 1000 | Franco Colapinto | Williams | 935 | 973 | 973 |
| 19 | 1000 | Kevin Magnussen | Haas F1 Team | 912 | 939 | 959 |
| 20 | 1000 | Logan Sargeant | Williams | 924 | 956 | 956 |
| 21 | 1000 | Liam Lawson | RB F1 Team | 935 | 956 | 956 |
| 22 | 1000 | Lewis Hamilton | Mercedes | 924 | 983 | 951 |
| 23 | 1000 | Oscar Piastri | McLaren | 869 | 930 | 930 |
| 24 | 1000 | Sergio Pérez | Red Bull | 897 | 876 | 898 |


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
# Calculate ELO for 2025 season (default)
npm start
# or
npm run calculate

# Calculate for specific seasons
npm run calculate:2024
npm run calculate:2023

# Or specify season directly
node main.js 2022

# Just fetch data without calculating (for debugging)
npm run fetch-only
```

This script will:
1. Check for existing race data in `data/` folder or fetch from Ergast API if needed
2. Load starting ELO ratings from previous season (defaults to 1000 for new drivers)
3. Calculate qualifying, race, and global ELO ratings using teammate comparisons
4. Save final ELO ratings for use as starting ratings in next season
5. Generate rankings table and update this README with results
