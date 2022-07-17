function makeServiceCall(methodType, url, async = true, data = null){
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
        request.onload = function () {
            if(request.status.toString().match('^[2][0-9]{2}$')){
                resolve(request.responseText);
            }
            else if(request.status.toString().match('^[4,5][0-9]{2}$')){
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
                console.log("XHR Failed");
            }
        }
        request.onerror = function (){
            reject({
                status : this.status,
                statusText : xhttp.statusText
            });
        }
        request.open(methodType, url, async)
        if (data) {
            console.log(JSON.stringify(data));
            request.setRequestHeader("Content-Type", "application/json");
            request.send(JSON.stringify(data));
        }
        else {
            request.send();
        }
        console.log(methodType + " Request Send To Server");
    });
} 