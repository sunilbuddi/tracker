var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");


//LOGGER
//var log4js = require('log4js');
//log4js.configure('./config/log4js.json');
//var log = log4js.getLogger("server");


//STATIC FILES
app.use(express.static('public'));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Body parser use JSON data

/*MY SQL Connection Info*/
var pool = mysql.createPool({
	connectionLimit : 25,
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'testResults'
});


//TEST CONNECTION
pool.getConnection(function (err, connection) {
	if (!err) {
		console.log("Database is connected ... ");
		var query = 'set global sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION";'
		connection.query(query);
		var query1 = 'set global sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION";'
		connection.query(query1);
		connection.release();
	} else {
		console.log("Error connecting database ... ");
	}
	console.log("releasing connection ... ");
});

// ROOT - Loads Angular App
app.get('/', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
});

// This responds a GET request for the /list page.
app.get('/api/list/TestPass', function (req, res) {
	console.log("GET Request :: /list/TestPass");
	var data = {
        "error": 1,
        "TestPass": ""
    };
	var query = 'select tp.prime as prime, tbl.name as name, tbl.firstCreated, max(tbl.fail) as fail,max(tbl.pass) as pass,max(tbl.skip) as skip from (select t.name,t.firstCreated,(CASE WHEN s.status = "FAIL" THEN count(s.status) END) as "fail",(CASE WHEN s.status = "PASS" THEN count(s.status) END) as "pass",(CASE WHEN s.status = "SKIP" THEN count(s.status) END) as "skip" from status s join run r on r.RunID = s.RunID join testPass t on t.prime = r.testPassId and s.is_current=1 group by t.name,t.firstCreated,s.status order by t.firstCreated) as tbl join testPass tp on tbl.name = tp.name group by tbl.name order by tp.prime DESC';
	
	pool.getConnection(function (err, connection) {
		connection.query(query, function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["TestPass"] = rows;
				res.json(data);
			} else if (rows.length === 0) {
				//Error code 2 = no rows in db.
				data["error"] = 2;
				data["TestPass"] = 'No products Found..';
				res.json(data);
			} else {
				data["TestPass"] = 'error while performing query';
				res.json(data);
				console.log('Error while performing Query: ' + err);
			}
		});
	
	});
});

//Summary List
app.get('/api/list/Summary:name', function (req, res) {
    var name = req.params.name;
    var data = {
        "error": 1,
        "Summary": ""
    };
    var query = 'select tbl.classname as classname, o.owner as owner, tbl.pass as pass, tbl.fail as fail, tbl.skip as skip from (select classname, max(fail) as fail,max(pass) as pass,max(skip) as skip from (select s.classname,(CASE WHEN s.status = "FAIL" THEN count(s.status) END) as "fail",(CASE WHEN s.status = "PASS" THEN count(s.status) END) as "pass",(CASE WHEN s.status = "SKIP" THEN count(s.status) END) as "skip" from status s join run r on r.RunID = s.RunID where r.testPassId=(select prime from testPass where name="'+name+'") and s.is_current=1 group by s.classname, s.status order by s.classname) as tbl group by classname) tbl, ownership o where o.classname = tbl.classname';
    pool.getConnection(function (err, connection) {
		connection.query(query, function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["Summary"] = rows;
				res.json(data);
				console.log('data from server is '+ data);
			} else if (rows.length === 0) {
				//Error code 2 = no rows in db.
				data["error"] = 2;
				data["Summary"] = 'No products Found..';
				res.json(data);
			} else {
				data["Summary"] = 'error while performing query';
				res.json(data);
				console.log('Error while performing Summary list Query: ' + err);
			}
		});
	
	});
});

//Error List
app.get('/api/list/Error:name', function (req, res) {
    var name = req.params.name;
    var data = {
        "error": 1,
        "ErrorList": ""
    };
    var query = 'select s.exception_name, count(s.status) as count from status s where s.RunID in (select RunID from run where testPassId=(select prime from testPass where name="'+name+'")) and s.is_current=1 and s.status<>"PASS" group by s.exception_name order by s.exception_name';
    pool.getConnection(function (err, connection) {
		connection.query(query, function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["ErrorList"] = rows;
				res.json(data);
				console.log('data from server is '+ data);
			} else if (rows.length === 0) {
				//Error code 2 = no rows in db.
				data["error"] = 2;
				data["ErrorList"] = 'No products Found..';
				res.json(data);
			} else {
				data["ErrorList"] = 'error while performing query';
				res.json(data);
				console.log('Error while performing Error list Query: ' + err);
			}
		});
	
	});
});


