//THE VALUE OF THE TOOGLE IS NOT PERSISTENT BECAUSE THE POPUP IS RE-CREATED EVERY TIME
//it is necessary to sent a message from here asking for the current value of the toogle
//which are stored in background.js (since that's where they are used, here they are displayed and controlled)

//Initialize toggle
//let expandScreen = document.getElementById("expandScreen");
let setFullScreen = document.getElementById("setFullScreen");


window.onload = function SetValueToggles() {
    //This function garaties that the pop up already exists
    
    //This function is called first everytime the popup is created
    //It retrives the values of the toggle (a second toggle is commented)
    
    chrome.runtime.sendMessage(
        {type: "popup_toggleValues"},
        function (valueToggleFullScreen) 
        {
            //this.expandScreen.checked = Expand;
            this.setFullScreen.checked = valueToggleFullScreen;
        }
    );
}



//To go full screen
setFullScreen.addEventListener('change', (e) => {
    this.checkboxValue = e.target.checked ? true : false;
    chrome.runtime.sendMessage(
        {content: checkboxValue,
        type: "popup_GoFullScreen"},
        function (response) 
            {console.log("Full-screen has been modified",response);}
    );
})

//To expand full screen
/* expandScreen.addEventListener('change', (e) => {
    this.checkboxValue = e.target.checked ? true : false;
    chrome.runtime.sendMessage({
        content: checkboxValue,
        type: "popup_ExpandScreen",
        function (response) {
            this.checkboxValue = response;
        }
    });
}) */


  

