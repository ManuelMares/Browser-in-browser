/******************************************************************************
* barCreator.js is a script that creates and loads the new extension's bar into the DOM
*
* @note
*   (1) This script is loaded after barController.js in manigest.json
*   (2) A copy of this script is loaded in each tab 
*   (3) To edit the functionallity, go to barController.js
*
*   (4) _SEARCH_BAR is a global variable that stores the extensions search bar part of the bar HTML node
*   (5) _FULL_SCREEN_TOGGLE is a global variable that stores the current status of the full screen toggle for all pages
*   (6) _THIS_TAB_ID is a global variable that stores the id of the web page for each tab
*   (7) _THIS_BAR is a global variable that stores  the extensions bar HTML node
*
* @author Manuel Mares
*
******************************************************************************/

/**
 *      window.onload can only be declared once
 *      The following code exists in barController_OnLoad.js
*/
// window.onload = function () {
//     var fullScreenToggle = document.getElementById("setFullScreen");
//     fullScreenToggle.addEventListener("click", ({click}) => {
//         fullScreeToggle = !fullScreeToggle;
//         setFullScreen();
//     })    
// }

/**
 * This function sets the window to full screen
*/
function setFullScreen(){
  //
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            toggleStatus: _FULL_SCREEN_TOGGLE,
            type: "barController_fullScreen_setFS"
        },
        function (response) 
        {
            resolve( response );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}
    