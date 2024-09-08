function saveData(dataJSON) {
	if (typeof(dataJSON)!='object') {
		console.error("Error on saving:\nData is expected as JSON object, got "+typeof(dataJSON));
		return;
	} else {
		//console.log("Received string, continuing");
	}
	
	if (!dataJSON.hasOwnProperty('data')) {
		console.error("JSON object must have property must have dataJSON of type string in it!");
		return;
	}
	console.log(dataJSON, typeof(dataJSON));
	const data = JSON.stringify(dataJSON);
	

	fetch('/save-data', {
		method: 'POST',
		headers: { 'Content-Type' : 'application/json' },
		body: data,
	})
	.then(response => response.text())
	.then(message => console.log(message))
	.catch(err => console.error('Error saving: ', err));
}

async function loadData() {
	try {
		let db;
		let response = await fetch('/load-data');
		let dataJSON = await response.text();
		return dataJSON;
	} catch (err) {
		console.log("Error loading: ", err);
	}

}

async function saveGame(game) {
	console.assert(typeof(game) == 'string', "Game must be of type string");
	fetch('/save-game', {
		method: 'POST',
		headers: { 'Content-Type': 'text/plain' },
		body: game,
	})
	.then(response => response.text())
	.then(message => console.log(message))
	.catch(err => console.error('Error saving: ', err));
}
async function savePlayerDB(db) {
	console.log("TODO: Save PlayerDB");
}

async function loadAllGames() {
	const response = await fetch('/load-all-games');
	const gamesText = await response.text();
	const games = parseCSV(gamesText);
	return games;
}
async function loadPlayers() {
	//console.log("TODO: Load games");
	const response = await fetch('/load-players');
	const playersJSON = await response.json();
	return playersJSON;
}

function parseCSV(data) {
	const parsedLines = data.split("\n");
	let parsed = parsedLines.map(l => l.split(","));

	if (parsed[parsed.length-1].length==1) parsed.pop();
	console.log(parsed);
	
	return parsed;
}
