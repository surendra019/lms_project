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
    host: "sql6.freesqldatabase.com",
    user: "sql6702090",
    password: "mMD6CXG9y9",
    port: 3306
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
                host: "sql6.freesqldatabase.com",
                user: "sql6702090",
                password: "mMD6CXG9y9",
                database: "library"
            })
            con.connect((err) => {
                if (err) console.log(err);
                else {
                    console.log(`successfully connected to the database ${database}`)
                    resolve();
                }
            })
            con.release();

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
    con.release();

    })
}



async function create_tables() {
    // await create_database_if_not_exists("library");
    create_table_if_not_exists("books", "id int auto_increment key", "book_name varchar(20)", "author varchar(15)", "category varchar(10)");
    create_table_if_not_exists("borrowers", "id int auto_increment key", "borrowed_book_name varchar(30)", "borrowed_book_category varchar(20)", "borrowed_book_author varchar(20)", "borrower_name varchar(20)", "borrower_contact_no bigint", "borrower_gender varchar(10)", "borrowed_date date");

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
        con.release();

    })
    
    res.status(201).send("Successfully added the book: " + req.body.book_name);
})

// remove a book from the 'books' table in the database 'library'
app.post('/remove_entry', async (req, res) => {
    let sql = `delete from books where id = ${req.body.id}`;
    console.log(sql);
    // let sql = "delete from books where id = 1";
    con.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({msg: "Error removing a book: " + err.sqlMessage});
            return;
        }
        else if (result.affectedRows === 0) {
            res.status(201).json({msg: "There is no book with id: " + req.body.id});
            return;
        }
        res.status(201).json({msg: "Successfully removed the book!"});
        con.release();

    })

})

app.get('/show_books', (req, res) => {
    let sql = `select * from books`;
    con.query(sql, (err, result) => {
        if (err) {
            res.status(500).send("An unexpected error occurred: " + err);
            console.log(err)
        } else {
            res.status(200).send(result);
        }
        con.release();

    })
})

app.get('/show_borrowers', (req, res) => {
    let sql = `select * from borrowers`;
    con.query(sql, (err, result) => {
        if (err) {
            res.status(500).send("An unexpected error occurred: " + err.sqlMessage);
        } else {
            res.status(200).send(result);
        }
        con.release();

    })
})

app.post('/add_borrower', (req, res) => {
    console.log(req.body["borrower_book_id"])
    con.query(`select * from books where id = ${req.body["borrower_book_id"]}`, (err, result) => {
        con.release();
        if (err) {
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                res.status(500).send("The book is not present in the database!");
            }
        


        } else {
            con.query(`select * from books where id = ${req.body["borrower_book_id"]}`, (err, result) => {
                con.release();
                if (err) {
                    res.status(500).send("An unexpected error occurred: " + err.sqlMessage);
                }
                else {
                    const book_data = result;

                    console.log(book_data.book_name);
                    con.query(`delete from books where id = ${req.body["borrower_book_id"]}`, (err, result) => {

                        if (err) {
                            console.log(err);
                            res.status(500).send("an error encountered!");
                        } else {
                            if (result.affectedRows !== 0) {
                                con.query(`insert into borrowers(id, borrowed_book_name, borrowed_book_category, borrowed_book_author, borrower_name, borrower_contact_no, borrower_gender, borrowed_date) values(${req.body["borrower_book_id"]}, "${book_data[0].book_name}", "${book_data[0]["category"]}", "${book_data[0]["author"]}", "${req.body["borrower_name"]}", ${req.body["borrower_contact_no"]}, "${req.body["gender"]}", current_date())`, (err, result) => {
                                    if (err) {
                                        res.status(500).send("an error encountered!");
                                        console.log(err);
                                    } else {

                                        res.status(200).send("borrower added successfully");
                                    }
                                })
                            } else {
                                res.status(404).send("The book is not present in the database!");
                            }





                        }
                    })
                }

            })



        }
    })
    // res.statusMessage(200).send()
})

app.post('/remove_borrower', (req, res) => {

    // console.log(req.body.id)
    con.query(`select * from borrowers where id = ${req.body.id}`, (err, result) => {
        if (err) res.status(500).json({ msg: err.sqlMessage });
        else {
            // console.log(req.body.id);
            console.log(result.length);
            if (result.length > 0) {
                con.query(`delete from borrowers where id = ${result[0].id}`, (err, result) => {
                    if (err) res.status(500).json({ msg: "an error encountered while removing the borrower" });
                    else {
                        res.status(201).json({ borrower_name: result.borrower_name, msg: "borrower successfully removed!" });
                        return;
                    }
                })
            } else {
                // console.log(result.length);
                res.status(201).json({ msg: "no borrower with this id" });
                return;
            }
            // con.query(`select * from borrower`)

        }
    });

    // res.status(201).send("success");
})
// hoisting the nodejs server locally over a port
const PORT = 3000; // Choose any port you like
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

