"use strict";
const baseSpeed = 200;
const highSpeed = 400;
var asteroidnames;
var zbtn = Phaser.Keyboard.Z;
var shiftKey = Phaser.Keyboard.SHIFT;
var abtn = Phaser.Keyboard.A;
var minTimeBetweenPlayerShots = 0.5;

var numLives = 100;
var playerscore = 0;


var main = {
    
    preload: function () {
        console.log("preloading");
        this.game.load.image("space-bg", "assets/images/Space-Background-NP51.jpg");
        this.game.load.image("player-ship", "assets/images/ship2.png");
        
        this.game.load.image("asteroid-black", "assets/images/Asteroid_.png");
        this.game.load.image("asteroid-cool", "assets/images/coolasteroid.png");
        this.game.load.image("asteroid-normal", "assets/images/normalasteroid.png");
        this.game.load.image("asteroid-boring", "assets/images/boringasteroid.png");
        this.game.load.image("asteroid-pretty-normal", "assets/images/planet-trans-asteroid.png");
        
        this.game.load.image("laser", "assets/images/bullet-laser.png");
        
        asteroidnames = ['asteroid-black', 'asteroid-cool', 'asteroid-normal',
                    'asteroid-boring', 'asteroid-pretty-normal'];
        
    
    },
    
    
/*    Phaser will call ‘create’ after calling preload, but still while creating your scene.
This is where you can place objects in the scene or setup a user interface before the scene is shown to the player.*/
    create: function () {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.add.sprite(-300, 0, 'space-bg');
        this.player_ship = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, 'player-ship');
        this.player_ship.scale.x = 0.75;
        this.player_ship.scale.y = 0.75;        
        this.player_ship.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this.player_ship);

        
        console.log("size of the this.game - w: " + this.game.width + " h: " + this.game.height);
        
        this.cursors = this.game.input.keyboard.createCursorKeys();    
        this.asteroidTimer = 2.0;
        this.asteroids = game.add.group();
        
        this.bullets = game.add.group();
        
        this.fireTimer = minTimeBetweenPlayerShots;

        var infosquare = "Lives: " + numLives + " Score: " + playerscore;
        
        this.text = game.add.text(0, 0, infosquare, {fill: "white"});
        //this.text.addColor('#ffffff', 0)
    
    },
    
    
    updatePlayer: function () {

        var moveright = this.cursors.right.isDown,
            moveleft = this.cursors.left.isDown,
            movedown = this.cursors.down.isDown,
            moveup = this.cursors.up.isDown,
            shipX = this.player_ship.centerX,
            shipY = this.player_ship.centerY;
        
        // move
        if (moveup) {
            if (this.game.input.keyboard.isDown(shiftKey)) {
                this.player_ship.body.velocity.y = -highSpeed;
            } else {
                this.player_ship.body.velocity.y = -baseSpeed;                
            }
        } else if (movedown) {
            if (this.game.input.keyboard.isDown(shiftKey)) {
                this.player_ship.body.velocity.y = highSpeed;                
            } else {
                this.player_ship.body.velocity.y = baseSpeed;                
            }
        } else if (moveright) {
            if (this.game.input.keyboard.isDown(shiftKey)) {
                this.player_ship.body.velocity.x = highSpeed;                
            } else {
                this.player_ship.body.velocity.x = baseSpeed;                
            }             
        } else if (moveleft) {
            if(this.game.input.keyboard.isDown(shiftKey)) {
                this.player_ship.body.velocity.x = -highSpeed;                
            } else {
                this.player_ship.body.velocity.x = -baseSpeed;
            }
        } else {
            this.player_ship.body.velocity.x = 0;
            this.player_ship.body.velocity.y = 0;
        }
        
        // rotate
        if (this.game.input.keyboard.isDown(abtn)) {
            if (moveup) {
                this.player_ship.angle -= 10;
            }
            
            if (movedown) {
                this.player_ship.angle += 10;
            }

        }
        
        if ((shipX > this.game.width && moveright) || (shipX < 0 && moveleft)) {
            this.player_ship.body.velocity.x = 0;
            this.player_ship.body.velocity.y = 0;
        }
        
        if ((shipY > this.game.height && movedown) || (shipY < 0 && moveup)) {
            this.player_ship.body.velocity.x = 0;
            this.player_ship.body.velocity.y = 0;
        }
        
    },
    
    
    spawnAsteroid: function () {
        
        var randx = Math.random() * this.game.width,
            randIndex = Math.floor(Math.random() * (asteroidnames.length-1));
        
        var currasteroid = asteroidnames[randIndex];

        this.asteroid = this.game.add.sprite(randx, 0, currasteroid);

        this.game.physics.arcade.enable(this.asteroid);
        
        // if stone is small
        if(randIndex == 5 || randIndex == 4){
            this.asteroid.body.velocity.y = highSpeed;
        } else {
            this.asteroid.body.velocity.y = baseSpeed;
        }
        
        if(randIndex == 2){
            this.asteroid.scale.x = 0.1;
            this.asteroid.scale.y = 0.1;            
        }
        
        if(randIndex == 1){
            this.asteroid.scale.x = 0.5;
            this.asteroid.scale.y = 0.5;                        
        }
        
        if(randIndex == 3){
            this.asteroid.scale.x = 0.1;
            this.asteroid.scale.y = 0.1;
        }    
        
        this.asteroid.body.angularVelocity = Math.random() * 50;
        var randscalefactor = 0.2 + Math.random();
        this.asteroid.scale.x = randscalefactor;
        this.asteroid.scale.y = randscalefactor;
        this.asteroids.add(this.asteroid);


    },
    
    
    shoot: function() {
        
        if(this.fireTimer > 0){
            return;
        }

        var angle = this.player_ship.angle;
        var xvel, yvel;
        var normAngle = Phaser.Math.normalizeAngle(Phaser.Math.degToRad(angle-90));        
        var radAng = Phaser.Math.degToRad(angle);
    
        yvel = Math.sin((normAngle));
        xvel = Math.cos((normAngle));
        
        var h = this.player_ship.body.height/2,
            w = this.player_ship.body.width/2;
        
        // upper left corner of the ship
        var startX = this.player_ship.x,
            startY = this.player_ship.y;

        this.laser = this.game.add.sprite(startX, startY, 'laser');
        this.bullets.add(this.laser);
        this.game.physics.arcade.enable(this.laser);

        
        this.laser.body.velocity.y = yvel*highSpeed;
        this.laser.body.velocity.x = xvel*highSpeed;
        
        // resets timer
        this.fireTimer = minTimeBetweenPlayerShots;
        
    },

    
    destroySpirits: function () {
        
        for(var i = 0; i < this.asteroids.children.length; i++){
            if(this.asteroids.children[i].centerY > this.game.height){
                this.asteroids.children[i].destroy();                
            }
        }


        var bulletY, bulletX;
        for(var i = 0; i < this.bullets.children.length; i++){
            bulletX = this.bullets.children[i].centerX;
            bulletY = this.bullets.children[i].centerY;
            if((bulletX > this.game.width || bulletX < 0) || (bulletY > this.game.height || bulletY < 0)){
                this.bullets.children[i].destroy();
            }
        }
        
    },
    
    ouch: function (player_ship, asteroid) {

        if(numLives == 0){
            this.player_ship.destroy();
        } else {
            console.log("OUCH")
            numLives--;
        }

    },

    hitTarget: function (asteroid, bullet) {

        asteroid.destroy();
        bullet.destroy();
        playerscore++;

    },
    
    update: function () {
        
        main.updatePlayer();
        
        this.text.setText("Lives: " + numLives + " Score: " + playerscore);

        if(this.asteroidTimer <= 0){
            main.spawnAsteroid();
            this.asteroidTimer = 2;
        } else{
            this.asteroidTimer -= game.time.physicsElapsed;
        }
        
        this.fireTimer -= game.time.physicsElapsed;
        
        main.destroySpirits();
        
        if (this.game.input.keyboard.isDown(zbtn)) {
            main.shoot();
        }

        game.physics.arcade.collide(this.asteroids, this.bullets, main.hitTarget, null, this);
        game.physics.arcade.collide(this.player_ship, this.asteroids, main.ouch, null, this);

        
    }
    
};