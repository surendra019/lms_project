const mysql = require('mysql');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
let database;




//middlewares

app.use(bodyParser.json());
app.use(cors());

//creating a connection to the server
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
});

// checks if the connection is established
con.connect((err) => {
    if (err) console.error(err);
    else {
        console.log("Connection to the server is successful");
    }
})



// create a 'library' database if there isn't exists one
function create_database_if_not_exists(database_name) {
    return new Promise((resolve, reject) => {
        con.query(`create database if not exists ${database_name}`, (err, result) => {
            if (err) console.log(err);
            else if (result.warningCount === 0) {
                console.log("Database created successfully");

            } else {
                console.log("The database already exists");
            }
            con.end();

            database = 'library';
            con = mysql.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "root",
                database: "library"
            })
            con.connect((err) => {
                if (err) console.log(err);
                else {
                    console.log(`successfully connected to the database ${database}`)
                    resolve();
                }
            })

        });
    })
}



// create the required tables if they won't exist in the library database
async function create_table_if_not_exists(table_name, ...args) {
    let sql = `CREATE TABLE ${table_name}(`;

    for (i in args) {
        sql += args[i];
        sql += ",";

    }
    sql = sql.slice(0, -1);
    sql += ")";



    con.query(sql, (err, result) => {

        if (err) console.log(err.sqlMessage);
        else {
            console.log(`The ${table_name} table is successfully created`);
        }


    })
}



async function create_tables() {
    await create_database_if_not_exists("library");
    create_table_if_not_exists("books", "id int auto_increment key", "book_name varchar(20)", "author varchar(15)", "category varchar(10)");
    create_table_if_not_exists("borrowers", "id int auto_increment key", "borrower_name varchar(20)", "borrower_contact_no bigint", "borrower_gender varchar(10)");

}

create_tables();



// Routing

app.get('/check_connection', (req, res) => {
    res.status(200).send("Connected to the database successfully!")
})

// a post request to add a book into the 'books' table in the database 'library'
app.post('/add_entry', (req, res) => {
    let sql = `insert into books(book_name, author, category) values("${req.body.book_name}", "${req.body.author_name}", "${req.body.category}")`;

    con.query(sql, (err, result) => {
        if (err) {
            console.log(err.sqlMessage)
            res.status(500).send("Error adding a book : " + err.sqlMessage);
            return;
        }

    })
    res.status(201).send("Successfully added the book: " + req.body.book_name);
})

// remove a book from the 'books' table in the database 'library'
app.post('/remove_entry', async (req, res) => {
    let sql = `delete from books where book_name = "${req.body.book_name}" and author = "${req.body.author_name}"`;

    // let sql = "delete from books where id = 1";
    con.query(sql, (err, result) => {
        if (err) {
            res.status(500).send("Error removing a book: " + err.sqlMessage);
            return;
        }
        else if (result.affectedRows === 0) {
            res.status(204).send("There is no book named " + req.body.book_name);
            return;
        }
        res.status(201).send("Successfully removed the book: " + req.body.book_name);

    })

})

app.get('/show_books', (req, res) => {
    let sql = `select * from books`;
    con.query(sql, (err, result) => {
        if (err) {
            res.status(500).send("An unexpected error occurred: " + err.sqlMessage);
        } else {
            res.status(200).send(result);
        }
    })
})

app.post('/add_borrower', (req, res) => {
    con.query(`select * from books where id = ${req.body["id"]}`, (err, result) => {
        if (err) {
            if(err.code === 'ER_BAD_FIELD_ERROR'){
                res.status(500).send("The book is not present in the database!");
            }
        }else{
            res.status(200).send("success");
        }
    })
    // res.statusMessage(200).send()
})

// hoisting the nodejs server locally over a port
const PORT = 3000; // Choose any port you like
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

