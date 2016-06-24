
var
    canvas,
    renderingContext,
    width,
    height,
    foregroundPosition = 0,
    frames = 0,
    cat,
    obstacle,
	gaming,
    obstacles = [],
    pillars,
    currentState,
    rockbottom = 260,
	jumping = false,
    states = {
        Splash: 0,
        Game: 1,
        Score: 2,
		Crash: 3,
    };



$(document).ready(function(){
	windowSetup();
	canvasSetup();
	currentState = states.Game;
	cat = new Cat();
	//obstacle = new Obstacle(50,50);
	loadGraphics();
});

function windowSetup(){
    width = window.innerWidth;
    height = window.innerHeight;
    if (width >= 500){
        width = 705;
        height = 380;
    }

    //$(document).on(inputEvent,onpress);
    //document.addEventListener(inputeEvent,onpress);
}

function canvasSetup(){
	canvas = "<canvas id='canvasEl' width='" + width + "' height='" + height + "'></canvas>"

	$("body").append(canvas); 
	$("#canvasEl").css({"border": "10px solid black"});
	ctx = $("#canvasEl")[0].getContext('2d');
	$(document).on("click",function(){
		onpress();
	});
	canvasWidth = $("#canvasEl").prop("width");
	canvasHeight = $("#canvasEl").prop("height");
}

function Obstacle(width,height){
	this.height = 80;
	this.width = 180;
	this.start = canvasWidth;
	this.top = canvasHeight - this.height;
	this.bottom = canvasHeight;
	this.x = 50;
	this.y = 100;
	this.color = "blue"; 
    this.update = function() {

    	this.start -= 8;
    	this.x = this.start;
    	this.left = this.x;
    	this.right = this.x + this.width;
        if (obstacles.length >= 2){
			obstacles.pop();
		}
		this.draw();
		this.collide();
		//console.log(this.height);

    };
	this.draw = function () {
		var rightSide = canvasWidth + this.width;
		var img=document.createElement('img');
		img.src='images/tree.png';
		ctx.drawImage(img,0,0,180,80,this.x,canvasHeight - this.height - 14,180,80);
		ctx.drawImage(img,0,0,180,80,this.x + this.width,canvasHeight - this.height - 14,180,80);
		//ctx.fillStyle = "blue";
		//ctx.fillRect(this.x, canvasHeight - this.height - 14, this.width,this.height );
		if(this.x < -this.width){
			this.start = rightSide;
		}
	};

    this.collide = function(){
    	//console.log(rockbottom);
		if (cat.y + catSprite[1].height  > this.top && cat.x + catSprite[1].width >= this.left + 20){
			currentState = states.Crash;
		}
    	if (cat.x + catSprite[1].width >= this.left + 20){
    		rockbottom = this.top - catSprite[1].height - 20;
    		
    	} else {
    		rockbottom = 260;
    		this.gravitySpeed = 0;
    	}
    }
}



function Cat() {
	this.x = 10;
	this.y = 230;
	this.frame = 0;
	this.velocity = 0;
	this.animation = [0,1,2,3,4,5,6,7];

	this.speedX = 0;
	this.speedY = 0;
	this.gravity = 0.5;
	this.gravitySpeed = 0;
	this._jump = 4.6;
	this.jumpHeight = 150;
	this.jump = function() {

		while(!jumping){
			jumping=true;
			this.gravitySpeed = -12.5;
			this.animation = [0];
		}

	}; 
	this.fall = function() {
			this.gravitySpeed += this.gravity;
			this.y += this.gravitySpeed;
			this.hitBottom();
	};
	this.hitBottom = function() {
		
		if (this.y > rockbottom) {
			this.y = rockbottom;
			this.gravitySpeed = 0;
		}
	};
	this.update = function() {
		if (currentState === states.Splash) {
			this.updateIdleCat();
		} else if (currentState == states.Game){
			this.updatePlayingCat();
		} else if (currentState === states.Crash){
			this.UpdateCrashingCat();
		}
	};

	this.speedUp = function() {

	};

	this.slowDown = function() {

	};

	this.updateIdleCat = function (){
		jumping = false;
		this.y = height - 280 + 5 * Math.cos(frames / 10);
		this.rotation = 100;
	};
	this.updatePlayingCat = function(){
		if (this.y >= rockbottom - 10){
			cat.animation = [0,1,2,3,4,5,6,7];
			jumping = false;
		}
		var n = 5;
		this.frame += frames % n === 0 ? 1 : 0;
		this.frame %= this.animation.length;
	};

	this.UpdateCrashingCat = function(){
		jumping = false;
		cat.animation = 0;
		$("body").append("<button>This</button>");
		gaming = cancelAnimationFrame(gameLoop);
	};


	this.draw = function (ctx){
		var n = this.animation[this.frame];
		catSprite[n].draw(ctx,this.x,this.y);
		/*
		ctx.fillRect(this.x,this.y,1,10);
		ctx.fillRect(this.x + catSprite[1].width,this.y,1,10);
		ctx.fillRect(this.x,this.y + catSprite[1].height,1,10);
		ctx.fillRect(this.x + catSprite[1].width,this.y + catSprite[1].height,1,10);
		*/
		ctx.restore();
	};
}

function Background (img){
	var x = 0;
	var y = 0;
	this.speedX = 5;
	this.width = 505;
	ctx.fillStyle = "green";

	this.img = img;
	console.log(img);
	this.scroll = function(){
		if (x <= -canvasWidth + 200){
			x = 0;
		}
		x -= this.speedX;
		ctx.drawImage(this.img, x, y);
		ctx.drawImage(this.img, x + this.width ,0);
		ctx.drawImage(this.img, x + this.width + this.width,0);
	  };
}


function loadGraphics() {
    backimg = new Image();
    backimg.src = 'images/jungle.png';
	bckgr = new Background(backimg);
    var img = new Image();
    img.src = "images/runningcat (1).png";
    img.onload = function() {
        initSprites(this);

    };
	tree = new Image();
	tree.src = backimg.src;
	tree.onload = function(){
		initTreeSprite(this);
		gameLoop();
	}
}

function gameLoop(){

	update();
	if (currentState === states.Game){
		render();
	}
	 gaming = requestAnimationFrame(gameLoop);
}

function update(){
	frames++;

	if(frames === 1 || everyinterval( 150 )){  // Math.floor((Math.random() * 550) + 150))){
		obstacle = new Obstacle(500,Math.ceil(Math.random() * 100) + 50);
		obstacles.push(obstacle);
	}
	cat.fall();
	cat.update();
}

function render(){
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	bckgr.scroll();
	cat.draw(ctx);
	for (var i = 0; i < obstacles.length; i++){
		obstacles[i].update();
	}
}

function onpress(){
	cat.jump();
}

function everyinterval(n) {
    if ((frames / n) % 1 == 0) {return true;}
    return false;
}