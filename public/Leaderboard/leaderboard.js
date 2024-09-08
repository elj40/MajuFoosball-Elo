const table = document.getElementById('game-table');
const changeModeBtn = document.getElementById('change-mode-btn');

const emptyTable = table.innerHTML;
var GAME_MODE = 2;


changeModeBtn.addEventListener("click", ()=> {
	changeModeBtn.innerText = "Change to "+GAME_MODE+"vs"+GAME_MODE;

	if (GAME_MODE == 1) GAME_MODE = 2;
	else if (GAME_MODE == 2) GAME_MODE = 1;
	
	table.innerHTML = emptyTable;
	loadTable();
});


async function loadTable() {
	const GM = GAME_MODE-1;

	const playerDBText = await loadPlayers();
	const playerDB = JSON.parse(playerDBText);
	console.log(playerDB);
	let data = Object.entries(playerDB);
	data = data.filter(info => info[1].games_played[GM] > 0);
	data.sort((a,b) => sortFn(a,b));


	for (let [name,info] of data) {

		const elo = info.elo[GM].at(-1);
		const totalGames = info.games_played[GM];
		const won = info.games_won[GM];
		const lost = info.games_lost[GM];

		console.log(name, elo, totalGames, won, lost);

		const row = document.createElement('tr');
		row.appendChild(makeCell(name));
		row.appendChild(makeCell(elo));
		row.appendChild(makeCell(totalGames));
		row.appendChild(makeCell(won));
		row.appendChild(makeCell(lost));

		table.appendChild(row);
		
	}
		
		
}

function makeCell(text) {
	const c = document.createElement('td');
	c.innerText = text;
	return c;
}

function sortFn(a,b,mode) {
	let elo1 = a[1].elo[GAME_MODE-1].at(-1);
	let elo2 = b[1].elo[GAME_MODE-1].at(-1);

	return elo2 - elo1;
}

loadTable();
