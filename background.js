// Manifest V3 Service Worker for Virtual Keyboard Extension
// Converted from V2 background.js

// Suppress common connection errors during tab initialization
const ignoreErrors = ['Receiving end does not exist', 'Extension context invalidated'];

// Message handler - converts all localStorage usage to chrome.storage
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request, sender)
        .then(sendResponse)
        .catch(error => {
            // Ignore common connection errors
            const shouldIgnore = ignoreErrors.some(msg => error.message.includes(msg));
            if (!shouldIgnore) {
                console.error('Error handling message:', error);
            }
            sendResponse({ error: error.message });
        });
    return true; // Required for async response
});

async function handleMessage(request, sender) {
    const { method } = request;

    switch (method) {
        case "getLocalStorage":
            return await getLocalStorage(request.key);

        case "getSmallKeyboardCoords":
            return await getSmallKeyboardCoords();

        case "loadKeyboardSettings":
            return await loadKeyboardSettings();

        case "initLoadKeyboardSettings":
            return await initLoadKeyboardSettings();

        case "setLocalStorage":
            return await setLocalStorage(request.key, request.value);

        case "openFromIframe":
            return await openFromIframe(request);

        case "clickFromIframe":
            return await clickFromIframe(request);

        case "toogleKeyboard":
            return await toggleKeyboard();

        case "toogleKeyboardOn":
            return await toggleKeyboardOn();

        case "toogleKeyboardDemand":
            return await toggleKeyboardDemand();

        case "toogleKeyboardOff":
            return await toggleKeyboardOff();

        case "openUrlBar":
            return await openUrlBar();

        case "createTab":
            chrome.tabs.create({ url: request.url });
            return { data: "ok" };

        default:
            return {};
    }
}

// Storage helper functions
async function getLocalStorage(key) {
    const result = await chrome.storage.local.get(key);
    return { data: result[key] };
}

async function getSmallKeyboardCoords() {
    const keys = [
        'smallKeyboard',
        'smallKeyboardTop',
        'smallKeyboardBottom',
        'smallKeyboardRight',
        'smallKeyboardLeft'
    ];
    const result = await chrome.storage.local.get(keys);
    return {
        smallKeyboard: result.smallKeyboard,
        smallKeyboardTop: result.smallKeyboardTop,
        smallKeyboardBottom: result.smallKeyboardBottom,
        smallKeyboardRight: result.smallKeyboardRight,
        smallKeyboardLeft: result.smallKeyboardLeft
    };
}

async function loadKeyboardSettings() {
    const keys = [
        'openedFirstTime',
        'capsLock',
        'smallKeyboard',
        'touchEvents',
        'keyboardLayout1',
        'urlButton',
        'keyboardEnabled'
    ];
    const result = await chrome.storage.local.get(keys);
    return {
        openedFirstTime: result.openedFirstTime,
        capsLock: result.capsLock,
        smallKeyboard: result.smallKeyboard,
        touchEvents: result.touchEvents,
        keyboardLayout1: result.keyboardLayout1,
        urlButton: result.urlButton,
        keyboardEnabled: result.keyboardEnabled
    };
}

async function initLoadKeyboardSettings() {
    const keys = [
        'hardwareAcceleration',
        'zoomLevel',
        'autoTrigger',
        'repeatLetters',
        'intelligentScroll',
        'autoTriggerLinks',
        'autoTriggerAfter',
        'refreshTime'
    ];
    const result = await chrome.storage.local.get(keys);
    return {
        hardwareAcceleration: result.hardwareAcceleration,
        zoomLevel: result.zoomLevel,
        autoTrigger: result.autoTrigger,
        repeatLetters: result.repeatLetters,
        intelligentScroll: result.intelligentScroll,
        autoTriggerLinks: result.autoTriggerLinks,
        autoTriggerAfter: result.autoTriggerAfter,
        refreshTime: result.refreshTime
    };
}

async function setLocalStorage(key, value) {
    await chrome.storage.local.set({ [key]: value });
    return { data: "ok", setted_key: key };
}

// Tab communication functions
async function openFromIframe(request) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        try {
            await chrome.tabs.sendMessage(tab.id, request);
        } catch (error) {
            // Ignore if tab not ready
        }
    }
    return { data: "ok" };
}

async function clickFromIframe(request) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        try {
            await chrome.tabs.sendMessage(tab.id, request);
        } catch (error) {
            // Ignore if tab not ready
        }
    }
    return { data: "ok" };
}

// Keyboard toggle functions
async function toggleKeyboard() {
    const { keyboardEnabled } = await chrome.storage.local.get('keyboardEnabled');
    const newState = (keyboardEnabled !== "false") ? "false" : "true";
    await chrome.storage.local.set({ keyboardEnabled: newState });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        await vkeyboard_loadPageIcon(tab.id);
        try {
            if (newState === "false") {
                await chrome.tabs.sendMessage(tab.id, "closeKeyboard");
            } else {
                await chrome.tabs.sendMessage(tab.id, "openKeyboard");
            }
        } catch (error) {
            // Ignore if tab not ready
        }
    }
    return { data: "ok" };
}

async function toggleKeyboardOn() {
    await chrome.storage.local.set({ keyboardEnabled: "true" });
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        await vkeyboard_loadPageIcon(tab.id);
        try {
            await chrome.tabs.sendMessage(tab.id, "openKeyboard");
        } catch (error) {
            // Ignore if tab not ready
        }
    }
    return { data: "ok" };
}

async function toggleKeyboardDemand() {
    await chrome.storage.local.set({ keyboardEnabled: "demand" });
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        await vkeyboard_loadPageIcon(tab.id);
        try {
            await chrome.tabs.sendMessage(tab.id, "openKeyboard");
        } catch (error) {
            // Ignore if tab not ready
        }
    }
    return { data: "ok" };
}

async function toggleKeyboardOff() {
    await chrome.storage.local.set({ keyboardEnabled: "false" });
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        await vkeyboard_loadPageIcon(tab.id);
        try {
            await chrome.tabs.sendMessage(tab.id, "closeKeyboard");
        } catch (error) {
            // Ignore if tab not ready
        }
    }
    return { data: "ok" };
}

async function openUrlBar() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        try {
            await chrome.tabs.sendMessage(tab.id, "openUrlBar");
        } catch (error) {
            // Ignore if tab not ready
        }
    }
    return { data: "ok" };
}

// Icon management
async function vkeyboard_loadPageIcon(tabId) {
    const { keyboardEnabled } = await chrome.storage.local.get('keyboardEnabled');
    
    let iconPath;
    if (keyboardEnabled === "demand") {
        iconPath = "buttons/keyboard_2.png";
    } else if (keyboardEnabled !== "false") {
        iconPath = "buttons/keyboard_1.png";
    } else {
        iconPath = "buttons/keyboard_3.png";
    }

    try {
        await chrome.action.setIcon({ tabId: tabId, path: iconPath });
    } catch (error) {
        console.error('Error setting icon:', error);
    }
}

// Tab update listener
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const { toogleKeyboard, keyboardEnabled } = await chrome.storage.local.get([
            'toogleKeyboard',
            'keyboardEnabled'
        ]);

        if (toogleKeyboard !== "false") {
            await vkeyboard_loadPageIcon(tabId);
        } else {
            await chrome.storage.local.set({ keyboardEnabled: "true" });
        }
    }
});

// Initialize
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('Virtual Keyboard extension installed/updated:', details.reason);
});

console.log('Virtual Keyboard service worker loaded');