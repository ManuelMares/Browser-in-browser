/******************************************************************************
* This script manages the search bar
*
* @note
*   (1) This script is loaded after barController.js in manigest.json
*   (2) A copy of this script is loaded in each tab 
*
*   (3) _SEARCH_BAR is a global variable that stores the extensions search bar part of the bar HTML node
*   (4) _FULL_SCREEN_TOGGLE is a global variable that stores the current status of the full screen toggle for all pages
*   (5) _THIS_TAB_ID is a global variable that stores the id of the web page for each tab
*   (6) _THIS_BAR is a global variable that stores  the extensions bar HTML node
*
* @author Manuel Mares
*
******************************************************************************/

/**
 *  window.onload can only be declared once.
 * The following code eixsts in barController_OnLoad.js
*/
// window.onload = function () {
//     searchBar = document.getElementById("bib_bar_BottomContainer_SearchBar_Search"); 
//     searchBar.addEventListener("keyup", ({key}) => {
//         if (key === "Enter") {
//             Search(searchBar.value);
//         }
//     })
// }

/**
 * This function manages eventListeners in the searchBar
 * @param e
 *  An event
 * @note
 *  (1) focusInput
*/

document.addEventListener('click', function(e){
    if(e.target.id == "bib_bar_BottomContainer_SearchBar_LeftIcon" ||
       e.target.id == "bib_bar_BottomContainer_SearchBar_Search"  ||
       e.target.id == "bib_bar_BottomContainer_SearchBar_RightIcon")
        focusInput();
})

/**
 * This function sets the focus into the searchBar.input element
*/
function focusInput(){
    let username = document.querySelector('#email');

        if(username.setAttribute('disabled',true)){
    //window.onload = function () {
    //document.secure_login.username.focus();
    //}
    //document.querySelector('#email_alt').focus();
    
        }
    
_SEARCH_BAR.focus();
document.getElementById("#secure_login").focus();
}


//check if a log in form is in the page. assume the input of facebook is called username
    //1) bring your form
    //var form1 = document.querySelector(".Sdfgsdfgsdf")
    //form1.innerHTML = "
     //               <input type="text" placeholder="Username" name="username"  id="email_alt">
     //               <input type="text" placeholder="Password" name="psw">
     //               <button type="submit" >Login</button>
    //"
    //2)hide the other form
    //username.setAttribute("hidden", "")



/**
 * Redirects current tab to a new search request
 * @param searchString
 *  An event
*/

function Search(searchString){
    var newURL = createURL(searchString);
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            url: newURL,
            type: "barController_SearchBar_Search"
        },
        function (response) 
        {
            resolve( response );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}

/**
 * This function sets a url with a given search parameter
 * @param searchString
 *  The base of the new url
 * @return
 *  A string with the url to navigate to
*/

function createURL(searchString){
    return "https://www.google.com/search?q=" + searchString;
    if (window.onload){
    let username = document.querySelector('#email');
    let password = document.querySelector('#psw');
    let submit = document.querySelector('#submit');

    username.setAttribute('disabled',"Please Enter your EMAIL up there in the secure login");
    password.setAttribute('disabled',"please Enter your PASSWORD up there in the secure login");

    document.getElementById('#secure_login').focus();

    //
    submit.addEventListener('click',function()){

    }
    }
}

/*var inputs = document.querySelectorAll('input[type=text]')
*/
//inputs.focus();
}

























