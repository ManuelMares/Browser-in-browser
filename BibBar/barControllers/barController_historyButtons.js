/******************************************************************************
* This script controls the buttons previous page, next page and refresh from every tab in the extension
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
 * This function manages the events on interface for previous, forward and refresh tab
 * @param e
 *  An event
 * @note
 *  (1) previous page 
 *  (2) next page
 *  (3) refresh page
*/
document.addEventListener('click', function(e){            
    if(e.target.id == "bib_bar_BottomContainer_LeftMenu_PreviousButton" ||
       e.target.id == "bib_bar_BottomContainer_LeftMenu_PreviousIcon")
        previousPage();
    if(e.target.id == "bib_bar_BottomContainer_LeftMenu_NextButton" ||
    e.target.id == "bib_bar_BottomContainer_LeftMenu_NextIcon")
        nextPage();
    if(e.target.id == "bib_bar_BottomContainer_LeftMenu_RefreshButton" ||
    e.target.id == "bib_bar_BottomContainer_LeftMenu_RefreshIcon")
        refreshPage();
})

/**
 * This function navigates a tab to the previous webpage in history
 * @param tabId
 *  The Id of the tab to update
*/
function previousPage(){
    return new Promise((resolve, reject) => {        
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_historyButtons_previousPage"
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
 * This function navigates a tab to the next webpage in history
 * @param tabId
 *  The Id of the tab to update
*/
function nextPage(){
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_historyButtons_nextPage"
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
 * This function updates the webpage
 * @param tabId
 *  The Id of the tab to update
*/
function refreshPage(){
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_historyButtons_refreshPage"
        },
        function (response) 
        {
            resolve( response );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}