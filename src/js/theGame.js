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
    //var timer = setInterval(gameLoop,100);
}


var i = 0,
    j = 0;
function gameLoop(){
    j++;
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

