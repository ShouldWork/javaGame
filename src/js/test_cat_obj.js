
var
    canvas,
    renderingContext,
    width,
    height,
    foregroundPosition = 0,
    frames = 0,
    cat,
    pillars,
    currentState,
	jumping = false,
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    };



$(document).ready(function(){
	windowSetup();
	canvasSetup();
	currentState = states.Game;
	cat = new Cat();
	bckgr = new Background();
	loadGraphics();
});

function windowSetup(){
    width = window.innerWidth;
    height = window.innerHeight;
    if (width >= 500){
        width = 580;
        height = 380;
    }
    $(document).on("click",function(){
		onpress(-0.2);
	});
	$(document).on("mouseup",function(){
		onpress(0.4);
	});
    //$(document).on(inputEvent,onpress);
    //document.addEventListener(inputeEvent,onpress);
}

function canvasSetup(){
	canvas = "<canvas id='canvasEl' width='" + width + "' height='" + height + "'></canvas>"
	$("body").append(canvas); 
	$("#canvasEl").css({"border": "10px solid black"});
	ctx = $("#canvasEl")[0].getContext('2d');
}

function Cat() {
	this.x = 10;
	this.y = 230;
	this.frame = 0;
	this.velocity = 0;
	this.animation = [0,1,2,3,4,5,6,7];

	this.speedX = 0;
	this.speedY = 0;
	this.gravity = 0.05;
	this.gravitySpeed = 0;
	this._jump = 4.6;
	this.jumpHeight = 150;
	this.jump = function() {

		while(!jumping){
			console.log("Jumping!");
			//this.y = this.jumpHeight;
			//setTimeout(function(){
				//console.log("falling");
				//jumping = false
			//},500);
		}
		var rockbottom = height - catSprite[0].height - 10,
			jumpTop = rockbottom - this.jumpHeight;
		if (this.y > rockbottom) {
			this.y = rockbottom;
			this.gravitySpeed = 0;
		}
	}; 
	this.update = function() {
		
		var n = currentState === states.Splash ? 10 : 5;
		//var n = 3;
		this.frame += frames % n === 0 ? 1 : 0;
		this.frame %= this.animation.length; 

		if (currentState === states.Splash) {
			this.updateIdleCat();
		} else {
			this.updatePlayingCat();
		}
	};

	this.speedUp = function() {

	};

	this.slowDown = function() {

	};

	this.updateIdleCat = function (){
		this.y = height - 280 + 5 * Math.cos(frames / 10);
		this.rotation = 100;
	};
	this.updatePlayingCat = function(){
		if (this.y <= 2) {
			currentState = states.Score;
		}
		if (this.velocity >= this._jump){
		this.frame = 1;
		this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
		} else {
			this.rotation = -0.3;
		}
	};

	this.newPos = function() {
		this.gravitySpeed += this.gravity;
		this.y += this.gravitySpeed;
		//this.jump();
	};

	this.draw = function (ctx){
		//ctx.save();
		//ctx.translate(this.x, this.y);
		//ctx.rotate(this);
		var n = this.animation[this.frame];
		catSprite[n].draw(ctx,this.x,this.y);
		ctx.restore();
	};
}

function Background (){
	var x = 0;
	var y = 0;
	this.scroll = function(){
	    var pattern = ctx.createPattern(backimg, 'repeat');
	        ctx.rect(x, 0, width, height);
	        ctx.fillStyle = pattern;
	        ctx.fill();
	        ctx.drawImage(backimg,x,0);
	        console.log("background")
	  };
}


function loadGraphics() {
    // Initiate graphics and ok button
    backimg = new Image();
    backimg.src = 'images/jungle.png';
    var img = new Image();
    img.src = "images/runningcat (1).png";
    img.onload = function() {
        initSprites(this);
        gameLoop();
    };

}

function gameLoop(){
	update();
	render();
	window.requestAnimationFrame(gameLoop);
}

function update(){
	frames++;
	ctx.clearRect(0, 0, 680, 430);
	//cat.newPos();
	cat.update();
}

function render(){
	//bckgr.scroll();
	cat.draw(ctx);
}

function onpress(n){
	cat.jump();
	cat.gravity = n;
	//cat.jump();
}