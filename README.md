# browser-in-browser
To enable rapid prototyping of browser chrome for user studies through browser chrome emulation within a browser 
render area



# About this version
- Pinning tabs. 
CAREFUL! This function does not allows you to pin or unpin tabs in the extension. Instead, when you load your tabs, 
use the actual browser to pin your tabs. All the pinned tabs will appear as such in the extension, but again, 
the pinning and unpinning has to happen in the actual browser. 

Workflow: start the browser, pin the tabs you want pinned in the ACTUAL browser. Refresh the page. Then you will
see the pinned status is reflected in the extension

- Timer. 
To close the tabs after certain time, you can indicate it in line 
'const _CLOSE_TAB_TIME_IN_SECONDS_ = 330; '
The timer is not enabled by default. To enable it, update the variable _USE_TIMER at barController_OnLoad.js

To modify the list of pages that are excluded from the timer, modify the list of string _URLS_NO_CLOSE_BUTTON_. 

- No closing tabs.
This functionality hides the 'x' button from the tabs in selected hostnames.
Update the list of pages with this feature in barController_OnLoad > _URLS_NO_CLOSE_BUTTON_

 

- Change URL version. The 'ctrl + b' shortcut controls the url that is being displayed

        0 - displays no url

        1 - displays the full url

        2 - displays only the qualified domain

To change the combination (only 'ctrl + someKey' allowed at the moment), modify the line of barController_OnLoad where it says 'event.key === "b"' for something like 'event.key === "k"'. This command is case sensitive, and might interfere with other commands from the browser. Be careful when choosing hotkeys.


## How to add images

All the images must be referenced starting from src='chrome-extension://BIB_EXTENSION_ID/'
Either you are using an HTML template or dynamically loading an image, make sure they start with that string.
In case it is in a template, 'BIB_EXTENSION_ID' is the literal string. It will be replaced later automatically.
In case it is loaded dynamically, BIB_EXTENSION_ID is a global variable, and it must be concatenated: `chrome-extension://${BIB_EXTENSION_ID}/...`
