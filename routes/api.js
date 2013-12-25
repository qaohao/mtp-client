/**
 * Created by qaohao on 13-12-22.
 */
var url = require("url");
var util = require("util");
var httpclient = require("./utils/httpclient");

var apis = {
    "all": [
        "/api/meta/get_cities",
        "/api/task/get_all_ids",
        "/api/task/get_single",
        "/api/task/get_batch",
        "/api/stats/get_deal_history"
    ],
    "common": {
        "args": [
            {
                "argName": "app_key",
                "argValue": "c0350972ae",
                "option": "false"
            },
            {
                "argName": "uid",
                "argValue": "241866356",
                "option": "false"
            }
        ]
    },
    "configs": [
        {
            "url": "/api/meta/get_cities",
            "args": []
        },
        {
            "url": "/api/task/get_all_ids",
            "args": [
                {
                    "argName": "city",
                    "argValue": "",
                    "option": false
                }
            ]
        },
        {
            "url": "/api/task/get_single",
            "args": [
                {
                    "argName": "task_id",
                    "argValue": "",
                    "option": false
                }
            ]
        },
        {
            "url": "/api/task/get_batch",
            "args": [
                {
                    "argName": "task_ids",
                    "argValue": "",
                    "option": false
                }
            ]
        }
    ]};

exports.api = function (req, res) {
    var params = url.parse(req.url, true);
    var result;

    // 查找请求的api配置
    if (params.query.api) {
        for (var i = 0; i < apis.configs.length; i++) {
            if (apis.configs[i].url === params.query.api) {
                result = apis.configs[i];
                break;
            }
        }
    }

    // 请求Api不正确或者没有没有带请求Api，默认跳转。
    if (!result) {
        result = apis.configs[0];
    }

    console.log("result:" + util.inspect(result));
    res.render("api", {
        "all": apis.all,
        "api": {
            "url": result.url,
            "args": apis.common.args.concat(result.args)
        }
    });
}

exports.submit = function (req, res) {
    console.log("query:" + util.inspect(req.body));

    var uri = req.body.api;
    var method = req.body.method;
    var query = req.body;
    var handleResult = function(result) {
        console.log("result:" + JSON.stringify(result));
        res.write(JSON.stringify(result));
        res.end();
    };

    delete query.api;
    delete query.method;
    if (method && method.toLowerCase() === 'post') {
        httpclient.post(uri, query, handleResult);
    } else {
        httpclient.get(uri, query, handleResult);
    }

}

