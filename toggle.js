window.addEventListener('load', async function() {
	// Get initial state
	const { keyboardEnabled } = await chrome.storage.local.get('keyboardEnabled');
	
	// Set active button based on state
	if (keyboardEnabled === "demand") {
		document.getElementById("toggleDemand").className = "active";
	} else if (keyboardEnabled !== "false") {
		document.getElementById("toggleOn").className = "active";
	} else {
		document.getElementById("toggleOff").className = "active";
	}

	document.getElementById("toggleOn").onclick = async function() {
		await chrome.runtime.sendMessage({method: "toogleKeyboardOn"});
		window.close();	
	};

	document.getElementById("settings").onclick = function() {
		window.open(chrome.runtime.getURL("options.html"));
	};

	document.getElementById("toggleOff").onclick = async function() {
		await chrome.runtime.sendMessage({method: "toogleKeyboardOff"});
		window.close();	
	};

	document.getElementById("toggleDemand").onclick = async function() {
		await chrome.runtime.sendMessage({method: "toogleKeyboardDemand"});
		window.close();	
	};

	document.getElementById("goToUrl").onclick = async function() {
		await chrome.runtime.sendMessage({method: "openUrlBar"});
		window.close();
	};

}, false);
