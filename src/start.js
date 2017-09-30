const spacebar = Phaser.Keyboard.SPACEBAR;

var start = {
    
  
    preload: function () {
    
    },
    
    create: function () {
      
        var text = "Directions:\n[UP], [DOWN], [LEFT], [RIGHT] -- move\n[A] -- rotate left\n[D] -- rotate right\n[S] -- shoot\n[SHIFT] -- speed up\n\nPress [SPACE] to start playing";
        
        this.cursors = this.game.input.keyboard.createCursorKeys();    

        this.text = game.add.text(this.game.width/4, this.game.height/4, text, {fill: "white"});
 

        
    },
    
    update: function() {
        if (this.game.input.keyboard.isDown(spacebar)) {
            console.log("start play")
            game.state.start("MainGame");
        }

    }
    
    
};