const winAttack = document.getElementById("winA"); 
const winDefense = document.getElementById("winD"); 
const loseAttack = document.getElementById("loseA"); 
const loseDefence = document.getElementById("loseB"); 
const saveBtn = document.getElementById('save');
const infoP = document.getElementById('info');


function updateDatabase(db) {
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
function updateDatabase(db) {
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

async function run() {
	let testing = true;
	let database;
	if (testing) database = "";
	else database = await loadData();
	
	database = parseCSV(database);

	saveBtn.addEventListener('click', ()=> {
		database = updateDatabase(database);
		const dataStr = JSON.stringify(database); 
		saveData(dataStr);
		clearInputs();
	});
	console.log(database);
	const dom =  {
		wai: winAttack,
		wdi: winDefense,
		lai: loseAttack,
		ldi: loseDefence,
		submit: saveBtn,
	}
	if (testing) {
		info.innerText = "TESTING WEBSITE, PLEASE LEAVE IF YOU ARE NOT DEVELOPING";
		//runTests(dom, database);
	}
}

run();
