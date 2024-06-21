# browser-in-browser
To enable rapid prototyping of browser chrome for user studies through browser chrome emulation within a browser render area


# About this version
-pinning tabs. This function does not allows to pin or unpin tabs in the extension. Instead, when you load your tabs, use the actual browser to pin your tabs. All the pinned tabs will appear as such in the extension, but again, the pinning and unpinning has to happen in the actual browser. 

Sadly, the bugs in chrome does not allow me to have full easy control over the order of the table, but as long as the pinned tabs are the first ones opens, they should appear listed at the leftmost side of the browser.

 

-timer. The variable is currently set to 330 seconds, so you have time to test your sites. Whenever you want to modify the time so it gets closed in different times, just change the value of the variable '_CLOSE_TAB_TIME_IN_SECONDS_' in line 20 of the file barController_OnLoad.js (value in seconds).

To disable the time completely you can pass a very large integer, or simply comment the line 89 from the same file, where it says ' startTimerForTab(_CLOSE_TAB_TIME_IN_SECONDS_, _TABS_NO_CLOSE_AFTER_TIME_)'.

To modify the list of pages that are excluded from the timer, modify the list of string _URLS_NO_CLOSE_BUTTON_. This variable is currently set to the same value as _URLS_NO_CLOSE_BUTTON_.

 

-no closing tabs.

This functionality hides the 'x' button from the tabs in selected hostnames. To modify the list of sites that cannot be closed, modify the variable '_URLS_NO_CLOSE_BUTTON_' in line 56. It is an array of strings ["site1", "site2", site3", ..., "siteN"].

 

-changeURL. The 'ctrl + b' shortcut controls the url that is being displayed

        0 - displays no url

        1 - displays the full url

        2 - displays only the qualified domain

To change the combination (only 'ctrl + someKey' allowed at the moment), modify the line 177 where it says 'event.key === "b"' for something like 'event.key === "k"'. This command is case sensitive, and might interfere with other commands from the browser.