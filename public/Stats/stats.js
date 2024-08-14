const nameInput = document.getElementById('stats-name');
const tableElement = document.getElementById('game-table');
const stateInfoElement = document.getElementById('state');

const defaultTable = `
			<tr>
				<th>Game</th>
				<th>Outcome</th>
				<th>Date</th>
				<th>Teammate</th>
				<th>Opponent Attack</th>
				<th>Opponent Defense</th>
				<th>Elo</th>
			</tr>
			`

window.onresize = () => {resizeTableColumns(window.innerWidth);}
async function start() {
	let db = await loadData();
	nameInput.addEventListener('change', ()=>{loadStats(nameInput, tableElement,  db)});

	resizeTableColumns(window.innerWidth);
}

function resizeTableColumns(width) {
	const longHeaders = ['Game','Outcome','Date','Teammate', 'Opponent Attack','Opponent Defense', 'Elo']
	const shortHeaders = ['G','O','D','TM', 'OPP A','OPP D', 'ELO']

	const headers = (width > 370) ? longHeaders : shortHeaders;

	const headerElements = tableElement.getElementsByTagName('th');

	for (let i = 0; i < headers.length; i++) {
		headerElements[i].innerText = headers[i];
	}

}

function loadStats(nameInput, table, db) {
	console.log('Loading stats');
	clearTable(table);
	let name = nameInput.value.trim().toUpperCase();
	if (!db.hasOwnProperty(name)) {
		stateInfoElement.innerText = "Could not find name in database";
		console.log("Could not find name in database");
		return;
	}

	stateInfoElement.innerText = "Showing stats for: " + name;
	for (let i = db[name].length-1; i>=0; i--) {
		let game = db[name][i];
		let row = document.createElement('tr');

		row.appendChild(makeCell(i+1));
		row.appendChild(makeCell(game["outcome"]));
		row.appendChild(makeCell(game["date"]));
		row.appendChild(makeCell(game["teammate"]));
		row.appendChild(makeCell(game["opponentA"]));
		row.appendChild(makeCell(game["opponentD"]));
		row.appendChild(makeCell(Math.floor(game["elo"])));

		tableElement.appendChild(row);
	}



}

function clearTable(table) {
	let len = table.children.length;
	let rows = table.getElementsByTagName('tr');
	console.log(rows);
	for (let i = len-1; i > 0; i--) {
		let r = rows[i];
		console.log(r);
		table.removeChild(r);
	}
}

function makeCell(text) {
	let cell = document.createElement('td');
	cell.innerText = text;
	return cell;
}

start();
