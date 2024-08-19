const table = document.getElementById('game-table');
var testPlayers = ['TEST1','TEST2']; 

for (let l of ['A','B','C','D']) {
	for (let i = 0; i <= 8; i++) {
		testPlayers.push(l + i);
	}
}
testPlayers.push('');

console.log(testPlayers);

async function loadTable() {
	const db = await loadData();
	console.log(db);
	let data = Object.entries(db);
	data.sort((a,b) => sortFn(a,b));

	for (let [name,games] of data) {
		if (testPlayers.includes(name)) continue;


		const elo = Math.floor(games[games.length-1].elo);
		const totalGames = games.length;
		const won = games.filter(g => (g.outcome=='W')).length;
		const lost = games.filter(g => (g.outcome=='L')).length;
		const wonAttack = games.filter(g => (g.outcome=='W' && g.position == 'A')).length;
		const wonDefense = games.filter(g => (g.outcome=='W' && g.position == 'D')).length;

		console.log(name, elo, totalGames, won, lost, wonAttack, wonDefense);

		const row = document.createElement('tr');
		row.appendChild(makeCell(name));
		row.appendChild(makeCell(elo));
		row.appendChild(makeCell(totalGames));
		row.appendChild(makeCell(won));
		row.appendChild(makeCell(lost));
		row.appendChild(makeCell(wonAttack));
		row.appendChild(makeCell(wonDefense));

		table.appendChild(row);
		
	}
		
		
}

function makeCell(text) {
	const c = document.createElement('td');
	c.innerText = text;
	return c;
}

function sortFn(a,b) {
	let games1 = a[1];
	let games2 = b[1];

	let l1 = games1.length;
	let l2 = games2.length;
	
	if (l1 == 0 || l2 == 0) return -1;

	let elo1 = games1[l1-1].elo;
	let elo2 = games2[l2-1].elo;

	
	return elo2 - elo1;
}

loadTable();
