window.addEventListener('load', function () {   
  //many bars are changed to fixed or sticky when scrolling. We want to run the algorithm only once.
  window.scrollBy(0, 30);
  setTimeout(function (){
    webStatus_Pushed = false;
    lastUrl = document.URL;
    try{
      startBrowserInBroswerMode();       
    }catch(error){
      alert(error + ":\n" +WARNING);
      console.log(WARNING);
      pushBody();
    }
  }, 200);
  
  window.scrollBy(0, 0);
})

async function startBrowserInBroswerMode(){
  pushWebsite();   
  loadCustomBar();
  await loadCustomBar();
}



// #region ================ BEGINNING REGION: LOAD BAR ===================================
async function loadCustomBar(){
  var customBar = await createBar();    
  document.documentElement.appendChild(customBar);
}

async function createBar(){
  var customBar = document.createElement('div');
  customBar.setAttribute("class", "customBar");
  customBar.setAttribute("id", "customBar");
  customBar.innerHTML = await getTextContent('Resources/Bar/bar.html');
  customBar.appendChild( await getCSS('Resources/Bar/bar.css') );   
  return customBar
}

async function getCSS(cssDir){
  var style = document.createElement( 'style' );
  style.innerHTML = await getTextContent(cssDir);
  return style;
}

async function getTextContent(dir){  
  return fetch(chrome.runtime.getURL(dir))
  .then((resp) => { return resp.text(); })
  .then((content) => { 
      content = content.replaceAll("BIB_EXTENSION_ID", BIB_EXTENSION_ID);
      return  content;
  });
}
// #endregion ============= END OF REGION: LOAD BAR ======================================



//#region ================ BEGINNING REGION: Push the body ==============================
async function pushWebsite(){    
  var classesWebsite = await getWEbsiteStyles('Resources/data.json');
  
  pushBody(classesWebsite["pushBody"]);
  setClass_ToListObjects_FromJSON("shrinkAndTranslate_porcentage", classesWebsite["shrinkAndTranslate_porcentage"]);
  setClass_ToListObjects_FromJSON("topMargin", classesWebsite["topMargin"]);
  setClass_ToListObjects_FromJSON("translate", classesWebsite["translate"]);
}


//These two methods: Read the current url and
//retrieve the JSON files that indicates which styles to apply and to which classes 
async function getWEbsiteStyles(dirJSON) {
  var url = document.URL
  var stylesJSonN = await getJson(dirJSON);  
  
  for (var key in stylesJSonN) {
    if(url.includes(key)){
      return stylesJSonN[key];
    }
  }
}
async function getJson(fileDir){
  return fetch(chrome.runtime.getURL(fileDir))
  .then((resp) => resp.json())
  .then(function (contentJSON) {
    //console.log(contentJSON);
    return contentJSON;
  });
}

//These two methods:
//Add the corresponding classes to the objects in each website
//with the given answer from the JSON
function pushBody(bodyClass){
  if (bodyClass == null || bodyClass.length == 0)
    return;
  document.body.classList.add(bodyClass); 
}
function setClass_ToListObjects_FromJSON(classToAdd, properties){
  listObjByClass = getListObject_FromProperties_ClassName(properties);
  listObjById = getListObject_FromProperties_IdName(properties);

  addNewClasses(classToAdd, listObjByClass);
  addNewClasses(classToAdd, listObjById);
}

//These methods:
//Get the lists of classes from the JSON and added them to the respective objects 
//that are also indicated in the JSON file
function addNewClasses(classToAdd, listObjects){
  if(listObjects == null || listObjects.length == 0)
    return;

  listObjects.forEach(element => {
    addClass(classToAdd, element)
  });
}
function addClass(className, element){
  if(element == null)
    return;

  if(element.classList.length == 0){
    element.addClass(className);
    return;
  }

  element.classList.add(className);
}
function getListObject_FromProperties_ClassName(props){
  //props is a JSON object with the key "class"
  //If the key is empty, return null, otherwise, return all the objects inside
  properties = props[0];

  var answer = null;
  length = properties["class"].length;
  if( length != 0 )  {
    answer = []
    properties["class"].forEach(element => {       
      answer.push( document.getElementsByClassName(element)[0] ) ;
    });
  }
  return answer;
}
function getListObject_FromProperties_IdName(props){
  //props is a JSON object with the key "id"
  //If the key is empty, return null, otherwise, return all the objects inside
  properties = props[0];

  var answer = null;
  length = properties["id"].length;
  if( length != 0 )  {
    answer = []
    properties["id"].forEach(element => {  
      answer.push( document.getElementById(element)) ;
    });
  }
  return answer;
}
//#endregion ================ END REGION: Push the body ==============================









