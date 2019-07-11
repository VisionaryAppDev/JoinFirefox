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
})
