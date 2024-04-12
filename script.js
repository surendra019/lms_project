
const toastContainer = document.getElementById('liveToastContainer');
let books_showing = false;
let borrowers_showing = false;

function showToast(msg, head = "Information") {
    let code = `<div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <img src="..." class="rounded me-2" alt="...">
            <strong class="me-auto">${head}</strong>
            <small></small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${msg}
        </div>
    </div>`;
    toastContainer.innerHTML = code;
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
}




function add_entry() {
    let book_title_input = document.getElementById('title');
    let book_author_input = document.getElementById('author');
    let category_input = document.getElementById('category');

    if (book_title_input.value != '' && book_author_input.value != '') {
        let book_name = book_title_input.value;
        let author_name = book_author_input.value;
        let category = category_input.value;
        let data = {
            "book_name": book_name,
            "author_name": author_name,
            "category": category
        }
        fetch("http://localhost:3000/add_entry", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => {
            if (res.status === 201) {
                showToast("The book: " + book_name + " has been addeed successfully");
                book_title_input.value = "";
                book_author_input.value = "";
                category_input.value = "";
                if (books_showing) {
                    showRefreshButton(true);
                }
            } else if (res.status === 500) {
                showToast("Error", "An error has occured while adding the book!");
            }
        })
    } else {

        showToast("Please fill all the fields!", "Warning");
    }


}

function remove_entry() {
    let book_title_input = document.getElementById('remove_title');
    let book_author_input = document.getElementById('remove_author');
    if (book_title_input.value != "" && book_author_input.value != "") {
        let book_name = book_title_input.value;
        let author_name = book_author_input.value;
        let data = {
            "book_name": book_name,
            "author_name": author_name
        }
        fetch("http://localhost:3000/remove_entry", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => {
            if (res.status === 201) {
                showToast("The book: " + book_name + " has been removed successfully");
                book_title_input.value = ""
                book_author_input.value = ""
                if (books_showing) {
                    showRefreshButton(true);
                }


            } else if (res.status === 204) {
                showToast("There is no book named " + book_title_input.value);
            }
            else if (res.status === 500) {
                showToast("Error", "An error has occured while removing the book!");
            }
        })
    } else {
        showToast("Please enter all the fields");
    }



}

function show_books() {
    let books_container = document.getElementById("books_show_table");
    let show_books_button = document.getElementById("show_books_button");
    if (!books_showing) {
        fetch("http://localhost:3000/show_books").then(res => {
            if (res.status === 200) {
                return res.json();
            }
            return new Promise((resolve, reject) => {
                reject("an Error has been encountered!");
            })
        }).then((res) => {
            books_container.innerHTML = `<tr>
            <th>ID</th>
        <th>Book Name</th>
        <th>Author</th>
        <th>Category</th>
    </tr>`;
            for (key in res) {
                let book_name = res[key]["book_name"];
                let author_name = res[key]["author"];
                let category = res[key]["category"];
                let book_id = res[key]["id"];
                let tr = document.createElement("tr");
                var td4 = document.createElement("td");
                td4.innerHTML = book_id;
                tr.appendChild(td4);
                var td = document.createElement("td");
                td.innerHTML = book_name;
                tr.appendChild(td);
                var td2 = document.createElement("td");
                td2.innerHTML = author_name;
                tr.appendChild(td2);
                var td3 = document.createElement("td");
                td3.innerHTML = category;
                tr.appendChild(td3);
                
                books_container.appendChild(tr);
            }
            books_showing = true;
            show_books_button.innerHTML = "Hide books";
        })
    } else {
        books_container.innerHTML = "";
        show_books_button.innerHTML = "Show books";
        books_showing = false;
    }

}