//Some changes in content brake the extension. 
//A reload is forces to avoid conflicts
new MutationObserver(() => {
  const url = location.href;
  //google changes the address if you zoom in or out. It is not necessary to reload the extension because there are not changes in interface
  /* if (url !== lastUrl && !urlIncludes("google.com/maps")) {
    lastUrl = url;
    location.reload();
    onUrlChange();
  } */
  //console.log("something happened");
}).observe(document, {subtree: true, childList: true});

/* 
This function waits until an HTML element exists, and returns it when that happens
All process will stop until the element exists
@param selector
A selector property from the element to wait for
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
function asyncQueryAll(selector) {
  return new Promise(resolve => {
      if (document.querySelectorAll(selector)) {
          return resolve(document.querySelectorAll(selector));
      }
      const observer = new MutationObserver(mutations => {
          if (document.querySelectorAll(selector)) {
              resolve(document.querySelectorAll(selector));
              observer.disconnect();
          }
      });
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}




































function newFunction(){
  var height = '40px';

  var generalWrapper = document.createElement('div');
  generalWrapper.setAttribute("class","generalWrapper");
  generalWrapper.setAttribute("id","generalWrapper");

  var generalWrapperHigh = document.createElement('div');
  generalWrapperHigh.setAttribute("class", "generalWrapperHigh");
  generalWrapperHigh.setAttribute("id", "generalWrapperHigh");

  var container = document.createElement("div");
  container.setAttribute('class', 'container');
  container.setAttribute('id', 'container');

  var button = document.createElement("button");
  button.setAttribute('class', 'button');
  button.setAttribute('id', 'button1');
  //button.setAttribute('src', 'homeIcon.png')

  var buttonOne = document.createElement("button");
  buttonOne.setAttribute('class', 'button');
  buttonOne.setAttribute('id', 'buttonOne');

  var buttonTwo = document.createElement("button");
  buttonTwo.setAttribute('class', 'button');
  buttonTwo.setAttribute('id', 'buttonTwo');

  var buttonThree = document.createElement("button");
  buttonThree.setAttribute('class', 'button');
  buttonThree.setAttribute('id', 'buttonThree');

  var containerTwo = document.createElement("div");
  containerTwo.setAttribute('class', 'containerTwo');
  containerTwo.setAttribute('id', 'container2');

  var textBar = document.createElement("div");
  textBar.setAttribute('class', 'textBar');
  textBar.setAttribute('id', 'textBar1');

  var containerThree = document.createElement("div");
  containerThree.setAttribute('class', 'containerThree');
  container.setAttribute('id', 'container3');

  var buttonFour = document.createElement("button");
  buttonFour.setAttribute('class', 'buttonRight');
  buttonFour.setAttribute('id', 'button4');

  var buttonFive = document.createElement("button");
  buttonFive.setAttribute('class', 'buttonRight');
  buttonFive.setAttribute('id', 'button5');

  var buttonSix = document.createElement("button");
  buttonSix.setAttribute('class', 'buttonRight');
  buttonSix.setAttribute('id', 'button6');

  var buttonSeven = document.createElement("button");
  buttonSeven.setAttribute('class', 'buttonRight');
  buttonSeven.setAttribute('id', 'button7');


  //Left Side
  container.appendChild(button);
  container.appendChild(buttonOne);
  container.appendChild(buttonTwo);
  container.appendChild(buttonThree);
  //Middle
  containerTwo.appendChild(textBar);
  //Right side
  containerThree.appendChild(buttonFour);
  containerThree.appendChild(buttonFive);
  containerThree.appendChild(buttonSix);
  containerThree.appendChild(buttonSeven);
  //Whole Browser Bar Area
  generalWrapper.appendChild(container);
  generalWrapper.appendChild(containerTwo);
  generalWrapper.appendChild(containerThree);
  //Whole top of screen including tabs and browser bar/icons
  var father = document.createElement("div");
  father.setAttribute("class","father");

  father.appendChild(generalWrapperHigh);
  father.appendChild(generalWrapper);
  return father;
  //body.appendChild(generalWrapper);
}



