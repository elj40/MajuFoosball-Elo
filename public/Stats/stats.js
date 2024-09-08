const nameInput = document.getElementById('stats-name');
const tableElement = document.getElementById('game-table');
const stateInfoElement = document.getElementById('state');

const defaultTable = tableElement.innerHTML; 

//window.onresize = () => {resizeTableColumns(window.innerWidth);}
async function start() {
	let games = await loadAllGames();
	loadGames({}, tableElement, games); 
	nameInput.addEventListener('change', ()=>{
		const filter_name = nameInput.value.toUpperCase().trim();
		loadGames({name: filter_name}, tableElement,  games)
		});

	//resizeTableColumns(window.innerWidth);
}

//function resizeTableColumns(width) {
//	const longHeaders = ['Game','Outcome','Date','Teammate', 'Opponent Attack','Opponent Defense', 'Elo']
//	const shortHeaders = ['G','O','D','TM', 'OPP A','OPP D', 'ELO']
//
//	const headers = (width > 370) ? longHeaders : shortHeaders;
//
//	const headerElements = tableElement.getElementsByTagName('th');
//
//	for (let i = 0; i < headers.length; i++) {
//		headerElements[i].innerText = headers[i];
//	}
//
//}

function loadGames(filters, table, games) {
	console.log('Loading stats');
	clearTable(table);

	for (let i = games.length-1; i>=0; i--) {
		let game = games[i];

		const date = game[0];	
		const type = game[1];	
		const winAttack = game[2];	
		const winDefence  = game[3];	
		const loseAttack  = game[4];	
		const loseDefence = game[5];	


		if (!filterGame(filters, game)) continue;

		let row = document.createElement('tr');

		row.appendChild(makeCell(i+1));
		row.appendChild(makeCell(date, filters.date));
		row.appendChild(makeCell(type, filters.type));
		row.appendChild(makeCell(winAttack, filters.name));
		row.appendChild(makeCell(winDefence, filters.name));
		row.appendChild(makeCell(loseAttack, filters.name));
		row.appendChild(makeCell(loseDefence, filters.name));

		console.log(row);

		tableElement.appendChild(row);
	}
}

function filterGame(filters, game) {
	if (filters.hasOwnProperty('name')) {
		const fn = filters.name;
		if (fn==game[2]|| fn==game[3]|| fn==game[4]|| fn==game[5]) {
			return true;
		}else return false;
	}
	return true;
}

function clearTable(table) {
	let len = table.children.length;
	let rows = table.getElementsByTagName('tr');
	for (let i = len-1; i > 0; i--) {
		let r = rows[i];
		table.removeChild(r);
	}
}

function makeCell(text, emphasis) {
	let cell = document.createElement('td');
	if (text == emphasis) cell.innerHTML = "<u><strong>"+text+"</strong></u>";
	else cell.innerText = text;
	console.log(cell);
	return cell;
}

start();
