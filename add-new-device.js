$(function(){

    initDevices();

    
    async function initDevices(){
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
    }
    
    
    $("#btnAddNewDevice").click(async function(){
        let deviceName = $("#deviceName").val();
        let deviceId   = $("#deviceId").val();
        let apiToken   = $("#apiToken").val();
        let pwd        = $("#pwd").val();

        
        if(deviceId === "" ) return;
        
        
        // read and write back to storage
        var device = { name: deviceName, id: deviceId, apiToken: apiToken, pwd: pwd };
        var devices = await getDevicesFromLocalStorage();
        devices[device.id] = device;
        browser.storage.local.set({ devices: devices});

        
        // browser.storage.sync.set({'key': 'val'});
        // browser.storage.managed.set({'key': 'val'});
        addNewDeviceToScreen(device);        
    })


    async function removeDeviceEvent(deviceId) {
        $(`#btnDelDevice${deviceId}`).click(async function() {
            $(`#deviceDivId${deviceId}`).remove();
            
            var devices = await getDevicesFromLocalStorage();
            delete devices[deviceId];
            browser.storage.local.set({ devices: devices});
        });
    }

    
    


    function getNewAddedDeviceHtml(device){
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

                   <button type="button" class="btn btn-primary">Save</button>
                   <button type="button" class="btn btn-danger" id="btnDelDevice${device.id}">Delete</button>
               </div>
           </div>`;
    }














    // Command

    initCmds();

    
    async function initCmds(){
        var cmds = await getCmdsFromLocalStorage();
        for (const [cmdId, cmd] of Object.entries(cmds)) {
            addNewCmdToScreen(cmd);
        }
    }

    function addNewCmdToScreen(cmd) {
        $("#divExistingCmds").append(getNewAddedCmdHtml(cmd));
        removeCmdEvent(cmd.id);
    }
    

    $("#btnAddNewCmd").click(async function(){
        let deviceId = $("#cmdDeviceId").val();
        let cmdId   = Date.now().toString();
        let cmdName = $("#cmdName").val();
        let cmdText   = $("#cmd").val();

        
        
        // read and write back to storage
        var cmd = { id: cmdId, name: cmdName, cmd: cmdText, deviceId: deviceId };
        var cmds = await getCmdsFromLocalStorage();
        cmds[cmd.id] = cmd;
        browser.storage.local.set({ cmds: cmds});

        
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
        $(`#btnDelCmd${cmdId}`).click(async function() {
            $(`#cmdDivId${cmdId}`).remove();
            
            var cmds = await getCmdsFromLocalStorage();
            delete cmds[cmdId];
            browser.storage.local.set({ cmds: cmds});
        });
    }

    


    function getNewAddedCmdHtml(cmd) {
        return `
             <div class="form-inline" id="cmdDivId${cmd.id}">
                 <label for="deviceName">Device Name:</label>
                 <select class="custom-select custom-select-mb" id="cmdDeviceId">
                     <!-- <option selected>Select Target Device......</option> -->
                     <option value="1">One</option>
                     <option value="2">Two</option>
                     <option value="3">Three</option>
                 </select>
                 
                 <label for="apiToken">Command Name:</label>
                 <input type="text" class="form-control" id="cmdName${cmd.id}" value="${cmd.name}">
                 <label for="cmd">Command:</label>
                 <input type="text" class="form-control" id="cmd${cmd.id}" value="${cmd.cmd}">
                 <button type="button" class="btn btn-primary">Save</button>
                 <button type="button" class="btn btn-danger" id="btnDelCmd${cmd.id}">Delete</button>
             </div>
        `;
    }; 


    
})
