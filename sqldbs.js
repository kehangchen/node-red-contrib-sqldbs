/**
 * Copyright 2013 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function(RED) {
    "use strict";
    var reconnect = RED.settings.sqldbsReconnectTime || 30000;
    var Sequelize = require('sequelize');
    var util = require("util");
    function sqldbsNode(n) {
        console.dir(n);
		RED.nodes.createNode(this,n);
        this.host = n.host;
        this.port = n.port;
        this.tz = n.tz || "local";
        this.connected = false;
        this.connecting = false;
        this.dbname = n.db;
        this.dialect = n.dialect;
        var node = this;

        function doConnect() {
            console.log("dialect: " + node.dialect);
			node.connecting = true;
            //console.log(node.credentials.password);
			node.connection = new Sequelize(node.dbname, node.credentials.user, node.credentials.password, {
                host: node.host,
                port: node.port,
                dialect: node.dialect,
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000
                },
            });
			console.dir(node.connection);

            node.connection.sync().then(function() {
                node.connected = true;
                util.log("Connection successful for database " + node.dbname + " with user " + node.credentials.user);
            }, function(err) {
                node.connected = false;
                util.log("Connection failed for database " + node.dbname + " with user " + node.credentials.user + ". Retry...");
                node.error(err);
                doConnect();
            });
        }
        this.connect = function() {
            //console.log("calling connect");
			if (!this.connected && !this.connecting) {
                doConnect();
            }
        }
        this.on('close', function (done) {
            //console.log("close is called");
            if (this.tick) { clearTimeout(this.tick); }
            //console.log("close is called 1");
            if (this.connection) {
                //console.log("close is called 2");
                try {
                    /*node.connection.connectionManager.close()(function(err) {
                        util.log("connection is closing 1");
                        if (err) { 
                            node.error(err);
                            util.log("Closing connection: " + err);
                        }
                        done();
                        util.log("connection is closing 2");
                    })*/;
                } catch (ex) {
                    util.log("Exception: " + ex);
                }
                done();
            } else {
                done();
                util.log("connection is closing");
            }
        });
    }
    RED.nodes.registerType("sqldbsdatabase",sqldbsNode, {
        credentials: {
            user: {type: "text"},
            password: {type: "password"}
        }
    });
    function sqlNodeIn(n) {
        RED.nodes.createNode(this,n);
        //console.dir(n);
		this.mydb = n.mydb;
        this.querytype = n.querytype;
        //console.log("Query Type 2: " + this.querytype);
        this.mydbConfig = RED.nodes.getNode(this.mydb);
        if (this.mydbConfig) {
            this.mydbConfig.connect();
            var node = this;
            node.on("input", function(msg) {
                if (typeof msg.topic === 'string') {
                    //console.dir(node.mydbConfig.connection);
                    var qtype = node.mydbConfig.connection.QueryTypes.SELECT;
                    if (node.querytype == "select")
                        qtype = node.mydbConfig.connection.QueryTypes.SELECT;
                    else if (node.querytype == "insert")
                        qtype = node.mydbConfig.connection.QueryTypes.INSERT;
                    else if (node.querytype == "update")
                        qtype = node.mydbConfig.connection.QueryTypes.UPDATE;
                    else if (node.querytype == "delete")
                        qtype = node.mydbConfig.connection.QueryTypes.DELETE;
                    node.mydbConfig.connection.query(msg.topic, qtype) 
                    .then(function(recordset) {
                        msg.payload = recordset;
                        node.send(msg);
                    })
                    .catch(function(err) {
                        util.log("Error requesting: " + err);
                        node.error(err);
                    })                            
                }
                else {
                    if (typeof msg.topic !== 'string') { node.error("msg.topic : the query is not defined as a string"); }
                }
            });
        }
        else {
            this.error("sqldbs database not configured");
        }
    }
    RED.nodes.registerType("sqldbs",sqlNodeIn);
}