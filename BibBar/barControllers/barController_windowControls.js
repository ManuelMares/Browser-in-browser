/******************************************************************************
* barController.js is a script that creates and loads the new extension's bar into the DOM
*
* @note
*   (1) This script is loaded after barController.js in manigest.json
*   (2) A copy of this script is loaded in each tab 
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
 * This function manages eventListeners in the window controls
 * @param e
 *  An event
 * @note
 *  (1) minimizes window
 *  (2) sets the full screen status
 *  (3) closses the window
*/
document.addEventListener('click', function(e){
    if( e.target.id == "bib_Bar_TopContainer_WindowControls_Minimize" ||
        e.target.id == "bib_Bar_TopContainer_WindowControls_MinimizeImg"
    )
        minimizeWindow();
    if( e.target.id == "bib_Bar_TopContainer_WindowControls_ExitFullScreen" ||
        e.target.id == "bib_Bar_TopContainer_WindowControls_ExitFullScreenImg"
    )
        setFullScreenWindow();
    if( e.target.id == "bib_Bar_TopContainer_WindowControls_Exit" ||
        e.target.id == "bib_Bar_TopContainer_WindowControls_ExitImg"
    )
        closeWindow();
})

/**
 * Minimizes the window
*/
function minimizeWindow(){
    return new Promise((resolve, reject) => {        
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_windowControls_minimize"
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
 * Helps setting the full screen status of the window 
 * @note
 *  1)The action of full screen itself is on barController_OnLoad.js
 *  2)his funciton just updates the icon 
*/
function setFullScreenWindow(){
    if(_FULL_SCREEN_TOGGLE)
        document.getElementById("bib_Bar_TopContainer_WindowControls_ExitFullScreenImg").setAttribute("src",`chrome-extension://${BIB_EXTENSION_ID}/BibBar/Icons/fullScreen_out.svg`)
    else
        document.getElementById("bib_Bar_TopContainer_WindowControls_ExitFullScreenImg").setAttribute("src",`chrome-extension://${BIB_EXTENSION_ID}/BibBar/Icons/fullScreen_in.svg`)
    
}

/**
 * closes the window of Chrome
*/
function closeWindow(){
    return new Promise((resolve, reject) => {        
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_windowControls_exit"
        },
        function (response) 
        {
            resolve( response );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}