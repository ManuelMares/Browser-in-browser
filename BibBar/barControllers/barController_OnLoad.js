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
* @author Manuel Mares, Xindi Zheng
*
******************************************************************************/
let _SEARCH_BAR                                 = null;
let _FULL_SCREEN_TOGGLE                         = false;
let _THIS_TAB_ID                                = null;
let _THIS_BAR                                   = null;
let _THIS_URL                                   = null;
let _USE_TIMER                                  = false;
const _CLOSE_TAB_TIME_IN_SECONDS_               = 15;                   //If you want the tabs to close after certain time, just indicate the time in seconds here
const _NO_PIN_HOSTS                             = [ ]                   //Might nor be fully working yet
const _URLS_NO_CLOSE_BUTTON_                    = [ ]                   //Add urls to this list to avoid users closing tabs by accident
const _TABS_NO_CLOSE_AFTER_TIME_                = [ ];                  //take the 'close' button away from the user in this list of pages
let _IS_MASTER                                  = false
const _MAKE_PINNED_TABS_INTO_MASTER_TABS        = true                  //use for experiments. If set to true, the return, back and refresh buttons disappear

let BIB_EXTENSION_ID                            = chrome.runtime.id;

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

    /* 
      THE FUNCTIONS AFTER THIS POINT WORK OVER THE BIB BAR, MEANING THEY CANNOT BE EXECUTED BEFORE BECAUSE THEY RELY ON THE HTML BEING LOADED.
      While using asyncQuery() guarantees the existence of the object, it is better to execute it after this point so there is not waiting time.
    */

    //Close the tab after (time in seconds, websites to not to close)
    //This function depend on _THIS_TAB_ID having a value (assigned at bib bar creation in barController_creator.js)
    //Therefore, this has to occur after the search bar is loaded
    startTimerForTab(_CLOSE_TAB_TIME_IN_SECONDS_, _TABS_NO_CLOSE_AFTER_TIME_)

    //make a wait here
    //turn bimi on    
    toBackground_GetPageValidatorStatus()
    .then(async show_page_validator => {
      displayBimiAndWebTraffic(show_page_validator);
      console.log(`show_page_validator: ${show_page_validator}`);
      if(show_page_validator == 1 || show_page_validator == 2){
        //display the web traffic popup
        var hint = await loadHintMessage();
        if (hint) {
            document.body.appendChild(hint);
            // Trigger the animation after appending the element
            requestAnimationFrame(() => {
                hint.classList.add('slide-down');
            });
        }
      }
    })

    //fullScreen
    var buttonFullScreen = document.getElementById("bib_Bar_TopContainer_WindowControls_ExitFullScreen");
    buttonFullScreen.addEventListener("click", ({click}) => {
        _FULL_SCREEN_TOGGLE = !_FULL_SCREEN_TOGGLE;
        setFullScreen();
    }) 

}

/**
* In charge of hiding of displaying the two buttons for BIMI and Web Traffic.
* @param show_page_validator
*   an integer
*/
function displayBimiAndWebTraffic(show_page_validator){
  if(show_page_validator == 0){
    //show only BIMI
    retrieveAndDisplayLogo();                                           //retrieves BIMI information
    removeHTMLNode('#bib_bar_BottomContainer_LeftMenu_HintButton');     //hides web traffic
  }
  else if(show_page_validator == 1){
    //show only web traffic
    removeHTMLNode('#bib_bar_BottomContainer_LeftMenu_circularLogo');   //hides bimi button
  }
  else if(show_page_validator == 2){
    //show BIMI and Web Traffic   
    retrieveAndDisplayLogo();                                           //retrieves BIMI information

  }
  else if(show_page_validator == 3){
    //show none
    removeHTMLNode('#bib_bar_BottomContainer_LeftMenu_circularLogo');   //hides bimi button
    removeHTMLNode('#bib_bar_BottomContainer_LeftMenu_HintButton');     //hides web traffic
  }
  
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






// ========================================================================================================
// =====================================GENERIC FUNCTIONS =================================================
// ========================================================================================================




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

/*
  Retrieve and display the logo using the BIMI API when the page loads
*/
function retrieveAndDisplayLogo() {
    const currentUrl = window.location.href;
    const domain = extractRootDomain(currentUrl);
  
    fetch(
      "https://cloudflare-dns.com/dns-query?name=default._bimi." +
        domain +
        "&type=TXT",
      {
        headers: {
          accept: "application/dns-json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP error ${response.status}`);
        }
      })
      .then((data) => {
        if (data && data.Answer && data.Answer.length > 0) {
          let logo = data.Answer[0].data.split(";")[1].trim().slice(2);
          showLogotype(logo, domain);
        } else {
          const circularLogo = document.getElementById("bib_bar_BottomContainer_LeftMenu_circularLogo");
          circularLogo.className = "hidden";
        }
      })
      .catch((error) => {
        console.error("Error fetching logo:", error);
      });
  }
  
  /*
    Display the logo in a div on the webpage
  */
  function showLogotype(svg, domain) {
    const circularLogo = document.getElementById("bib_bar_BottomContainer_LeftMenu_circularLogo");
    console.log(svg);
    if (!svg || svg.trim() === "") {
      if (circularLogo) {
        circularLogo.className = "hidden";
      }
      return;
    }
  
    if (circularLogo) {
      //key
      circularLogo.style.display = "block";
    } else {
      const logoContainer = document.createElement("div");
      logoContainer.className = "bib_bar_BottomContainer_LeftMenu_circularLogo";
      logoContainer.id = "bib_bar_BottomContainer_LeftMenu_circularLogo";
      document.body.appendChild(logoContainer);
    }
  
    const logoContainer = document.getElementById("bib_bar_BottomContainer_LeftMenu_circularLogo");
    logoContainer.innerHTML = `
      <img src="${svg}" alt="${domain} logo" style="max-width: 50px; height: auto; border-radius: 50%; border: 2px solid green;">
    `;
  }
  
/*
  Function to extract the root domain from a URL
*/
function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}
function extractRootDomain(url) {
  var domain = extractHostname(url),
    splitArr = domain.split("."),
    arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + "." + domain;
    }
  }
  return domain;
}
