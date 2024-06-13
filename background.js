/******************************************************************************
* background.js is a script that controls the working service of Chrome.
* this file mannages the browser window (tabs, favorites, search, etc), but not the webpages
*
* @note
*   (1) The communication between this script and any webpage is done through messages.
*       a) Any request to this script is heard with 'chrome.runtime.onMessage.addListener'
            I)  The response to any message (calls to 'sendResponse()'), if it involves using any function, 
                has to be done through  'promise'. The return value in 'sendResponse(answer)' has to
                be called inside the .then() in the promise. i.e
                    
                chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse){   
                        getTabs().then(ans => {sendResponse(ans)}); 
                    } 
                )

                where getTabs is a promise set into a function, but the answer is of type <promise>
            II) Only one chrome.runtime.onMessage.addListener can be declared. The way to listen for different messages
                is to check to request.type for the matching request String. i.e.

                 
                chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse){   
                        if(request.type == "bar_RequestTabsIcons"){ 
                            getTabs().then(ans => {sendResponse(ans)});                        
                        }
                    } 
                )
        b)  When requesting any information from any webpage, the request has to be done with
            chrome.runtime.sendMessage
            I)  The request has to be inside a promise (probably inside a function as well),
                due to a chrome extension bug. i.e.

                    return new Promise((resolve, reject) => {   
                        chrome.runtime.sendMessage(
                            {type: "bar_RequestTabs"},
                            function (response) 
                            {
                                resolve( response );
                                reject(ans => {console.log("reject: ", ans)})
                            }
                        )
                    })

            II) Any script in any webpage can catch a sent message. To garantee
                it is read by the correct page, the line {type: "bar_RequestTabs"} 
                in the previous example was added as the identifier.
            III) The answer is handle through function(response) has seen in previous example

*   (2) The expected communication is with and from barController.js and barCreator.js
*   (3) Similarly, for any answer that requires information from any tab, a independent promise has to be created
*       a) To retrieve information of a tab, it is done through 
                'chrome.tabs.query({ currentWindow: true }, function (tabs) { //code to execute })'
            where tabs is an array parameter containing all the tabs
*           I)  To send the information from a single tab, 'chrome.runtime.sendMessage' can be called inside the function
*       b) To get the tabs as a promise, the following code can be used
                    
                return new Promise((resolve, reject) => {  
                    chrome.tabs.query({ currentWindow: true }, function (tabs) {
                        resolve( tabs );    
                        reject(errorMessage => {console.log("reject: ", errorMessage)})
                    });
                }) *                
*       b) The promise has to be in an independet function
*
* @author Manuel Mares
*
******************************************************************************/
var _TOGGLE_STATUS = false;
var _WIN_ID = false;  
getWindowId();

