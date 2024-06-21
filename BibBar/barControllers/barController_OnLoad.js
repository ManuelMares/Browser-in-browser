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
let _SEARCH_BAR = null;
let _FULL_SCREEN_TOGGLE = false;
let _THIS_TAB_ID = null;
let _THIS_BAR = null;
let _THIS_URL = null;
let _SHOW_BAR_ADDRESS = 1 //0 no address, 1 full domain, 2 qualified domain
const _CLOSE_TAB_TIME_IN_SECONDS_ = 330; //In seconds
const _NO_PIN_HOSTS = [ "stackoverflow.com" ] //Might nor be fully working yet
const _URLS_NO_CLOSE_BUTTON_ = [
    "http://127.0.0.1:8080/task1.html",
    "http://127.0.0.1:8080/task2.html",
    "http://127.0.0.1:8080/task3.html",
    "http://127.0.0.1:8080/task4.html",
    "http://127.0.0.1:8080/task5.html",
    "http://127.0.0.1:8080/task6.html",
    "http://127.0.0.1:8080/task7.html",
    "http://127.0.0.1:8080/task8.html",
    "http://127.0.0.1:8080/task9.html",
    "http://127.0.0.1:8080/task10.html",
    "http://127.0.0.1:8080/task11.html",
    "http://127.0.0.1:8080/task12.html",
    "http://127.0.0.1:8080/task13.html",
    "http://127.0.0.1:8080/task14.html",
    "http://127.0.0.1:8080/task15.html",
    "http://127.0.0.1:8080/task16.html",
    "http://127.0.0.1:8080/task17.html",
    "http://127.0.0.1:8080/task18.html",
    "http://127.0.0.1:8080/task19.html",
    "http://127.0.0.1:8080/task20.html",
    "http://127.0.0.1:8080/task21.html",
    "http://127.0.0.1:8080/task22.html",
    "http://127.0.0.1:8080/task23.html",
    "http://127.0.0.1:8080/task24.html",
    "http://127.0.0.1:8080/task25.html",
    "http://127.0.0.1:8080/task26.html",
    "http://127.0.0.1:8080/task27.html",
    "http://127.0.0.1:8080/task28.html",
    "http://127.0.0.1:8080/task29.html",
    "http://127.0.0.1:8080/task30.html",
    "http://127.0.0.1:8080/directions.html",
    "http://127.0.0.1:8080/index.html",
]
const _TABS_NO_CLOSE_AFTER_TIME_ = _URLS_NO_CLOSE_BUTTON_;

/**
 * This function sets the values of the global variables
 * and the addlistener across all the scripts in the extension
*/
window.onload = async function () {
    //everything occurs after the _THIS_TAB_ID has been set
    await setTabId()          
    
    //hotkeys
    hotKeysHandler();    
    ExcludedTabsFromPin(_NO_PIN_HOSTS);


    //Sets the URL in the search bar. Either qualified domain, full url, or nothing.
    getDisplayBarStatus()
    .then((show_bar_address => {
        updateURL(show_bar_address);
    }))

    
    //retrieves the searchBar and sets the addEventListener to search
    _SEARCH_BAR = await asyncQuery("#bib_bar_BottomContainer_SearchBar_Search");
    _SEARCH_BAR.addEventListener("keyup", ({key}) => {
        if (key === "Enter") {
            Search(_SEARCH_BAR.value);
        }
    })

    //Close the time after (time in seconds, websites to not to close)
    //This funciton depend on _THIS_TAB_ID having a value (assigned at bib bar creation in barController_creator.js)
    //Therefore, this has to occur after the search bar is loaded
    startTimerForTab(_CLOSE_TAB_TIME_IN_SECONDS_, _TABS_NO_CLOSE_AFTER_TIME_)




    //fullScreen
    var buttonFullScreen = document.getElementById("bib_Bar_TopContainer_WindowControls_ExitFullScreen");
    buttonFullScreen.addEventListener("click", ({click}) => {
        _FULL_SCREEN_TOGGLE = !_FULL_SCREEN_TOGGLE;
        setFullScreen();
    }) 
    


}


