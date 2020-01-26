/**
 * Created by abhilashak on 10/14/18.
 */
// set up ========================
var express = require('express');

var app = express();                               //create our app w/ express
var http = require('http');
var https = require('https');
var oracledb = require('oracledb');
// var hostname = '<your oracle db connection hostname>';
var hostname = 'localhost';

console.log('Hostname is : ' + hostname);

let _user = 'dedale';
let _password = 'dedale';
connstr = "WENDYS";
//    "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521)) (CONNECT_DATA =(SERVER = DEDICATED)(SID = parade)))";

console.log('Starting to get oracle connection . . . . .. ');


oracledb.getConnection(
    {
        user: _user,
        password: _password,
        connectString: connstr
        //connectString : "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(CONNECT_DATA =(SID= ORCL)))"
    },
    function (err, connection) {
        console.log('Starting to establish a connection. . . . . ');
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('Connection was successful!');

        connection.close(
            function (err) {
                if (err) {
                    console.error(err.message);
                    return;
                }
            });
    });


app.get('/api/customapp/loadinitialdata', function (req, res) {

    console.log("inside loadinitialdata");

    var rslt = new Object();
    oracledb.getConnection(
        {
            user: _user,
            password: _password,
            connectString: connstr
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                res.render('index', {result: 'Oracle error!'});
                return;
            }
            connection.execute(
                "select * from test",
                //Above is a sample query that returns some result
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }

                    rslt = JSON.stringify(result);
                    res.json(JSON.parse(rslt));

                    connection.release(
                        function (err) {
                            console.log('Releasing connection');
                            if (err) {
                                console.error(err.message);
                            }
                        });
                });
        });


});


var distDir = 'C:/Users/Alain/Document/OracleAngular'; //something like '/Users/AK/MyAngularProjects/CustomApp'
app.use(express.static(distDir));


// listen (start app with node server.js) ======================================
app.listen(8081);
console.log("App listening on port 8081");

