function runTests(dom, db) {
	for (let i =0; i < tests.length; i++) {
		for (let key in dom) dom[key].value = "";
		pass = tests[i](dom, db);
		msg = pass ? "success" : "FAILED";
		console.log("Test " + i +": " + msg);
	}
	console.log(db);
	console.log("TESTS COMPLETED");
}
const tests = [
	(dom,db) => {
		dom.wai.value = "a0";
		dom.wdi.value = "b0";
		dom.lai.value = "c0";
		dom.ldi.value = "d0";
		dom.submit.click();
		
		let test_passed = true;
		test_passed = db["A0"][0].elo == 1016;
		test_passed = db["B0"][0].elo == 1016;
		test_passed = db["C0"][0].elo == 984;
		test_passed = db["D0"][0].elo == 984;
		return test_passed;	
	},
	(dom, db) => {
		dom.wai.value = "a1";
		dom.lai.value = "b1";
		dom.submit.click();
		let tp = true;
		tp = db["A1"][0].elo == 1016;
		tp = db["B1"][0].elo == 984;
		return tp;
	},

	(dom, db) => {
		dom.wdi.value = "a2";
		dom.lai.value = "b2";
		dom.submit.click();
		let tp = true;
		tp = db["A2"][0].elo == 1016;
		tp = db["B2"][0].elo == 984;
		return tp;
	},

	(dom, db) => {
		dom.wai.value = "a3";
		dom.ldi.value = "b3";
		dom.submit.click();
		let tp = true;
		tp = db["A3"][0].elo == 1016;
		tp = db["B3"][0].elo == 984;
		return tp;
	},

	(dom, db) => {
		dom.wdi.value = "a4";
		dom.ldi.value = "b4";
		dom.submit.click();
		let tp = true;
		tp = db["A4"][0].elo == 1016;
		tp = db["B4"][0].elo == 984;
		return tp;
	},
	(dom, db) => {
		dom.wai.value = "a5";
		dom.wdi.value = "b5";
		dom.lai.value = "c5";
		dom.submit.click();
		let tp = true;
		tp = db["A5"][0].elo == 1016;
		tp = db["B5"][0].elo == 1016;
		tp = db["C5"][0].elo == 984;
		return tp;
	},

	(dom, db) => {
		dom.wai.value = "a6";
		dom.wdi.value = "b6";
		dom.ldi.value = "c6";
		dom.submit.click();
		let tp = true;
		tp = db["A6"][0].elo == 1016;
		tp = db["B6"][0].elo == 1016;
		tp = db["C6"][0].elo == 984;
		return tp;
	},

	(dom, db) => {
		dom.wai.value = "a7";
		dom.ldi.value = "b7";
		dom.lai.value = "c7";
		dom.submit.click();
		let tp = true;
		tp = db["A7"][0].elo == 1016;
		tp = db["B7"][0].elo == 984;
		tp = db["C7"][0].elo == 984;
		return tp;
	},

	(dom, db) => {
		dom.wdi.value = "a8";
		dom.ldi.value = "b8";
		dom.lai.value = "c8";
		dom.submit.click();
		let tp = true;
		tp = db["A8"][0].elo == 1016;
		tp = db["B8"][0].elo == 984;
		tp = db["C8"][0].elo == 984;
		return tp;
	},
]
