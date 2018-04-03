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

var es = function (sel) {
    return document.querySelectorAll(sel)
}

var hearts = es('.icon-heart')
for(let i = 0; i < hearts.length; i++) {
    hearts[i].addEventListener('click', function (event) {
        var self = event.target
        if (!hearts[i].classList.contains('redHeart')) {
            var method = 'POST'
            var path = '/addMyLove'
            var task = self.dataset.id
            var data = {
                'task': task,
            }
            data = JSON.stringify(data)
            ajax(method, path, data, function () {
                hearts[i].classList.add('redHeart')
            })
        } else {
            var method = 'POST'
            var path = '/removeMyLove'
            var task = self.dataset.id
            var data = {
                'task': task,
            }
            data = JSON.stringify(data)
            ajax(method, path, data, function () {
                hearts[i].classList.remove('redHeart')
            })
        }
    })
}
