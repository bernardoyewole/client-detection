'use strict';

// Utility functions
function select(selector, parent = document) {
    return parent.querySelector(selector);
}

function onEvent(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

// Main 
const os = select('.os');
const lang = select('.lang');
const browser = select('.browser');
const pageW = select('.width');
const pageH = select('.height');
const orientation = select('.orientation');
const batteryLevel = select('.battery-level');
const batteryStatus = select('.battery-status');
const connection = select('.connection');

function setWindowDimensions() {
    pageW.innerText = `Width: ${window.innerWidth}px`;
    pageH.innerText = `Height: ${window.innerHeight}px`;
}

function setOrientation() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (width > height) {
        return 'landscape';
    } else {
        return 'portrait';
    }
}

function online() {
    connection.classList.remove('offline');
    connection.innerText = `ONLINE`;
}

function offline() {
    connection.classList.add('offline');
    connection.innerText = `OFFLINE`;
}

onEvent('load', window, function() {
    if (navigator.userAgent.indexOf("Windows") != -1) {
        os.innerText = `OS: Windows`;
    } else if (navigator.userAgent.indexOf("Mac OS") != -1) {
        os.innerText = `OS: Mac OS`;
    } else {
        os.innerText = 'OS: Linux';
    } 
    lang.innerText = `Language: ${navigator.language}`;
    let browserArr = navigator.userAgent.split(' ');
    for (let i = browserArr.length - 1; i >= 0;  i--) {
        if (browserArr[i].match(/firefox/i)) {
            browser.innerText = `Browser: Firefox`;
            break;
        } else if (browserArr[i].match(/edg/i)) {
            browser.innerText = `Browser: Edge`;
            break;
        } else {
            browser.innerText = `Browser: Chrome`;
            break;
        }
    }
    setWindowDimensions();
    orientation.innerText = `Orientation: ${setOrientation()}`; 
    online();
});

onEvent('resize', window, function() {
    setWindowDimensions();
    orientation.innerText = `Orientation: ${setOrientation()}`;
});

onEvent('online', window, function() {
    online();
});

onEvent('offline', window, function() {
    offline(); 
});

window.navigator.getBattery().then((battery) => {
    function updateAllBatteryInfo() {
        updateChargeInfo();
        updateLevelInfo();
    }
    updateAllBatteryInfo();

    onEvent('chargingchange', battery, () => {
        updateChargeInfo();
    })
    function updateChargeInfo() {
        batteryStatus.innerText = `Status: ${battery.charging ? "charging" : "idle"}`
    }

    onEvent('levelchange', battery, () => {
        updateLevelInfo();
    })
    function updateLevelInfo() {
        batteryLevel.innerText = `Level: ${Math.round(battery.level * 100)}%`;
    }
}); 
