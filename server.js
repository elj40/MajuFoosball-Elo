const express = require('express');
const fs = require('fs');
const path = require('path');

const TESTING = true;

const gamesFileName = path.join(__dirname, TESTING ? 'TEST_GAMES.CSV' : 'GAMES.CSV');
const playersFileName = path.join(__dirname, TESTING ? 'TEST_PLAYERS.JSON' : 'PLAYERS.JSON');

const IP = '0.0.0.0';
const PORT = 3000;
const BRANCH = "CSV"

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
		if (err) {
			console.log(e);
			res.send("Could not append to file :(\nRead server error");
		} else {
			updatePlayersFile(game);
		}
	});
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
	console.log(games);
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
	console.log(players);
	res.json(players);
});

app.listen(PORT, () => {
	console.log('On branch: ' + BRANCH);
	console.log('Testing status: ' + TESTING);
	console.log('Listening on '+ IP + ':' + PORT);
});
