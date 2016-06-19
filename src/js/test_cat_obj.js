
var
    canvas,
    renderingContext,
    width,
    height,
    foregroundPosition = 0,
    frames = 0,
    cat,
    obstacle,
    obstacles = [],
    pillars,
    currentState,
    rockbottom = 260,
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
	obstacle = new Obstacle(50,50);
	loadGraphics();
});

function windowSetup(){
    width = window.innerWidth;
    height = window.innerHeight;
    if (width >= 500){
        width = 780;
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
	$("#canvasEl").on("click",function(){
		onpress();
	});
	canvasWidth = $("#canvasEl").prop("width");
	canvasHeight = $("#canvasEl").prop("height");
}

function Obstacle(width,height){
	
	this.height = height;
	this.width = width; 
	this.start = canvasWidth;
	this.top = canvasHeight - this.height;
	this.bottom = canvasHeight;
	//this.x = x;
	//this.y = y;
	this.color = "blue"; 
    this.update = function() {
    	var rightSide = canvasWidth + this.width,
    		speed = 8;
    	this.start -= speed; 
    	this.x = this.start;
    	this.left = this.x;
    	this.right = this.x + this.width;
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, canvasHeight - this.height - 14, this.width,this.height );
        if(this.x < -this.width){
        	this.start = rightSide; 
        }
        if (obstacles.length >= 2){
			obstacles.pop();
		}
		this.collide();
		//console.log(this.height);

    };
    this.collide = function(){
    	console.log(rockbottom);
    	if (cat.x + catSprite[1].width >= this.left){
    		rockbottom = this.top - catSprite[1].height - 40;
    		
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

		if (this.y >= rockbottom - 10){
			cat.animation = [0,1,2,3,4,5,6,7];
			jumping = false
		}
		
		var n = currentState === states.Splash ? 10 : 5;
		//console.log(cat.y);
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
	};


	this.draw = function (ctx){
		var n = this.animation[this.frame];
		catSprite[n].draw(ctx,this.x,this.y);
		ctx.fillRect(this.x,this.y,1,10);
		ctx.fillRect(this.x + catSprite[1].width,this.y,1,10);
		ctx.fillRect(this.x,this.y + catSprite[1].height,1,10)
		ctx.fillRect(this.x + catSprite[1].width,this.y + catSprite[1].height,1,10);
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
	
	if(frames === 1 || everyinterval(Math.floor((Math.random() * 1550) + 150))){
		obstacle = new Obstacle(500,50);
		obstacles.push(obstacle);
		//console.log(obstacle);
		//obstacle.update();
	}

	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	//ctx.drawImage("<div></div>",10,100);

	for (var i = 0; i < obstacles.length; i++){
		obstacles[i].update()
	}

	cat.fall();
	cat.update();
	
}

function render(){
	//bckgr.scroll();
	
	cat.draw(ctx);
}

function onpress(){
	cat.jump();
	//cat.gravity = n;
	//cat.jump();
}

function everyinterval(n) {
	//console.log("everyInterval: " + frames);
    if ((frames / n) % 1 == 0) {return true;}
    return false;
}