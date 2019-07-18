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
        updateDeviceEvent(device.id);
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

    async function updateDeviceEvent(deviceId) {
        $(`#btnUpdateDevice${deviceId}`).click(async function(){
            // alert(deviceId);
            if(deviceId === "" ) return;

            // let newDeviceId = $(`#deviceId${deviceId}`).val();
            let deviceName = $(`#deviceName${deviceId}`).val();
            let apiToken   = $(`#apiToken${deviceId}`).val();
            let pwd        = $(`#pwd${deviceId}`).val();

            // TODO:
            // allow to update device id,
            // set deviceId = new device id from form
            // delete old data because add new device id will create another record
            // loop through cmds and update 
            
            var device = { name: deviceName, id: deviceId, apiToken: apiToken, pwd: pwd };
            var devices = await getDevicesFromLocalStorage();
            devices[device.id] = device;
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

                   <button type="button" class="btn btn-primary" id="btnUpdateDevice${device.id}">Save</button>
                   <button type="button" class="btn btn-danger" id="btnDelDevice${device.id}">Delete</button>
               </div>
           </div>`;
    }














    // Command

    initCmds();

    
    async function initCmds(){
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

     async function updateCmdEvent(cmdId) {
        $(`#btnSaveCmd${cmdId}`).click(async function() {
            let deviceId = $(`#cmdDeviceId${cmdId}`).val();
            let cmdName = $(`#cmdName${cmdId}`).val();
            let cmdText   = $(`#cmd${cmdId}`).val();

        
        
            // read and write back to storage
            var cmd = { id: cmdId, name: cmdName, cmd: cmdText, deviceId: deviceId };
            var cmds = await getCmdsFromLocalStorage();
            cmds[cmd.id] = cmd;
            browser.storage.local.set({ cmds: cmds});
        });
    }

    


    async function getNewAddedCmdHtml(cmd) {
        var devices = await getDevicesFromLocalStorage();
        return `
             <div class="form-inline" id="cmdDivId${cmd.id}">
                 <label for="deviceName">Device Name:</label>
                 <select class="custom-select custom-select-mb" id="cmdDeviceId${cmd.id}">
                     ${Object.entries(devices).map(device=>
                       `<option value="${device[1].id}" ${cmd.deviceId == device[1].id ? "selected" : ""}>
                            ${device[1].name}
                        </option>
                     `)}                   
                 </select>
                 
                 <label for="apiToken">Command Name:</label>
                 <input type="text" class="form-control" id="cmdName${cmd.id}" value="${cmd.name}">
                 <label for="cmd">Command:</label>
                 <input type="text" class="form-control" id="cmd${cmd.id}" value="${cmd.cmd}">
                 <button type="button" class="btn btn-primary" id="btnSaveCmd${cmd.id}">Save</button>
                 <button type="button" class="btn btn-danger" id="btnDelCmd${cmd.id}">Delete</button>
             </div>
        `;
    };


    initTestDevices();
    
    async function initTestDevices(){
        var devices = await getDevicesFromLocalStorage();
        Object.entries(devices).forEach((device, ind)=> {
            var option = new Option(device[1].name, `testDevice${device[1].id}`);
            $("#testDevices").append(option);
            // option.data(device);
            option.setAttribute('data-id', device[1])
        });
       
        console.log("")
    } 
    
    function btnSendTestCmd(){
        $("#btnSendTestCmd").click(async function(){
            alert("")
        })
    }
})
