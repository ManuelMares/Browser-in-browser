
/*========================Utility functions========================*/

/*
    Deletes the HTML node given an id
*/
function removeHTMLNode_byId(id){
document.getElementById(id).outerHTML = "";
}

/**
*   Removes a html node given a selector
*   @param selector
*       A string
*   @note
*       -   The id must include #
*       -   This is a strong deletion of nodes, as opposed to 
*           removeHTMLNode_byId()
*/
function removeHTMLNode(selector){
    if(elementExists(selector)){
        document.querySelector(selector).remove();
    }

    if(elementExists(selector))
        document.querySelector(selector).outerHTML = "";

//In case in needs TrustedHTML assignment
}

function elementExists(query){
    let el = document.querySelector(query);
    if(!el)
      return false;
    return true;
}
function isValidHTML(node){
    if(node == null)
        return false;
    return true;
}


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
              console.log("we are printing: ", htmlDir)
              content = content.replaceAll("BIB_EXTENSION_ID", BIB_EXTENSION_ID);
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
      if(!_USE_TIMER)
          return;
  
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
  