/******************************************************************************
* This script sets the correct location of the extension's bar in every webpage
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
* @author Manuel Mares
*
******************************************************************************/

/**
 * main function of the script
 * puts the bar in the right place
 * @param Bar   
 *  A HTML Node
*/
async function setBarInDOM(Bar){
    //add bar  and CSS to DOM
    document.body.appendChild(Bar); 
    document.body.appendChild(await getCSS("BibBar/webPage_addedStyles.css") );

    //get JSON
    var JSONFile = await getJson('BibBar/webpageModifiers.json');
    
    //Push website
    pushWebSite(JSONFile, Bar);
}

/**
 * Adjusts each website to fit the Bar
 * @param JSONFile
 *  The JSON file with styles for each website
 * @param Bar
 *  The Bar that will be added
*/
function pushWebSite(JSONFile, Bar){
    getPageStylesFromJSON(JSONFile)
    .then( stylesJSON => {
        classKeys = Object.keys(stylesJSON);
        var refreshKey = classKeys.pop()
        classKeys.forEach(classKey => {
            addClassToHTMLNodes(classKey, stylesJSON[classKey]);
        });
        conditionalUpload();
    })
}

function conditionalUpload(){

}


/**
 * Returns a JSON to modify a specific website
 * @param JSONFile
 *  The JSON file with styles for each website
 * @returns
 *  A promise with a JSONFile
*/
function getPageStylesFromJSON(JSONFile){
    return new Promise((resolve, reject) => {
        getTabURL()
        .then(tabURL => { return searchInJSON(JSONFile, tabURL); })
        .then( JSONSection => { resolve(JSONSection) })
    }) 
}

/**
 * Return the website key from a JSONFile
 * @param JSONFile
 *  The JSON file with styles for each website
 * @param tabURL
 *  The url of the current tab
*/
function searchInJSON(JSONFile, tabURL){
    webPagesKeys = Object.keys(JSONFile);
    return new Promise((resolve, reject) => {          
        webPagesKeys.forEach(key => {
            if( tabURL.includes(key) )
                resolve(JSONFile[key]);
        });
        reject();    
    }) 
}

/**
 * Given classes and a HTMLNode array, sets the corresponding class to each node
 * @param classKey
 * A String indicating the class to add
 * @param HTMLNodes
 *  The list of nodes to where the class will be added
*/
function addClassToHTMLNodes(classKey, HTMLNodes){
    if(HTMLNodes.length == 0)
        return;
    HTMLNodes.forEach(nodeName => {
        try {
            document.querySelector(nodeName).classList.add(classKey);        
        } catch (error){}
    });
}


