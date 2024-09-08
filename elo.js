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
