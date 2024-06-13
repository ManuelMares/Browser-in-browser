/******************************************************************************
* This file declares all the global variables and define the necessary 
* window.onload functions
*
* @note
*   (1) _SEARCH_BAR is a global variable that stores the extensions search bar part of the bar HTML node
*   (2) _FULL_SCREEN_TOGGLE is a global variable that stores the current status of the full screen toggle for all pages
*   (3) _THIS_TAB_ID is a global variable that stores the id of the web page for each tab
*   (4) _THIS_BAR is a global variable that stores  the extensions bar HTML node
*
* @author Manuel Mares
*
******************************************************************************/
var _SEARCH_BAR             = null;
var _FULL_SCREEN_TOGGLE     = false;
var _THIS_TAB_ID            = null;
var _THIS_BAR               = null;
let BIB_EXTENSION_ID        = chrome.runtime.id;


//========================================================================================================
//========================================================================================================
//========================================================================================================


/**
 * This function sets the values of the global variables
 * and the addlistener across all the scripts in the extension
*/
window.onload = function () {
    //searchBar
    //console.log(document)
    _SEARCH_BAR = document.getElementById("bib_bar_BottomContainer_SearchBar_Search");
    _SEARCH_BAR.addEventListener("keyup", ({key}) => {
        if (key === "Enter") {
            Search(_SEARCH_BAR.value);
        }
    })
    
 /*   function createTextBox(){
        var textBox = document.createElement("input");
        textBox.type = "text";
        document.body.appendChild(textBox);
    }
*/
    //fullScreen
    var buttonFullScreen = document.getElementById("bib_Bar_TopContainer_WindowControls_ExitFullScreen");
    buttonFullScreen.addEventListener("click", ({click}) => {
        _FULL_SCREEN_TOGGLE = !_FULL_SCREEN_TOGGLE;
        setFullScreen();
    })  
}



/*========================Utility functions========================*/

/**
 * Gets a HTML file as a String
 * @param htmlDir
 *    A String with the location of the HTML file to retrieve
 * @returns String
 *    the html that will be set as the node.innerHTML +=
 *    of a DOM Node
 * @note
 *  1)The return value IS NOT a Node.
 *    it cannot be added with element.append()
 *  2)Returning a Node in this function would mean
 *    to add a intermedian wrapper
 *    whose style would cause more trouble
*/
async function getHTMLElement(htmlDir){
  return fetch(chrome.runtime.getURL(htmlDir))
        .then((resp) => { return resp.text(); })
        .then((content) => { 
            console.log("we are printing: ", htmlDir)
            content = content.replaceAll("BIB_EXTENSION_ID", BIB_EXTENSION_ID);
            return  content;
        });
}

/**
 * Gets a style HTML Node to add into a HTML file
 * @param cssDir
 *    A String with the location of the CSS file to retrieve
 * @returns HTML Node
 *    A tag to be added to an HTML file, and containing the respective styles
 * @note
 *  1)This object, unlike the return object from getHTMLElement
 *    CAN return a HTML Node because the intermedian wraper
 *    is not a node to display or style
 *    in fact, it is a <style> tag that is always what we look for
 *  2)The styles are added as inline stylesheet because the chrome extension
 *    does not admit a reference to any css file
 *  3)Because of (2), the styles will show in the DOM. The shadow root 
 *    technique does not work in the chrome extension
 */
async function getCSS(cssDir){
  var style = document.createElement( 'style' );
  style.innerHTML = await fetch(chrome.runtime.getURL(cssDir))
                          .then((resp) => { return resp.text(); })
                          .then((content) => { return  content; });
  return style;
}


/**
 * Retrieves a JSON file
 * @param fileDir
 *    A String with the location of the JSON file to retrieve
 * @returns 
 *    A JSON file
 */
async function getJson(fileDir){
    return fetch(chrome.runtime.getURL(fileDir))
    .then((resp) => resp.json())
    .then(function (contentJSON) {
        //console.log(contentJSON);
        return contentJSON;
    });
}


/**
 * Returns the url of the current tab
 * @returns 
 *    A String
 */
function getTabURL(){
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_getURL"
        },
        function (tabURL) 
        {
            resolve( tabURL );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}
  