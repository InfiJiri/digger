var Hobbin = function(map) {
	debug("Hobbin.init");

	var sprites = new SpriteSheet({
		width: 34,
		height: 34,
		sprites: {
			"walk1": { x: 0, y: 0 },
			"walk2": { x: 1, y: 0 },
			"walk3": { x: 2, y: 0 },
		}
	});

	this._animations = {
		"walk": new Animation([
			{ sprite: "walk1", time: 0.15 },
			{ sprite: "walk2", time: 0.15 },
			{ sprite: "walk3", time: 0.15 },
		], sprites)		
	};	
	
	this._image = new Image();
	this._image.src = "images/hobbin.png";
	this._timer = new FrameTimer();
	this._map = map;
};

Hobbin.prototype = {
	_animations: {},
    action: "walk",
	type: "hobbin",
	vx: 0,
	vy: 0,
	x: 0,
	y: 0,
	direction: 0,
	hspeed:    4,
	vspeed:    3,
	height:   34,
	width:    34,

	kill: function() {
		alert("This kills the Hobbin");
	},

	animate: function(context, interpolation) {
		this._timer.tick();

		var animation = this._animations[this.action];
		animation.animate(this._timer.getSeconds());

		var frame = animation.getSprite();

		context.drawImage(this._image,
			frame.x,
			frame.y,
			this.width,
			this.height,
			this.x + this.vx * interpolation,
			this.y + this.vy * interpolation,
			this.width,
			this.height);
	},

	update: function() {
		this.step();
	},

	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	},
	canEnterTile: function(x, y) {
		return this._map.canEntityEnterTile(this, x, y);
	},
	step: function() { // Taken from the java-port of Digger @ digger.org
	  var clbits;
	  var dir;
	  var mdirp1;
	  var mdirp2;
	  var mdirp3;
	  var mdirp4;
	  var t;
	  var push;

	  var digger = this._map.getDigger();
	  npDigger = digger.getNormalizedPosition();
	  npHobbin = this._map.getNormalizedEntityPosition(this);

	  if (npHobbin.vx==0 && npHobbin.vy==0) {
		/* If we are here the monster needs to know which way to turn next. */

		/* Turn hobbin back into nobbin if it's had its time */
		//if (this.hnt>30+(digger.Main.levof10()<<1)) {
		//  if (!this.nob) {
		//	this.hnt=0;
		//	this.nob=true;
		//  }
		//}

		/* Set up monster direction properties to chase Digger */
		var LEFT   = 4;
		var RIGHT  = 0;
		var UP     = 2;
		var DOWN   = 6;
		
		if (Math.abs(digger.y-npHobbin.y)>Math.abs(digger.x-npHobbin.x)) {
		  if (digger.y<npHobbin.y) {
			mdirp1 = {x:0, y:1};   //UP;
			mdirp4 = {x:0, y:-1}; //DOWN;
		  }	else {
			mdirp1 = {x:0, y:-1}; //DOWN;
			mdirp4 = {x:0, y:1};   //UP;
		  }

		  if (digger.x<npHobbin.x) {
			mdirp2 = {x:-1, y:0}; //LEFT;
			mdirp3 = {x:1, y:0}; //RIGHT;
		  } else {
			mdirp2 = {x:1, y:0}; //RIGHT;
			mdirp3 = {x:-1, y:0}; //LEFT;
		  }
		} else {
		  if (digger.x<npHobbin.x) {
		    mdirp1 = {x:-1, y:0}; //LEFT;
			mdirp4 = {x:1, y:0}; //RIGHT;
		  } else {
		    mdirp1 = {x:1, y:0}; //RIGHT;
			mdirp4 = {x:-1, y:0}; //LEFT;
		  }

		  if (digger.y<npHobbin.y) {
			mdirp2 = {x:0, y:1};   //UP;
			mdirp3 = {x:0, y:-1}; //DOWN;
		  } else { 
			mdirp2 = {x:0, y:-1}; //DOWN;
			mdirp3 = {x:0, y:1};   //UP;
		  }
		}

		/* In bonus mode, run away from digger */
		//if (digger.bonusmode) {
		//  t=mdirp1; mdirp1=mdirp4; mdirp4=t;
		//  t=mdirp2; mdirp2=mdirp3; mdirp3=t;
		//}

		/* Adjust priorities so that monsters don't reverse direction unless they
		   really have to */
		// dir = digger.reversedir(this.direction);
		
		/*if (dir==mdirp1) {
		  mdirp1 = mdirp2;
		  mdirp2 = mdirp3;
		  mdirp3 = mdirp4;
		  mdirp4 = dir;
		}

		if (dir==mdirp2) {
		  mdirp2 = mdirp3;
		  mdirp3 = mdirp4;
		  mdirp4 = dir;
		}

		if (dir==mdirp3) {
		  mdirp3 = mdirp4;
		  mdirp4 = dir;
		}*/

		/* Introduce a randno element on levels <6 : occasionally swap p1 and p3 */
		//if (digger.Main.randno(digger.Main.levof10()+5)==1 && digger.Main.levof10()<6) {
		//  t      = mdirp1;
		//  mdirp1 = mdirp3;
		//  mdirp3 = t;
		//}

		/* Check field and find direction */
			
		if ( this.canEnterTile( this.x + mdirp1.x, this.y + mdirp1.y )) {
		    dir = mdirp1;
		} else if (this.canEnterTile( this.x + mdirp2.x, this.y + mdirp2.y )) {
			dir = mdirp2;
	    } else if (this.canEnterTile( this.x + mdirp3.x, this.y + mdirp3.y )) {
			dir = mdirp3;
		} else if (this.canEnterTile( this.x + mdirp4.x, this.y + mdirp4.y )) {
			dir = mdirp4;
	    }

		/* Hobbins don't care about the field: they go where they want. */
		//if (!this.nob) {
		//  dir=mdirp1;
		//}

		/* Monsters take a time penalty for changing direction */
		if (this.direction!=dir) {
		  this.t++;
		}

		/* Save the new direction */
		this.direction = dir;
	  }

	  /* If monster is about to go off edge of screen, stop it. */
	  //if ((npHobbin.x==292 && this.direction==0) ||
	//	  (npHobbin.x==12 && this.direction==4) ||
		//  (npHobbin.y==180 && this.direction==6) ||
		 // (npHobbin.y==18 && this.direction==2)) {
		//this.direction = -1;
	  //}

	  /* Change hdir for hobbin */
	  //if (this.direction==4 || this.direction==0) {
	//	this.hdir=this.direction;
	  //}

	  /* Hobbins digger */
	  //if (!this.nob) {
	//	digger.Drawing.eatfield(npHobbin.x,npHobbin.y,this.direction);
	  //}

	  /* (Draw new tunnels) and move monster */
	  if ( this.direction.x ) {
		this.vx = this.speed * this.direction.x;
	  } else if (this.direction.y) {
		this.vy = this.speed * this.direction.y;
	  }

	  /* Hobbins can eat emeralds */
	  //if (!this.nob) {
	//		digger.hitemerald((npHobbin.x-12)/20,(npHobbin.y-18)/18, (npHobbin.x-12)%20,(npHobbin.y-18)%18, this.direction);
	  //}

	  /* If digger's gone, don't bother */
	  if (digger.action=="die") {
		this.vx = 0;
		this.vy = 0;
	  }

	  /* If monster's just started, don't move yet */
	  if (this.stime!=0) {
		this.stime--;
	  }

	  /* Increase time counter for hobbin */
	  //if (!this.nob && this.hnt<100) {
	//	this.hnt++;
	  //}

	  //push = true;
//	  digger.Main.incpenalty();

	  /* Collision with another monster */
	  //if ((clbits&0x3f00)!=0) {
      //	this.t++; /* Time penalty */
	  //checkcoincide(mon,clbits); /* Ensure both aren't moving in the same dir. */
	  //incpenalties(clbits);
	  //}

	  /* Check for collision with bag */
	  //if ((clbits&digger.Bags.bagbits())!=0) {
	//	this.t++; /* Time penalty */
		//mongotgold=false;
//		if (this.direction==4 || this.direction==0) { /* Horizontal push */
	//	  push=digger.Bags.pushbags(this.direction,clbits);
	//	  this.t++; /* Time penalty */
//		}
//		else
	//	  if (!digger.Bags.pushudbags(clbits)) /* Vertical push */
		//	push=false;
//		if (mongotgold) /* No time penalty if monster eats gold */
//		  this.t=0;
//		if (!this.nob && this.hnt>1)
//		  digger.Bags.removebags(clbits); /* Hobbins eat bags */
//	  }

	  /* Increase hobbin cross counter */
	  //if (this.nob && ((clbits&0x3f00)!=0) && digger.digonscr) {
	//	this.hnt++;
	  //}

	  /* See if bags push monster back */
	  //if (!push) {
		//digger.Drawing.drawmon(mon,this.nob,this.hdir,npHobbin.x,npHobbin.y);
		//digger.Main.incpenalty();
		//if (this.nob) /* The other way to create hobbin: stuck on h-bag */
		//  this.hnt++;
		//if ((this.direction==2 || this.direction==6) && this.nob)
		  //this.direction=digger.reversedir(this.direction); /* If vertical, give up */
	  //}

	  /* Collision with digger */
	  //if (((clbits&1)!=0) && digger.digonscr) {
	//	if (digger.bonusmode) {
		//  killmon(mon);
		  //digger.Scores.scoreeatm();
		  //digger.Sound.soundeatm(); /* Collision in bonus mode */
		//} else {
		  //digger.killdigger(3,0); /* Kill digger */
		//}
	 // }

	  /* Update co-ordinates */
	  //this.h  = (npHobbin.x-12)/20;
	  //this.v  = (npHobbin.y-18)/18;
	  //npHobbin.xr = (npHobbin.x-12)%20;
	  //npHobbin.yr = (npHobbin.y-18)%18;
	}
}