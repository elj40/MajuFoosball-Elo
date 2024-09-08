# MajuFoosball-Elo
Simple website to track elo of foosball in majuba

## Interface

**Game input**
- Simple text inputs to enter names
- 4 inputs for 2v2 and 2 for 1v1

**Leaderboard**
- Table of players and their stats with ability to sort by each stat (elo descending default)

**Player stats**
- Input to search which stats you want 
- Table that shows all games played by player
- Remake table to show better on mobile

## Backend

**Game input**
- Generate game data 
	- Oragnise data considering type of game
	- Calculate elo change of each player (use highest players elo?, or average, or lowest?)
- Send to server:
	- Game: (Date, Type, WAttack, WDefense, LAttack, LDefence)

**Leaderboard**
- Load player file
- Sort games
- Output into table

**Player stats**
- Load games of said player (do server side or client side? client side for now since eduroam is fast)
- Display to table

## Data

- GAMES.CSV: CSV file to store every game played
- TEST_GAMES.CSV: CSV for testing purposes
- PLAYERS.JSON: JSON file to store every player in the system and overall stats
- TEST_PLAYERS.JSON: JSON for testing purposes
- /backups: folder to store auto generated backups of GAMES.CSV and PLAYERS.JSON
- [date]_GAMES.CSV.bak: backup file for games
- [date]_PLAYERS.JSON.bak: backup file for players

## Server

- Use ejs? or static (use this for now)
- Use pure http? or express (this for now)
- load games: read entire games file and return it
- save game: append to games.csv file and update players.json
	- Players: Update elos, games played
- load leaderboard: read players.json and return it
- IMPORTANT: do not allow program to delete any data, data deletion will be done manually from now on or only on test data

## Fairness

- Both teams have to code somehow before it gets entered
