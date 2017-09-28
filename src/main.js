"use strict";
const baseSpeedAsteroid = 300;
const highSpeedAsteroid = 600;
const baseSpeedPlayer = 200;
const highSpeedPlayer = 400;
const bulletSpeed = 800;
var asteroidnames;
var zbtn = Phaser.Keyboard.Z;
var shiftKey = Phaser.Keyboard.SHIFT;
var abtn = Phaser.Keyboard.A;
var minTimeBetweenPlayerShots = 0.5;

var numLives = 2;
var playerscore = 0;


var main = {
    
    preload: function () {
        console.log("preloading");
//        this.game.load.image("space-bg", "assets/images/Space-Background-NP51.jpg");
        this.game.load.image("space-bg", "assets/images/tileable-classic-nebula-3120072-o.jpg");
        
        
        this.game.load.image("player-ship", "assets/images/ship2.png");
        
        this.game.load.image("asteroid-black", "assets/images/Asteroid_.png");
        this.game.load.image("asteroid-cool", "assets/images/coolasteroid.png");
        this.game.load.image("asteroid-normal", "assets/images/normalasteroid.png");
        this.game.load.image("asteroid-boring", "assets/images/boringasteroid.png");
        this.game.load.image("asteroid-pretty-normal", "assets/images/planet-trans-asteroid.png");
        this.game.load.image("alien", "assets/images/Alien-PNG-Photo.png");
        
        this.game.load.image("explosion", "assets/images/explosionNotFullSmall.png");
        
        
        this.game.load.image("laser", "assets/images/bullet-laser.png");
        
        asteroidnames = ['asteroid-black', 'asteroid-cool', 'asteroid-normal',
                    'asteroid-boring', 'asteroid-pretty-normal', 'alien'];
        
    
    },
    
    
    render: function () {
      
        this.game.debug.body(this.player_ship);
        this.player_ship.body.debug = true;
//        this.player_ship.debug.body();
        
        for(var i = 0; i < this.asteroids.children.length; i++){
            this.game.debug.body(this.asteroids.children[i]);
            this.asteroids.children[i].body.debug = true;
        }

        for(var i = 0; i < this.bullets.children.length; i++){
            this.game.debug.body(this.bullets.children[i]);
            this.bullets.children[i].body.debug = true;
        }
        
    },
    
    
/*    Phaser will call ‘create’ after calling preload, but still while creating your scene.
This is where you can place objects in the scene or setup a user interface before the scene is shown to the player.*/
    create: function () {

//        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //this.game.physics.startSystem(Phaser.Physics.p2);
        
        this.game.physics.startSystem(Phaser.Physics.P2JS)
//        game.physics.p2.defaultRestitution = 0.8				// Default Restitution 
        this.game.physics.p2.setImpactEvents(true);

        this.playerCollGroup = game.physics.p2.createCollisionGroup();
        //this.game.add.sprite(-300, 0, 'space-bg');
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space-bg');
        
        this.player_ship = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, 'player-ship');
        
        this.player_ship.scale.x = 0.75;
        this.player_ship.scale.y = 0.75;        
        this.player_ship.anchor.setTo(0.5, 0.5);
//        this.game.physics.arcade.enable(this.player_ship);
        
        this.game.physics.p2.enable(this.player_ship);
        
        this.player_ship.body.setCollisionGroup(this.playerCollGroup);
        
        
        console.log("size of the this.game - w: " + this.game.width + " h: " + this.game.height);
        
        this.cursors = this.game.input.keyboard.createCursorKeys();    
        this.asteroidTimer = 2.0;
        this.asteroids = game.add.group();
        this.asteroids.enableBody = true;
        this.asteroids.physicsBodyType = Phaser.Physics.P2JS;

        
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.P2JS;

        this.player_ship.body.fixedRotation = true;

        this.fireTimer = minTimeBetweenPlayerShots;

        this.invulnerableTimer = 0.0;
        this.particleDestroyTimer = 0.0;
        
        this.enemyShipSpawnTimer = 3*60;
        this.enemyShipMoveTimer = 0.0;
        
        var infosquare = "Lives: " + numLives + " Score: " + playerscore;
        this.text = game.add.text(0, 0, infosquare, {fill: "white"});

        
        this.asteroidCollGroup = game.physics.p2.createCollisionGroup();
        this.bulletCollGroup = game.physics.p2.createCollisionGroup();
        this.particleCollGroup = game.physics.p2.createCollisionGroup();
        

        
        
        this.player_ship.body.collides(this.asteroidCollGroup, main.ouch, this);
        
        this.particles = game.add.group();
        this.particles.enableBody = true;
        this.particles.physicsBodyType = Phaser.Physics.P2JS;
        
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
                this.player_ship.body.velocity.y = -highSpeedPlayer;
            } else {
                this.player_ship.body.velocity.y = -baseSpeedPlayer;                
            }
        } else if (movedown) {
            if (this.game.input.keyboard.isDown(shiftKey)) {
                this.player_ship.body.velocity.y = highSpeedPlayer;                
            } else {
                this.player_ship.body.velocity.y = baseSpeedPlayer;                
            }
        } else if (moveright) {
            if (this.game.input.keyboard.isDown(shiftKey)) {
                this.player_ship.body.velocity.x = highSpeedPlayer;                
            } else {
                this.player_ship.body.velocity.x = baseSpeedPlayer;                
            }             
        } else if (moveleft) {
            if(this.game.input.keyboard.isDown(shiftKey)) {
                this.player_ship.body.velocity.x = -highSpeedPlayer;                
            } else {
                this.player_ship.body.velocity.x = -baseSpeedPlayer;
            }
        } else {
            this.player_ship.body.velocity.x = 0;
            this.player_ship.body.velocity.y = 0;
        }
        
        // rotate
        if (this.game.input.keyboard.isDown(abtn)) {
            if (moveup) {
                this.player_ship.angle -= 10;
                this.player_ship.body.angle-=10;
            }
            if (movedown) {
                this.player_ship.angle += 10;
                this.player_ship.body.angle+=10;
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
    
    spawnEnemyShip: function () {
        
        this.enemyship = this.game.add.sprite(this.game.width, Math.random()*this.game.height, 'player-ship');
        this.enemyShipSpawnTimer = 3*60;
    },
    
    updateEnemyShip: function () {
    
        
    
    },
    
    spawnAsteroid: function () {
        
        var randx = Math.random() * this.game.width,
            randIndex = Math.floor(Math.random() * (asteroidnames.length-1));
        
        var currasteroid = asteroidnames[randIndex];

        this.asteroid = this.game.add.sprite(randx, 0, currasteroid);

        this.game.physics.p2.enable(this.asteroid);
        
        // if stone is small
        if(randIndex == 5 || randIndex == 4){
            this.asteroid.body.velocity.y = highSpeedAsteroid;
        } else {
            this.asteroid.body.velocity.y = baseSpeedAsteroid;
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
        
        var angspeed = Math.random() * 2;
        this.asteroid.body.angularVelocity = angspeed;

        var randscalefactor = 0.2 + Math.random();
        this.asteroid.scale.x = randscalefactor;
        this.asteroid.scale.y = randscalefactor;
        
        var w = this.asteroid.width,
        h = this.asteroid.height;
        
        var diagonal = Math.sqrt(Math.pow(w, 2)+Math.pow(h, 2));
        
        diagonal = Math.min(diagonal, 100);
        diagonal = Math.min(diagonal, w);
        diagonal = Math.min(diagonal, h);
        
        this.asteroid.body.setCircle(diagonal/2);
        
        this.asteroids.add(this.asteroid);
        
        this.asteroid.body.setCollisionGroup(this.asteroidCollGroup);
        this.asteroid.body.collides(this.bulletCollGroup);
        this.asteroid.body.collides(this.playerCollGroup);

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
        
        var h = this.player_ship.height/2,
            w = this.player_ship.width/2;
        
        // upper left corner of the ship
        var startX = this.player_ship.x,
            startY = this.player_ship.y;

        this.laser = this.game.add.sprite(startX, startY, 'laser');
        this.bullets.add(this.laser);
        this.game.physics.p2.enable(this.laser);
        this.laser.body.setCollisionGroup(this.bulletCollGroup);
        
        this.laser.body.collides(this.asteroidCollGroup, main.hitTarget , this);
        
        
        this.laser.body.velocity.y = yvel*bulletSpeed;
        this.laser.body.velocity.x = xvel*bulletSpeed;
        this.laser.body.fixedRotation = true;
        
        // resets timer
        this.fireTimer = minTimeBetweenPlayerShots;
        
    },

    
    destroySprites: function () {
        
        for(var i = 0; i < this.asteroids.children.length; i++){
            if(this.asteroids.children[i].centerY > this.game.height){
                this.asteroids.children[i].destroy();  
                playerscore--;
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
        
        var partY, partX;
        for(var i = 0; i < this.particles.children.length; i++){
            
            partX = this.particles.children[i].centerX;
            partY = this.particles.children[i].centerY;
            if((partX > this.game.width || partX < 0) || (partY > this.game.height || partY < 0) || this.particleDestroyTimer == 0){
                this.particles.children[i].destroy();
            }
        }        
        
        
        
    },
    
    ouch: function (player_ship, asteroid) {

        if(numLives == 1){
            game.state.start("GameOver");
        } else {
            if(this.invulnerableTimer > 0){
                console.log("im invulnerable!")
                //asteroid.destroy();
                asteroid.sprite.pendingDestroy = true;
            } else {
                numLives--;
                console.log("OUCH")
                this.invulnerableTimer = 4*60;
            }

            asteroid.sprite.pendingDestroy = true;
        }

    },

    hitTarget: function (bullet, asteroid) {
        
        var size = asteroid.sprite.width;
        var speed = asteroid.velocity.y;
        
        var score = 1;

        if(size < 100 || speed > 300){
            console.log("extra points!")
            score++;
        }
        
        if(asteroid.sprite.key=="alien"){
            console.log("i killed an alien")
            numLives++;
            score = 0;
        }
        
        playerscore+=score;
        
        asteroid.sprite.pendingDestroy = true;
        bullet.sprite.pendingDestroy = true;
        
        var numParts = 20;
        
        while(numParts > 0){
            
            this.part = this.game.add.sprite(asteroid.x, asteroid.y, 'explosion');
      
            this.game.physics.p2.enable(this.part);
      
            this.particles.add(this.part);
            
            this.part.body.setCollisionGroup(this.particleCollGroup);

            var opt = [-1, 1];
            
            var index = Math.floor(Math.random()*2);
            var factor1 = opt[index];
            index = Math.floor(Math.random()*2);
            var factor2 = opt[index];
            
            
            this.part.body.velocity.x = Math.random()*factor1*(highSpeedAsteroid+100);
            this.part.body.velocity.y = Math.random()*factor2*(highSpeedAsteroid+100);
            this.particleDestroyTimer=3.0*60;

            numParts--;
        }
        
        
    },
    
    update: function () {
        
        main.updatePlayer();

        if(this.invulnerableTimer > 0){
            this.invulnerableTimer--;
        }
        if(this.particleDestroyTimer > 0){
            this.particleDestroyTimer--;
        }
        if(this.enemyShipSpawnTimer > 0){
            this.enemyShipSpawnTimer--;
        }

        this.text.setText("Lives: " + numLives + " Score: " + playerscore);
        //object.tilePosition.y += 2;
        this.background.tilePosition.y +=2;
        
        if(this.asteroidTimer <= 0){
            main.spawnAsteroid();
            this.asteroidTimer = 2;
        } else{
            this.asteroidTimer -= game.time.physicsElapsed;
        }
        
        this.fireTimer -= game.time.physicsElapsed;
        
        main.destroySprites();
        
        if (this.game.input.keyboard.isDown(zbtn)) {
            main.shoot();
        }
        




    }
    
};