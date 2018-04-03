var ajax = function(method, path, data, reseponseCallback) {
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式
    r.setRequestHeader('Content-Type', 'application/json')
    // 注册响应函数
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            // reseponseCallback 服务器返回的信息
            reseponseCallback(r.response)
        }
    }
    // 发送请求
    r.send(data)
}

var initRank = function () {
    var method = 'GET'
    var path = '/rank'
    var data = ''
    ajax(method, path, data, function (response) {

    })
}

initRank()