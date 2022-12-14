const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log("Server is running...");
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const mysql = require("mysql");
const conn = mysql.createConnection({
    host: "139.180.186.20",
    user: "t2204m",
    password: "t2204m123",
    database: "t2204m",
    port: 3306
});
// const conn = mysql.createConnection({
//     host: "db4free.net",
//     user: "hung_t2204m",
//     password: "t2204m123",
//     database: "tranhung_nodejs",
//     port: 3306
// });
// const conn = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "", //XAMPP: để trống
//     database: "eproject",
//     port: 3306
// });



// ---------------------------------- E-PROJECT --------------------------------------


// --------------------- API for latest posts page and filter ------------------------
//API get list of all continents
app.get("/api-get-continent", function (req, res){
    const sql_txt = "SELECT * FROM nhom3_continent ORDER BY id";
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get list of all countries
app.get("/api-get-countries", function (req, res){
    const sql_txt = "SELECT code, name AS country_name, continent_id FROM nhom3_country ORDER BY name ASC";
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get list of countries filter by continent
app.get("/api-country-by-continent", function (req, res){
    const continentId = req.query.continentid;
    const sql_txt = `SELECT nhom3_country.code, nhom3_country.name AS country_name, nhom3_country.continent_id, nhom3_continent.name AS continent_name FROM nhom3_country LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_country.continent_id = ${continentId} ORDER BY nhom3_country.name ASC`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})


// ---------------- 1. WITHOUT SERVER PAGINATION --------------------
//API get lapi-top-bridge-of-continentist of bridges (All nhom3_bridge at once)
app.get("/api-get-bridge", function (req, res){
    const sql_txt = "SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id ORDER BY nhom3_bridge.id";
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get list of bridges filter by continent
app.get("/api-bridge-by-continent", function (req, res){
    const continentId = req.query.continentid;
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_continent.id = ${continentId} ORDER BY nhom3_bridge.id`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get list of bridges filter by country
app.get("/api-bridge-by-country", function (req, res){
    const countryCode = req.query.countrycode;
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_country.code = "${countryCode}" ORDER BY nhom3_bridge.id`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})


// ---------------- 2. WITH SERVER PAGINATION (THROUGH LIMIT AND OFFSET) --------------------
//API get total number of posts
app.get("/api-get-total-number", function (req, res){
    const continentId = req.query.continentid;
    const countryCode = req.query.countrycode;
    if(continentId === 'all') {
        if(countryCode === 'all') {
            const sql_txt = "SELECT COUNT(id) AS total FROM nhom3_bridge";
            conn.query(sql_txt, function (err, data) {
                if(err) res.send("Error");
                else res.send(data);
            })
        } else {
            const sql_txt = `SELECT COUNT(id) AS total FROM nhom3_bridge WHERE country_code = "${countryCode}"`;
            conn.query(sql_txt, function (err, data) {
                if(err) res.send("Error");
                else res.send(data);
            })
        }
    } else {
        if (countryCode === 'all') {
            const sql_txt = `SELECT COUNT(nhom3_bridge.id) AS total FROM nhom3_bridge LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_continent.id = ${continentId}`;
            conn.query(sql_txt, function (err, data) {
                if(err) res.send("Error");
                else res.send(data);
            })
        } else {
            const sql_txt = `SELECT COUNT(id) AS total FROM nhom3_bridge WHERE country_code = "${countryCode}"`;
            conn.query(sql_txt, function (err, data) {
                if(err) res.send("Error");
                else res.send(data);
            })
        }
    }

})
//API get list of bridges per page (with limit and offset)
app.get("/api-get-bridge-page", function (req, res){
    const continentId = req.query.continentid;
    const countryCode = req.query.countrycode;
    const limit = req.query.limit;
    const offset = req.query.offset;
    if(continentId === 'all') {
        if(countryCode === 'all') {
            const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.id AS continent_id,nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id ORDER BY nhom3_bridge.id LIMIT ${limit} OFFSET ${offset}`;
            conn.query(sql_txt, function (err, data){
                if(err) res.send("Error");
                else res.send(data);
            })
        } else {
            const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.id AS continent_id, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_country.code = "${countryCode}" ORDER BY nhom3_bridge.id LIMIT ${limit} OFFSET ${offset}`;
            conn.query(sql_txt, function (err, data){
                if(err) res.send("Error");
                else res.send(data);
            })
        }
    } else {
        if (countryCode === 'all') {
            const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.id AS continent_id, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_continent.id = ${continentId} ORDER BY nhom3_bridge.id LIMIT ${limit} OFFSET ${offset}`;
            conn.query(sql_txt, function (err, data){
                if(err) res.send("Error");
                else res.send(data);
            })
        } else {
            const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.id AS continent_id, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_country.code = "${countryCode}" ORDER BY nhom3_bridge.id LIMIT ${limit} OFFSET ${offset}`;
            conn.query(sql_txt, function (err, data){
                if(err) res.send("Error");
                else res.send(data);
            })
        }
    }
})


// ---------------------------- API for nhom3_bridge detail page ------------------------------
//API get a nhom3_bridge detail (all it's information)
app.get("/api-bridge-detail", function (req, res){
    const bridgeId = req.query.bridgeid;
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.coordinates, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.main_material, nhom3_bridge_detail.total_length, nhom3_bridge_detail.width, nhom3_bridge_detail.height, nhom3_bridge_detail.longest_span, nhom3_bridge_detail.clearance_below, nhom3_bridge_detail.construction_start, nhom3_bridge_detail.construction_end, nhom3_bridge_detail.opened_date, nhom3_bridge_detail.introduction, nhom3_bridge_detail.history FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_bridge.id = ${bridgeId}`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get all images of a bridge
app.get("/api-bridge-images", function (req, res){
    const bridgeId = req.query.bridgeid;
    const sql_txt = `SELECT * FROM nhom3_image WHERE bridge_id = ${bridgeId}`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})

// ------------------------- API for top lists in home page ----------------------------
//API get all top lists info
app.get("/api-all-top-lists", function (req, res){
    const sql_txt = "SELECT * FROM nhom3_top_list";
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else {
            res.send(data);
        };
    })
})

// -------------------------- API for top list detail page -------------------------------
//- get the top list info (name, description)
app.get("/api-top-list-info", function (req, res){
    const topListId = req.query.toplistid;
    const sql_txt = "SELECT * FROM nhom3_top_list WHERE id = " + topListId;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else {
            res.send(data);
        };
    })
})
//- get the top 10 bridges in the top list
app.get("/api-top-10-bridges", function (req, res){
    const sortOrder = req.query.sortorder;
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.coordinates, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.main_material, nhom3_bridge_detail.total_length, nhom3_bridge_detail.width, nhom3_bridge_detail.height, nhom3_bridge_detail.longest_span, nhom3_bridge_detail.clearance_below, nhom3_bridge_detail.construction_start, nhom3_bridge_detail.construction_end, nhom3_bridge_detail.opened_date, nhom3_bridge_detail.oldest_order, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id ORDER BY nhom3_bridge_detail.${sortOrder} DESC LIMIT 10`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else {
            res.send(data);
        };
    })
})

// -------------------------- API for search result page -------------------------------
//API search name of bridges
app.get("/search-bridge", function (req, res){
    const q = req.query.q;
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.id AS continent_id, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_bridge.name LIKE '%${q}%'`;
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})

// ----------------------------- API for nhom3_continent page -------------------------------
//API get a single nhom3_continent info (for bridges-by-continent page)
app.get("/api-single-continent-info", function (req, res){
    const continentId = req.query.continentid;
    const sql_txt = `SELECT * FROM nhom3_continent WHERE id = ${continentId}`;
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})

//API get images filter by continent
app.get("/api-get-continent-images", function (req, res){
    const continentId = req.query.continentid;
    const sql_txt = `SELECT nhom3_image.id, nhom3_image.title, nhom3_image.url, nhom3_image.bridge_id, nhom3_bridge.name FROM nhom3_image LEFT JOIN nhom3_bridge ON nhom3_image.bridge_id = nhom3_bridge.id WHERE nhom3_image.bridge_id IN (SELECT id FROM nhom3_bridge WHERE country_code IN (SELECT code FROM nhom3_country WHERE continent_id = ${continentId}))`;
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})

//API get longest, highest, tallest nhom3_bridge in each continent
app.get("/api-top-bridge-of-continent", function (req, res){
    const continentId = req.query.continentid;
    const sortOrder = req.query.sortorder;
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.coordinates, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.main_material, nhom3_bridge_detail.total_length, nhom3_bridge_detail.width, nhom3_bridge_detail.height, nhom3_bridge_detail.longest_span, nhom3_bridge_detail.clearance_below, nhom3_bridge_detail.construction_start, nhom3_bridge_detail.construction_end, nhom3_bridge_detail.opened_date, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_continent.id = ${continentId} ORDER BY nhom3_bridge_detail.${sortOrder} DESC LIMIT 1`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else {
            res.send(data);
        };
    })
})



// ----------------------------- API for gallery page -------------------------------
//API get all images
app.get("/api-get-all-images", function (req, res){
    const sql_txt = `SELECT nhom3_image.id, nhom3_image.title, nhom3_image.url, nhom3_image.bridge_id, nhom3_bridge.name FROM nhom3_image LEFT JOIN nhom3_bridge ON nhom3_image.bridge_id = nhom3_bridge.id`;
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})


// -------------------------- API for historical great bridges page-------------------------------
app.get("/historical-great-bridges", function (req, res){
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.id AS continent_id, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_bridge.id IN (20, 95, 6, 4, 7, 96, 34, 98, 50)`;
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})

// -------------------------- API for iconic bridges page-------------------------------
app.get("/iconic-bridges", function (req, res){
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.id AS continent_id, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_bridge.id IN (102, 11, 103, 17)`;
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})

// -------------------------- API for modern great bridges page-------------------------------
app.get("/modern-great-bridges", function (req, res){
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.id AS continent_id, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_bridge.id IN (2, 1, 3, 8, 15, 26, 17)`;
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})
// -------------------------- API for high-level achievements bridges page-------------------------------
app.get("/high-level-achievements", function (req, res){
    const sql_txt = `SELECT nhom3_bridge.id, nhom3_bridge.name AS bridge_name, nhom3_bridge.thumbnail, nhom3_bridge.posted_date, nhom3_bridge_detail.detail_location, nhom3_bridge.country_code, nhom3_country.name AS country_name, nhom3_continent.id AS continent_id, nhom3_continent.name AS continent_name, nhom3_bridge_detail.type, nhom3_bridge_detail.total_length, nhom3_bridge_detail.introduction FROM nhom3_bridge LEFT JOIN nhom3_bridge_detail ON nhom3_bridge.id = nhom3_bridge_detail.id LEFT JOIN nhom3_country ON nhom3_bridge.country_code = nhom3_country.code LEFT JOIN nhom3_continent ON nhom3_country.continent_id = nhom3_continent.id WHERE nhom3_bridge.id IN (54, 46, 99, 90, 100, 13, 101, 88, 89)`;
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})