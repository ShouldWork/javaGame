
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
	birds = [],
    pillars,
	bird,
	ctx,
    currentState,
	mainspeed = 5,
    rockbottom = 260,
	jumping = false,
    states = {
        Splash: 0,
        Game: 1,
        Score: 2,
		Crash: 3
    };



$(document).ready(function(){
	windowSetup();
	canvasSetup();
	currentState = states.Game;
	loadGraphics();
	cat = new Cat();
	bird = new Bird(); 

});

function windowSetup(){
    width = window.innerWidth;
    height = window.innerHeight;
    if (width >= 500){
        width = 705;
        height = 380;
    }
}

function canvasSetup(){
	canvas = "<canvas id='canvasEl' width='" + width + "' height='" + height + "'></canvas>";

	$("body").append(canvas); 
	$("#canvasEl").css({"border": "10px solid black"});
	ctx = $("#canvasEl")[0].getContext('2d');
	$(document).on("click",function(){
		onpress();
	});
	$(document).on("keydown",function ( e ){
		if (e.shiftKey){
			speedup();
		};
	});
	$(document).on("keyup", function ( e ){
		if (e.shiftKey){
			slowdown();
		}
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
	this.x = 0;
	this.y = 100;
	this.color = "blue"; 
    this.update = function() {

    	this.start -= 8;
		if (currentState != states.Game){
			this.start -= -mainspeed - -13;
			if (this.x < -this.width * 2){
				obstacles = [];
			}
		}
    	this.x = this.start;
    	this.left = this.x;
    	this.right = this.x + this.width;
        if (obstacles.length >= 2){
			obstacles.pop();
		}
		this.draw();
		this.collide();
    };
	this.draw = function () {
		var rightSide = canvasWidth + this.width;
		var img=document.createElement('img');
		img.src='images/tree.png';
		ctx.drawImage(img,0,0,180,80,this.x,canvasHeight - this.height - 14,180,80);
		ctx.drawImage(img,0,0,180,80,this.x + this.width,canvasHeight - this.height - 14,180,80);
		if(this.x < -this.width * 2){
			this.start = rightSide;
		}
		this.collide();
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


function Bird() {
	var birdState = "wait";
	this.state = birdState;
	this.height = 150;
	this.width = 80;
	this.x = canvasWidth - this.width;
	this.y = canvasHeight - this.height - 220;
	this.top = canvasHeight + this.height;
	this.bottom = this.y - this.height;
	this.right = this.x - this.width;
	this.left = this.x;
	this.animation = [0,1,2,1,0];
	this.frame = 0;
	this.speed = 1;
	this.rotation = 0;
	this.update = function() {
		birdState = this.state;
		if (currentState === states.Game){
			this.updateGameBird();
		}
		if (this.bottom - this.height >= canvasHeight){
		//	console.log(this.bottom);
			birds.shift();
		}
	};
	this.updateGameBird = function(){
		if (birdState === "wait"){
				this.animation = [0,1,2,1,0];
			this.x -= this.speed -0.25;
			} else if (birdState === "dive"){
			this.left = this.x - this.width /2;
			//this.bottom = this.y + this.height / 2;
			//this.top = this.bottom - this.height /2;

			this.animation = [4,5,6,7,8,9];

			//n = this.animation[this.frame];
		//	ctx.fillRect(50,50,100,100);
		} else if (birdState === "smash"){
			console.log("smash");
			this.speed = 4;
			this.animation = [3];
			this.y += 3;

		}
			var n = 5;
			this.frame += frames % n === 0 ? 1 : 0;
			this.frame %= this.animation.length;
		};

	this.draw = function (ctx){
		birdState = this.state;
		if (birdState === "wait"){
			var n = this.animation[this.frame];

			birdSprite[n].draw(ctx,this.x,this.y);
		} else if (birdState === "dive"){
			n = this.animation[this.frame];
			this.y += 2.5;
			this.x += this.speed - mainspeed;
			this.bottom = this.y - birdSprite[5].height;
			this.top = this.bottom - birdSprite[5].height;
			ctx.fillStyle="#FF0000";
			//ctx.fillRect(this.x+ 10,this.y,birdSprite[n].width - 13,birdSprite[n].height + 5);
			birdSprite[n].draw(ctx,this.x, this.y);
			this.collide();
		} else if (birdState === "smash"){
			console.log("smash");
			this.y +=3;
			birdSprite[3].draw(ctx,this.x,this.y);
		}
	};
	this.tapOut = function(){
		this.state = "smash";
		jumping = false;
	};
	this.collide = function() {
		if (cat.y - catSprite[1].height  > this.top && (cat.x + catSprite[1].width - 50) >= this.left && this.bottom >= cat.y){
			console.log(this.top + " " + (cat.y + 150));
			currentState = states.Crash;
		}
		if (cat.x + catSprite[1].width >= this.left + 20 && cat.y >= this.bottom){
		//	console.log(this.top);
		//	rockbottom = this.top - catSprite[1].height - 20;

		} else if (cat.x + catSprite[1].width >= this.left + birdSprite[4].width && cat.y >= this.top){
			//rockbottom = this.top - catSprite[1].height + (birdSprite[4].height * 2);

			//console.log("top of bird");
			this.gravitySpeed = 0;
			this.tapOut();
			this.animation = [3];
			//console.log((cat.x + catSprite[1].width) + " vs " + this.x)
		} else if (cat.x + catSprite[1].width >= this.x){
			rockbottom = 260;
			//console.log((cat.x + catSprite[1].width) + " vs " + this.x)
		}
	}
}
function Cat() {
	this.x = 10;
	this.y = 230;
	this.frame = 0;
	this.velocity = 0;
	this.animation = [0,1,2,3,4,5,6,7];

	this.rotation = 0;
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
	var rotation = 0;
	this.UpdateCrashingCat = function(){
		this.y = 220;
		this.x +=10;
		var n = 20;
		this.frame += frames % n === 0 ? 1 : 0;
		this.frame %= this.animation.length;
		this.rotation += 0.15;
	};


	this.draw = function (ctx){
		if (currentState === states.Game){
			var n = this.animation[this.frame];
			catSprite[n].draw(ctx,this.x,this.y);
		} else if (currentState === states.Crash){
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.rotation);
			catSprite[4].draw(ctx, -catSprite[4].width/2, -catSprite[4].height/2);
			ctx.restore();
		}
	};
}
function speedup() {
	setTimeout(function(){
		mainspeed += 2;
	},500)
}
function Background (img){
	var x = 0;
	var y = 0;
	this.speedX = mainspeed;
	this.width = 505;
	ctx.fillStyle = "green";

	this.img = img;
	console.log(img);
	this.scroll = function(){
		if (currentState != states.Game){
			this.speedX = 15;
			if (cat.x - catSprite[4].width > canvasWidth){
				this.speedX = 0;
			}
		}
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
	var tree = new Image();
	tree.src = backimg.src;
	tree.onload = function(){
		initTreeSprite(this);

	};
	var birdImg = new Image();
	birdImg.src = 'images/bird(turn) copy.png';
	birdImg.onload = function() {
		initBirdSprite(this);
		gameLoop();
	};
}

function gameLoop(){
	update();
	render();
	gaming = requestAnimationFrame(gameLoop);
}

function update(){
	frames++;
	if(frames === 1 || everyinterval( 150 )){  // Math.floor((Math.random() * 550) + 150))){
		if (currentState === states.Game){
			obstacle = new Obstacle(500,Math.ceil(Math.random() * 100) + 50);
			obstacles.push(obstacle);
		}

	}
	if (frames === 1 || everyinterval( 350 )){ //Math.ceil(Math.random() * 450) + 100)){
		bird = new Bird();
		birds.push(bird);
	}
	for ( var cc = 0; cc < birds.length; cc++){
		birds[cc].update();
	}
	cat.fall();
	cat.update();
}

function render(){
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		bckgr.scroll();

	cat.draw(ctx);
		for (var i = 0; i < obstacles.length; i++) {
			obstacles[i].update();
		}
	for ( var cc = 0; cc < birds.length; cc++){
		birds[cc].draw(ctx);

	}
	//bird.draw(ctx);
}

function onpress(){
	cat.jump();
}
function onCtrl(){
	speedup();
}

function slowdown(){
	setTimeout(function(){
		mainspeed -= 1;
	},500);
}
var updateState = 0;
function everyinterval(n) {

    if ((frames / n) % 1 == 0) {
		updateState++;
	//	console.log(updateState);
		if (updateState === 1){
			bird.state = "dive";
			updateState = 0;
		}
		return true;}

    return false;
}