/**
 * Listener for messages
 * @note
 *  This function gets messages from barCreator.js and barController.js
 *  Each message is handle with an 'if(request.type == "typeOfMessage")'
 *  The return value is send with 'sendResponse(ans)
 *  sendResponse(has to be the very last statement executed)
 *  Each called funciton has to return a promise
*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){   
        if(request.type == "barController_tabs_RequesTab"){ 
            getTabs().then(ans => {sendResponse(ans)});                        
        }   
        if(request.type == "barController_tabs_FocusTab"){
            focusTab(request.tabId)
            //The addEventListener replaces this funtion
            //is left here for possible changes and a vestigy
            //.then(ans => {updateBar(request.tabId)} )
            //.then(ans => {sendResponse(ans)});                        
        }      
        if(request.type == "barController_tabs_CloseTab"){
            removeTab(request.tabId)
            .then(ans => {sendResponse(ans)})
        }   
        if(request.type == "barController_tabs_AddTab"){
            addTab(request.tabId)
            .then(ans => {sendResponse(ans)})
        }     
        if(request.type == "barController_historyButtons_previousPage"){
            previousPage(request.tabId)
            .then(ans => {sendResponse(ans)})
        }     
        if(request.type == "barController_historyButtons_nextPage"){
            nextPage(request.tabId)
            .then(ans => {sendResponse(ans)})
        }     
        if(request.type == "barController_historyButtons_refreshPage"){
            refreshPage(request.tabId)
            .then(ans => {sendResponse(ans)})
        }  
        if(request.type == "barController_optionsMenu_openExtensionsPage"){
            openExtensionsPage(request.tabId)
            .then(ans => {sendResponse(ans)})
        }           
        if(request.type == "barController_optionsMenu"){
            openMoreMenuOption(request.tabId, request.option)
            .then(ans => {sendResponse(ans)})
        }
        if(request.type == "barController_SearchBar_Search"){
            redirect(request.tabId, request.url)
            .then(ans => {sendResponse(ans)})
        }
        if(request.type == "barController_fullScreen_setFS"){
            setFullScreen(request.toggleStatus)
            .then(ans => {sendResponse(ans)})
        }
        if(request.type == "getToggleStatus"){
            sendResponse(_TOGGLE_STATUS);
        }
        if(request.type == "barController_getURL"){
            getURL(request.tabId)
            .then(tabURL => { sendResponse(tabURL) });
        }  
        if(request.type == "barController_relocateBar_refreshPage"){
            refreshPage(request.tabId)
            .then(ans => {sendResponse(ans)})
        }
        if(request.type == "barController_windowControls_minimize"){
            minimizeWindow(request.tabId)
            .then(ans => {sendResponse(ans)})
        }
        if(request.type == "barController_windowControls_setFullScreen"){
            setFullScreen(request.toggleStatus)
            .then(ans => {sendResponse(ans)})
        }
        if(request.type == "barController_windowControls_exit"){
            getTabsIds()
            .then( tabsIds =>  {exitChrome(tabsIds)} )
            .then( ans => {sendResponse(ans)})
        }

        //this return keeps the port open until an answer is returned
        return true;
    }
)


/**
 * Opens a new tab in a indicated address
 * @param tabId
 *  the id of the tab that sent the message
 * @param option
 *  the page to open or action to execute 
 * @returns
 *  A promise
*/
function openMoreMenuOption(tabId, option){
    if(option == "NewTab")
        chrome.tabs.create({ url: "https://www.google.com/" });
    if(option == "NewWindow")
        chrome.windows.create({ url: "https://www.google.com/" });
    if(option == "NewIncognitoTab")
        chrome.windows.create({url: "https://google.com/", incognito: true});
    if(option == "History")
        chrome.windows.create({ url: "chrome://history/", type: "popup" });
    if(option == "Downloads")
        chrome.windows.create({ url: "chrome://downloads/", type: "popup" });
    if(option == "Bookmarks")
        chrome.windows.create({ url: "chrome://bookmarks/", type: "popup"});
    
    if(option == "Search") //TODO: IMPLEMENT
    if(option == "MoreTools") //TODO: IMPLEMENT
    
    if(option == "Settings")
        chrome.windows.create({url: "chrome://settings/", type: "popup"});
    if(option == "Help")
        chrome.windows.create({url: "chrome://settings/help/", type: "popup"});
}


/**
 * Retrives the current tabs in the browser
 * @returns <promise> -> array
 *  A promise containig an array of tabs
 * @note
 *  To access the promise getTabs().then(ans => {//code})
*/
async function setFullScreen(toggleStatus){
    return new Promise((resolve, reject) => {
        _TOGGLE_STATUS = toggleStatus;
        getWindowId()
        if(_TOGGLE_STATUS){
            chrome.windows.update(_WIN_ID, { state: "fullscreen" })
        }
        else{
            chrome.windows.update(_WIN_ID, { state: "maximized" })
        }
        resolve();
        //define window Id
    })    
}

/**
 * Gets th Id of the current windo
*/
async function getWindowId(){    
    chrome.windows.getCurrent(win => {
        _WIN_ID = win.id;
    })
}

/**
 * Retrieves the url of a webpage
 * @param tabId 
 *   The id to get the url from
 * @returns 
 *  A promise
*/
function getURL(tabId){
    return new Promise((resolve, reject) => {        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            resolve( tabs[0].url );
            reject();       
         });
    })     
}

/**
 * Retrives the current tabs in the browser
 * @returns <promise> -> array
 *  A promise containig an array of tabs
 * @note
 *  To access the promise getTabs().then(ans => {//code})
*/
function getTabs(){
    return new Promise((resolve, reject) => {  
        chrome.tabs.query({ currentWindow: true }, function (tabs) {
            resolve( tabs );    
            reject(errorMessage => {console.log("reject: ", errorMessage)})
        });
    })    
}


/**
 * Redirects the page to a given url
 * @param tabId
 *  The tab requesting the redirection
 * @param url
 *  The new url to navigate to
 * @returns <promise> -> array
 *  A promise containig an array of tabs
 * @note
 *  To access the promise getTabs().then(ans => {//code})
*/
function redirect(tabId, url){
    return new Promise((resolve, reject) => {   
        chrome.tabs.update({url: url})
        .then(resolve())
        reject();
    })
}


/**
 * Removes a tab
 * @param tabId
 *  Id of the tab to delete
 * @note
 *  Chrome sets the focus to the deleted tab
 *  the focus has to be set back into the original tab 
*/
function removeTab(tabId){
    return new Promise((resolve, reject) => {  
        chrome.tabs.remove(parseInt(tabId))
        .then(resolve())
        reject();
    })    
}


/**
 * This function sets the focus of the window in an specified tab
 * @param tabId
 *  The Id of the tab to focus on
*/
function focusTab(tabId){
    return new Promise((resolve, reject) => {
        chrome.tabs.update(parseInt(tabId), {selected: true, active: true})
        .then(resolve())
        reject();
    })    
}

