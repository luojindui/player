// 引入 express 并且创建一个 express 实例赋值给 app
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// 配置了这一行 就可以在 路由函数 中用 request.body 的方式
// 获取到 ajax 发过来的 json 格式数据
app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('static'))

const appendRedHeart = function (b, name, author, id) {
    var t = ''
    if (b) {
        t = `
            <div class="music-cell">
                <div class="music-img-div">
                  <img class="music-img" src="img/1.jpg">
                </div>
                <div class="music-name-author">
                    <a href="play/${id}" class="music-name" data-id="${id}">${name}</a>
                    -
                    <span>${author}</span>
                </div>
                <div class="music-love">
                    <span class="icon-heart redHeart" data-id="${id}"></span>
                </div>
            </div>
           `
    } else {
        t = `
            <div class="music-cell">
                <div class="music-img-div">
                  <img class="music-img" src="img/1.jpg">
                </div>
                <div class="music-name-author">
                    <a href="play/${id}" class="music-name" data-id="${id}">${name}</a>
                    -
                    <span>${author}</span>
                </div>
                <div class="music-love">
                    <span class="icon-heart" data-id="${id}"></span>
                </div>
            </div>
           `
    }
    return t
}

const appendHtml = function(str, musics) {
    var cell = ''
    var fs = require('fs')
    var path = 'db/myLoveMusic.json'
    var myLove = JSON.parse(fs.readFileSync(path, 'utf8'))
    for(let i = 0; i < musics.length; i++) {
        const name = musics[i].name
        const author = musics[i].author
        const id = musics[i].id
        var red = false
        for(let j = 0; j < myLove.length; j++) {
            if(myLove[j].id === id) {
               red = true
                break
            }
        }
        var t = appendRedHeart(red, name, author, id)
        cell += t
    }
    if(musics.length == 0) {
        cell = '<p class="noneText">这里还没有东西...</p>'
    }
    str = str.replace('{{cell}}', cell)
    return str
}

const appendRankHtml = function (str, musics) {
    for (let i = 0; i < musics.length; i++) {
        for (let j = 0; j < musics.length - i - 1; j++) {
            if (musics[j].time < musics[j + 1].time) {
                var temp = musics[j]
                musics[j] = musics[j + 1]
                musics[j + 1] = temp
            }
        }
    }
    var cell = ''
    for (let i = 0; i < musics.length; i++) {
        var t = ''
        var id = musics[i].id
        var name = musics[i].name
        var author = musics[i].author
        var time = musics[i].time
        t = `
            <div class="music-cell">
                <div class="music-img-div">
                  <img class="music-img" src="img/1.jpg">
                </div>
                <div class="music-name-author">
                    <a href="play/${id}" class="music-name" data-id="${id}">${name}</a>
                    -
                    <span>${author}</span>
                </div>
                <div class="music-time">
                    <p>播放次数: ${time}</p>
                </div>
            </div>
    `
        cell += t
    }
    console.log(cell)
    return cell
}

const addTime = function (musics, id) {
    var fs = require('fs')
    for(let i = 0; i < musics.length; i++) {
        if(musics[i].id == id) {
            musics[i].time = musics[i].time + 1
        }
    }
    var result = JSON.stringify(musics, null, 2)
    var file = 'db/music.json'
    fs.writeFile(file, result, function () {
        console.log('update time success')
    })
}

app.get('/', function(request, response) {
    const path = 'template/index.html'
    const fs = require('fs')
    var data = fs.readFileSync(path, 'utf8')
    const file = "db/music.json"
    const result = JSON.parse(fs.readFileSync(file))
    data = appendHtml(data, result)
    // data = data.replace('{{name}}', name)
    // data = data.replace('{{author}}', author)
    // data = data.replace('{{id}}', id)
    response.send(data)
})

