function Player(game, gameSize) {
    this.type = 'player';
    this.game = game;
    this.size = { x: 10, y: 20};
    this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };
    this.angle = 0;
    this.keyboarder = new Keyboarder();
    this.velocity = { x: 0, y: 0};
    this.gameSize = gameSize;
    this.overHeated = 0;
    this.poweredUp = 0;
    this.lifeSpan = 3;
    this.repairing = 0
    this.vertices = [
      { x: this.center.x, y: this.center.y - this.size.y / 2},
      { x: this.center.x + this.size.x / 2, y: this.center.y + this.size.y / 2},
      { x: this.center.x - this.size.x / 2, y: this.center.y + this.size.y / 2}
    ]
  }

  Player.prototype = {
    update: function() {
      if (this.poweredUp > 0) { this.poweredUp -= 1; }
      if (this.overHeated > 0) {this.overHeated -= 1;}
      if (this.repairing > 0) {this.repairing -= 1}

      this.playerActions();
      this.positioner();
    },

    playerActions: function () {

      var angle = ((this.angle - 90) * Math.PI) / 180;

      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
        this.turnLeft();
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.turnRight();
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
       this.thrust(angle);
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) && this.overHeated === 0 && this.poweredUp > 0) {
        this.shootShotGun(angle);
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) && this.overHeated === 0) {
        this.shootBullets(angle);
      }
    },

    positioner: function () {

      this.center.x += this.velocity.x
      this.center.y += this.velocity.y

      this.friction();

      this.vertices = [
            { x: this.center.x, y: this.center.y - this.size.y / 2},
            { x: this.center.x + this.size.x / 2, y: this.center.y + this.size.y / 2},
            { x: this.center.x - this.size.x / 2, y: this.center.y + this.size.y / 2}
      ]

      this.screenWrapping();

      var self = this

      for (let i = 0; i < this.vertices.length; i++) {
          this.vertices[i] = calcNextVertexCoord(this.vertices[i], self.center, -self.angle)
      }

      if (this.game.respawnPlayer === true) {
          this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };
          this.velocity = { x: 0, y: 0};
          this.game.respawnPlayer = false;
        }
    },

    friction: function () {
      this.velocity.x = this.velocity.x * 0.99;
      this.velocity.y = this.velocity.y * 0.99;
    },

    screenWrapping: function () {
      if (this.center.x - (this.size.x / 2) > this.gameSize.x) {
        this.center.x = 0;
      }
      if (this.center.x < 0) {
        this.center.x = this.gameSize.x;
      }
      if (this.center.y > this.gameSize.y) {
        this.center.y = 0;
      }
      if (this.center.y < 0) {
        this.center.y = this.gameSize.y;
      }
    },

    turnLeft: function () {
      this.angle -= 4;
    },

    turnRight: function () {
       this.angle += 4;
    },

    thrust: function (angle) {
       sounds.thruster.play();
       this.velocity.x += Math.cos(angle) * 0.1;
       this.velocity.y += Math.sin(angle) * 0.1;
    },

    shootBullets: function (angle) {
      var bullet = new Bullet({ x: this.center.x, y: this.center.y}, { x: Math.cos(angle) * 10 + this.velocity.x, y: Math.sin(angle) * 10 + this.velocity.y}, this.gameSize);
      this.game.addBody(bullet);
      this.overHeated = 20;
    },

    shootShotGun: function (angle) {
      var bullet1 = new Bullet({ x: this.center.x, y: this.center.y}, { x: Math.cos(angle - 0.1) * 10 + this.velocity.x, y: Math.sin(angle - 0.1) * 10 + this.velocity.y}, this.gameSize);
      var bullet2 = new Bullet({ x: this.center.x, y: this.center.y}, { x: Math.cos(angle) * 10 + this.velocity.x, y: Math.sin(angle) * 10 + this.velocity.y}, this.gameSize);
      var bullet3 = new Bullet({ x: this.center.x, y: this.center.y}, { x: Math.cos(angle + 0.1) * 10 + this.velocity.x, y: Math.sin(angle + 0.1) * 10 + this.velocity.y}, this.gameSize);
      this.game.addBody(bullet1);
      this.game.addBody(bullet2);
      this.game.addBody(bullet3);
      this.overHeated = 20;
    },

    draw: function(screen) {

      this.drawPowerLevel(screen);

      this.drawLives(screen);

      this.drawShip(screen);

      if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
        this.drawThrust(screen);
      }

      if (this.repairing % 20 < 10) {screen.stroke()}
    },

    drawPowerLevel: function (screen) {
      screen.save()
      screen.fillStyle = 'yellow'
      screen.fillRect(20, 20, this.poweredUp/12, 5)
      screen.beginPath();
    },

    drawLives: function (screen) {
      for(let i = 0; i < this.lifeSpan; i++ ) {
        screen.moveTo(780 - i * 18, 25 - this.size.y / 2)
        screen.lineTo(780 - i * 18 + this.size.x / 2, 25 + this.size.y / 2)
        screen.lineTo(780 - i * 18 - this.size.x / 2, 25 + this.size.y / 2)
        screen.lineTo(780 - i * 18, 25 - this.size.y / 2)
        screen.strokeStyle = 'white'
      }
    },

    drawShip: function (screen) {
      screen.moveTo(this.vertices[0].x, this.vertices[0].y);
      screen.lineTo(this.vertices[1].x, this.vertices[1].y);
      screen.lineTo(this.vertices[2].x, this.vertices[2].y);
      screen.lineTo(this.vertices[0].x, this.vertices[0].y);
    },

    drawThrust: function (screen) {
       screen.translate(this.center.x, this.center.y);
       screen.rotate(this.angle * Math.PI / 180);
       screen.translate(-this.center.x, -this.center.y);
       screen.moveTo(this.center.x + 3, this.center.y + 12)
       screen.lineTo(this.center.x, this.center.y + 15);
       screen.lineTo(this.center.x - 3, this.center.y + 12);
       screen.lineTo(this.center.x + 3, this.center.y + 12);
       screen.strokeStyle = 'white'
       screen.restore();
    },
  };
