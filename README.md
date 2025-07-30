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
- **K-factor**: 64 (determines rating change magnitude)
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
| 1 | 1930 | <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg" alt="Netherlands" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇱'; this.style.marginRight='5px';"/> Max Verstappen | Red Bull | 1989 | 1975 | 1975 |
| 2 | 1741 | <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" alt="Thailand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇹🇭'; this.style.marginRight='5px';"/> Alexander Albon | Williams | 1743 | 1807 | 1807 |
| 3 | 1735 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> George Russell | Mercedes | 1786 | 1803 | 1803 |
| 4 | 1658 | <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg" alt="Monaco" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇨'; this.style.marginRight='5px';"/> Charles Leclerc | Ferrari | 1675 | 1730 | 1690 |
| 5 | 1696 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lando Norris | McLaren | 1576 | 1665 | 1636 |
| 6 | 1500 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Isack Hadjar | RB F1 Team | 1671 | 1596 | 1596 |
| 7 | 1594 | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso | Aston Martin | 1637 | 1532 | 1587 |
| 8 | 1524 | <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Oscar Piastri | McLaren | 1644 | 1555 | 1584 |
| 9 | 1444 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Pierre Gasly | Alpine F1 Team | 1606 | 1583 | 1583 |
| 10 | 1619 | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg" alt="Japan" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇯🇵'; this.style.marginRight='5px';"/> Yuki Tsunoda | RB F1 Team | 1540 | 1574 | 1574 |
| 11 | 1600 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lewis Hamilton | Ferrari | 1583 | 1528 | 1568 |
| 12 | 1630 | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Carlos Sainz | Williams | 1628 | 1564 | 1564 |
| 13 | 1514 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Nico Hülkenberg | Sauber | 1442 | 1544 | 1544 |
| 14 | 1516 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Oliver Bearman | Haas F1 Team | 1481 | 1543 | 1543 |
| 15 | 1499 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Esteban Ocon | Haas F1 Team | 1534 | 1472 | 1472 |
| 16 | 1500 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Gabriel Bortoleto | Sauber | 1572 | 1470 | 1470 |
| 17 | 1500 | <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Jack Doohan | Alpine F1 Team | 1418 | 1433 | 1433 |
| 18 | 1500 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Andrea Kimi Antonelli | Mercedes | 1449 | 1432 | 1432 |
| 19 | 1423 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Lance Stroll | Aston Martin | 1380 | 1485 | 1430 |
| 20 | 1473 | <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg" alt="Argentina" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇷'; this.style.marginRight='5px';"/> Franco Colapinto | Alpine F1 Team | 1392 | 1402 | 1402 |
| 21 | 1492 | <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg" alt="New Zealand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇿'; this.style.marginRight='5px';"/> Liam Lawson | Red Bull | 1341 | 1396 | 1396 |



<!-- ELO_RESULTS_END -->
## Top 30 F1 Drivers of All Time (by Peak ELO)

