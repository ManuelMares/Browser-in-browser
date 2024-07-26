/******************************************************************************
* This file defines key combinations that trigger special functions in the extension 
* window.onload functions
*
* @note
*   (1) If you want the action of the hot key to affect ALL tabs, set a global variable in 
*   background.js, so all tabs see the same variable, but also set a copy in this script
*   so the tabs has a local copy of the variable in background.js that can use.
*   (2) Before defining a hot key, check that it does not interfere with functions already
*   built-in within the browser.
*   (3) The normal flow of a hotkey usually involves creating a global variable and changing
*   its value. Then, maybe an if condition on barControl_onLoad.js uses that variable
*   to decide whether to show/trigger something or not. This is because barControl_onLoad.js
*   is the point where most things are triggered from.
*
* @author Manuel Mares, Xindi Zheng
*
******************************************************************************/
let _SHOW_BAR_ADDRESS                           = 3                     //0 no address, 1 full domain, 2 qualified domain



// ========================================================================================================
// ======================================= HOT KEYS CONTROLLER ============================================
// ========================================================================================================
function hotKeysHandler(){
    document.addEventListener('keydown', function(event) {
        /*
        This hotkey ctrl + b controls the url that is being displayed
        0 - displays no url
        1 - displays the full url
        2 - displays only the qualified domain
        */
        if (event.ctrlKey && event.key === "b") {
            setDisplayBarStatus()
            .then((ans) => {
                updateURL(ans);
                showUpdateBarAddress(ans);
            })
        }

        /*
        This hotkey ctrl + ; controls the page validators
        0 - displays BIMI
        1 - displays Web Traffic indicator
        2 - displays BIMI and Web Traffic
        3 - displays no validator
        */
        if (event.ctrlKey && event.key === ";") {
          toBackground_SetPageValidatorStatus()
          .then((ans) => {
                //Updates the url
                showUpdatePageValidator(ans);
          })
      }
    }, true);
}


// ========================================================================================================
// ===================================== HELPER FUNCTIONS =================================================
// ========================================================================================================
/*
Updates the url of the interface based on a given parameter
@param show_bar_address
    The status of the bar that indicates the new url
@precondition:
    _SHOW_BAR_ADDRESS has been modified
@postconditions
    The interface is updated showing a new url
*/
function updateURL(show_bar_address){
    //Cleans the url
    _THIS_URL = null;

    //case 0. show_bar_address == 0, show nothing
    if(show_bar_address == 0)   _THIS_URL = "";
    //case 1. show_bar_address == 1, show full url
    if(show_bar_address == 1)   _THIS_URL = window.location.href;
    //case 2. show_bar_address == 2, show qualified domain
    if(show_bar_address == 2)   _THIS_URL = concatenateURL();

    //display the url
    displayURL();
}

function showUpdateBarAddress(show_bar_address){
    if(show_bar_address == 0)   alert(`_SHOW_BAR_ADDRESS updates. Displaying NO URL`);
    if(show_bar_address == 1)   alert(`_SHOW_BAR_ADDRESS updates. Displaying NO FULL URL`);
    if(show_bar_address == 2)   alert(`_SHOW_BAR_ADDRESS updates. Displaying ONLY QUALIFIED DOMAIN`);
}

/*
    Informs the use user about the validator display in use
*/
function showUpdatePageValidator(show_page_validator){
    if(show_page_validator == 0) {
        alert(`_SHOW_PAGE_VALIDATOR updated. Displaying new page validator: BIMI`);
    }
    if(show_page_validator == 1) {
        alert(`_SHOW_PAGE_VALIDATOR updated. Displaying new page validator: Web Traffic`);
    }
    if(show_page_validator == 2) {
        alert(`_SHOW_PAGE_VALIDATOR updated. Displaying new page validator: BIMI and Web Traffic`);
    }
    if(show_page_validator == 3) {
        alert(`_SHOW_PAGE_VALIDATOR updated. Displaying new page validator: None`);
    }
    refreshPage();
}


// ========================================================================================================
// ======================+========== TO BACKGROUND FUNCTIONS ==============================================
// ========================================================================================================
/**
 * retrieves the _SHOW_BAR_ADDRESS variable from background script
 * @returns 
 *    A  string as a promise
 */
function toBackground_GetPageValidatorStatus(){
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_HotKeys_get_SHOW_PAGE_VALIDATOR"
        },
        function (show_page_validator) 
        {
            resolve( show_page_validator );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}


/**
 * Changes the _SHOW_BAR_ADDRESS variable status
 * @returns 
 *    A String as a promise
 */
function toBackground_SetPageValidatorStatus(){
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_HotKeys_set_SHOW_PAGE_VALIDATOR"
        },
        function (show_page_validator) 
        {
            resolve( show_page_validator );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}

/**
 * retrieves the _SHOW_BAR_ADDRESS variable from background script
 * @returns 
 *    A  string as a promise
 */
function getDisplayBarStatus(){
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_OnLoad_get_SHOW_BAR_ADDRESS"
        },
        function (show_bar_address) 
        {
            _SHOW_BAR_ADDRESS = show_bar_address;
            resolve( show_bar_address );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}


/**
 * Changes the _SHOW_BAR_ADDRESS variable status
 * @returns 
 *    A String as a promise
 */
function setDisplayBarStatus(){
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_OnLoad_set_SHOW_BAR_ADDRESS"
        },
        function (show_bar_address) 
        {
            _SHOW_BAR_ADDRESS = show_bar_address;
            resolve( show_bar_address );
            reject(ans => {console.log("reject: ", ans)})
        }
      )
    })
}
