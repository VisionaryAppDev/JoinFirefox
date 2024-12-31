/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (e) => {

        /**
         * Given the name of a beast, get the URL to the corresponding image.
         */
        async function beastNameToURL(beastName) {
            switch (beastName) {
                case "Preference":
                    return browser.tabs.create({ url: "/preference.html" });
                // case "Backup":
                //     var devices = await browser.storage.local.get("devices");
                //     var cmds = await browser.storage.local.get("cmds");
                //     var data = Object.entries(devices, cmds) || {};
                //     if (data.length !== 0)
                //         console.log(JSON.stringify(data, null, 4));
                // break;
                case "Snake":
                    return browser.extension.getURL("beasts/snake.jpg");
                default:
                    alert(beastName)
            }
        }

        /**
         * Insert the page-hiding CSS into the active tab,
         * then get the beast URL and
         * send a "beastify" message to the content script in the active tab.
         */
        function beastify(tabs) {
            let url = beastNameToURL(e.target.textContent);
            browser.tabs.sendMessage(tabs[0].id, {
                command: "beastify",
                beastURL: url
            });
        }

        /**
         * Just log the error to the console.
         */
        function reportError(error) {
            console.error(`Could not beastify: ${error}`);
        }

        /**
         * Get the active tab,
         * then call "beastify()" or "reset()" as appropriate.
         */
        if (e.target.classList.contains("beast")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(beastify)
                .catch(reportError);
        }
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({ file: "/content_scripts/beastify.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