function show_borrowers() {
    let borrowers_show_table = document.getElementById("borrowers_show_table");
    let show_borrowers_button = document.getElementById("show_borrowers_button");
    if (!borrowers_showing) {
        fetch("http://localhost:3000/show_borrowers").then(res => {
            if (res.status === 200) {
                return res.json();
            }
            return new Promise((resolve, reject) => {
                reject("an Error has been encountered!");
            })
        }).then((res) => {
            borrowers_show_table.innerHTML = `<tr>
            <th>ID</th>
            <th>Book Name</th>
        <th>Name</th>
        <th>Contact</th>
        <th>Gender</th>
        <th>Date</th>
    </tr>`;
            for (key in res) {
                let borrower_name = res[key]["borrower_name"];
                let borrowed_book_name = res[key]["borrowed_book_name"];
                let contact = res[key]["borrower_contact_no"];
                let gender = res[key]["borrower_gender"];
                let id = res[key]["id"];
                let date = res[key]["borrowed_date"];
                let tr = document.createElement("tr");
                var td4 = document.createElement("td");
                td4.innerHTML = id;
                tr.appendChild(td4);
                var td5 = document.createElement("td");
                td5.innerHTML = borrowed_book_name;
                tr.appendChild(td5)
                var td = document.createElement("td");
                td.innerHTML = borrower_name;
                tr.appendChild(td);
                var td2 = document.createElement("td");
                td2.innerHTML = contact;
                tr.appendChild(td2);
                var td3 = document.createElement("td");
                td3.innerHTML = gender;
                tr.appendChild(td3);
                var td6 = document.createElement("td");
                td6.innerHTML = date;
                tr.appendChild(td6)
                
                borrowers_show_table.appendChild(tr);
            }
            borrowers_showing = true;
            show_borrowers_button.innerHTML = "Hide borrowers";
        })
    } else {
        borrowers_show_table.innerHTML = "";
        show_borrowers_button.innerHTML = "Show borrowers";
        borrowers_showing = false;
    }

}

function check_connection() {
    fetch("http://localhost:3000/check_connection").then((res) => {
        if (res.status === 200) {
            showToast("Connected to the database!");
        } else {
            showToast("Not connected to the database!");
        }
    })
}

function showRefreshButtonBorrowers(a){
    let refresh_button = document.getElementById("refresh_button_borrowers");
    if (a) {
        refresh_button.style.display = "inline";
    }
    else {
        refresh_button.style.display = "none";
    }
}
showRefreshButtonBorrowers(false)

function showRefreshButtonBooks(a) {
    let refresh_button = document.getElementById("refresh_button");
    if (a) {
        refresh_button.style.display = "inline";
    }
    else {
        refresh_button.style.display = "none";
    }
}

showRefreshButtonBooks(false);

function refresh_books_available() {
    let books_container = document.getElementById("books_show_table");
    books_container.innerHTML = "";
    show_books_button.innerHTML = "Show books";
    books_showing = false;
    showRefreshButtonBooks(false);
}

function refresh_borrower_list() {
    let books_container = document.getElementById("borrowers_show_table");
    books_container.innerHTML = "";
    show_books_button.innerHTML = "Show borrowers";
    borrowers_showing = false;
    showRefreshButtonBorrowers(false);
}


function borrow_book() {
    let borrower_name = document.getElementById("borrower_name");
    let borrower_book_id = document.getElementById("borrower_book_id");
    let borrower_contact_no = document.getElementById("borrower_contact_no");
    let val = document.querySelector('input[name="gender"]:checked').value;

    if (borrower_name.value != "" && borrower_contact_no.value != "" && borrower_book_id.value != "" && val != "") {
        fetch("http://localhost:3000/add_borrower", {
            method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({
                "borrower_name": borrower_name.value,
                "borrower_book_id": borrower_book_id.value,
                "borrower_contact_no": borrower_contact_no.value,
                "gender": val
            })
        }).then((res) => {
            return res.text();
        }).then((res) =>{
            showToast(res);
        })
    } else {
        showToast("Please fill all the required fields!");
    }


}




















