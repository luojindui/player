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

var e = function(sel) {
    return document.querySelector(sel)
}
var es = function(sel) {
    return document.querySelectorAll(sel)
}

var a = e('#audio-player')
var aChild = a.firstElementChild

var bindEvent = function(e, b, callback) {
    b.addEventListener(e, callback)
}

var vol = e('#vol-control')
var setVol = function() {
    a.volume = vol.value / 100
    a.muted = false
}

var pro = e('#music-pro')
var setTime = function() {
    pro.max = a.duration
    pro.value = a.currentTime
}

var setLrc = function () {
    var ps = document.getElementsByTagName('p')
    ps[0].classList.add('lrc-light')
    for(let i = 0; i < ps.length - 1; i++) {
        var time = ps[i + 1].dataset.time
        var min = parseInt(time.split(':')[0].split('[')[1])
        var sec = parseInt(time.split(':')[1].split('.')[0])
        var msec = parseInt(time.split(']')[0].split('.')[1])
        var currTime = min * 60 + sec + msec * 0.01
        if(a.currentTime > currTime) {
            ps[i + 1].classList.add('lrc-light')
            ps[i].classList.add('hide')
        } else {
            ps[i].classList.remove('hide')
            ps[i + 1].classList.remove('lrc-light')
        }
    }
}

var clickX = 0
var setProgress = function () {
    var windowWidth = window.innerWidth
    var strickWidth = windowWidth * 0.95
    var start = (windowWidth - strickWidth) / 2
    var curr = ((clickX - start) / strickWidth) * a.duration
    if(curr >= 0) {
        a.currentTime = curr
    }
}

setInterval(function () {
    setTime()
    setLrc()
}, 60)

var playMethods = es('.play-method')
// console.log(playMethods)
for (var i = 0; i < playMethods.length; i++) {
    var b = playMethods[i]
    bindEvent('click', b, function(event) {
        var pa = event.target.parentElement
        var index = pa.dataset.index % 3 + 1
        var nowShow = e('.show')
        nowShow.classList.remove('show')
        var str = '#method-' + index
        var nextShow = e(str)
        nextShow.classList.add('show')
        pa.dataset.index = index
        if(index == 1) {
            a.dataset.method = 'order'
        } else if(index == 2) {
            a.dataset.method = 'shuffle'
        } else if(index == 3) {
            a.dataset.method = 'loop'
        }
    })
}

var startButton = e('.music-start')
bindEvent('click', startButton, function() {
    console.log('start')
    a.play()
})

var pauseButton = e('.music-pause')
bindEvent('click', pauseButton, function() {
    console.log('pause')
    a.pause()
})

var nextButton = e('.music-next')
bindEvent('click', nextButton, function() {
    var id = parseInt(aChild.dataset.id)
    ajax('GET', '/getLen', '', function (response) {
        var length = parseInt(response)
        if(id === length) {
            id = 0
        }
        id = id + 1
        var path = '/play/' + id
        self.location = path
    })
})

var clickStick = e('#music-pro')
bindEvent('click', clickStick, function (event) {
    clickX = event.pageX
    setProgress()
})

bindEvent('ended', a, function () {
    console.log(a.dataset.method)
    if(a.dataset.method == 'order') {
        console.log('order')
        nextButton.click()
    } else if(a.dataset.method == 'shuffle') {
        var id = parseInt(aChild.dataset.id)
        ajax('GET', '/getLen', '', function (response) {
            var length = parseInt(response)
            if(id === length) {
                id = 0
            }
            id = parseInt(Math.random() * length) + 1
            var path = '/play/' + id
            self.location = path
            console.log('shuffle')
        })
    } else if(a.dataset.method == 'loop') {
        var id = parseInt(aChild.dataset.id)
        var path = '/play/' + id
        self.location = path
        console.log('loop')
    }
})