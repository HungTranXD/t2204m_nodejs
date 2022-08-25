const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log("Server is running...");
})

const mysql = require("mysql");
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", //XAMPP: để trống
    database: "t2204m",
    port: 3306
});
// conn viet tat connection

//lam API danh sach category
app.get("/api-get-category", function (req, res){
    const sql_txt = "SELECT * FROM category";
    conn.query(sql_txt, function (err, data) {
      if(err) res.send("Error");
      else res.send(data);
    })
})
//lam API danh sach product
app.get("/api-get-product", function (req, res){
    const sql_txt = "SELECT category_id FROM product";
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})
//lam API danh sach product kèm category
app.get("/api-get-product-and-category", function (req, res){
    const sql_txt = "SELECT product.id, product.name AS product_name, product.price, product.category_id, category.name AS category_name  FROM product LEFT JOIN category ON product.category_id = category.id";
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})
//lam api thong ke so luong san pham theo loai san pham
app.get("/api-get-productnumber-in-category", function (req, res){
    const sql_txt = "SELECT COUNT(*) AS number, category_id FROM product GROUP BY category_id";
    conn.query(sql_txt, function (err, data){
        if(err) res.send("Error");
        else res.send(data);
    })
})


app.get("/", function (req, res) {
    res.send("Hello World!");
})
app.get("/bongda", function (req, res) {
    res.send("Bóng đá 24h");
})