var catSprite,
    birdSprite;

Sprite.prototype.draw = function (renderingContext, x, y){
  //renderingContext.drawImage(this.img,this.x,this.y);
  renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height,
   x, y, this.width, this.height);
};
/**
 * Sprite class
 * @param {Image} img - sprite sheet image
 * @param {number} x - x-position in sprite sheet
 * @param {number} y - y-position in sprite sheet
 * @param {number} width - width of sprite
 * @param {number} height - height of sprite
 */
function Sprite(img,x,y,width,height){
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
}

function initSprites(img){
    catSprite = [
        new Sprite(img, 1, 15, 150, 55),
        new Sprite(img, 150, 18, 120, 52),
        new Sprite(img, 12, 85, 120, 55),
        new Sprite(img, 158, 85, 110, 50),
        new Sprite(img, 16, 155, 112, 50),
        new Sprite(img, 155, 160, 110, 50),
        new Sprite(img, 5, 225, 120, 55),
        new Sprite(img, 140, 220, 133, 60)
    ];
}

function initSprites2(img){
    birdSprite = [
        new Sprite(img,7,5,40,35),
        new Sprite(img,0,0,0,0),
        new Sprite(img,0,0,0,0),
        new Sprite(img,0,0,0,0),
        new Sprite(img,0,0,0,0),
        new Sprite(img,0,0,0,0),
        new Sprite(img,0,0,0,0),
        new Sprite(img,0,0,0,0),
        new Sprite(img,0,0,0,0),
        new Sprite(img,0,0,0,0),
        new Sprite(img,0,0,0,0)
    ];
}