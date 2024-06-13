/******************************************************************************
* barCreator.js is a script that creates and loads the new extension's bar into the DOM
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

main();

/**
 * This function creates, sets and adds the bar into the DOM
 * @note
 *  1)This function is asyncronous, but this is a by-pass
 *    to the chrome extensions bugs with sendMessages
 *  2)loading the bar consists in 3 phases
 *  1) create the bar
 *  2) put it in the right place in the page
 *  3) add the tabs
 */
async function main(){
  //1)load bar
  var Bar = await loadBar()
  
  //2)put it in place
  setBarInDOM(Bar)

  //3) add tabs
  var tabs = await requestTabs()
  loadTabs(tabs);  
} 

/**
 * This function recieves messages from background.js
 * @note
 *  Case 1: background_UpdateBar
 *    updates the tabs in the bar
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type == "background_UpdateBar") 
      updateBar().then(ans => {sendResponse(ans)});                        
    return true;
  }
);

/**
 * This function updates the bar into the DOM
 * @note
 *  1)This functions cleans the tabs and reloads them
 *  2)It is not necessary to relocate the bar, just to reload the tabs
 *  3)This function is called by barController. 
 *    It is known due to scope of scripts
*/
async function updateBar(){
  return new Promise(async (resolve, reject) => { 
    var tabs = await requestTabs();  
    cleanTabs()
    .then(ans => {
      loadTabs(tabs);
    })
    .then(ans => {
      resolve();
    })

  })
}

/**
 * Deletes all the tabs
 * @returns promise
*/
async function cleanTabs(){
  return new Promise(async (resolve, reject) => { 
    var tabsContainer = document.getElementById("bib_Bar_TopContainer_Tabs");  
    tabsContainer.textContent = "";
    resolve();
  })
}

/**
 * Returns an array with the list of open tabs
 * @returns array
 *    An array ob objects tabs
 * @note
 *  This function internally is a promise
 *  to solve the asyncronous bug in the chrome extensions
*/
function requestTabs(){
  return new Promise((resolve, reject) => {   
    chrome.runtime.sendMessage(
      {type: "barController_tabs_RequesTab"},
      function (response) 
      {
        resolve( response );
        reject()
      }
    )
  })
}

/**
 * Creates the HTML Node without tabs to be added in the DOM
 * @returns HTML Node
 *    The Bar node
*/
async function loadBar(){
  /*Creating the wrapper*/
  _THIS_BAR = document.createElement('div');
  _THIS_BAR.setAttribute('class', 'bib_Bar_GeneralContainer');
  _THIS_BAR.setAttribute('id', 'bib_Bar_GeneralContainer');

  /*Settingt the html and css content*/
  _THIS_BAR.innerHTML += await getHTMLElement("BibBar/bar.html") ;
  _THIS_BAR.appendChild(await getCSS("BibBar/bar.css") );
  
  return _THIS_BAR;
}


/**
 * Adds a given list of tabs into the new Bar HTML
 * @param tabs
 *  An array with the tabs to be added
 * @note
 *  The bar is already in the DOM, so the tabs will automatically render
 *  The tabs are added into #bib_Bar_TopContainer_Tabs
*/
function loadTabs(tabs){
  var tabsContainer = document.getElementById("bib_Bar_TopContainer_Tabs");  
  addTabs(tabs, tabsContainer)
  .then( ans => {
    setToggleFullScreen();
  })
  .then( ans => {
    addTabsContainerCSS(tabsContainer)
  })
}

/**
 * Adds a list of tabs to a given HTML Node
 * @param tabs
 *    The array of tabs to add
 * @param tabsContainer
 *    The HTML Node where the tabs will be added
 * @returns promise
*/
function addTabs(tabs, tabsContainer){
  var index = 0;
  return new Promise((resolve, reject) => {
    tabs.forEach(tab => {      
      createTab(tabsContainer, tab, index);   
    });
    resolve();
    reject();
  })
}

/**
 * Sets the value of the toggle to be full scree
 * @returns promise
*/
function setToggleFullScreen(){
  return new Promise((resolve, reject) => {
    //request value and use return value
    getFullScreenToggleValue()
    .then(ans => {
      if(ans)
      document.getElementById("setFullScreen").setAttribute("checked", "checked");
      else
      document.getElementById("setFullScreen").removeAttribute("checked");      
    })
    .then( 
      resolve()
    )
    reject();
  })
}

/**
 * Adds a css-style HTML-Node-tag to an into a given HTML-Node
 * @param tabsContainer
 *    The HTML-Node where the style will be added
 * @note
 *    The styles will be displayed in the DOM, since they are added in line 
 *    as the innerHTML of the targ
*/
async function addTabsContainerCSS(tabsContainer){
  tabsContainer.appendChild(await getCSS("BibBar/Components/tab.css") );
}

/**
 * updates the value of the fullScreen toggle
*/
function getFullScreenToggleValue(){
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
          tabId: _THIS_TAB_ID,
          type: "getToggleStatus"
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
 * Creates a tab and adds it to the DOM
 * @param tabsContainer
 *  The DOM node where the tab is added
 * @param tab
 *  The tab String that is the basis to create the tab node
 * @param index
 *  This param is used internally to maintain the order of the tabs when rendered
*/
async function createTab(tabsContainer, tab, index){
  //There are two types of tabs: activeTab.html and innactiveTab.html
  //The properties to modify of each tab are:
  //  id:     #bib_Bar_TopContainer_Tabs_Tab (has to be changed for the actual id of the tab)
  //  icon:   bib_Bar_TopContainer_Tabs_TabIcon (set image)
  //  title:  bib_Bar_TopContainer_Tabs_TabTitle (set innerHTML)
  //While editing the properties of each tab, a temporary container is created
  //The temporary container is faster to use than retriving each tab from the DOM
  //The tabs are set into the DOM after being edited
  var tabId = tab["id"]
  var title = tab["title"]
  var icon = tab["favIconUrl"]
  var statusActive = tab["active"];
  var temporaryTab = document.createElement('div');

  var divisorBar = document.createElement('div');
  divisorBar.setAttribute('id', "Bib_tabDivisor"+tabId);
  divisorBar.setAttribute('class', "Bib_tabDivisor")

  
  /*------------Set the style of active and innactive tabs---------------*/
  if(statusActive){
    _THIS_TAB_ID = tabId;
    temporaryTab.innerHTML = await getHTMLElement("BibBar/Components/activeTab.html");
  }
  if(!statusActive){
    temporaryTab.innerHTML = await getHTMLElement("BibBar/Components/innactiveTab.html")
  }


  /*------------Sets the right attributes of the tab---------------*/
  //change id
  temporaryTab.children[0].setAttribute("id", tabId); //change the id
  //change icon
  if(icon != "")
    temporaryTab.children[0].children[0].setAttribute('src', icon);  //change the icon
  //change title
  temporaryTab.children[0].children[1].innerHTML = title;  //change the title
  

  tabsContainer.innerHTML += temporaryTab.innerHTML;
  if(!statusActive)
    tabsContainer.appendChild(divisorBar);
}

