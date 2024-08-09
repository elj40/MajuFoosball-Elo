const winAttack = document.getElementById("winA"); 
const winDefense = document.getElementById("winD"); 
const loseAttack = document.getElementById("loseA"); 
const loseDefence = document.getElementById("loseB"); 
const saveBtn = document.getElementById('save');


function updateDatabase(db) {
	
	const wa = 	winAttack.value.toUpperCase().trim();
	const wd = 	winDefense.value.toUpperCase().trim();
	const la =	loseAttack.value.toUpperCase().trim();
	const ld =	loseDefence.value.toUpperCase().trim();

	if (!db.hasOwnProperty(wa)) { db[wa] = []; console.log("Generating space for ",wa); }
	if (!db.hasOwnProperty(wd)) { db[wd] = []; console.log("Generating space for ",wd); }
	if (!db.hasOwnProperty(la)) { db[la] = []; console.log("Generating space for ",la); }
	if (!db.hasOwnProperty(ld)) { db[ld] = []; console.log("Generating space for ",ld); }

	wad_elo = calculateNewElo([wa,wd,la,ld],'W',db);
	wdd_elo = calculateNewElo([wa,wd,la,ld],'W',db);
	lad_elo = calculateNewElo([wa,wd,la,ld],'L',db);
	ldd_elo = calculateNewElo([wa,wd,la,ld],'L',db);


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

function calculateNewElo(players, wl, db) {
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

	if (playerElos[0]==-1) playerElos[0] = playerElos[1];
	if (playerElos[1]==-1) playerElos[1] = playerElos[0];
	if (playerElos[2]==-1) playerElos[2] = playerElos[3];
	if (playerElos[3]==-1) playerElos[3] = playerElos[2];

	let winAvg = (playerElos[0]+playerElos[1])/2;
	let loseAvg = (playerElos[2]+playerElos[3])/2;

	const ra = winAvg;
	const rb = loseAvg;

	const k = 32;
	const c = 400;

	const qa = Math.pow(10, ra/c);
	const qb = Math.pow(10, rb/c);

	const q = (wl=='W') ? qa : qb;
	const r = (wl=='W') ? ra : rb;
	const ea = q/(qa+qb);
	const sa = (wl=='W') ? 1 : 0;

	const nra = r + k*(sa - ea);

	return nra;
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

async function run() {
	let testing = true;
	let database;
	if (testing) database = {};
	else database = await loadData();
	console.log(database);
	saveBtn.addEventListener('click', ()=> {
		database = updateDatabase(database);
		const dataStr = JSON.stringify(database); 
		saveData(dataStr);
	});
	const dom =  {
		wai: winAttack,
		wdi: winDefense,
		lai: loseAttack,
		ldi: loseDefence,
		submit: saveBtn,
	}
	runTests(dom, database);
}

run();
