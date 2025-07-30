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
| 1 | 2750 | <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg" alt="Netherlands" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇱'; this.style.marginRight='5px';"/> Max Verstappen | Red Bull | 2750 | 2753 | 2753 |
| 2 | 2593 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> George Russell | Mercedes | 2525 | 2594 | 2594 |
| 3 | 1595 | <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" alt="Thailand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇹🇭'; this.style.marginRight='5px';"/> Alexander Albon | Williams | 2451 | 2517 | 2517 |
| 4 | 2029 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lando Norris | McLaren | 998 | 2025 | 2020 |
| 5 | 1048 | <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg" alt="Monaco" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇨'; this.style.marginRight='5px';"/> Charles Leclerc | Ferrari | 1961 | 1989 | 1973 |
| 6 | 795 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Lance Stroll | Aston Martin | 1779 | 1807 | 1801 |
| 7 | 1439 | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg" alt="Japan" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇯🇵'; this.style.marginRight='5px';"/> Yuki Tsunoda | RB F1 Team | 524 | 1436 | 1436 |
| 8 | -48 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Pierre Gasly | Alpine F1 Team | 990 | 1417 | 1417 |
| 9 | 1068 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Oliver Bearman | Haas F1 Team | 341 | 1344 | 1344 |
| 10 | 1000 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Isack Hadjar | RB F1 Team | 1934 | 1340 | 1340 |
| 11 | 2046 | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Carlos Sainz | Williams | 1190 | 1124 | 1124 |
| 12 | 1000 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Andrea Kimi Antonelli | Mercedes | 1068 | 999 | 999 |
| 13 | 1000 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Gabriel Bortoleto | Sauber | 998 | 993 | 993 |
| 14 | 967 | <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Oscar Piastri | McLaren | 1998 | 971 | 976 |
| 15 | 1721 | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso | Aston Martin | 737 | 709 | 715 |
| 16 | 1604 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lewis Hamilton | Ferrari | 691 | 663 | 679 |
| 17 | 849 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Esteban Ocon | Haas F1 Team | 1576 | 573 | 573 |
| 18 | 852 | <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg" alt="New Zealand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇿'; this.style.marginRight='5px';"/> Liam Lawson | Red Bull | 834 | 512 | 512 |
| 19 | 921 | <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg" alt="Argentina" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇷'; this.style.marginRight='5px';"/> Franco Colapinto | Alpine F1 Team | -104 | 481 | 481 |
| 20 | 1000 | <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Jack Doohan | Alpine F1 Team | 987 | -25 | -25 |
| 21 | -50 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Nico Hülkenberg | Sauber | -48 | -43 | -43 |



<!-- ELO_RESULTS_END -->
## Top 30 F1 Drivers of All Time (by Peak ELO)

