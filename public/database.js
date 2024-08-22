function saveData(data) {
	if (typeof(data)!='string') {
		console.error("Error on saving:\nData is expected as string, got "+typeof(data));
		return;
	} else {
		console.log("Received string, continuing");
	}
	console.log(data,typeof(data));
	let ndata = JSON.stringify({data});
	console.log(ndata);

	fetch('/save-data', {
		method: 'POST',
		headers: { 'Content-Type' : 'application/json' },
		body:ndata,
	})
	.then(response => response.text())
	.then(message => console.log(message))
	.catch(err => console.error('Error saving: ', err));
}

async function loadData() {
	try {
		let db;
		let response = await fetch('/load-data');
		let data = await response.text();
		return data;
	} catch (err) {
		console.log("Error loading: ", err);
	}

}

function parseCSV(data) {
	let parsed = [data];
	return parsed;
}
