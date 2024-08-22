function saveData(dataJSON) {
	if (typeof(dataJSON)!='object') {
		console.error("Error on saving:\nData is expected as JSON object, got "+typeof(dataJSON));
		return;
	} else {
		//console.log("Received string, continuing");
	}
	
	if (!dataJSON.hasOwnProperty('data')) {
		console.error("JSON object must have property must have dataJSON of type string in it!");
		return;
	}
	console.log(dataJSON, typeof(dataJSON));
	const data = JSON.stringify(dataJSON);
	

	fetch('/save-data', {
		method: 'POST',
		headers: { 'Content-Type' : 'application/json' },
		body: data,
	})
	.then(response => response.text())
	.then(message => console.log(message))
	.catch(err => console.error('Error saving: ', err));
}

async function loadData() {
	try {
		let db;
		let response = await fetch('/load-data');
		let dataJSON = await response.text();
		return dataJSON;
	} catch (err) {
		console.log("Error loading: ", err);
	}

}

function parseCSV(data) {
	let parsed = [data];
	return parsed;
}