app.get('/play/:id', function (request, response) {
    const id = request.params.id
    var str = ''
    /*
    <source src="../music/红色高跟鞋.mp3">
     */
    const fs = require('fs')
    const file = "db/music.json"
    const result = JSON.parse(fs.readFileSync(file))
    addTime(result, id)
    var lrcFile
    for(let i = 0; i < result.length; i++) {
        if(JSON.stringify(result[i].id) == JSON.stringify(id)) {
            lrcFile = 'db/' + result[i].lrc
        }
    }
    var lrcs = fs.readFileSync(lrcFile, 'utf8')
    var lrc = lrcs.split('\n')
    var t = ''
    for(let i = 0; i < lrc.length - 1; i++) {
        var time = lrc[i].substring(0, 10)
        var line = lrc[i].substring(10, lrc[i].length)
        t += `<p data-time="${time}">${line}</p>
        `
    }
    var path = 'template/player.html'
    var data = fs.readFileSync(path, 'utf8')
    data = data.replace('{{lrc}}', t)

    for(let i = 0; i < result.length; i++) {
        result[i].time = parseInt(result[i].time) + 1 + ''
        // console.log(result[i].id, id)
        if(result[i].id === id) {
            str = `<source src="../music/${result[i].name}.mp3" data-id="${result[i].id}">`
            break
        }
    }
    data = data.replace('{{audio}}', str)
    response.send(data)
})

app.get('/mylove', function (request, response) {
    const path = 'template/myLove.html'
    const fs = require('fs')
    var data = fs.readFileSync(path, 'utf8')
    const file = "db/myLoveMusic.json"
    var result = JSON.parse(fs.readFileSync(file))
    if(result.length == 0) {
        console.log('result is null')
        // result = '这里还没有东西'
    }
    // console.log('result', result)
    data = appendHtml(data, result)
    // console.log('data', data)
    // data = data.replace('{{name}}', name)
    // data = data.replace('{{author}}', author)
    // data = data.replace('{{id}}', id)
    response.send(data)
})

app.get('/rank', function (request, response) {
    const path = 'template/rank.html'
    const fs = require('fs')
    var data = fs.readFileSync(path, 'utf8')
    const file = "db/music.json"
    const result = JSON.parse(fs.readFileSync(file))
    const cell = appendRankHtml(data, result)
    data = data.replace('{{cell}}', cell)
    response.send(data)
})

app.get('/getLen', function (request, response) {
    var fs = require('fs')
    const file = "db/music.json"
    const result = JSON.parse(fs.readFileSync(file))
    var data = JSON.stringify(result.length)
    response.send(data)
})

app.get('/favicon.ico', function (request, response) {
    var data = ''
    response.send(data)
})

app.post('/addMyLove', function (request, response) {
    var id = request.body.task
    // console.log('love music id', id)
    const fs = require('fs')
    const musicFile = "db/music.json"
    var musics = JSON.parse(fs.readFileSync(musicFile, 'utf8'))
    var music = {}
    // console.log('musics', musics.length)
    for (let i = 0; i < musics.length; i++) {
        // console.log(musics[i].id, id)
        if(musics[i].id === id) {
            music = musics[i]
            break
        }
    }
    const file = "db/myLoveMusic.json"
    var result = JSON.parse(fs.readFileSync(file))
    result = result.concat(music)
    var resultData = JSON.stringify(result, null, 2)
    fs.writeFile(file, resultData, function () {
        console.log('wirte myLoveMusic success')
    })
    var data = ''
    response.send(data)
})

app.post('/removeMyLove', function (request, response) {
    var id = request.body.task
    // console.log('love music id', id)
    const fs = require('fs')
    const musicFile = "db/myLoveMusic.json"
    var musics = JSON.parse(fs.readFileSync(musicFile, 'utf8'))
    for (let i = 0; i < musics.length; i++) {
        // console.log(musics[i].id, id)
        if(musics[i].id === id) {
            musics.splice(i, 1)
        }
    }
    // result = result.concat(music)
    var resultData = JSON.stringify(musics, null, 2)
    fs.writeFile(musicFile, resultData, function () {
        console.log('wirte success')
    })
    var data = ''
    response.send(data)
})

// 但是 1024 以下的端口是系统保留端口，需要管理员权限才能使用
const server = app.listen(8081, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("访问地址为 http://%s:%s", host, port)
})
