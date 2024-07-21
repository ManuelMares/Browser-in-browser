/******************************************************************************
* This script controls the options in the right side of the search bar in the extension's menu
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
* @author Manuel Mares, Xindi Zheng
*
******************************************************************************/

/**
 * This function manages eventListeners in the optionsMenu (actions triggered by clicks on buttons).
 * @param e
 *  An event
 * @note
 *  (1) open the extensions page
 *  (2) open more menu
 *  (3) Open option from more menu
 *  (4) close more menu
*/
document.addEventListener('click', function(e){
    //open extensions page
    if( e.target.id == "bib_bar_BottomContainer_LeftMenu_ExtensionsButton" ||
        e.target.id == "bib_bar_BottomContainer_LeftMenu_ExtensionIcon")
        openExtensionsPage();

    //open 'more'menu
    if( e.target.id == "bib_bar_BottomContainer_LeftMenu_MoreButton" ||
        e.target.id == "bib_bar_BottomContainer_LeftMenu_MoreIcon")
        openMoreMenu();
        if(e.target.dataset.ismoremenu == "true")
            openMoreMenuOption(e.target.id);
        else
        closeMoreMenu();
    
    //website traffic
    if( e.target.id == "bib_bar_BottomContainer_LeftMenu_HintButton" ||
        e.target.id == "bib_bar_BottomContainer_LeftMenu_HintIcon")
        openHintMessage();
    if (!e.target.closest('.bib_bar_Hint_Container') && !e.target.closest('#bib_bar_BottomContainer_LeftMenu_HintButton')) {
        closeHintMessage();
    }
})

/**
 * This function open a new tab showing the extensions of the browser
*/
function openExtensionsPage(){
    return new Promise((resolve, reject) => {        
      chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            type: "barController_optionsMenu_openExtensionsPage"
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
 * Creates and sets the more menu
*/
async function openMoreMenu(){
    var moreMenu = await loadMoreMenu();
    document.body.appendChild(moreMenu);
}

/**
 * Executes one of the options in the more menu
 * @param buttonId
 *  The button whose function must be activated
 * @returns
 *  A promise
*/
function openMoreMenuOption(buttonId){
    closeMoreMenu();
    var optionId = buttonId.replace("bib_", "");
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
        {
            tabId: _THIS_TAB_ID,
            option: optionId,
            type: "barController_optionsMenu"
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
 * loads the HTML Node containing the more menu
 * @return 
 *  HTML Node
*/
async function loadMoreMenu(){    
    closeMoreMenu()

    var moreMenuContainer = document.createElement('div');
    moreMenuContainer.setAttribute('class', "bib_bar_MoreMenu_Container");
    moreMenuContainer.setAttribute('id', "bib_bar_MoreMenu_Container");
    moreMenuContainer.setAttribute("data-isMoreMenu", "true")
    moreMenuContainer.innerHTML += await getHTMLElement("BibBar/Components/moreMenu/moreMenu.html");
    moreMenuContainer.appendChild(await getCSS("BibBar/Components/moreMenu/moreMenu.css") );
    
    return moreMenuContainer;
}

/**
 * Removes the more menu from the DOM
*/
async function closeMoreMenu(){
    var moreMenu = document.getElementById("bib_bar_MoreMenu_Container")
    if( moreMenu != null )
        moreMenu.remove()
}



async function openHintMessage(){
    var hint = await loadHintMessage();
    if (hint) {
        document.body.appendChild(hint);
        // Trigger the animation after appending the element
        requestAnimationFrame(() => {
            hint.classList.add('slide-down');
        });
    }
}


async function loadHintMessage() {
    closeHintMessage();

    const currentUrl = window.location.hostname.toLowerCase();
    const messages = await fetchMessages();

    let hintMessage = "Data not available";

    for (const [domain, message] of Object.entries(messages)) {
        console.log(`currentUrl ${currentUrl}, domain: ${domain}.`);
        if (currentUrl.includes(domain)) {
            hintMessage = message;
            break;
        }
    }

    var moreHintContainer = document.createElement('div');
    moreHintContainer.setAttribute('class', "bib_bar_Hint_Container");
    moreHintContainer.setAttribute('id', "bib_bar_Hint_Container");
    moreHintContainer.innerHTML = hintMessage;
    moreHintContainer.appendChild(await getCSS("BibBar/Components/hintContainer/hintContainer.css"));

    return moreHintContainer;
}

async function fetchMessages() {
        const response = await getJson("BibBar/WebPool.json");
        return response;
}


async function closeHintMessage(){
    var hint = document.getElementById("bib_bar_Hint_Container")
    if( hint != null )
        hint.remove()
}





