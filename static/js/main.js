var log = console.log.bind(console)

var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if(r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

var musicTemplate = function (music) {
    var name = music.name
    var author = music.author
    var img = music.img
    var url = music.url
    var id = music.id
    var t = `
        <div class="music-cell">
            <div class="music-img-div">
              <img class="music-img" src="${img}">
            </div>
            <div class="music-name-author">
                <a href="${url}" class="music-name" data-id="${id}">${name}</a>
                -
                <span>${author}</span>
            </div>
            <div class="music-love">
                <span class="icon-heart"></span>
            </div>
        </div>
    `
    return t
}

var insertMusicAll = function (musics) {
    var html = ''
    for (var i = 0; i < musics.length; i++) {
        var m = musics[i]
        var t = musicTemplate(m)
        html += t
    }
    var div = document.querySelector('.musicList')
    div.innerHTML = html
}

var musicAll = function () {
    var request = {
        method: 'GET',
        url: 'api/music/all',
        contentType: 'application/json',
        callback: function(response) {
            console.log('blog all 响应', response)
            var musics = JSON.parse(response)
            window.musics = musics
            insertMusicAll(musics)
        }
    }
}


var __main = function () {
    musicAll()
}

__main()