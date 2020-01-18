const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 2000
const { sqlDB } = require('./database')

app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send('WELCOME TO FAKE API')
})

// MOVIES //
app.get('/movies', (req, res) => {
    req.query.orderBy = 'ORDER BY ' + req.query.orderBy
    console.log(req.query)

    let sql = `SELECT id, movieName, poster, synopsis, year(releaseDate) as year
               FROM m_movies
               ${req.query.orderBy}
               ${req.query.orderDir}
               LIMIT ${req.query.limit}
               OFFSET ${req.query.offset}`

    sqlDB.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(results)
    })
})

app.get('/movieByKeyword', (req, res) => {
    let sql = `SELECT id, movieName, poster, synopsis, year(releaseDate) as year
               FROM m_movies
               WHERE movieName LIKE '%${req.query.keyword}%' OR synopsis LIKE '%${req.query.keyword}%'`

    sqlDB.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(results)
    })
})

app.get('/movieById', (req, res) => {
    let sql = `SELECT id, movieName, trailer, poster, synopsis, year(releaseDate) as year, country, lang,
               concat(hour(duration), if(hour(duration) > 1, ' hours ', ' hour '), minute(duration), ' minutes') as duration
               FROM m_movies
               WHERE id = ${req.query.idMov}`

    sqlDB.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(results[0])
    })
})

app.get('/movieGenres', (req,res) => {
    let sql = `SELECT g.id, genreName
               FROM m_movies m
	           JOIN con_moviegenre c ON m.id = c.idMov
               JOIN m_genre g ON g.id = c.idGen
               WHERE m.id = ${req.query.idMov}`

    sqlDB.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(results)
    })
})
// MOVIES //


// ARTIST //
app.get('/allArtist', (req,res) => {
    let sql = `SELECT id, castName, image FROM m_cast`

    sqlDB.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(results)
    })
})

app.get('/movieArtists', (req,res) => {
    let sql = `SELECT m.id, castName
               FROM m_cast m
               JOIN con_moviecast cm ON m.id = cm.idCast
               WHERE idMov = ${req.query.idMov}`

    sqlDB.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(results)
    })
})

app.get('/moviesByArtist', (req, res) => {
    let sql = `SELECT cm.idMov as id, movieName, poster, synopsis, year(releaseDate) as year, castName
               FROM m_cast m
               JOIN con_moviecast cm ON m.id = cm.idCast
               JOIN m_movies mv ON mv.id = cm.idMov
               WHERE idCast = ${req.query.idArtist}`

    sqlDB.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(results)
    })
})
// ARTIST //


// GENRE //
app.get('/allGenres', (req, res) => {
    let sql = `SELECT * FROM m_genre ORDER BY genreName`

    sqlDB.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(results)
    })
})

app.get('/moviesByGenre', (req, res) => {
    let sql = `SELECT m.id, movieName, poster, synopsis, year(releaseDate) as year, genreName
               FROM m_movies m
	           JOIN con_moviegenre c ON m.id = c.idMov
               JOIN m_genre g ON g.id = c.idGen
               WHERE g.id = ${req.query.idGenre}`

    sqlDB.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).send(results)
    })
})
// GENRE //


app.listen(port, () => console.log('API aktif di port ' + port))