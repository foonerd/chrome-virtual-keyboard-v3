async function kl_add() {
	var o = document.getElementById("al").options;
	for (var i = 0; i < o.length; i++) {
		if (o[i].selected) {
			var opt = document.createElement("option");
			opt.text = o[i].innerHTML;
			opt.value = o[i].value;
			var os = document.getElementById("sl").options;
			var exists = false;
			for (var i2 = 0; i2 < os.length; i2++) {
				if (os[i2].value == o[i].value) {
					exists = true;
				}
			}
			if (!exists) {
				document.getElementById("sl").options.add(opt);
			}
		}
	}
	await kl_save();
}

async function kl_save() {
	var a = new Array();
	var o = document.getElementById("sl").options;
	for (var i = 0; i < o.length; i++) {
		if (o[i].value != undefined) {
			a.push({ value: o[i].value, name: o[i].innerHTML });
		}
	}
	await chrome.storage.local.set({
		keyboardLayoutsList: JSON.stringify(a),
		keyboardLayout1: a[0].value
	});
	document.getElementById("changeEffect").className = "show";
}

async function kl_load() {
	const result = await chrome.storage.local.get('keyboardLayoutsList');
	if (result.keyboardLayoutsList != undefined) {
		var a = JSON.parse(result.keyboardLayoutsList);
		if (a.length > 0) {
			document.getElementById("sl").removeChild(document.getElementById("sl").options[0]);
			for (var i = 0; i < a.length; i++) {
				var opt = document.createElement("option");
				opt.text = a[i].name;
				opt.value = a[i].value;
				if (a[i].value != undefined) {
					document.getElementById("sl").options.add(opt);
				}
			}
		}
	}
}

async function kl_remove() {
	var o = document.getElementById("sl").options;
	if (o.length > 1) {
		for (var i = 0; i < o.length; i++) {
			if (o[i].selected) {
				document.getElementById("sl").removeChild(o[i]);
			}
		}
	}
	await kl_save();
}

window.addEventListener('load', async function () {
	document.body.className = "loaded";
	await kl_load();
	
	document.getElementById("kl_remove").addEventListener("click", kl_remove, false);
	document.getElementById("kl_add").addEventListener("click", kl_add, false);
	
	var c = document.getElementsByClassName("setting");
	
	// Get all settings keys first
	var settingsKeys = [];
	for (var i = 0; i < c.length; i++) {
		var sk = c[i].getAttribute("_setting");
		if (sk) {
			settingsKeys.push(sk);
		}
	}
	
	// Load all settings at once
	const allSettings = await chrome.storage.local.get(settingsKeys);
	
	// Process each setting element
	for (var i = 0; i < c.length; i++) {
		var sk = c[i].getAttribute("_setting");
		if (c[i].getAttribute("type") == "checkbox") {
			if ((allSettings[sk] == undefined) && (c[i].getAttribute("_default") != undefined)) {
				await chrome.storage.local.set({ [sk]: c[i].getAttribute("_default") });
				allSettings[sk] = c[i].getAttribute("_default");
			}
			if (allSettings[sk] == "true") {
				c[i].checked = true;
			}
		} 
		if (c[i].getAttribute("type") == "range") {
			if (allSettings[sk] == undefined) {
				c[i].value = 0;
			} else {
				c[i].value = allSettings[sk];
			}
		} else if (c[i].getAttribute("type") != "checkbox") {
			c[i].value = allSettings[sk];
		}
		
		c[i].onchange = async function () {
			var skey = this.getAttribute("_setting");
			if (this.getAttribute("type") == "checkbox") {
				const currentSettings = await chrome.storage.local.get(skey);
				if ((currentSettings[skey] == undefined) && (this.getAttribute("_default") != undefined)) {
					await chrome.storage.local.set({ [skey]: this.getAttribute("_default") });
				}
				await chrome.storage.local.set({ [skey]: this.checked ? "true" : "false" });
			} else {
				await chrome.storage.local.set({ [skey]: this.value });
			}
			document.getElementById("changeEffect").className = "show";
			if (this.getAttribute("_changed") != undefined) {
				callFunc(this.getAttribute("_changed"));
			}
		};
		
		if (c[i].getAttribute("_changed") != undefined) {
			callFunc(c[i].getAttribute("_changed"));
		}
	}
}, false);

function callFunc(callback) {
	// Call functions by name directly without eval
	try {
		if (typeof window[callback] === 'function') {
			window[callback]();
		} else {
			console.warn('Function not found:', callback);
		}
	} catch (e) {
		console.error('Error calling function:', e);
	}
}

function slider_zoom() {
	var v = document.getElementById("zoomLevel").value;
	if (v < 0.3) { v = "Auto"; } else { v = (v * 100).toFixed(0) + "%"; }
	document.getElementById("zoomLevelValue").innerHTML = v;
}

function checkbox_smallKeyboard() {
	var s = document.getElementById("smallKeyboard").checked;
	document.getElementById("zoomLevelLabel").style.display = s ? "none" : "block";
}

function checkbox_touchEvents() {
	var s = document.getElementById("touchEvents").checked;
	document.getElementById("autoTriggerPH").style.display = s ? "none" : "block";
}

function slider_autoTriggerAfter() {
	var v = document.getElementById("autoTriggerAfter").value + " sec";
	document.getElementById("autoTriggerAfterValue").innerHTML = v;
}

function checkbox_autoTrigger() {
	var s = !document.getElementById("autoTrigger").checked;
	document.getElementById("autoTriggerOnPH").style.display = s ? "none" : "block";
}