| Rank | Driver | Peak ELO | Constructor | Teammate | Teammate ELO | Season | Race |
|------|--------|----------|-------------|----------|--------------|--------|------|
| 1 | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso | **2011** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Felipe Massa | 1497 | 2012 | [Round 20: Brazilian Grand Prix](./results/2012-season-report.md#round-20-brazilian-grand-prix) |
| 2 | <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg" alt="Netherlands" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇱'; this.style.marginRight='5px';"/> Max Verstappen | **1989** | Red Bull | <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg" alt="New Zealand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇿'; this.style.marginRight='5px';"/> Liam Lawson | 1341 | 2025 | [Round 13: Belgian Grand Prix](./results/2025-season-report.md#round-13-belgian-grand-prix) |
| 3 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Jenson Button | **1891** | McLaren | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso | 1768 | 2016 | [Round 16: Malaysian Grand Prix](./results/2016-season-report.md#round-16-malaysian-grand-prix) |
| 4 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Michael Schumacher | **1885** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Felipe Massa | 1577 | 2006 | [Round 12: German Grand Prix](./results/2006-season-report.md#round-12-german-grand-prix) |
| 5 | <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Daniel Ricciardo | **1855** | Red Bull | Daniil Kvyat | 1481 | 2015 | [Round 4: Bahrain Grand Prix](./results/2015-season-report.md#round-4-bahrain-grand-prix) |
| 6 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Jarno Trulli | **1853** | Jordan | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Heinz-Harald Frentzen | 1579 | 2001 | [Round 13: Hungarian Grand Prix](./results/2001-season-report.md#round-13-hungarian-grand-prix) |
| 7 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Nigel Mansell | **1852** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Riccardo Patrese | 1528 | 1992 | [Round 8: French Grand Prix](./results/1992-season-report.md#round-8-french-grand-prix) |
| 8 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lewis Hamilton | **1849** | McLaren | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Jenson Button | 1528 | 2011 | [Round 5: Spanish Grand Prix](./results/2011-season-report.md#round-5-spanish-grand-prix) |
| 9 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Alain Prost | **1847** | McLaren | Stefan Johansson | 1456 | 1987 | [Round 16: Australian Grand Prix](./results/1987-season-report.md#round-16-australian-grand-prix) |
| 10 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Ayrton Senna | **1845** | McLaren | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Alain Prost | 1611 | 1989 | [Round 16: Australian Grand Prix](./results/1989-season-report.md#round-16-australian-grand-prix) |
| 11 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Jacques Villeneuve | **1820** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Heinz-Harald Frentzen | 1488 | 1998 | [Round 14: Italian Grand Prix](./results/1998-season-report.md#round-14-italian-grand-prix) |
| 12 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Sebastian Vettel | **1820** | Red Bull | <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Mark Webber | 1443 | 2013 | [Round 19: Brazilian Grand Prix](./results/2013-season-report.md#round-19-brazilian-grand-prix) |
| 13 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Nico Hülkenberg | **1813** | Force India | <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg" alt="Mexico" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇽'; this.style.marginRight='5px';"/> Sergio Pérez | 1515 | 2014 | [Round 11: Hungarian Grand Prix](./results/2014-season-report.md#round-11-hungarian-grand-prix) |
| 14 | <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" alt="Thailand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇹🇭'; this.style.marginRight='5px';"/> Alexander Albon | **1807** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Carlos Sainz | 1564 | 2025 | [Round 13: Belgian Grand Prix](./results/2025-season-report.md#round-13-belgian-grand-prix) |
| 15 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Eddie Irvine | **1806** | Jaguar | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Pedro de la Rosa | 1514 | 2002 | [Round 7: Monaco Grand Prix](./results/2002-season-report.md#round-7-monaco-grand-prix) |
| 16 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> George Russell | **1803** | Mercedes | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Andrea Kimi Antonelli | 1432 | 2025 | [Round 13: Belgian Grand Prix](./results/2025-season-report.md#round-13-belgian-grand-prix) |
| 17 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Nelson Piquet | **1796** | Brabham | <img src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg" alt="Switzerland" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇭'; this.style.marginRight='5px';"/> Marc Surer | 1409 | 1985 | [Round 15: South African Grand Prix](./results/1985-season-report.md#round-15-south-african-grand-prix) |
| 18 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lando Norris | **1796** | McLaren | <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Daniel Ricciardo | 1417 | 2022 | [Round 22: Abu Dhabi Grand Prix](./results/2022-season-report.md#round-22-abu-dhabi-grand-prix) |
| 19 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Giancarlo Fisichella | **1790** | Jordan | Ralph Firman | 1404 | 2003 | [Round 15: United States Grand Prix](./results/2003-season-report.md#round-15-united-states-grand-prix) |
| 20 | <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg" alt="Mexico" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇽'; this.style.marginRight='5px';"/> Sergio Pérez | **1780** | Force India | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Esteban Ocon | 1421 | 2017 | [Round 9: Austrian Grand Prix](./results/2017-season-report.md#round-9-austrian-grand-prix) |
| 21 | <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg" alt="Monaco" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇨'; this.style.marginRight='5px';"/> Charles Leclerc | **1779** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Carlos Sainz | 1493 | 2022 | [Round 7: Monaco Grand Prix](./results/2022-season-report.md#round-7-monaco-grand-prix) |
| 22 | <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Mark Webber | **1771** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Nick Heidfeld | 1493 | 2005 | [Round 11: British Grand Prix](./results/2005-season-report.md#round-11-british-grand-prix) |
| 23 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Felipe Massa | **1771** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" alt="Finland" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇮'; this.style.marginRight='5px';"/> Kimi Räikkönen | 1572 | 2007 | [Round 8: French Grand Prix](./results/2007-season-report.md#round-8-french-grand-prix) |
| 24 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Heinz-Harald Frentzen | **1770** | Sauber | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Johnny Herbert | 1456 | 1996 | [Round 6: Monaco Grand Prix](./results/1996-season-report.md#round-6-monaco-grand-prix) |
| 25 | Juan Pablo Montoya | **1765** | McLaren | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" alt="Finland" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇮'; this.style.marginRight='5px';"/> Kimi Räikkönen | 1596 | 2006 | [Round 4: San Marino Grand Prix](./results/2006-season-report.md#round-4-san-marino-grand-prix) |
| 26 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" alt="Finland" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇮'; this.style.marginRight='5px';"/> Kimi Räikkönen | **1761** | McLaren | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Pedro de la Rosa | 1424 | 2006 | [Round 18: Brazilian Grand Prix](./results/2006-season-report.md#round-18-brazilian-grand-prix) |
| 27 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Riccardo Patrese | **1759** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Nigel Mansell | 1621 | 1991 | [Round 7: French Grand Prix](./results/1991-season-report.md#round-7-french-grand-prix) |
| 28 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Romain Grosjean | **1754** | Lotus F1 | Pastor Maldonado | 1393 | 2015 | [Round 18: Brazilian Grand Prix](./results/2015-season-report.md#round-18-brazilian-grand-prix) |
| 29 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Gilles Villeneuve | **1746** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Didier Pironi | 1396 | 1982 | [Round 5: Belgian Grand Prix](./results/1982-season-report.md#round-5-belgian-grand-prix) |
| 30 | Thierry Boutsen | **1746** | Benetton | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Teo Fabi | 1448 | 1987 | [Round 16: Australian Grand Prix](./results/1987-season-report.md#round-16-australian-grand-prix) |

*Based on peak ELO ratings achieved during their F1 careers. Updated: 2025-07-30*


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
