var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
	/*
	if(!exists) {
		db.run("CREATE TABLE ChatHistory (thing TEXT)");
	}
	  
	var stmt = db.prepare("INSERT INTO ChatHistory VALUES (?)");  
	stmt.run("First entry in my table");  
	stmt.finalize();
	*/

	db.each("SELECT rowid AS id, thing FROM ChatHistory", function(err, row) {
	    console.log(row.id + ": " + row.thing);
	});
});

db.close();