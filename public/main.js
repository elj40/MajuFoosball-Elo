const winAttack = document.getElementById("winA"); 
const winDefence = document.getElementById("winD"); 
const loseAttack = document.getElementById("loseA"); 
const loseDefence = document.getElementById("loseD"); 
const gameForm = document.getElementById("form");
const saveBtn = document.getElementById('save');
const infoP = document.getElementById('info');

var GAME_MODE = 2;

//function addNewPlayer(player, db) {
//	console.log("Creating new player: " + player);
//	db[player] = {
//	     elo: [1000],
//	     games_won: 0,
//	     games_lost: 0,
//	     games_played: 0
//	}
//}
//
//function updatePlayer(player, newElo, outcome, db) {
//	console.assert(!isNaN(newElo), "New Elo is not a number");
//	console.assert(outcome == 'W' || outcome == 'L', "Outcome should be W or L");
//	db[player].elo.push(newElo);
//	db[player].games_played++;
//
//	if (outcome == 'W') db[player].games_won++;
//	else db[player].games_lost++;
//}
//// This function updates the player databse for if there were 1 players
//function updatePlayerDB1(db) {
//	const wa = 	winAttack.value.toUpperCase().trim();
//	const la =	loseAttack.value.toUpperCase().trim();
//
//	if (!db.hasOwnProperty(wa)) addNewPlayer(wa, db);
//	if (!db.hasOwnProperty(la)) addNewPlayer(la, db);
//
//	wad_elo = db[wa].elo[db[wa].games_played];
//	lad_elo = db[la].elo[db[la].games_played];
//
//	const eloWin = wad_elo;
//	const eloLose = lad_elo;
//
//	wad_elo += calculateEloChange(eloWin, eloLose,'W',db);
//	lad_elo += calculateEloChange(eloWin, eloLose,'L',db);
//
//	wad = updatePlayer(wa, wad_elo, 'W', db);
//	lad = updatePlayer(la, lad_elo, 'L', db);
//
//	console.log(db);
//	return db;
//}
//// This function updates the player databse for if there were 4 players
//function updatePlayerDB2(db) {
//	const wa = 	winAttack.value.toUpperCase().trim();
//	const wd = 	winDefence.value.toUpperCase().trim();
//	const la =	loseAttack.value.toUpperCase().trim();
//	const ld =	loseDefence.value.toUpperCase().trim();
//
//
//	if (!db.hasOwnProperty(wa)) addNewPlayer(wa, db);
//	if (!db.hasOwnProperty(wd)) addNewPlayer(wd, db);
//	if (!db.hasOwnProperty(la)) addNewPlayer(la, db);
//	if (!db.hasOwnProperty(ld)) addNewPlayer(ld, db);
//
//	wad_elo = db[wa].elo[db[wa].games_played];
//	wdd_elo = db[wd].elo[db[wd].games_played];
//	lad_elo = db[la].elo[db[la].games_played];
//	ldd_elo = db[ld].elo[db[ld].games_played];
//
//	const eloWin = (wad_elo + wdd_elo)/2;
//	const eloLose = (lad_elo + ldd_elo)/2;
//
//	wad_elo += calculateEloChange(eloWin, eloLose,'W',db);
//	wdd_elo += calculateEloChange(eloWin, eloLose,'W',db);
//	lad_elo += calculateEloChange(eloWin, eloLose,'L',db);
//	ldd_elo += calculateEloChange(eloWin, eloLose,'L',db);
//
//	wad = updatePlayer(wa, wad_elo, 'W', db);
//	wdd = updatePlayer(wd, wdd_elo, 'W', db);
//	lad = updatePlayer(la, lad_elo, 'L', db);
//	ldd = updatePlayer(ld, ldd_elo, 'L', db);
//
//	console.log(db);
//	return db;
//}



function generateGamePerPlayer(p,t,oA,oD,wl,e) {
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
	                + (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear() + " @ "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":" 
	                + currentdate.getSeconds();
	return {
		position: p,
		teammate: t,
		opponentA: oA,
		opponentD: oD,
		outcome: wl,
		elo: e,
		date: datetime
	}
}

function generateCSVGame() {
	var currentdate = new Date(); 

	var datetime = currentdate.getDate() + "/"
	                + (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear() + " @ "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":" 
	                + currentdate.getSeconds();

	const wa = 	winAttack.value.toUpperCase().trim();
	const wd = 	winDefence.value.toUpperCase().trim();
	const la =	loseAttack.value.toUpperCase().trim();
	const ld =	loseDefence.value.toUpperCase().trim();

	let csv;

	csv = datetime + ",";
	csv += GAME_MODE+"vs"+GAME_MODE+",";
	csv += wa + ",";
	csv += wd + ",";
	csv += la + ",";
	csv += ld;
	csv += "\n";

	return csv;
}


function clearInputs() {
	winAttack.value = "";
	winDefence.value = "";
	loseAttack.value = "";
	loseDefence.value = "";
}

async function run() {
	let testing = true;
	let playerDB;
	playerDB = await loadPlayers();

	gameForm.addEventListener('submit', (e)=> {
		e.preventDefault();
		const newGame = generateCSVGame();
		saveGame(newGame);
		clearInputs();
	});
	console.log("Main playerDB: ", JSON.parse(playerDB));
	const dom =  {
		wai: winAttack,
		wdi: winDefence,
		lai: loseAttack,
		ldi: loseDefence,
		submit: saveBtn,
	}
	if (testing) {
		info.innerText = "TESTING WEBSITE, PLEASE LEAVE IF YOU ARE NOT DEVELOPING";
	}
}

run();
