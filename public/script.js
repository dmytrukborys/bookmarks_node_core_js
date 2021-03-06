var myBookmarks = [];
var filteredBookmarks = [];
var myCategories = [
    "social networks",
    "learn coding",
    "learn graphic design",
    "pleasures"
];


window.onload = shiftApp;


// Starter function
function shiftApp() {
    myBookmarks = [];
    $.ajax({
        url: 'http://127.0.0.1:3000/favourites',
        complete: function (response) {
            console.log(response);
            console.log(JSON.parse(response.responseText));
            myBookmarks = myBookmarks.concat(response.responseJSON);
            console.log(JSON.stringify(myBookmarks));
            loadBookmarks(myBookmarks);
            loadCategories();
        },
        error: function () {
            alert('there was an error!');
        }
    });

}

function loadCategories() {
    var categoryPanel = document.getElementById("categoryPanel");
    for (var j = 0; j < myCategories.length; j++) {
        var categoryItem = document.createElement("div");
        categoryItem.className = "categoryItem";
        categoryItem.innerHTML = myCategories[j];
        categoryItem.id = myCategories[j];
        categoryPanel.appendChild(categoryItem);
        categoryItem.onclick = function (event) {
            filterCategories(event.target.id);
        };


    }
}

function loadBookmarks(bookmarks) {


    var bookmarksList = document.getElementById("bookmarksList");



    for (var i = 0; i < bookmarks.length; i++) {
        var idNum = bookmarks[i].id;

        var bookmarkItem = document.createElement("div");
        bookmarkItem.className = "bookmarkItem";
        bookmarksList.appendChild(bookmarkItem);

        var bookmarkHeader = document.createElement("div");
        bookmarkHeader.className = "bookmarkHeader";
        bookmarkItem.appendChild(bookmarkHeader);

        var titleHyperlink = document.createElement("a");
        titleHyperlink.href = bookmarks[i].link;
        titleHyperlink.id = "titleHyperlink";
        titleHyperlink.target = "_blank";
        titleHyperlink.class = "titleHyperlink";
        bookmarkHeader.appendChild(titleHyperlink);

        var bookmarkTitle = document.createElement("h2");
        bookmarkTitle.className = "bookmarkTitle";
        bookmarkTitle.innerHTML = bookmarks[i].title;
        titleHyperlink.appendChild(bookmarkTitle);

        var dropdown = document.createElement("div");
        dropdown.className = "dropdown";
        bookmarkHeader.appendChild(dropdown);

        var dropButton = document.createElement("button");
        dropButton.className = "dropbtn";
        dropButton.id = "db" + idNum;
        dropButton.onclick = function (event) {
            showDropdown(event.target.id);
        };
        dropdown.appendChild(dropButton);

        var dropdownContent = document.createElement("div");
        dropdownContent.className = "dropdown-content";
        dropdownContent.id = "dc" + idNum;
        dropdown.appendChild(dropdownContent);


        var dropdownEdit = document.createElement("a");
        dropdownEdit.className = "dropdownEdit";
        dropdownEdit.id = "de" + idNum;
        dropdownEdit.innerHTML = "edit";
        dropdownEdit.onclick = function (event) {
            showEditForm(event.target.id);
        };
        dropdownContent.appendChild(dropdownEdit);

        var dropdownDelete = document.createElement("a");
        dropdownDelete.className = "dropdownDelete";
        dropdownDelete.id = "dl" + idNum;
        dropdownDelete.innerHTML = "delete";
        dropdownContent.appendChild(dropdownDelete);

        var bookmarkEditForm = document.createElement("form");
        bookmarkEditForm.className = "bookmarkEditForm";
        bookmarkEditForm.id = idNum;
        bookmarkItem.appendChild(bookmarkEditForm);

        var editTitle = document.createElement("input");
        editTitle.className = "editTitle";
        editTitle.type = "text";
        editTitle.value = bookmarks[i].title;
        editTitle.id = "editTitle" + idNum;
        bookmarkEditForm.appendChild(editTitle);

        var editCategory = document.createElement("input");
        editCategory.className = "editCategory";
        editCategory.type = "text";
        editCategory.value = bookmarks[i].category;
        editCategory.id = "editCategory" + idNum;
        bookmarkEditForm.appendChild(editCategory);

        var editDescription = document.createElement("input");
        editDescription.className = "editDescription";
        editDescription.type = "text";
        editDescription.id = "editDescription" + idNum;
        editDescription.value = bookmarks[i].description;
        bookmarkEditForm.appendChild(editDescription);

        var bookmarkLink = document.createElement("input");
        bookmarkLink.className = "bookmarkLink";
        bookmarkLink.type = "text";
        bookmarkLink.id = "bookmarkLink" + idNum;
        bookmarkLink.value = bookmarks[i].link;
        bookmarkEditForm.appendChild(bookmarkLink);

        var formSubmit = document.createElement("input");
        formSubmit.className = "formSubmit";
        formSubmit.type = "submit";
        formSubmit.id = "fs" + idNum;
        formSubmit.value = "Submit";
        formSubmit.onclick = function (event) {
            submitChanges(event.target.id);
            addEventListener("click", function (event) {
                event.preventDefault();
            });
        };
        bookmarkEditForm.appendChild(formSubmit);

        var formReset = document.createElement("input");
        formReset.className = "formReset";
        formReset.type = "reset";
        formReset.value = "Cancel";
        bookmarkEditForm.appendChild(formReset);
    }
}

