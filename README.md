node-red-contrib-sqldbs
=========================
[Node-RED](http://nodered.org) nodes to work with a database 
that can be either MSSQL, MySQL, SQLite, or PostgreSQL server.

Install
-------
Install from [npm](http://npmjs.org)
```
npm install node-red-contrib-sqldbs
```

Usage
-----
This package contains one node to select, update, insert, or delete records from a specified database engine.  It can 
work with Microsoft SQL Server, MySql, SQLite, and ProgreSQL by selecting proper database dialect


Query node usage:
-----------------

You will need to fill in the following fields:

-- Database host name.

-- User name to access the database.

-- Password for the user name above.

-- Database name

-- Dialect for different database engines, currently, it supports MSSQL, MYSQL, SQLite, and PostgreSQL. 

-- Query Type that the query is for.  It can be either select, insert, update, and delete


Node usage:
------------------

The returned data will be stored in msg.payload and it will contains two array.  
You should just need to access the first object of the array to retrieve data
returned from the database query.  

So for example, you might create a function node that flows into your sqldbs node
with code like this to find if the user exists in the table (please make a special
note to "as count".  It will serve as the key of the return to retrieve the data. 
However, if you use "select * from user", the column name will serve as the key
name):

```
msg.topic = "select count(*) as count from user where username = '" + msg.payload.username + "'";
return msg;
```

Then, you can use a switch function after sqldbs node to check if the user exist:

```
if msg.payload[0][0].count > 0 
if msg.payload[0][0].count <= 0
```

Currently, only MSSQL server and MySQL have been tested but not others.  Please let
me know if you have any issue.

Authors
-------
* Kehang Chen - [kehangchen@yahoo.com](mailto:kehangchen@yahoo.com)