/**
 * This function opens a new tab to the extension
 * @param tabId
 *  The Id of the tab to focus on
*/
function addTab(tabId){
    return new Promise((resolve, reject) => {
        chrome.tabs.create({ url: "chrome://newtab/" })
        .then(resolve())
        reject();
    })  
}

/**
 * This function opens a new tab to the extension
 * @param tabId
 *  The Id of the tab to focus on
 * @param pageURL
 *  The page to open
*/
function addTab(tabId, pageURL){
    return new Promise((resolve, reject) => {
        chrome.tabs.create({ url: pageURL })
        .then(resolve())
        reject();
    })  
}

/**
 * This function reloads only the tabs in the extension
 * @param tabId
 *  The Id of the tab to update
 * @note
 *  This functions sends a message to barCreator.js, 
 *  who updates the bar
 *  The parameter tabId defines which tab listens for the message
*/
function updateBar(tabId){
    return new Promise((resolve, reject) => {   
        chrome.tabs.sendMessage(
            parseInt(tabId), 
            {type: "background_UpdateBar"},
            function (response){
                resolve(response)
                reject();
            }
        )
    })
}

/**
 * This function navigates a tab to the previous webpage in history
 * @param tabId
 *  The Id of the tab to update
*/
function previousPage(tabId){
    return new Promise((resolve, reject) => {
        chrome.tabs.goBack(parseInt(tabId))
        .then(resolve())
        reject();
        
    })
}

/**
 * This function navigates a tab to the next webpage in history
 * @param tabId
 *  The Id of the tab to update
*/
function nextPage(tabId){
    return new Promise((resolve, reject) => {
        chrome.tabs.goForward(parseInt(tabId))
        .then(resolve())
        reject();
        
    })
}

/**
 * This function updates the webpage
 * @param tabId
 *  The Id of the tab to update
*/
function refreshPage(tabId){
    return new Promise((resolve, reject) => {   
        chrome.tabs.reload(parseInt(tabId))
        .then(resolve())
        reject();
        
    })
}

/**
 * Opens the extensions page in a new tab
 * @param tabId
 *  The id of the tab that sent the message
 * @returns
 *  A promise
*/
function openExtensionsPage(tabId){
    return new Promise((resolve, reject) => {   
        chrome.windows.create({url: "chrome://extensions/", type: "popup"})
        .then(resolve())
        reject();
    })
}


/**
 * This function minimizes the window
 * @param tabId
 *  The id of the tab that sent the message
 * @returns
 *  A promise
*/
function minimizeWindow(tabId){
    return new Promise((resolve, reject) => {
        getWindowId()        
        chrome.windows.update(_WIN_ID, { state: "minimized" })
        resolve();
        //define window Id
    })  
}

/**
 * Retrieves an array containing all the tab's ids
 * @param tabId
 *  The id of the tab that sent the message
 * @returns
 *  A promise containing an int array
*/
function getTabsIds(){
    tabsIds = [];
    return new Promise((resolve, reject) => {  
        chrome.tabs.query({ currentWindow: true }, function (tabs) {
            tabs.forEach(tab => {
                tabsIds.push( parseInt(tab.id))                
            });
            resolve(tabsIds);
            //reject(errorMessage => {console.log("reject: ", errorMessage)})
        });
    })  
}

/**
 * closes all the tabs in a window
 * @param tabsIds
 *  An integer array indicating all the tab's ids
 * @returns
 *  A promise
 * @note
 *  This function, although it calls the remove function only once
 *      with an array of integers,
 *      It actually closes tab y tab.
 *  Therefore, opening the last closed tab (ctrl + shift + t)
 *      will reopen a new window with only a single tab
 *      rather than opening a new window with all the previous tabs
*/
function exitChrome(tabsids){
    console.log(tabsids);
    return new Promise((resolve, reject) => {  
        chrome.tabs.remove( tabsids )
        .then(resolve())
        reject();
    })    
}





























/**
 * refreshes the tab when a tab is changed with a method other than the extension
 * @note
 *  This functions sends a message to barCreator.js, 
 *  who updates the bar
 *  The parameter tabId defines which tab listens for the message
*/
chrome.tabs.onActivated.addListener(ans => {
    getActiveTabId()
    .then( tabId => {
        updateBar(tabId).then(ans => {});
    })
})


/**
 * This function returns a promise with the Id of the current active tab 
 * @return
 *  promise containing the id of the active tab
*/
function getActiveTabId(){
    return new Promise((resolve, reject) => {  
        chrome.tabs.query(
            {active:true,windowType:"normal", currentWindow: true},
            function(tabs){
                resolve(tabs[0].id)
                reject();  
            }
        )       
    })
}