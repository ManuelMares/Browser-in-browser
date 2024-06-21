var height = '40px';
var iframe = document.createElement('iframe');
iframe.src = chrome.runtime.getURL('toolbar.html');
iframe.style.height = '10%';
iframe.style.width = '100%';
iframe.style.position = 'fixed';
iframe.style.top = '0';
iframe.style.left = '0';
iframe.style.zIndex = '938089'; 

document.documentElement.appendChild(iframe);

var bodyStyle = document.body.style;
var cssTransform = 'transform' in bodyStyle ? 'transform' : 'webkitTransform';
bodyStyle[cssTransform] = 'translateY(' + height + ')';

/*var button = document.getElementById("generalWrapper");

var body = document.body;
var generalWrapper = document.createElement('div');
generalWrapper.setAttribute("class","wrapper");
generalWrapper.setAttribute("id","generalWrapper");

var buttonContainer = document.createElement('div');
buttonContainer.setAttribute("class", "buttonsWrapper");
buttonContainer.setAttribute("id", "buttonContainer");

var test1 = docuemnt.createElement('div');
test1.setAttribute("class", "button");
test1.setAttribute("id", "test1");;
test1.innerHTML('Read Me');

buttonContainer.appendChild(test1);
generalWrapper.appendChild(buttonContainer);
body.appendChild(generalWrapper);

document.addEventListener('DOMContentLoaded', function() {
    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = 'Press me';
    button.className = 'btn-styled';
 
    button.onclick = function() {
        // …
    };
 
    var container = document.getElementById('container');
    container.appendChild(button);
}, false);*/

var body = document.body;
// console.log('Working!');

var generalWrapper = document.createElement('div');
generalWrapper.setAttribute("class","wrapper");
generalWrapper.setAttribute("id","generalWrapper");

var generalWrapperHigh = document.createElement('div');
generalWrapperHigh.setAttribute("class", "wrapper");
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
container.setAttribute('class', 'containerTwo');
container.setAttribute('id', 'container2');

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
generalWrapper.appendChild(containerThree);
generalWrapper.appendChild(container);
generalWrapper.appendChild(containerTwo);
//Whole top of screen including tabs and browser bar/icons
body.appendChild(generalWrapper);