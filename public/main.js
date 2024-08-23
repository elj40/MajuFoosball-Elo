const winAttack = document.getElementById("winA"); 
const winDefense = document.getElementById("winD"); 
const loseAttack = document.getElementById("loseA"); 
const loseDefence = document.getElementById("loseB"); 
const saveBtn = document.getElementById('save');
const infoP = document.getElementById('info');
let gameMode = 2;


function updateDatabase(db, mode) {
	
	const wa = 	winAttack.value.toUpperCase().trim();
	const wd = 	winDefense.value.toUpperCase().trim();
	const la =	loseAttack.value.toUpperCase().trim();
	const ld =	loseDefence.value.toUpperCase().trim();

	if (!db.hasOwnProperty(wa)) { db[wa] = []; console.log("Generating space for ",wa); }
	if (!db.hasOwnProperty(wd)) { db[wd] = []; console.log("Generating space for ",wd); }
	if (!db.hasOwnProperty(la)) { db[la] = []; console.log("Generating space for ",la); }
	if (!db.hasOwnProperty(ld)) { db[ld] = []; console.log("Generating space for ",ld); }

	const players = [wa,wd,la,ld];
	const playerElos = getPlayerElos(players,db);
	const elos = removeEmptyElos(playerElos);
	
	wad_elo = getCurrentElo(wa,db);
	wdd_elo = getCurrentElo(wd,db);
	lad_elo = getCurrentElo(la,db);
	ldd_elo = getCurrentElo(ld,db);

	wad_elo += calculateEloChange(elos,'W',db);
	wdd_elo += calculateEloChange(elos,'W',db);
	lad_elo += calculateEloChange(elos,'L',db);
	ldd_elo += calculateEloChange(elos,'L',db);

	wad = generateGamePerPlayer('A',wd,la,ld,'W',wad_elo);
	wdd = generateGamePerPlayer('D',wa,la,ld,'W',wdd_elo);
	lad = generateGamePerPlayer('A',ld,wa,wd,'L',lad_elo);
	ldd = generateGamePerPlayer('D',la,wa,wd,'L',ldd_elo);

	if (wa.length>0) db[wa].push(wad);
	if (wd.length>0) db[wd].push(wdd);
	if (la.length>0) db[la].push(lad);
	if (ld.length>0) db[ld].push(ldd);

	//console.log(db);
	return db;
}
function getCurrentElo(p, db) {
	if (!db.hasOwnProperty(p)) {
		console.log("Somehow player does not exist here");
		return 1000;
	}
	if (db[p].length > 0) return db[p][db[p].length-1].elo;

	return 1000;
}

function getPlayerElos(players, db) {
	let playerElos = [];
	for (let p of players) {
		let l = db[p].length;
		let exists =db.hasOwnProperty(p) 
		let e;
		if (p=='') e = -1;
		else if (exists && l>0) e = db[p][l-1].elo;
		else if (exists) e = 1000;
		else console.log(p + " does not exist");
		playerElos.push(e);
	}
	return playerElos;
}

function removeEmptyElos(elos) {
	let e = [...elos];
	if (e[0]==-1) e[0] = e[1];
	if (e[1]==-1) e[1] = e[0];
	if (e[2]==-1) e[2] = e[3];
	if (e[3]==-1) e[3] = e[2];

	return e;
}
function calculateEloChange(elos, wl, db) {

	const ra = (elos[0]+elos[1])/2; //Winners
	const rb = (elos[2]+elos[3])/2; //Losers

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

function calculateEloChange2(ra, rb, wl, db) {
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

function clearInputs() {
	winAttack.value = "";
	winDefense.value = "";
	loseAttack.value = "";
	loseDefence.value = "";
}

function switchGameMode(mode) {
	if (mode == 1) {
		winDefense.style.display = "none";
		loseDefence.style.display = "none";
	}
	if (mode == 2) {
		winDefense.style.display = "block";
		loseDefence.style.display = "block";
	}
	if (mode > 2 || mode < 1) {
		console.error("SOMEHOW MODE NOT IN RANGE");
		return;
	}
	gameMode = mode; 

}

async function run() {
	let testing = false;
	let database;
	if (testing) database = {};
	else database = await loadData();
	console.log("DB at start: ", database);
	saveBtn.addEventListener('click', ()=> {
		database = updateDatabase(database, gameMode);
		database["testing"] = testing;
		const dataStr = JSON.stringify(database); 
		if (testing) console.log(database);
		else saveData(dataStr);
		clearInputs();
	});
	switchGameMode(gameMode);
	const dom =  {
		wai: winAttack,
		wdi: winDefense,
		lai: loseAttack,
		ldi: loseDefence,
		submit: saveBtn,
	}
	if (testing) {
		info.innerText = "TESTING WEBSITE, PLEASE LEAVE IF YOU ARE NOT DEVELOPING";
		runTests(dom, database);
		saveBtn.setAttribute("disabled", "disabled");
	}
}

run();
