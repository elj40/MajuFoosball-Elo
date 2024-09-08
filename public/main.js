const winAttack = document.getElementById("winA"); 
const winDefence = document.getElementById("winD"); 
const loseAttack = document.getElementById("loseA"); 
const loseDefence = document.getElementById("loseD"); 
const gameForm = document.getElementById("form");
const saveBtn = document.getElementById('save');
const infoP = document.getElementById('info');
let gameMode = 2;

var GAME_MODE = 2;
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
	if (testing) {
		info.innerText = "TESTING WEBSITE, PLEASE LEAVE IF YOU ARE NOT DEVELOPING";
		runTests(dom, database);
		saveBtn.setAttribute("disabled", "disabled");
	}
}

run();
