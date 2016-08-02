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
      var angle = ((this.angle - 90) * Math.PI) / 180;

      if (this.overHeated > 0) {this.overHeated -= 1;}
      if (this.repairing > 0) {this.repairing -= 1}

      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
        this.angle -= 4;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.angle += 4;
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
       sounds.thruster.play();
       this.velocity.x += Math.cos(angle) * 0.1;
       this.velocity.y += Math.sin(angle) * 0.1;
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) && this.overHeated === 0) {
        var bullet = new Bullet({ x: this.center.x, y: this.center.y}, { x: Math.cos(angle) * 10 + this.velocity.x, y: Math.sin(angle) * 10 + this.velocity.y}, this.gameSize);
        this.game.addBody(bullet);
        this.overHeated = 20;
      }

      this.center.x += this.velocity.x
      this.center.y += this.velocity.y

      this.velocity.x = this.velocity.x * 0.99;
      this.velocity.y = this.velocity.y * 0.99;

     this.vertices = [
           { x: this.center.x, y: this.center.y - this.size.y / 2},
           { x: this.center.x + this.size.x / 2, y: this.center.y + this.size.y / 2},
           { x: this.center.x - this.size.x / 2, y: this.center.y + this.size.y / 2}
     ]



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

    draw: function(screen) {
      screen.save()
      screen.beginPath();

      for(let i = 0; i < this.lifeSpan; i++ ) {
      screen.moveTo(780 - i * 18, 25 - this.size.y / 2)
      screen.lineTo(780 - i * 18 + this.size.x / 2, 25 + this.size.y / 2)
      screen.lineTo(780 - i * 18 - this.size.x / 2, 25 + this.size.y / 2)
      screen.lineTo(780 - i * 18, 25 - this.size.y / 2)
      screen.strokeStyle = 'white'
      }

      if (this.repairing % 20 < 10) {
        screen.moveTo(this.vertices[0].x, this.vertices[0].y);
        screen.lineTo(this.vertices[1].x, this.vertices[1].y);
        screen.lineTo(this.vertices[2].x, this.vertices[2].y);
        screen.lineTo(this.vertices[0].x, this.vertices[0].y)



        if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
          screen.translate(this.center.x, this.center.y);
          screen.rotate(this.angle * Math.PI / 180);
          screen.translate(-this.center.x, -this.center.y);
          screen.moveTo(this.center.x + 3, this.center.y + 12)
          screen.lineTo(this.center.x, this.center.y + 15);
          screen.lineTo(this.center.x - 3, this.center.y + 12);
          screen.lineTo(this.center.x + 3, this.center.y + 12);
          screen.strokeStyle = 'white'
          screen.restore();
        }
      screen.stroke()
      }
    },
  };