function submitChanges(id) {
    var formId = id.substring(2);
    var updatedItem = {};
    updatedItem.title = document.getElementById("editTitle" + formId).value;
    updatedItem.category = document.getElementById("editCategory" + formId).value;
    updatedItem.description = document.getElementById(
        "editDescription" + formId
    ).value;
    updatedItem.link = document.getElementById("bookmarkLink" + formId).value;
    updatedItem.id = formId;
    console.log(updatedItem);
    $.ajax({
        type: 'put',
        url: 'http://127.0.0.1:3000/favourites',
        data: JSON.stringify(updatedItem),
        beforeSend: function (request) {
            request.setRequestHeader("content-type", 'application/json');
        },
        complete: function (response) {
            console.log(response);
            console.log(JSON.parse(response.responseText));
            console.log("here: " + response.responseJSON.id);
            myBookmarks[response.responseJSON.id-1] = response.responseJSON;
            document.getElementById("bookmarksList").innerHTML="";
            loadBookmarks(myBookmarks);
        },
        error: function () {
            alert('there was an error!');
        }
    });
}


function addItem() {
    var newItem = {};
    newItem.title = document.getElementById("newTitle").value;
    newItem.category = document.getElementById("newCategory").value;
    newItem.description = document.getElementById("newDescription").value;
    newItem.link = document.getElementById("newBookmarkLink").value;

    $.ajax({
        type: 'post',
        url: 'http://127.0.0.1:3000/favourites',
        data: JSON.stringify(newItem),
        beforeSend: function (request) {
            request.setRequestHeader("content-type", 'application/json');
        },
        complete: function (response) {
            console.log(response);
            console.log(JSON.parse(response.responseText));
            myBookmarks.push(response.responseJSON);
            console.log(JSON.stringify(myBookmarks));
            document.getElementById("bookmarksPanel").innerHTML="";
            loadBookmarks(myBookmarks);
        },
        error: function () {
            alert('there was an error!');
        }
    });
}


//Dropdown elements

function showDropdown(id) {

    var dropdownDisplay = document.getElementById("dc" + id.substring(2));
    dropdownDisplay.style.display = dropdownDisplay.style.display == "none" ? "flex" : "none";

    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {

            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.style.display == "flex") {
                    openDropdown.style.display = "none";
                }
            }
        }
    }
}


function showEditForm(n) {
    var editForm = document.getElementById(n.substring(2));
    editForm.className = editForm.className == "bookmarkEditForm" ? "bookmarkEditForm-opened" : "bookmarkEditForm";
}


function filterCategories(categoryName) {
    filteredBookmarks = [];
    for (var i = 0; i < myBookmarks.length; i++) {
        if (myBookmarks[i].category == categoryName) {
            filteredBookmarks.push(myBookmarks[i]);
        }
    }
    document.getElementById("bookmarksList").innerHTML="";
    loadBookmarks(filteredBookmarks);
}