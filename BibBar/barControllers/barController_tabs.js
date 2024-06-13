/******************************************************************************
* barController_tabs.js is a script in change of manage the functionallity of the extension's bar
*
* @note
*   (1) This script is loaded before barCreator.js in manigest.json
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
 * This function checks if a tab has been clicked
*/
document.addEventListener('click', function(e){
    if(e.target.dataset.istab == "true")
      manageTabs(e);
    if(e.target.id == "bib_Bar_TopContainer_WindowControls_AddTab")
      addTab(e);
})

/**
 * This function creates a new tab
*/
function addTab(e){
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
          tabId: e.target.id,
          type: "barController_tabs_AddTab"
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
 * This function manages the focusing, creation and closing of  tabs
 * @param e
 *    An event object indicating which element has been clicked
 * @note
 *  An easy way to check what to do with the clicked element
 *    is to add a data-property to the tags, for easy validations
*/
function manageTabs(e){
    var isTabHolder = e.target.dataset.istabholder;
    var isCloseButton = e.target.dataset.isclosebutton;
    var tabId = isTabHolder == "true" ? e.target.id : e.target.parentNode.id;

    if(isCloseButton == "true"){ 
      closeTabController(tabId)
      .then(ans => { 
        document.getElementById(tabId).remove();
        document.getElementById("Bib_tabDivisor"+tabId).remove();
      });
    }
    else{
        focusTab(tabId);
    }
}

/**
 * Closes the indicated tab, and focused in the corresponding new active tab
 * @param tabId
 *    The id of the tab to close
 * @return
 *    A promise
*/
function closeTabController(tabId){
  return new Promise((resolve, reject) => {
    focusNewActiveTab(tabId)
    closeTab(tabId)
    .then(resolve());
  })
}

/**
 * Chosses a the next tab to focused in when current is closed
 * @param tabId
 *    The tab to close
 * @note
 *  it will try to focused in next tab on the right
 *  if there is not next tab it will focused in previous tab
 *  if current is the only tab, nothing happends. The window will be closed
*/
async function focusNewActiveTab(tabId){
  var ids = await getTabsIds();
  var indexThisTab = ids.indexOf(_THIS_TAB_ID);

  if(tabId == _THIS_TAB_ID){
    if( indexedDB.length > indexThisTab)
      focusTab( ids[indexThisTab + 1] )
    else
      focusTab( ids[indexThisTab - 1] )
  }
}

/**
 * Returns an array with the id of the tabs
 * @return 
 *    array of integers
 * @note
 *  This function has to be awaited for when called (from a async function)
*/
async function getTabsIds(){
  var tabs = await requestTabs(); 
  var ids = []
  tabs.forEach(tab => {
    ids.push(tab["id"])
  });
  return ids;
}

/**
 * This function closes a tab
 * @param tabId
 *    The id of the tab to close
 * @returns 
 *  A promise
*/
function closeTab(tabId){  
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
          tabId: tabId,
          type: "barController_tabs_CloseTab"
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
 * Focuses a tab
 * @param tabId
 *  An id indicating what tab to focuse
 * @returns 
 *  A promise
*/
function focusTab(tabId){
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
          tabId: tabId,
          type: "barController_tabs_FocusTab"
      },
      function (response) 
      {
        resolve( response );
        reject(ans => {console.log("reject: ", ans)})
      }
    )
  })
}



