const express = require('express');
const fs = require('fs');
const path = require('path');

const dataFileName = path.join(__dirname, 'data.json');
const port = 3000;

app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/save-data', (req,res)=> {
	let data = req.body;
	if (typeof(data)=='object') data = JSON.stringify(data);
	console.log(data,typeof(data));
	fs.writeFile(dataFileName, data, err => {
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
		const fileData =  fs.readFileSync(dataFileName, 'utf8');
		res.status(200).json(JSON.parse(fileData));
	} catch (err) {
		res.status(500).send('Error loading data: ' + err.message);
	}
});


app.listen(port, () => {
	console.log('Listening on localhost:' + port);
});
