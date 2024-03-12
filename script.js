
const toastContainer = document.getElementById('liveToastContainer');

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
            console.log(res);
        })
    } else {

        showToast("Please fill all the fields");
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
            return res.text();
        }).then(res =>{
            showToast("No such book present");
        })
    }else{
        showToast("Please enter all the fields");
    }


}

function show_books(){
    fetch("http://localhost:/3000/show_books", (res)=>{
        
    })
}