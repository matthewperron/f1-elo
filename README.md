# F1 ELO Rating System

A simplistic driver strength calculation for every F1 driver (current and historical) using the chess ELO algorithm.

## Overview

This project calculates ELO ratings for Formula 1 drivers by comparing their performance against their teammates in both qualifying and race sessions. Each driver receives two separate ELO scores:

- **Qualifying ELO**: Based on qualifying position comparisons with teammates
- **Race ELO**: Based on race finishing position comparisons with teammates

## Methodology

The ELO calculation follows the classic chess ELO formula, comparing each driver directly with their teammate(s) for each race weekend. Key rules:

1. **Data Source**: Historical race results from `f1-historical-race-results.json` (fetched from Ergast API)
2. **Teammate Comparison**: Only head-to-head comparisons between teammates are considered
3. **Exclusions**: Races where no teammate participated or either driver had a DNF are excluded from calculations
4. **Chronological Processing**: Race history is processed in chronological order to maintain accurate ELO progression

## ELO Formula

The standard chess ELO rating system is used:
- Expected score calculation based on rating difference
- K-factor determines rating change magnitude
- Separate calculations for qualifying and race performance

## Results

The following table shows current ELO ratings for all F1 drivers (updated automatically):

<!-- ELO_RESULTS_START -->
### ELO Ratings (2024 Season)
*Last updated: 2025-07-30*

| Rank | Driver | Qualifying ELO | Race ELO | Average ELO |
|------|--------|----------------|----------|-------------|
| 1 | Max Verstappen | 1603 | 1624 | 1614 |
| 2 | Alexander Albon | 1641 | 1570 | 1606 |
| 3 | Lando Norris | 1631 | 1570 | 1601 |
| 4 | Yuki Tsunoda | 1622 | 1542 | 1582 |
| 5 | Fernando Alonso | 1608 | 1525 | 1567 |
| 6 | George Russell | 1576 | 1517 | 1546 |
| 7 | Nico Hülkenberg | 1549 | 1543 | 1546 |
| 8 | Valtteri Bottas | 1605 | 1485 | 1545 |
| 9 | Charles Leclerc | 1526 | 1531 | 1529 |
| 10 | Pierre Gasly | 1529 | 1500 | 1514 |
| 11 | Oliver Bearman | 1524 | 1502 | 1513 |
| 12 | Esteban Ocon | 1487 | 1500 | 1494 |
| 13 | Jack Doohan | 1485 | 1500 | 1492 |
| 14 | Carlos Sainz | 1490 | 1485 | 1487 |
| 15 | Daniel Ricciardo | 1443 | 1501 | 1472 |
| 16 | Guanyu Zhou | 1395 | 1515 | 1455 |
| 17 | Lewis Hamilton | 1424 | 1483 | 1454 |
| 18 | Franco Colapinto | 1435 | 1473 | 1454 |
| 19 | Liam Lawson | 1435 | 1456 | 1445 |
| 20 | Logan Sargeant | 1424 | 1456 | 1440 |
| 21 | Lance Stroll | 1392 | 1475 | 1433 |
| 22 | Kevin Magnussen | 1412 | 1439 | 1425 |
| 23 | Oscar Piastri | 1369 | 1430 | 1399 |
| 24 | Sergio Pérez | 1397 | 1376 | 1386 |


*Showing top 50 drivers by average ELO rating*
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
1. Check for existing race data or fetch from Ergast API if needed
2. Calculate qualifying and race ELO ratings using teammate comparisons
3. Generate rankings and update this README with results
4. Handle all data processing automatically with proper error handling
