const BASE_URL = 'https://thinkful-list-api.herokuapp.com/christian/bookmarks'

//get bookmark api 
const getBookmark = function() {
    console.log('getBookmark has been run!')
    return fetch(`${BASE_URL}`)
    .catch(err => {
        $('#options').text(`Something went wrong: ${err.message}`);
        })
};

//create bookmark api
const createBookmark = function (bookmark) {
    console.log('createBookmark has been run!');
    let newBookmarkJSON = JSON.stringify(bookmark);

        return fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: newBookmarkJSON
        });   
    };


//DELETE bookmark api

const deleteBookmark = function (id) {
    return fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    }); 
  };



export default {
    createBookmark,
    getBookmark,
    deleteBookmark
};