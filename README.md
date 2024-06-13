# browser-in-browser
To enable rapid prototyping of browser chrome for user studies through browser chrome emulation within a browser render area

### How to test the most recent version
- Open the project in Github
- Download the code source as a zip file
- Extract the zip file into your computer
- Open chrome and go to chrome://extensions in a new tab
- Click on uncompressed load
- Select the previously extracted folder for the extension
- A blue toggle will indicate that the extension is active
- Open a new tab to test the extension
  - The extension will not work in url that have the format <chrome://*>
  - A button in the top right corner will allow you to enter the full screen mode for the extension

To follow the instructions, see the following link

https://user-images.githubusercontent.com/30966062/216696331-3bbba8b6-42b7-48d3-b7db-18dde5b5ffde.mp4

## How to add images
All the images must be referenced starting from src='chrome-extension://BIB_EXTENSION_ID/'
Either you are using an HTML template or dynamically loading an image, make sure they start with that string.
In case it is in a template, 'BIB_EXTENSION_ID' is the literal string. It will be replaced later automatically.
In case it is loaded dynamically, BIB_EXTENSION_ID is a global variable, and it must be concatenated: `chrome-extension://${BIB_EXTENSION_ID}/...`

## Chrome extensions in a nutshell
- All the configuration of the extension is given in the manifest.json file
  The most important sections of this file are the three:
  - Background.js
  - Scripts (js)
  - Resources (others)
### Background
  This is the script that runs in the service worker (chrom://extensions gives a link to the service worker by extension).
It is in charge of controlling the general behaviour of the browser. It controls the tabs(focus, open, close), windows(create, close, maximize, minimize, full-screen) and others. It should not control what happens inside each tab
### Scripts
  A copy of each loaded script will will run on each specified tab. For this extension, each script is loaded in each tab; which means that each tab will load their own copy of each script. These scripts control what happens inside each tab, being able to modify the html, css of js. Their output can be accesed in the console of each tab. There cannot be direct communication between the script of different tab (see section 'communicating all the parts'). A TAB CANNOT DIRECTLY LOAD ANY HTML OR CSS FILE
### Resources
  Any file that is not a js that needs to be in a page, has to be loaded as a resource, and has to be called explicitely. This includes html and css files, although the Scripts can create those on the fly with document.creator() and other related methods. To load a resource, a full access route has to be provided. This route starts with a string indicating the id of the chrome extension (visible at chrome://extensions)
### Comunicating all the parts
- To load resources into each webpage
  Although the Scripts cannot load resources like html, css of png file, it is possible to include by listing them as resources. In the particular case of css and html, these files have to be fetched and parsed into the innerHTML of a new html node created dinamically with Js. In other words, to use these file, a new element has to be created as var newNode = document.createHTMLNode('div') ('style' for css). Then, the inner html has to be set as the parsed html or css code
- To communicate between background and Scripts.
  To get a page to decide how the whole window/browser behaves, it is possible to send a promise to the background.js file This is the only way to communicate these files, and the promise must include a meaningful message that indicates what acction the background.js file should execute.
- To communicate between tabs
  Since it is possible for the background (and only the background) to communicate with pages, it is possible to send a message from a page to the background, and then return that message to the new tab to be reach
  
## To modify the browser-in-browser bar
### To modify the html and css files
  Most of the extension functionallity was abstracted in such way that to modify the current bar, it is enough to directly modify the current existing bar.html and bar.css files. To modify the more menu. To particularly modify the aspect of a tab or the more menu, the corresponding files are located in the components folder.
### To add new html and css files
  These files must be listed as resources in the manifest indicating the full route (see the 'communicating all the parts' section). The file in charge of loading these resources is any .js script needed. The files in charge of these are found in the barControllers folder.
### To add new Js scripts
  New js must be listed as scripts in the manifest, as well as the default webpage where a copy of it will be loaded. If any action has to be excuted onLoad of page, that particular action can be declared in the barController_OnLoad.js file in the barControllers folder. A copy of the script will be loaded into each tab, so the tabs cannot have direct communication.
