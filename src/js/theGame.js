var
    canvas,
    renderingContext,
    width,
    height,
    okButton,
    foregroundPosition = 0,
    frames = 0,
    character,
    pillars,
    currentState,
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    };




$(document).ready(function(){
    windowSetup();
    canvasSetup();
    currentState = states.Splash;
    document.body.appendChild(canvas);
    
    character = new Character();
   // pillars = new PillarCollections();
    loadGraphics();
});

function Character(){
    this.x = 140;
    this.y = 0;
}

function windowSetup(){
    width = window.innerWidth;
    height = window.innerHeight;
    var inputEvent = "touchstart";
    if (width >= 500){
        width = 680;
        height = 380;
        inputEvent = "mousedown";
    }
    //$(document).on(inputEvent,onpress);
    //document.addEventListener(inputeEvent,onpress);
}


function canvasSetup(){
    canvas = document.createElement("canvas");
    renderingContext = canvas.getContext('2d');
    canvas.setAttribute("width",width);
    canvas.setAttribute("height",height);    
}


function loadGraphics(){
    var backimg = new Image();
    backimg.src = 'images/jungle.png';
    backimg.onload = function() {
    var pattern = renderingContext.createPattern(backimg, 'repeat');
        renderingContext.rect(0, 0, canvas.width, canvas.height);
        renderingContext.fillStyle = pattern;
        renderingContext.fill();
      };
    var img = new Image();
    img.src = "images/runningcat (1).png";
    img.onload = function() {
        initSprites(this);
        catSprite[0].draw(renderingContext,10,height - catSprite[0].height - 10);
    };

    var birdimg = new Image();
    birdimg.src = 'images/bird.png';
    birdimg.onload = function(){
        initSprites2(this);
        birdSprite[0].draw(renderingContext,width - birdSprite[0].width,200);
    };
    //var timer = setInterval(catLoop,100);
    //var birdtimer = setInterval(birdLoop,400);
}


var i = 0,
    j = 0;
function catLoop(){
    if (i >= 7) {
        i=-1;
    }
    
    var backimg = new Image();
    backimg.onload = function() {
    var pattern = renderingContext.createPattern(backimg, 'repeat');
        renderingContext.rect(-150, 0, canvas.width, canvas.height);
        renderingContext.fillStyle = pattern;
        renderingContext.fill();
      };
    backimg.src = 'images/jungle.png';
    var img = new Image();
    img.src = "images/runningcat3.png";
    img.onload = function() {
        //initSprites(this);
        catSprite[i].draw(renderingContext,10,height - catSprite[0].height - 10);
    };
    renderingContext.clearRect(0, 0, canvas.width, canvas.height);
    i++
}

function birdLoop(){
    while(true){
        for (j = 0; j<birdSprite.length;j++){
            var birdimg = new Image();
            birdimg.src = 'images/bird.png';
            birdimg.onload = function(){
                birdSprite[j].draw(renderingContext,width - birdSprite[0].width,200);
            };
            renderingContext.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}




function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
    //console.log('swim');
}

/**
 * Updates all moving sprites: foreground, fish, and corals
 */
function update() {
    frames++;
    fish.update();
    //console.log(fish.y);
}

/**
 * Re-draw the game view.
 */
function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);

    // Draw background sprites
    backgroundSprite.draw(renderingContext, 0, height - backgroundSprite.height);
    backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    corals.draw(renderingContext);
    fish.draw(renderingContext);

    if (currentState === states.Score) {
        okButtonSprite.draw(renderingContext, okButton.x, okButton.y);
    }

    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);
}



/**
 * Fish class. Creates instances of Fish.
 * @constructor
 */
function Fish() {
    this.x = 140;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 3,4,5,6,7]; // The animation sequence

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    /**
     * Makes the Fish jump
     */
    this.jump = function () {
        this.velocity = -this._jump;
    };

    /**
     * Update sprite animation and position of Fish
     */
    this.update = function () {
        // Play animation twice as fast during game state
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdleFish();
        } else { // Game state
            this.updatePlayingFish();
        }
    };

    /**
     * Runs the fish through its idle animation.
     */
    this.updateIdleFish = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    /**
     * Determines fish animation for the player-controlled fish.
     */
    this.updatePlayingFish = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Change to the score state when fish touches the ground
        if (this.y >= height - foregroundSprite.height - 10) {
            this.y = height - foregroundSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

        // If our player hits the top of the canvas, we crash him
        if (this.y <= 2) {
            currentState = states.Score;
        }

        // When fish lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
        } else {
            this.rotation = -0.3;
        }
    };

    /**
     * Draws Fish to canvas renderingContext
     * @param  {CanvasRenderingContext2D} renderingContext the context used for drawing
     */
    this.draw = function (renderingContext) {
        renderingContext.save();

        // translate and rotate renderingContext coordinate system
        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

        // draws the fish with center in origin
        fishSprite[n].draw(renderingContext, -fishSprite[n].width / 2, -fishSprite[n].height / 2);

        renderingContext.restore();
    };
}