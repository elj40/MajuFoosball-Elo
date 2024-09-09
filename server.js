const express = require('express');
const fs = require('fs');
const path = require('path');

const TESTING = false;		//Variable to put program in development state
const OVERWRITE = false && TESTING;	//Allows overwriting of database, use ONLY when testing is true;

const gamesFileName = path.join(__dirname, TESTING ? 'TEST_GAMES.CSV' : 'GAMES.CSV');
const playersFileName = path.join(__dirname, TESTING ? 'TEST_PLAYERS.JSON' : 'PLAYERS.JSON');
const backupDirName = path.join(__dirname, 'backups');

const IP = '0.0.0.0';
const PORT = 3000;

//Counter that keeps track of how many games were saved in a session,
//this is a flawed and lazy approach but should be fine
const GAMES_TILL_BACKUP = 5;
var SESSION_GAMES = 0; 


app = express();

app.use(express.static(path.join(__dirname, 'public')));

//Middleware to be able to load and send different types of data
app.use(express.json());
app.use(express.text());


app.post('/save-game', (req, res)=> {

	console.assert(req.body, "Server says: req.body does not exist, expected text");
	console.assert(typeof(req.body) == 'string', "Server says: req.body is not a string");
	
	const game = req.body;

	fs.appendFile(gamesFileName, game, e => {
		if (e) {
			console.log(e);
			res.send("Could not append to file :(\nRead server error");
		} else {
			console.log(game);
			console.log("Successfully wrote to: ", gamesFileName);
			if (!updatePlayerDB(game)) res.status(500).send("Failed to save game");

			SESSION_GAMES++;
			if (SESSION_GAMES >= GAMES_TILL_BACKUP) {
				console.log("Making backups...");
				makeBackups()
				SESSION_GAMES = 0;
			}
		}
	});



	res.status(200).send("File saved successfully");
});


app.get('/load-all-games', (req, res) => {
	var games;
	try {
		games = fs.readFileSync(gamesFileName, 'utf8');
	} catch (err) {
		console.log(error);
		res.send("Could not load games, check server error");
		return;
	}
	//console.log(games);
	//Maybe do some processing here?
	res.send(games);
});

app.get('/load-players', (req, res) => {
	var players;
	try {
		players = fs.readFileSync(playersFileName, 'utf8');
	} catch (err) {
		console.log(error);
		res.send("Could not load players, check server error");
		return;
	}
	//console.log(players);
	res.json(players);
});

app.listen(PORT, () => {
	console.log('Testing status: ' + TESTING);
	console.log('Overwrite status: ' + OVERWRITE);
	console.log('Listening on '+ IP + ':' + PORT);
	
	if (OVERWRITE) {
		console.log("OVERWRITING GAMES FILE: ", gamesFileName);
		fs.writeFileSync(gamesFileName, "");
		console.log("OVERWRITING PLAYERS FILE: ", playersFileName);
		fs.writeFileSync(playersFileName, "");
	}
});

function getDateToday() {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = mm + '_' + dd + '_' + yyyy;
	return today;
}
// pfn: playersFileName
// gfn: gamesFileName
function makeBackups() {
	const today = getDateToday();
	const pfn = TESTING ? 'TEST_PLAYERS.JSON' : 'PLAYERS.JSON';
	const gfn = TESTING ? 'TEST_GAMES.CSV' : 'GAMES.CSV';

	const bpfn = path.join(backupDirName, today+'_'+pfn+'.bak');
	const bgfn = path.join(backupDirName, today+'_'+gfn+'.bak');

	const playersText = fs.readFileSync(playersFileName, 'utf8')
	const gamesText = fs.readFileSync(gamesFileName, 'utf8')

	try {
	fs.writeFileSync(bpfn, playersText)
	console.log("Successfully wrote to: ", bpfn);
	fs.writeFileSync(bgfn, gamesText)
	console.log("Successfully wrote to: ", bgfn);
	}
	catch (err) {
	console.error("Could not make backup: ", err);
	return false;
	}

	console.log("Succesfully made backups")
	return true;
}

