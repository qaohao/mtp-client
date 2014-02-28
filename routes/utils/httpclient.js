cmd
/**
 * Created by qaohao on 13-12-23.
 */
// 配置服务器信息
var host = "localhost";
var port = "8080";
var webapp = "/mtp";

var http = require("http");
var querystring = require("querystring");
var util = require("util");

exports.get = function (uri, query, callback) {
    var url = webapp.concat(uri).concat("?").concat(
        querystring.stringify(query));
    console.log("http-get uri:"+url);

    http.get({
        host: host,
        port: port,
        path: url
    }, function (res) {
        res.setEncoding('utf8');
        console.log("http-get processing...");
        res.on('data', function (data) {
            console.log("http-get result:"+util.inspect(data));
            callback({
                "url": "http://".concat(host).concat(":").concat(port).concat(url),
                "result": data
            });
        }).on('error',function(err){
            console.log("http-get error:" + err.message);
        });
    });
}

exports.post = function (uri, query, callback) {
    var url = webapp.concat(uri);
    var contents = querystring.stringify(query);
    console.log("http-post uri:"+url+",\n post data:"+contents);

    var options = {
        host: host,
        port: port,
        path: webapp.concat(uri),
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': contents.length
        }
    };

    var req = http.request(options, function (res) {
        console.log("http-post processing...");
        res.setEncoding('UTF-8');
        res.on('data', function (data) {
            console.log("http-post result:"+util.inspect(data));
            callback({
                "url": "http://".concat(host).concat(":").concat(port).concat(url)
                    .concat("?").concat(querystring.stringify(contents)),
                "result": data
            }).on('error',function(err){
                console.log("http-post error:" + err.message);
            });
        });
    });

    req.write(contents);
    req.end();
}
