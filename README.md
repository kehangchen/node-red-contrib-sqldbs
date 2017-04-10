node-red-contrib-sqldbs
=========================
[Node-RED](http://nodered.org) nodes to work with a database 
in a database that can be MSSQL, MySQL, SQLite, and PostgreSQL.

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

-- Query Type that the query is for.  It can be either select, insert, update, and delete


Output node usage:
------------------

The output node will have the value from msg.payload.  

So for example, you might create a function node that flows into your sqldb output node
with code like this:

```
msg.payload = 
{
  TS : 'TIMESTAMP',
  SCREENNAME : msg.tweet.user.screen_name,
  TWEET : msg.payload,
  SENTIMENT : msg.sentiment.score,
  LOCATION : msg.location
}
return msg;
```

Authors
-------
* [Kehang Chen]
