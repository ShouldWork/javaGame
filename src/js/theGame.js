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
    $("#canvasContainer").css({"border": "5px solid #000","width": width,"height": height});
    //$("body").append($("#canvasContainer"));
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
        width = 380;
        height = 430;
        inputEvent = "mousedown";
    }
   // $(document).on(inputEvent,onpress);
    //document.addEventListener(inputeEvent,onpress);
}


function canvasSetup(){
    canvas = document.createElement("canvas");
    canvas.setAttribute("id","canvasContainer");


    renderingContext = canvas.getContext("2d"); //$("#canvasContainer")[0].getContext('2d');
}


function loadGraphics(){
    var img = new Image();
    img.src = "images/sheet.png";
    img.onload = function() {
        initSprites(this);
        renderingContext.fillStyle = backgroundSprite.color;
        renderingContext.fillRect(0,0,width,height);
        fishSprite[0].draw(renderingContext,5,5);
       /*
        okButton = {
            x: (width - okButtonSprite.width) /2,
            y: height - 200,
            width: okButtonSprite.width,
            height: okButtonSprite.height
        };
        */
        //gameLoop();
    };
}

