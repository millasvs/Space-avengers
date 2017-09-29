const enemyshipSpawnTime = 10*60;

var enemyship = {

    create: function () {
      
        this.enemybullets = game.add.group();
        this.enemybullets.enableBody = true;
        this.enemybullets.physicsBodyType = Phaser.Physics.P2JS;
        
        this.enemyShipSpawnTimer = enemyshipSpawnTime;
        this.enemyShipMoveTimer = 60;

        this.enemyBulletCollGroup = game.physics.p2.createCollisionGroup();
        this.enemyCollGroup = game.physics.p2.createCollisionGroup();
        
        this.enemies = game.add.group();
        
        
    },
    
    spawnEnemyShip: function () {
        
        this.enemy_ship = main.game.add.sprite(main.game.width-150, Math.random()*main.game.height, 'player-ship');
        main.game.physics.p2.enable(this.enemy_ship);
        this.enemy_ship.body.setCollisionGroup(this.enemyCollGroup);
        
        this.enemy_ship.body.collides(main.bulletCollGroup);

        this.enemy_ship.body.angle = -90;
        
        this.enemies.add(this.enemy_ship);
        
//         this.enemyship.body.fixedRotation = true;


        console.log("enemy ship spawned")
        this.enemyShipSpawnTimer = enemyshipSpawnTime;
    },
        
    enemyshoot: function(enemy) {
        
        var startX = this.enemy.x,
            startY = this.enemy.y;
        
        this.enemylaser = main.game.add.sprite(startX, startY, 'plasma');
        main.game.physics.p2.enable(this.enemylaser);
        
        this.enemybullets.add(this.enemylaser);
        this.enemylaser.body.setCollisionGroup(this.enemyBulletCollGroup);
        

        var xvel = startX - main.player_ship.x,
            yvel = startY - main.player_ship.y;
        
        
        this.enemylaser.body.velocity.x = -xvel*2 + Math.random()*100;
        this.enemylaser.body.velocity.y = -yvel*2 + Math.random()*100;

         
        this.enemylaser.body.angle = -90;

        this.enemylaser.body.collides(main.playerCollGroup, enemyship.enemyHit, this);
        
    
    },
    
    enemyHit: function (bullet, player_ship) {
      
        diffLives = -1;
        
        if(numLives <= 1){
            console.log("gameover")
            game.state.start("GameOver");
        }

        bullet.sprite.pendingDestroy = true;

    },
    
    
    update: function () {

        console.log("at update enemyship")
        var opt = [-1, 1];
        var index, factor, diff;
        for(var i = 0; i < this.enemies.children.length; i++){
    
            index = Math.floor(Math.random()*2);
            factor = Math.random() * 50;
            diff = opt[index];

            this.enemy = this.enemies.children[i];
            
//            console.log(this.enemy_ship)

            if(this.enemy.body.y > main.game.height){
                this.enemy.body.y -= factor;
            } else if(this.enemy.body.y < 0){
                this.enemy.body.y += factor;
            } else {
                this.enemy.body.y += diff*factor;
            }

            this.enemy.body.velocity.y = 0;
            this.enemy.body.velocity.x = 0;

            enemyship.enemyshoot(this.enemy);
            
        }

    
    }
    
    
};