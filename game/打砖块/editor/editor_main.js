const __main = () => {

    const images = {
        ball: 'img/ball.png',
        paddle: 'img/paddle.png',
        block1: 'img/block1.png',
        block2: 'img/block2.png',
        block3: 'img/block3.png',
        block4: 'img/block4.png',
        block5: 'img/block5.png',
    }

  const game = new Game(30, images, (game) => {
        let s = new SceneTitle(game)
        log(s)
        game.runWithScene(s)
    })

  editor = new Editor(game)

  editor.bindEvents()
  editor.setBlock()

  game.update = () => {

  }

  var saveButton = e('#save-button')
  saveButton.addEventListener('click', function() {
    editor.saveMap()
  })


  game.draw = () => {
    for (var i = 0; i < editor.currBlock.length; i++) {
      game.drawImage(editor.currBlock[i])
    }
  }
}
