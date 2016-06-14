var fishSprite,
    backgroundSprite;


Sprite.prototype.draw = function (renderingContenxt, x, y){
    renderingContenxt.drawImage(this.img, this.x, this.y, this.width, this.height,
    x, y, this.width, this.height);
};

function Sprite(img,x,y,width,height){
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
}

function initSprites(img){
    fishSprite = [
        new Sprite(img, 176, 115, 42, 28),
        new Sprite(img, 176, 144, 42, 28),
        new Sprite(img, 176, 172, 42, 28)
    ];
    backgroundSprite = new Sprite(img,0,0,138,114);
    backgroundSprite.color = "aqua";
}