//Class level List
app.get('/api/list/Class', function (req, res) {
    var name = req.query.testPassName;
    var className = req.query.className;
    var data = {
        "error": 1,
        "ClassSummary": ""
    };
    var query = 'select s.TestCaseID, s.status, s.entryTime, s.assignedto, s.exception_name, s.exception_category, s.methodname, s.executionTime, IF(s.status = "PASS", NULL, f.pathOfTheFile) as filePath from status s, logs l, fileuploads f where s.RunID=l.RunId and l.fileid=f.ID and s.RunID in (select RunID from run where testPassId=(select prime from testPass where name="'+name+'")) and s.classname="'+className+'" and is_current="1" order by s.classname';
    pool.getConnection(function (err, connection) {
		connection.query(query, function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["ClassSummary"] = rows;
				res.json(data);
				console.log('data from server is '+ data);
			} else if (rows.length === 0) {
				//Error code 2 = no rows in db.
				data["error"] = 2;
				data["ClassSummary"] = 'No test cases Found..';
				res.json(data);
			} else {
				data["ClassSummary"] = 'error while performing query';
				res.json(data);
				console.log('Error while performing Summary list Query: ' + err);
			}
		});
	
	});
});

//Error level List
app.get('/api/list/exception', function (req, res) {
    var name = req.query.testPassName;
    var exceptionName = req.query.exceptionName;
    var data = {
        "error": 1,
        "ClassSummary": ""
    };
    var query = 'select TestCaseID,status,entryTime,assignedto,exception_name, exception_category,methodname,executionTime,classname from status where RunID in (select RunID from run where testPassId=(select prime from testPass where name="'+name+'")) and exception_name="'+exceptionName+'" and is_current=1 order by classname';
    console.log(query)
    pool.getConnection(function (err, connection) {
		connection.query(query, function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["ExceptionSummary"] = rows;
				res.json(data);
				console.log('data from server is '+ data);
			} else if (rows.length === 0) {
				//Error code 2 = no rows in db.
				data["error"] = 2;
				data["ExceptionSummary"] = 'No test cases Found..';
				res.json(data);
			} else {
				data["ExceptionSummary"] = 'error while performing query';
				res.json(data);
				console.log('Error while performing Exception Summary list Query: ' + err);
			}
		});
	
	});
});



//LIST Product by ID
app.get('/api/list/:id', function (req, res) {
	var id = req.params.id;
	var data = {
        "error": 1,
        "product": ""
    };
	
	console.log("GET request :: /list/" + id);
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from products WHERE id = ?', id, function (err, rows, fields) {
			connection.release();
			
			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["product"] = rows;
				res.json(data);
			} else {
				data["product"] = 'No product Found..';
				res.json(data);
				console.log('Error while performing Query: ' + err);
			}
		});
	
	});
});

//INSERT new product
app.post('/api/insert', function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price;
    var data = {
        "error": 1,
        "products": ""
    };
	console.log('POST Request :: /insert: ');
    if (!!name && !!description && !!price) {
		pool.getConnection(function (err, connection) {
			connection.query("INSERT INTO products SET name = ?, description = ?, price = ?",[name,  description, price], function (err, rows, fields) {
				if (!!err) {
					data["products"] = "Error Adding data";
					console.log(err);
				} else {
					data["error"] = 0;
					data["products"] = "Product Added Successfully";
					console.log("Added: " + [name, description, price]);
				}
				res.json(data);
			});
        });
    } else {
        data["products"] = "Please provide all required data (i.e : name, desc, price)";
        res.json(data);
    }
});

app.post('/api/delete', function (req, res) {
    var id = req.body.id;
    var data = {
        "error": 1,
        "product": ""
    };
	console.log('DELETE Request :: /delete: ' + id);
    if (!!id) {
		pool.getConnection(function (err, connection) {
			connection.query("DELETE FROM products WHERE id=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error deleting data";
					console.log(err);
				} else {
					data["product"] = 0;
					data["product"] = "Delete product Successfully";
					console.log("Deleted: " + id);
				}
				res.json(data);
			});
		});
    } else {
        data["product"] = "Please provide all required data (i.e : id ) & must be a integer";
        res.json(data);
    }
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("dummy app listening at: " + host + ":" + port);

})