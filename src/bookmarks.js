import $ from 'jquery';
import store from './store';
import api from './api';



//function to generate the HTML elements for the bookmark
const generateBookmarkElement = function(bookmark) {
    console.log({bookmark})
    console.log('generateBookmarkElement has been ran!');
    if (bookmark.expanded === false) {
        return ` <div class="bookmark ${bookmark.rating}" id="${bookmark.id}">
                    <button class ="title" id="${bookmark.id}">${bookmark.title}</button>
                    ${bookmark.rating} <img src="starRating.png" alt="small icon of a star" class="ratingImg">
                    <button class="delete" id="${bookmark.id}">Delete</button>
                    </div>`
    }

    return ` <div class="bookmark ${bookmark.rating}" id="${bookmark.id}">
                <button class ="title" id="${bookmark.id}">${bookmark.title}</button>
                <a href="${bookmark.url}"> Visit</a>
                ${bookmark.rating} <img src="starRating.png" alt="small icon of a star" class="ratingImg"/>
                <p class="description">${bookmark.desc}</p>
                <button class="delete" id="${bookmark.id}">Delete</button>
            </div>`
};


//function to put together the bookmark html elements into one block
const generateBookmarkListString = function(bookmarkArr) {
    console.log('generateBookmarkListString has been run!');
    console.log({bookmarkArr})
    const list = bookmarkArr.map((item) => generateBookmarkElement(item));
    return list.join('');
};



//function to render store 
const render = function() {

console.log('render has been run!');

let currState = store.state;
if (currState.adding === true) {
    let addmenu = generateAddMenuElements();
    $('#addMenu').html(`${addmenu}`);
    submitNewBookmark();
    cancelAdding();
};
console.log({currState})
const bookmarkListString = generateBookmarkListString(currState.bookmarks);
$('#bookmarkList').html(bookmarkListString);
generateExpandedView();
deleteButton();
filterBookmarks();

};


//event listener for filtering bookmarks

const filterBookmarks = function() {
    $('.filter').change(function() {
        let filterNum = $('.filter').val();
        console.log(filterNum);  
        for (let i = 1; i<filterNum; i++){
        $(`.${i}`).addClass('hidden'); 
        }}
    )
};


//event listener to toggle expanded view of bookmark
const generateExpandedView = function() {
    $('.title').click(function () {
        console.log('generateExpandedView just ran')
        let id = $(this).attr('id');
        console.log(id);
        store.toggleExpand(id);
        render();
    })

};

//event listener for delete button

const deleteButton = function() {
    $('.delete').on('click', function() {
        console.log('delete function ran');
        let id = $(this).attr('id');
        console.log(id);
        api.deleteBookmark(id);
        store.deleteBookmark(id);
        render();
    })

};


//event listener for the add bookmark button
const addButton = function() {
    $('.options').on('click', '.add-new', event => {
      store.toggleAddMenu();  
      render();  
      });
};
//function to render the menu to add new bookmarks
const generateAddMenuElements = function() {
    return `<form id="addNew">
                <label for="bookmarkTitle">Title:</label>
                <input type="text" name="title" id="bookmarkTitle" placeholder="Google" required/>
                <label for="bookmarkURL">URL: </label>
                <input type="text" name="url" id="bookmarkURL" placeholder="https://www.google.com" required/>
                <label for="ratingTool">Rating:</label>
                <select class="ratingTool" name="ratingTool" id="ratingTool">
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                </select>
                <label for="descriptionBox">Description:</label>
                <input type="text" name="descriptionBox" id="descriptionBox" placeholder="describe this site"/>
                
                <button class="create" type="submit">Create</button>
                <button class="cancel" type="reset" id="cancelButton">Cancel</button>
            </form>`;
};

//event listener to submit new bookmark
const submitNewBookmark = function() {
    console.log('submitNewBookmark ran!');
    $('#addNew').submit(function (event) {
        event.preventDefault();
        const newBookmark = {};

        newBookmark.title = $('#bookmarkTitle').val();
        newBookmark.url = $('#bookmarkURL').val();
        newBookmark.desc = $('#descriptionBox').val();
        newBookmark.rating = $('#ratingTool').val();

        api.createBookmark(newBookmark)    
            .then((res) => res.json())
            .then(data => store.addBookmark(data) )
            .then(() => render())
            .catch(err => {
                $('#addNew').append(`<p>Invalid entry: Title and URl required (include https://)</p>`);
            });
    });
};

//event listener for the cancel button
const cancelAdding = function() {
    $('#cancelButton').on('click',(event) => {
        store.toggleAddMenu();
        $('#addMenu').html('');
        render();
        });
};


//function to initialize eventlisteners

const eventListeners = function() {
    addButton();

};

export default {
    render,
    generateBookmarkElement,
    generateAddMenuElements,
    generateExpandedView,
    eventListeners
};