function setTabId(){    
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
              type: "get_tab_id"
          },
          function (tabId) 
          {
            _THIS_TAB_ID = tabId;
            resolve(_THIS_TAB_ID);
          }
        )
      })
}

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
/*
Updates the url of the interface based on the global variable _SHOW_BAR_ADDRESS
@precondition:
    _SHOW_BAR_ADDRESS has been modified
@postconditions
    The interface is updated showing a new url
*/
function updateURL(){
    //Cleans the url
    _THIS_URL = null;

    //case 0. show_bar_address == 0, show nothing
    if(_SHOW_BAR_ADDRESS == 0)   _THIS_URL = "";
    //case 1. show_bar_address == 1, show full url
    if(_SHOW_BAR_ADDRESS == 1)   _THIS_URL = window.location.href;
    //case 2. show_bar_address == 2, show qualified domain
    if(_SHOW_BAR_ADDRESS == 2)   _THIS_URL = concatenateURL();

    //display the url
    displayURL();
}

/*
Controller for hot keys
*/
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
                //Updates the url
                updateURL(ans)
                //Inform the user
                if(_SHOW_BAR_ADDRESS == 0)
                    alert(`_SHOW_BAR_ADDRESS updates. Displaying NO URL`);
                if(_SHOW_BAR_ADDRESS == 1)
                    alert(`_SHOW_BAR_ADDRESS updates. Displaying NO FULL URL`);
                if(_SHOW_BAR_ADDRESS == 2)
                    alert(`_SHOW_BAR_ADDRESS updates. Displaying ONLY QUALIFIED DOMAIN`);
            })
        }

    }, true);
}




/*
    Pins tabs to the browser, except the indicated ones

    This function checks for the current pinned tabs in the browser, and when a match is found, 
    they get pinned
*/
function ExcludedTabsFromPin(domains){
    domains.map((domain)=>{
        //identifyTabToPin
        checkTabToPin(domain)    
        //pin tab
        pinTab(domain)
    
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
 * retrieves the _SHOW_BAR_ADDRESS variable
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
            console.log(show_bar_address)
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
  
/**
 * Returns the url of the current tab
 * @param tabId
 *   An integer with the id of the tab to check for
 * @returns 
 *    A String
 */
function getTabURL(tabId){
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
            tabId: tabId,
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
  
/*
    Starts the timer for to close tabs out of the safe list
    @param timeInSeconds
        An integer indicating the time to wait before closing the tab, in seconds
    @param excludedTabsHostName
        The tabs for which the timer will not be started. These tabs will not automatically close
    @note
        The timer is set in the background to preserve the status even after refreshing the tab.

*/
function startTimerForTab(timeInSeconds, excludedTabsHostName){
    //If the hostname is in the list of safe tabs, don't start the counter
    for(var i = 0; i < excludedTabsHostName.length; i++){
        hostname = excludedTabsHostName[i];
        if(location.hostname.localeCompare(hostname) == 0)
            return;
    }

    //else, start the counter in background to preserve the status of the time
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            delayInSeconds: timeInSeconds,
            type: "barController_timer"
        },
        function (tabURL) 
        {
            resolve()
            reject(ans => {console.log("reject: ", ans)})
        }
        )
    })
}



// ========================================================================================================
// =====================================GENERIC FUNCTIONS =================================================
// ========================================================================================================

/* 
This functions wait for a given amount of time before finalizing 

This function returns a promise to garantee that the indicated time ocurred
@param timeMs
An integer indicating the time to wait for in ms
*/
const delay = (timeInMs) => {
    return new Promise(resolve => {    
        setTimeout(function() {
          resolve();
        }, timeInMs)
    });
  }
  


/* 
This function waits until an HTML element exists, and returns it when that happens

All process will stop until the element exists

@param selector
    A selector property from the element to wait for
@return
    A HTML Node
*/
function asyncQuery(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


/*

*/
function checkTabToPin(hostName){
    if(location.hostname.localeCompare(hostName) != 0)
      return;
    
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
        {
            type: "barController_flagTabToPin"
        },
        function (tabURL) 
        {
            resolve()
            reject(ans => {console.log("reject: ", ans)})
        }
        )
    })
}