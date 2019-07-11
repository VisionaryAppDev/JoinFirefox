$(function(){
    $("#btnAddNewDevice").click(async function(){
        let deviceName= $("#deviceName").val();
        let deviceId= $("#deviceId").val();
        let apiToken = $("#apiToken").val();
        let pwd = $("#pwd").val();
        // let id = Date.now().toString();



        // read and write back to storage
        var device = { deviceName: deviceName, deviceId: deviceId, apiToken: apiToken, pwd: pwd };
        var devices = await browser.storage.local.get("devices");
        devices = typeof devices.devices === 'undefined' ? {} : devices.devices; 
        devices[deviceId] = device;
        browser.storage.local.set({ devices: devices});


        // Output to screen
        $("#divExistingDevices").append(getNewAddedDeviceHtml(deviceId, deviceName, apiToken, pwd));



        // browser.storage.sync.set({'key': 'val'});
        // browser.storage.managed.set({'key': 'val'});

        
        // TEST output
        var result = await browser.storage.local.get('devices');
        console.log(result);
    })


    function getNewAddedDeviceHtml(deviceId, deviceName, apiToken, pwd){
        return `
           <div class="container-fluid" id=id${deviceId}>
               <div class="form-inline">
                   <label for="deviceName">Device Name:</label>
                   <input type="text" class="form-control" id="deviceName${deviceId}" value="${deviceName}">

                   <label for="deviceName">Device Id:</label>
                   <input type="text" class="form-control" id="deviceId${deviceId}" value="${deviceId}">

                   <label for="apiToken">Api token:</label>
                   <input type="text" class="form-control" id="apiToken${deviceId}" value=${apiToken}>

                   <label for="pwd">Password:</label>
                   <input type="password" class="form-control" id="pwd${deviceId}" value=${pwd}>

                   <button type="button" class="btn btn-primary">Save</button>
                   <button type="button" class="btn btn-danger">Delete</button>
               </div>
           </div>`;

    }
})
