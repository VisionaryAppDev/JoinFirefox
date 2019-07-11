$(function(){
    $("#btnAddNewDevice").click(async function(){
        let deviceName= $("#deviceName").val();
        let deviceId= $("#deviceId").val();
        let apiToken = $("#apiToken").val();
        let pwd = $("#pwd").val();
        // let id = Date.now().toString();


        console.log(deviceId, deviceName, apiToken, pwd);
        $("#divExistingDevices").append(getNewAddedDeviceHtml(deviceId, deviceName, apiToken, pwd));



        
        browser.storage.local.set(`{
            ${id}: {
                "deviceName": deviceName,
                "apiToken": apiToken,
                "pwd": pwd
            }
        }`);
        // browser.storage.sync.set({'key': 'val'});
        // browser.storage.managed.set({'key': 'val'});
        var result = await browser.storage.local.get(deviceId);  
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
