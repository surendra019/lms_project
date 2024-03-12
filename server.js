const mysql = require('mysql');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "library"
});
app.use(bodyParser.json());
app.use(cors());

app.post('/add_entry', (req, res) => {
    let sql = `insert into books(book_name, author, category) values("${req.body.book_name}", "${req.body.author_name}", "${req.body.category}")`;

    con.query(sql, (err, result) => {
        if (err) throw err;
        else {
            console.log(result);
        }

    })
    res.status(201).send("Success");
})

app.post('/remove_entry', async (req, res) => {
    let sql = `delete from books where book_name = "${req.body.book_name}" and author = "${req.body.author_name}"`;

    // let sql = "delete from books where id = 1";
    con.query(sql, (err, result) => {
        if (err) throw err;
        else {
            if(result.affectedRows==0){
                res.status(200).send("No such book found");
            }
        }
    })

})

const PORT = 3000; // Choose any port you like
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

