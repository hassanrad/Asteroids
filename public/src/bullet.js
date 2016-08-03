function Bullet(center, velocity, gameSize) {

  sounds.fire.play();
  this.type = 'bullet';
  this.size = { x: 3, y: 3};
  this.center = center;
  this.velocity = velocity;
  this.lifeSpan = 40;
  this.gameSize = gameSize;
  this.vertices = [
          { x: center.x - this.size / 2, y: center.y - this.size / 2},
          { x: center.x + this.size / 2, y: center.y - this.size / 2},
          { x: center.x + this.size / 2, y: center.y + this.size / 2},
          { x: center.x - this.size / 2, y: center.y + this.size / 2}
    ]
}

Bullet.prototype = {
  update: function () {
    this.lifeSpan -= 1
    this.positioner();
  },

  positioner: function () {
    this.center.x += this.velocity.x
    this.center.y += this.velocity.y
    
    this.vertices = [
          { x: this.center.x - this.size.x / 2, y: this.center.y - this.size.y / 2},
          { x: this.center.x + this.size.x / 2, y: this.center.y - this.size.y / 2},
          { x: this.center.x + this.size.x / 2, y: this.center.y + this.size.y / 2},
          { x: this.center.x - this.size.x / 2, y: this.center.y + this.size.y / 2}
    ]

    this.screenWrapping();
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

  draw: function(screen) {
    screen.fillStyle = 'white';
    screen.fillRect(this.center.x - this.size.x / 2,
                    this.center.y - this.size.y / 2,
                    this.size.x,
                    this.size.y);
  }
};
