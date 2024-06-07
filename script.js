let info = {};

window.onload = (e) => {
	console.log("document.onload", e);
	console.log(data);
	info = csvStringToObject(data);
	console.log(info);
}

function updateElos() {
	const resultsScreen = document.getElementById("results-screen");
	const playerInputs = document.getElementsByTagName("input");
	
	
}

function resetPage() {
	const resultsScreen = document.getElementById("results-screen");
	const playerInputs = document.getElementsByTagName("input");
	
	for (let inp of playerInputs) {
		inp.value = ''
	}
	
	resultsScreen.style.display = "none"
}

function csvStringToObject(csvString) {
    const lines = csvString.split('\n');
    const result = {};

    lines.forEach(line => {
        const values = line.trim().split(',');
        const name = values.shift().trim();
        const nums = values.map(num => parseFloat(num.trim()));

        result[name] = nums;
    });

    return result;
}
