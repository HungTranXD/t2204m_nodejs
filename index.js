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
    host: "db4free.net",
    user: "hung_t2204m",
    password: "t2204m123", //XAMPP: để trống
    database: "tranhung_nodejs",
    port: 3306
});
// conn viet tat connection

// //lam API danh sach category
// app.get("/api-get-category", function (req, res){
//     const sql_txt = "SELECT * FROM category";
//     conn.query(sql_txt, function (err, data) {
//       if(err) res.send("Error");
//       else res.send(data);
//     })
// })
//
// //lam API danh sach product
// app.get("/api-get-product", function (req, res){
//     const sql_txt = "SELECT category_id FROM product";
//     conn.query(sql_txt, function (err, data){
//         if(err) res.send("Error");
//         else res.send(data);
//     })
// })
// //lam API danh sach product kèm category
// app.get("/api-get-product-and-category", function (req, res){
//     const sql_txt = "SELECT product.id, product.name AS product_name, product.price, product.category_id, category.name AS category_name  FROM product LEFT JOIN category ON product.category_id = category.id";
//     conn.query(sql_txt, function (err, data){
//         if(err) res.send("Error");
//         else res.send(data);
//     })
// })
// //lam api thong ke so luong san pham theo loai san pham
// app.get("/api-get-productnumber-in-category", function (req, res){
//     const sql_txt = "SELECT COUNT(*) AS number, category_id FROM product GROUP BY category_id";
//     conn.query(sql_txt, function (err, data){
//         if(err) res.send("Error");
//         else res.send(data);
//     })
// })
// // Tham số
// // Lọc theo danh mục
// app.get("/api-product-by-category", function (req, res){
//     const categoryId = req.query.categoryid;
//     const sql_txt = "SELECT product.id, product.name AS product_name, product.price, product.category_id, category.name AS category_name  FROM product LEFT JOIN category ON product.category_id = category.id WHERE product.category_id =  " + categoryId;
//     conn.query(sql_txt, function (err, data){
//         if(err) res.send("Error");
//         else res.send(data);
//     })
// })
// // Tìm kiếm sản phẩm
// app.get("/search-product", function (req, res){
//     const q = req.query.q;
//     const sql_txt = `SELECT * FROM product WHERE name LIKE '%${q}%'`;
//     conn.query(sql_txt, function (err, data) {
//         if(err) res.send("Error");
//         else res.send(data);
//     })
// })
// // Chi tiết sản phẩm
// app.get("/detail-product",function (req,res) {
//     const id = req.query.id;
//     const sql_txt = "SELECT * FROM product WHERE id = " + id;
//     conn.query(sql_txt,function (err,data) {
//         if(err) res.send("Error");
//         else if(data.length ==0)
//             res.send("404 not found");
//         else
//             res.send(data[0]);
//     })
// })
//
// app.get("/", function (req, res) {
//     res.send("Hello World!");
// })
// app.get("/bongda", function (req, res) {
//     res.send("Bóng đá 24h");
// })



// -------------- E-PROJECT ----------------
//API get list of all continents
app.get("/api-get-continent", function (req, res){
    const sql_txt = "SELECT * FROM continent ORDER BY id";
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get list of all countries
app.get("/api-get-countries", function (req, res){
    const sql_txt = "SELECT code, name AS country_name, continent_id FROM country ORDER BY name ASC";
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get list of countries filter by continent
app.get("/api-country-by-continent", function (req, res){
    const continentId = req.query.continentid;
    const sql_txt = `SELECT country.code, country.name AS country_name, country.continent_id, continent.name AS continent_name FROM country LEFT JOIN continent ON country.continent_id = continent.id WHERE country.continent_id = ${continentId} ORDER BY country.name ASC`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get list of bridges
app.get("/api-get-bridge", function (req, res){
    const sql_txt = "SELECT bridge.id, bridge.name AS bridge_name, bridge.thumbnail, bridge.posted_date, bridge_detail.detail_location, bridge.country_code, country.name AS country_name, continent.name AS continent_name, bridge_detail.type, bridge_detail.total_length FROM bridge LEFT JOIN bridge_detail ON bridge.id = bridge_detail.id LEFT JOIN country ON bridge.country_code = country.code LEFT JOIN continent ON country.continent_id = continent.id ORDER BY bridge.id";
    conn.query(sql_txt, function (err, data) {
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get list of bridges filter by continent
app.get("/api-bridge-by-continent", function (req, res){
    const continentId = req.query.continentid;
    const sql_txt = `SELECT bridge.id, bridge.name AS bridge_name, bridge.thumbnail, bridge.posted_date, bridge_detail.detail_location, bridge.country_code, country.name AS country_name, continent.name AS continent_name, bridge_detail.type, bridge_detail.total_length FROM bridge LEFT JOIN bridge_detail ON bridge.id = bridge_detail.id LEFT JOIN country ON bridge.country_code = country.code LEFT JOIN continent ON country.continent_id = continent.id WHERE continent.id = ${continentId} ORDER BY bridge.id`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})
//API get list of bridges filter by country
app.get("/api-bridge-by-country", function (req, res){
    const countryCode = req.query.countrycode;
    const sql_txt = `SELECT bridge.id, bridge.name AS bridge_name, bridge.thumbnail, bridge.posted_date, bridge_detail.detail_location, bridge.country_code, country.name AS country_name, continent.name AS continent_name, bridge_detail.type, bridge_detail.total_length FROM bridge LEFT JOIN bridge_detail ON bridge.id = bridge_detail.id LEFT JOIN country ON bridge.country_code = country.code LEFT JOIN continent ON country.continent_id = continent.id WHERE country.code = ${countryCode} ORDER BY bridge.id`;
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})
