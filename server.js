const express = require('express');
const fs = require('fs');
const path = require('path');

const dataFileName = path.join(__dirname, 'games.csv');
const IP = '0.0.0.0';
const PORT = 3000;
const BRANCH = "CSV"

app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/save-data', (req,res)=> {
	let dataJSON = req.body;
	console.log(dataJSON,typeof(dataJSON));
	dataJSON = JSON.stringify(dataJSON);
	fs.appendFile(dataFileName, dataJSON, err => {
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
		res.status(200).json({fileData});
	} catch (err) {
		res.status(500).send('Error loading data: ' + err.message);
	}
});


app.listen(PORT, () => {
	console.log('On branch: ' + BRANCH);
	console.log('Listening on '+ IP + ':' + PORT);
});
