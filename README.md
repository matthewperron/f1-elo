# F1 ELO Rating System

A simplistic driver strength calculation for every F1 driver (current and historical) using the chess ELO algorithm.

## Overview

This project calculates ELO ratings for Formula 1 drivers by comparing their performance against their teammates in both qualifying and race sessions. Each driver receives two separate ELO scores:

- **Qualifying ELO**: Based on qualifying position comparisons with teammates
- **Race ELO**: Based on race finishing position comparisons with teammates

## Methodology

The ELO calculation follows the classic chess ELO formula, comparing each driver directly with their teammate(s) for each race weekend. Key rules:

1. **Data Source**: Historical race results from `f1-historical-race-results.json`
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
*Results will be populated by the update script*
<!-- ELO_RESULTS_END -->

## Usage

Run the update script to recalculate ratings and update this README:

```bash
npm run update-elo
```
