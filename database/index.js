const mysql = require('mysql')

const conn = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'GKIdGIS9IU',
    password: 'T6C5dbOAXG',
    database: 'GKIdGIS9IU',
    timezone: 'UTC'
})

module.exports = {
    sqlDB: conn
}