function updatePlayerDB(game) {
	const gameValues = game.split(",");
	console.assert(gameValues.length == 6, "Expected 6 terms in a game (Date, Type, WAttack, WDefense, LAttack, LDefence)");

	var dbText = fs.readFileSync(playersFileName, 'utf8');
	if (dbText=="" || OVERWRITE) dbText = "{}";
	//console.log("DB read from file: ", dbText);

	let playerDB = JSON.parse(dbText);

	const game_mode = parseInt(gameValues[1][0]);

	if (game_mode == 1) {
		updatePlayerDB1(gameValues[2],gameValues[4],playerDB);
	}
	else{
		updatePlayerDB2(gameValues[2],gameValues[3],gameValues[4],gameValues[5],playerDB);
	}

	const playerDBText = JSON.stringify(playerDB, null, 4);
	//console.log("PLAYER_DB: \n", playerDBText);

	try {
	fs.writeFileSync(playersFileName, playerDBText);
	console.log("Successfully wrote to: ", playersFileName);
	}
	catch (err) {
		console.error(err);
		return false;
	}

	return true;
}

// This function updates the player databse for if there were 2 players
function updatePlayerDB1(winner, loser, db) {
	const wa = 	winner.toUpperCase().trim();
	const la =	loser.toUpperCase().trim();

	if (!db.hasOwnProperty(wa)) addNewPlayer(wa, db);
	if (!db.hasOwnProperty(la)) addNewPlayer(la, db);

	wad_elo = db[wa].elo[0].at(-1);
	lad_elo = db[la].elo[0].at(-1);

	const eloWin = wad_elo;
	const eloLose = lad_elo;

	wad_elo += calculateEloChange(eloWin, eloLose,'W',db);
	lad_elo += calculateEloChange(eloWin, eloLose,'L',db);

	wad = updatePlayer(wa, wad_elo, 'W', 1, db);
	lad = updatePlayer(la, lad_elo, 'L', 1, db);

}
// This function updates the player databse for if there were 4 players
function updatePlayerDB2(winAttack, winDefence, loseAttack, loseDefence, db) {
	const wa = 	winAttack.toUpperCase().trim();
	const wd = 	winDefence.toUpperCase().trim();
	const la =	loseAttack.toUpperCase().trim();
	const ld =	loseDefence.toUpperCase().trim();


	if (!db.hasOwnProperty(wa)) addNewPlayer(wa, db);
	if (!db.hasOwnProperty(wd)) addNewPlayer(wd, db);
	if (!db.hasOwnProperty(la)) addNewPlayer(la, db);
	if (!db.hasOwnProperty(ld)) addNewPlayer(ld, db);

	wad_elo = db[wa].elo[1].at(-1);
	wdd_elo = db[wd].elo[1].at(-1);
	lad_elo = db[la].elo[1].at(-1);
	ldd_elo = db[ld].elo[1].at(-1);

	const eloWin = (wad_elo + wdd_elo)/2;
	const eloLose = (lad_elo + ldd_elo)/2;

	wad_elo += calculateEloChange(eloWin, eloLose,'W',db);
	wdd_elo += calculateEloChange(eloWin, eloLose,'W',db);
	lad_elo += calculateEloChange(eloWin, eloLose,'L',db);
	ldd_elo += calculateEloChange(eloWin, eloLose,'L',db);

	wad = updatePlayer(wa, wad_elo, 'W', 2, db);
	wdd = updatePlayer(wd, wdd_elo, 'W', 2, db);
	lad = updatePlayer(la, lad_elo, 'L', 2, db);
	ldd = updatePlayer(ld, ldd_elo, 'L', 2, db);

}
function addNewPlayer(player, db) {
	console.log("Creating new player: " + player);
	db[player] = {
	     elo: [[1000], [1000]],
	     games_won: [0,0],
	     games_lost: [0,0],
	     games_played: [0,0]
	}
}

function updatePlayer(player, newElo, outcome, mode, db) {
	console.assert(!isNaN(newElo), "New Elo is not a number");
	console.assert(outcome == 'W' || outcome == 'L', "Outcome should be W or L");

	const i = mode-1;
	db[player].elo[i].push(newElo);
	db[player].games_played[i]++;

	if (outcome == 'W') db[player].games_won[i]++;
	else db[player].games_lost[i]++;
}

function calculateEloChange(ra, rb, wl, db) {
	const k = 32;
	const c = 400;

	const qa = Math.pow(10, ra/c);
	const qb = Math.pow(10, rb/c);

	const q = (wl=='W') ? qa : qb;
	const r = (wl=='W') ? ra : rb;
	const ea = q/(qa+qb);
	const sa = (wl=='W') ? 1 : 0;

	const nra = r + k*(sa - ea);
	const change = k*(sa-ea);

	return change;
}