| Rank | Driver | Peak ELO | Constructor | Teammate | Teammate ELO | Season | Report |
|------|--------|----------|-------------|----------|--------------|--------|--------|
| 1 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" alt="Finland" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇮'; this.style.marginRight='5px';"/> Kimi Räikkönen | **3486** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Felipe Massa | 2078 | 2007 | [2007](./results/2007-season-report.md) |
| 2 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Felipe Massa | **3230** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" alt="Finland" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇮'; this.style.marginRight='5px';"/> Kimi Räikkönen | 2334 | 2009 | [2009](./results/2009-season-report.md) |
| 3 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Eddie Irvine | **3192** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Michael Schumacher | 1985 | 1999 | [1999](./results/1999-season-report.md) |
| 4 | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso | **3175** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Felipe Massa | 2063 | 2013 | [2013](./results/2013-season-report.md) |
| 5 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Jenson Button | **3079** | McLaren | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso | 2032 | 2016 | [2016](./results/2016-season-report.md) |
| 6 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> René Arnoux | **3051** | Ligier | Stefan Johansson | 1637 | 1988 | [1988](./results/1988-season-report.md) |
| 7 | Stoffel Vandoorne | **3043** | McLaren | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso | 2036 | 2017 | [2017](./results/2017-season-report.md) |
| 8 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Gilles Villeneuve | **3013** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Didier Pironi | 1555 | 1982 | [1982](./results/1982-season-report.md) |
| 9 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Michael Schumacher | **3008** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Eddie Irvine | 2169 | 1999 | [1999](./results/1999-season-report.md) |
| 10 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Riccardo Patrese | **2987** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Nigel Mansell | 1794 | 1991 | [1991](./results/1991-season-report.md) |
| 11 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" alt="Finland" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇮'; this.style.marginRight='5px';"/> Valtteri Bottas | **2986** | Mercedes | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lewis Hamilton | 1630 | 2020 | [2020](./results/2020-season-report.md) |
| 12 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Alain Prost | **2971** | McLaren | Stefan Johansson | 1594 | 1987 | [1987](./results/1987-season-report.md) |
| 13 | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Pedro de la Rosa | **2916** | Jaguar | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Luciano Burti | 129 | 2001 | [2001](./results/2001-season-report.md) |
| 14 | Juan Pablo Montoya | **2906** | McLaren | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" alt="Finland" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇮'; this.style.marginRight='5px';"/> Kimi Räikkönen | 1559 | 2005 | [2005](./results/2005-season-report.md) |
| 15 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Nigel Mansell | **2885** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Nelson Piquet | 1509 | 1986 | [1986](./results/1986-season-report.md) |
| 16 | <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg" alt="Mexico" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇽'; this.style.marginRight='5px';"/> Sergio Pérez | **2882** | Red Bull | <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg" alt="Netherlands" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇱'; this.style.marginRight='5px';"/> Max Verstappen | 1509 | 2021 | [2021](./results/2021-season-report.md) |
| 17 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Johnny Herbert | **2880** | Benetton | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Michael Schumacher | 1598 | 1995 | [1995](./results/1995-season-report.md) |
| 18 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Jarno Trulli | **2851** | Jordan | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Heinz-Harald Frentzen | 1659 | 2000 | [2000](./results/2000-season-report.md) |
| 19 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lewis Hamilton | **2779** | Mercedes | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" alt="Finland" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇮'; this.style.marginRight='5px';"/> Valtteri Bottas | 1847 | 2021 | [2021](./results/2021-season-report.md) |
| 20 | <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg" alt="Netherlands" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇳🇱'; this.style.marginRight='5px';"/> Max Verstappen | **2755** | Red Bull | <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg" alt="Mexico" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇲🇽'; this.style.marginRight='5px';"/> Sergio Pérez | 1636 | 2024 | [2024](./results/2024-season-report.md) |
| 21 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Heinz-Harald Frentzen | **2704** | Jordan | <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" alt="Italy" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇮🇹'; this.style.marginRight='5px';"/> Jarno Trulli | 1806 | 2000 | [2000](./results/2000-season-report.md) |
| 22 | Stefan Johansson | **2686** | Ligier | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> René Arnoux | 2002 | 1988 | [1988](./results/1988-season-report.md) |
| 23 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Didier Pironi | **2635** | Ferrari | <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Gilles Villeneuve | 1933 | 1981 | [1981](./results/1981-season-report.md) |
| 24 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> George Russell | **2605** | Mercedes | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Lewis Hamilton | 1592 | 2024 | [2024](./results/2024-season-report.md) |
| 25 | <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇧🇷'; this.style.marginRight='5px';"/> Nelson Piquet | **2583** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Nigel Mansell | 1811 | 1986 | [1986](./results/1986-season-report.md) |
| 26 | <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" alt="Germany" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇩🇪'; this.style.marginRight='5px';"/> Nick Heidfeld | **2552** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg" alt="Australia" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇦🇺'; this.style.marginRight='5px';"/> Mark Webber | 1091 | 2005 | [2005](./results/2005-season-report.md) |
| 27 | <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" alt="Thailand" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇹🇭'; this.style.marginRight='5px';"/> Alexander Albon | **2548** | Williams | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Carlos Sainz | 1093 | 2025 | [2025](./results/2025-season-report.md) |
| 28 | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> John Watson | **2537** | Surtees | Unknown | N/A | 1975 | [1975](./results/1975-season-report.md) |
| 29 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="France" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇫🇷'; this.style.marginRight='5px';"/> Jean Alesi | **2536** | Sauber | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/512px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20250726143817" alt="United Kingdom" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇬🇧'; this.style.marginRight='5px';"/> Johnny Herbert | 1612 | 1998 | [1998](./results/1998-season-report.md) |
| 30 | <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg" alt="Canada" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇨🇦'; this.style.marginRight='5px';"/> Jacques Villeneuve | **2530** | Renault | <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="Spain" width="20" height="auto" style="vertical-align: middle; margin-right: 5px;" onerror="this.outerHTML='🇪🇸'; this.style.marginRight='5px';"/> Fernando Alonso | 1163 | 2004 | [2004](./results/2004-season-report.md) |

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
