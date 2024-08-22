const express = require('express');
const fs = require('fs');
const path = require('path');

const gamesFileName = path.join(__dirname, 'data.csv');
const IP = '0.0.0.0';
const PORT = 3000;

app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/save-data', (req,res)=> {
	console.log(req);
	console.log("Insave data:");
	let data = req.body;
	console.log(data,typeof(data));
	fs.appendFile(dataFileName, data, err => {
		if (err) {
			console.log(err);
			res.status(500).send("Failed to save.");
		} else {
			console.log('Saved data');
			res.status(200).send("Data saved successfully");
		}
	});
});

app.get('/load-data', (req,res) => {
	try {
		const fileData = fs.readFileSync(dataFileName, 'utf8');
		res.status(200).text(fileData);
	} catch (err) {
		res.status(500).send('Error loading data: ' + err.message);
	}
});


app.listen(PORT, () => {
	console.log('Listening on '+ IP + ':' + PORT);
});
