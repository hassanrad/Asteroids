function Powerup(gameSize, center, size) {
  this.type = 'powerup'
  this.size = size;
  this.gameSize = gameSize
  this.center = center
  this.angle = 0;
  this.velocity = { x: randomRange(), y: randomRange() };
  this.lifeSpan = 600;
  this.vertices = [
        { x: this.center.x - this.size / 2, y: this.center.y - this.size / 2},
        { x: this.center.x + this.size / 2, y: this.center.y - this.size / 2},
        { x: this.center.x + this.size / 2, y: this.center.y + this.size / 2},
        { x: this.center.x - this.size / 2, y: this.center.y + this.size / 2}
  ]
}

Powerup.prototype = {
  update: function() {
    this.lifeSpan -= 1;

    this.center.x += this.velocity.x;
    this.center.y += this.velocity.y;

    this.vertices = [
          { x: this.center.x - this.size / 2, y: this.center.y - this.size / 2},
          { x: this.center.x + this.size / 2, y: this.center.y - this.size / 2},
          { x: this.center.x + this.size / 2, y: this.center.y + this.size / 2},
          { x: this.center.x - this.size / 2, y: this.center.y + this.size / 2}
    ]

    if (this.center.x > this.gameSize.x) {
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
    screen.save();
    screen.strokeStyle = 'yellow';
    screen.beginPath();
    screen.arc(this.center.x, this.center.y, (this.size/2), 0, Math.PI*2, true);
    screen.stroke();
    screen.restore();
  },
};