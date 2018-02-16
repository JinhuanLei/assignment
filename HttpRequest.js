var arr;
var requestObj = new Object();
var queryObj = new Object();
var headersObj = new Object();
function validateUrl(requestLine) {
    var methodarr = new Array("GET", "POST", "HEAD", "PUT", "DELETE", "OPTIONS", "CONNECT", "TRACE");
    var arr = requestLine.split(" ");
    var flag = false;
    for (var x = 0; x < methodarr.length; x++) {
        if (methodarr[x] == arr[0]) {
            flag = true;
        }
    }
    var reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/);
    var reg1 = new RegExp(/^[hH][tT][tT][pP]\/[1].[1,0]$/);
    if (reg.test(arr[1]) && reg1.test(arr[2]) && flag) {
        return true;
    }
    return false;
}
function parseQuery(){
    if (arr[0].indexOf("?") != -1) {
        var queryP = arr[0].indexOf("?");
        var subQuery;
        var arrQ
        if (arr[0].indexOf("#") == -1) {
            subQuery = arr[0].substring(queryP + 1);
        } else {
            subQuery = arr[0].substring(queryP + 1, arr[0].indexOf("#"));
        }
        arrQ = subQuery.split("&");
        for (var x = 0; x < arrQ.length; x++) {
            var arrE = arrQ[x].split("=");
            queryObj[arrE[0]] = arrE[1];
        }
    } else {
        queryObj = "";
    }
}
function parseBody(url)
{
    if (url.indexOf("\n\n") != -1) {
        var arrBody = url.split("\n\n");
        requestObj.body = arrBody[1];
    } else {
        requestObj.body = "";
    }
}

function parseHeader()
{
    for (var i = 1; i < arr.length; i++) {
        if (arr[i].indexOf(":") != -1) {
            var temparr = arr[i].split(":");
            headersObj[temparr[0]] = temparr[1];
        }
    }
}

function parsethings()
{
    requestObj.method = arr[0].split(" ")[0];
    var tempstr = arr[0].substring(arr[0].indexOf("//") + 2);
    var pathstr = tempstr.substring(tempstr.indexOf("/"), tempstr.indexOf("?"));
    requestObj.path = pathstr;
    var urlstr = tempstr.substring(tempstr.indexOf("/"), tempstr.indexOf(" "));
    requestObj.url = urlstr;
    var versionstr = tempstr.substring(tempstr.indexOf(" ")+1);
    requestObj.version = versionstr;
    if (tempstr.indexOf("#") != -1) {
        requestObj.fragment = tempstr.substring(tempstr.indexOf("#") + 1, tempstr.indexOf(" "));
    } else {
        requestObj.fragment = "";
    }
    requestObj.host = tempstr.substring(0, tempstr.indexOf("/"));
    if (tempstr.indexOf(":") == -1) {
        requestObj.port = "80"
    } else {
        requestObj.port = tempstr.substring(tempstr.indexOf(":"), tempstr.indexOf("/"));
    }
    requestObj.protocol = versionstr.substring(0, versionstr.indexOf("/"));
}

function HttpRequest(url) {
    arr = url.split("\n");
    try {
        if (!validateUrl(arr[0])) throw "Wrong URL";
    } catch(err) {
        alert(err);
        return;
    }
    parseHeader();
    parseQuery();
    requestObj.headers = headersObj;
    requestObj.query = queryObj;
    parseBody(url);
    parsethings();
    return requestObj;
}

