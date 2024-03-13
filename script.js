
const toastContainer = document.getElementById('liveToastContainer');
let books_showing = false;

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

            } else if (res.status === 500) {
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
        <th>Book Name</th>
        <th>Author</th>
        <th>Category</th>
    </tr>`;
            for (key in res) {
                let book_name = res[key]["book_name"];
                let author_name = res[key]["author"];
                let category = res[key]["category"];
                let tr = document.createElement("tr");
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

function check_connection() {
    fetch("http://localhost:3000/check_connection").then((res) => {
        if (res.status === 200) {
            showToast("Connected to the database!");
        } else {
            showToast("Not connected to the database!");
        }
    })
}
