$(function () {

    initDevices();


    async function initDevices() {
        var devices = await getDevicesFromLocalStorage();
        for (const [deviceId, device] of Object.entries(devices)) {
            addNewDeviceToScreen(device);
        }
    }


    async function getDevicesFromLocalStorage() {
        var devices = await browser.storage.local.get("devices");
        devices = typeof devices.devices === 'undefined' ? {} : devices.devices;

        return devices;
    }


    function addNewDeviceToScreen(device) {
        $("#divExistingDevices").append(getNewAddedDeviceHtml(device));
        removeDeviceEvent(device.id);
        updateDeviceEvent(device.id);
    }


    $("#btnAddNewDevice").click(async function () {
        let deviceName = $("#deviceName").val();
        let deviceId = $("#deviceId").val();
        let apiToken = $("#apiToken").val();
        let pwd = $("#pwd").val();


        if (deviceId === "") return;


        // read and write back to storage
        var device = { name: deviceName, id: deviceId, apiToken: apiToken, pwd: pwd };
        var devices = await getDevicesFromLocalStorage();
        devices[device.id] = device;
        browser.storage.local.set({ devices: devices });


        // browser.storage.sync.set({'key': 'val'});
        // browser.storage.managed.set({'key': 'val'});
        addNewDeviceToScreen(device);
    })


    async function removeDeviceEvent(deviceId) {
        $(`#btnDelDevice${deviceId}`).click(async function () {
            $(`#deviceDivId${deviceId}`).remove();

            var devices = await getDevicesFromLocalStorage();
            delete devices[deviceId];
            browser.storage.local.set({ devices: devices });
        });
    }

    async function updateDeviceEvent(deviceId) {
        $(`#btnUpdateDevice${deviceId}`).click(async function () {
            // alert(deviceId);
            if (deviceId === "") return;

            // let newDeviceId = $(`#deviceId${deviceId}`).val();
            let deviceName = $(`#deviceName${deviceId}`).val();
            let apiToken = $(`#apiToken${deviceId}`).val();
            let pwd = $(`#pwd${deviceId}`).val();

            // TODO:
            // allow to update device id,
            // set deviceId = new device id from form
            // delete old data because add new device id will create another record
            // loop through cmds and update

            var device = { name: deviceName, id: deviceId, apiToken: apiToken, pwd: pwd };
            var devices = await getDevicesFromLocalStorage();
            devices[device.id] = device;
            browser.storage.local.set({ devices: devices });
        });
    }





    function getNewAddedDeviceHtml(device) {
        return `
           <div class="container-fluid" id="deviceDivId${device.id}">
               <div class="form-inline">
                   <label for="deviceName">Device Name:</label>
                   <input type="text" class="form-control" id="deviceName${device.id}" value="${device.name}">

                   <label for="deviceName">Device Id:</label>
                   <input type="text" class="form-control" id="deviceId${device.id}" value="${device.id}">

                   <label for="apiToken">Api token:</label>
                   <input type="text" class="form-control" id="apiToken${device.id}" value=${device.apiToken}>

                   <label for="pwd">Password:</label>
                   <input type="password" class="form-control" id="pwd${device.id}" value=${device.pwd}>

                   <button type="button" class="btn btn-primary" id="btnUpdateDevice${device.id}">Save</button>
                   <button type="button" class="btn btn-danger" id="btnDelDevice${device.id}">Delete</button>
               </div>
           </div>`;
    }














    // Command

    initCmds();


    async function initCmds() {
        //
        // $("#cmdDeviceId option").remove();
        var devices = await getDevicesFromLocalStorage();
        for (const [deviceId, device] of Object.entries(devices)) {
            $("#cmdDeviceId").append(new Option(device.name, device.id));
        }


        //
        var cmds = await getCmdsFromLocalStorage();
        for (const [cmdId, cmd] of Object.entries(cmds)) {
            addNewCmdToScreen(cmd);
        }
    }

    async function addNewCmdToScreen(cmd) {
        var newAddedCmdHtml = await getNewAddedCmdHtml(cmd);
        $("#divExistingCmds").append(newAddedCmdHtml);
        removeCmdEvent(cmd.id);
        updateCmdEvent(cmd.id);
    }


    $("#btnAddNewCmd").click(async function () {
        let deviceId = $("#cmdDeviceId").val();
        let cmdId = Date.now().toString();
        let cmdName = $("#cmdName").val();
        let cmdText = $("#cmd").val();
        let cmdExtraData = $("#cmdExtraData").val();



        // read and write back to storage
        var cmd = { id: cmdId, name: cmdName, cmd: cmdText, deviceId: deviceId, extraData: cmdExtraData };
        var cmds = await getCmdsFromLocalStorage();
        cmds[cmd.id] = cmd;
        browser.storage.local.set({ cmds: cmds });


        // browser.storage.sync.set({'key': 'val'});
        // browser.storage.managed.set({'key': 'val'});
        addNewCmdToScreen(cmd);
    })

    async function getCmdsFromLocalStorage() {
        var cmds = await browser.storage.local.get("cmds");
        cmds = typeof cmds.cmds === 'undefined' ? {} : cmds.cmds;

        return cmds;
    }


    async function removeCmdEvent(cmdId) {
        $(`#btnDelCmd${cmdId}`).click(async function () {
            $(`#cmdDivId${cmdId}`).remove();

            var cmds = await getCmdsFromLocalStorage();
            delete cmds[cmdId];
            browser.storage.local.set({ cmds: cmds });
        });
    }

    async function updateCmdEvent(cmdId) {
        $(`#btnSaveCmd${cmdId}`).click(async function () {
            let deviceId = $(`#cmdDeviceId${cmdId}`).val();
            let cmdName = $(`#cmdName${cmdId}`).val();
            let cmdText = $(`#cmd${cmdId}`).val();
            let cmdExtraData = $(`#cmdExtraData${cmdId}`).val();



            // read and write back to storage
            var cmd = { id: cmdId, name: cmdName, cmd: cmdText, deviceId: deviceId, extraData: cmdExtraData };
            var cmds = await getCmdsFromLocalStorage();
            cmds[cmd.id] = cmd;
            browser.storage.local.set({ cmds: cmds });
        });
    }




    async function getNewAddedCmdHtml(cmd) {
        var devices = await getDevicesFromLocalStorage();
        return `
             <div class="form-inline" id="cmdDivId${cmd.id}">
                 <label for="deviceName">Device Name:</label>
                 <select class="custom-select custom-select-mb" id="cmdDeviceId${cmd.id}">
                     ${Object.entries(devices).map(device =>
            `<option value="${device[1].id}" ${cmd.deviceId == device[1].id ? "selected" : ""}>
                            ${device[1].name}
                        </option>
                     `)}
                 </select>

                 <label for="apiToken">Command Name:</label>
                 <input type="text" class="form-control" id="cmdName${cmd.id}" value="${cmd.name}">
                 <label for="cmd">Command:</label>
                 <input type="text" class="form-control" id="cmd${cmd.id}" value="${cmd.cmd}">

                  <label for="deviceName">Extra Data:</label>
                    <select class="custom-select custom-select-mb" id="cmdExtraData${cmd.id}">
                        <option value="none" ${cmd.extraData == "none" ? "selected" : ""}>None</option>
                        <option value="clipboard" ${cmd.extraData == "clipboard" ? "selected" : ""}>Clipboard</option>
                        <option value="currentPageUrl" ${cmd.extraData == "currentPageUrl" ? "selected" : ""}>Current Page Url</option>
                        <option value="link" ${cmd.extraData == "link" ? "selected" : ""}>Link</option>
                        <option value="selectedText" ${cmd.extraData == "selectedText" ? "selected" : ""}>Selected Text</option>
                    </select>
                 <button type="button" class="btn btn-primary" id="btnSaveCmd${cmd.id}">Save</button>
                 <button type="button" class="btn btn-danger" id="btnDelCmd${cmd.id}">Delete</button>
             </div>
        `;
    };


    initTestDevices();

    async function initTestDevices() {
        var devices = await getDevicesFromLocalStorage();
        Object.entries(devices).forEach((device, ind) => {
            var option = new Option(device[1].name, `testDevice${device[1].id}`);
            $("#testDevices").append(option);
            // option.data(device);
            option.setAttribute('data-id', device[1])
        });

        console.log("")
    }

    sendTestCmdEvent();

    async function sendTestCmdEvent() {
        $("#btnSendTestCmd").click(async function () {
            var testCmd = $("#testCmd").val().trim();
            var selectedDevice = $("#testDevices").val();
            var device = {};


            var devices = await getDevicesFromLocalStorage();
            for (const [deviceId, device_] of Object.entries(devices)) {
                if (selectedDevice == `testDevice${device_.id}`) {
                    device = device_;
                }
            }

            var pwd = device.pwd != "" ? `&password=${device.pwd}` : "";
            var cmd = `${device.apiToken}&${testCmd}${pwd}`;
            fetch(cmd)
                .then(function (response) {
                    return response;
                })
                .then(function (myJson) {
                    console.log((myJson));
                });
        })
    }




    //// Context menu
    async function onCreated() {
        var currentUrl = await browser.tabs.getCurrent().url;
        console.log(await browser.tabs.getCurrent());

        if (browser.runtime.lastError) {
            console.log(`Error: ${browser.runtime.lastError}`);
        } else {
            console.log("Item created successfully");

        }
    }
    initDevicesMenu();
    initCmdsMenu();


    async function initDevicesMenu() {
        var devices = await getDevicesFromLocalStorage();
        for (const [deviceId, device] of Object.entries(devices)) {
            browser.menus.create({
                id: `device${device.id}`,
                title: device.name,
                contexts: ["all"],
            }, onCreated);

            // clipboard: -text. to phone clip

            // link: -text, -open link

            // selected text: -

            // current page: -text, -   link

            // download youtube

            //
        }
    }

    async function initCmdsMenu() {
        var cmds = await getCmdsFromLocalStorage();
        for (const [cmdId, cmd] of Object.entries(cmds)) {
            if(cmd.extraData == "link"){
                browser.contextMenus.create({
                    id: `cmd${cmdId}`,
                    parentId: `device${cmd.deviceId}`,
                    title: cmd.name,
                    contexts: ["link"],
                });
            }
            else {
                browser.menus.create({
                    id: `cmd${cmd.id}`,
                    parentId: `device${cmd.deviceId}`,
                    title: `cmd${cmd.name}`,
                    contexts: ["all"],
                }, onCreated);
            }
        }
    }


    // browser.menus.create({
    //     id: "separator1-1",
    //     type: "separator",
    //     contexts: ["all"]
    // }, onCreated);



    // browser.contextMenus.create({
    //     id: "copy-link-to-clipboard",
    //     title: "Copy link to clipboard",
    //     contexts: ["link"],
    // });


    browser.menus.onClicked.addListener((info, tab) => {
        // switch (info.menuItemId) {
        //     case "remove-me":
        //         var removing = browser.menus.remove(info.menuItemId);
        //         removing.then(onRemoved, onError);
        //         break;
        // }




        //
        getCmdsFromLocalStorage().then(function(cmds){
            for (const [cmdId, cmd] of Object.entries(cmds)) {
                if (typeof cmd  !== 'undefined' && cmd.id != "" && info.menuItemId.includes(cmd.id))
                {
                    console.log(cmd)
                    getDevicesFromLocalStorage().then(devices => {
                        for (const [deviceId, device] of Object.entries(devices)) {
                            if (cmd.deviceId==device.id){

                                // TODO: send message here
                            }
                        }
                    });


                    return;
                }
            }
        });


        // console.log(tab);
        // console.log(info);

        // Get the select page
        console.log("he "+content.getSelection().toString());
        console.log("pas"+document.execCommand("paste"))



        // read clipboard
        // navigator.clipboard.readText().then(text => text);


        // Get current page url
        // console.log(await browser.tabs.getCurrent());



    });

    function getExtraData(cmd) {
        if(cmd.extraData === "none")
            return "";
        else if (cmd.extraData === "clipboard")
            return "";
        else if (cmd.extraData === "currentPageUrl")
            return "";
        else if (cmd.extraData === "link")
            return "";
        else if (cmd.extraData === "selectedText")
            return "";

    }
})
