var Monster = function(map) {
	debug("Monster.init");

	var sprites = new SpriteSheet({
		width: 34,
		height: 34,
		sprites: {
			"nobbin1": { x: 0, y: 0 },
			"nobbin2": { x: 1, y: 0 },
			"nobbin3": { x: 2, y: 0 },
			"hobbin1": { x: 0, y: 1 },
			"hobbin2": { x: 1, y: 1 },
			"hobbin3": { x: 2, y: 1 },			
		}
	});

	this._animations = {
		"nobbin": new Animation([
			{ sprite: "nobbin1", time: 0.15 },
			{ sprite: "nobbin2", time: 0.15 },
			{ sprite: "nobbin3", time: 0.15 },
		], sprites),
		"hobbin": new Animation([
			{ sprite: "hobbin1", time: 0.15 },
			{ sprite: "hobbin2", time: 0.15 },
			{ sprite: "hobbin3", time: 0.15 },
		], sprites),		
	};
	
	this._image = new Image();
	this._image.src = "images/monster.png";
	this._timer = new FrameTimer();
	this._map = map;
};

Monster.prototype = {
	_animations: {},
	type: "monster",
	state: "nobbin",
	vx: 0,
	vy: 0,
	x: 0,
	y: 0,
	normx: 0,
	normy: 0,	
	hnt: 0,
	stime: 50,
	direction: { x: 0, y: 0 },
	target:    null,
	hspeed:    2.5,
	vspeed:    2,
	height:   34,
	width:    34,

	kill: function() {
		alert("This kills the Monster");
	},
	isHobbin: function() {
		return this.state == "hobbin";
	},
	animate: function(context, interpolation) {
		this._timer.tick();

		var animation = this._animations[this.state];
		animation.animate(this._timer.getSeconds());

		var frame = animation.getSprite();

		context.drawImage(this._image,
			frame.x,
			frame.y,
			this.width,
			this.height,
			this.x + this.vx * interpolation, // Move this to 'update' or some other place that makes more sense
			this.y + this.vy * interpolation, // Move this to 'update' or some other place that makes more sense
			this.width,
			this.height);
	},

	update: function() {
		this.step();
	},

	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	},
	getNormalizedPosition: function() {
		return this._map.getNormalizedEntityPosition(this);
	},
	canEnterTile: function(x, y) {
		return this._map.canEntityEnterTile(this, x, y);
	},
	collide: function(entity) {
      this.t++; /* Time penalty */

	  /* Ensure both aren't moving in the same dir. */
	  if (this.direction.x == entity.directionx && this.direction.y == entity.direction.y) {
		entity.t++;
		this.t++;
	  }
	},
	moveToField: function(x, y) {
		this._map.moveEntityToField(this, x, y);
	},	
	step: function() { // Taken from the java-port of Digger @ digger.org
	  var dir;
	  var mdirp1;
	  var mdirp2;
	  var mdirp3;
	  var mdirp4;
	  var push;

	  var digger = this._map.getDigger();
	  npDigger = digger.getNormalizedPosition();
	  npMonster = this._map.getNormalizedEntityPosition(this);

	  if (this.target) {
		if (this.stime!=0) {
			/* If monster's just started, don't move yet */
			//this.vx = this.vy = 0;
			this.stime--;
			return;
		}

		if ((this.vx>0 && this.x>=this.target.x) ||
			(this.vx<0 && this.x<=this.target.x) ) {
			this.vx = 0;
			this.x  = this.target.x;

			this.target = null;
		}

		if ((this.vy>0 && this.y>=this.target.y) ||
			(this.vy<0 && this.y<=this.target.y) ) {
			this.vy = 0;
			this.y  = this.target.y;

			this.target = null;
		}


		this.x += this.vx;
		this.y += this.vy;		
		
		// Keep moving until destination reached.
		return;
	  }	  

		/* If we are here the monster needs to know which way to turn next. */

		/* Turn monster back into nobbin if it's had its time */
		if (this.hnt>30 && this.isHobbin()) {
			this.hnt   = 0;
			this.state = "nobbin";
		}

		/* Set up monster direction properties to chase Digger */
		var LEFT   = 4;
		var RIGHT  = 0;
		var UP     = 2;
		var DOWN   = 6;
		
		if (Math.abs(npDigger.y-npMonster.y)>Math.abs(npDigger.x-npMonster.x)) {
		  if (npDigger.y<npMonster.y) {
			mdirp1 = {x:0, y:-1};   //UP;
			mdirp4 = {x:0, y:1}; //DOWN;
		  }	else {
			mdirp1 = {x:0, y:1}; //DOWN;
			mdirp4 = {x:0, y:-1};   //UP;
		  }

		  if (npDigger.x<npMonster.x) {
			mdirp2 = {x:-1, y:0}; //LEFT;
			mdirp3 = {x:1, y:0}; //RIGHT;
		  } else {
			mdirp2 = {x:1, y:0}; //RIGHT;
			mdirp3 = {x:-1, y:0}; //LEFT;
		  }
		} else {
		  if (npDigger.x<npMonster.x) {
		    mdirp1 = {x:-1, y:0}; //LEFT;
			mdirp4 = {x:1, y:0}; //RIGHT;
		  } else {
		    mdirp1 = {x:1, y:0}; //RIGHT;
			mdirp4 = {x:-1, y:0}; //LEFT;
		  }

		  if (npDigger.y<npMonster.y) {
			mdirp2 = {x:0, y:-1};   //UP;
			mdirp3 = {x:0, y:1}; //DOWN;
		  } else { 
			mdirp2 = {x:0, y:1}; //DOWN;
			mdirp3 = {x:0, y:-1};   //UP;
		  }
		}

		/* In bonus mode, run away from digger */
		//if (digger.bonusmode) {
		//  t=mdirp1; mdirp1=mdirp4; mdirp4=t;
		//  t=mdirp2; mdirp2=mdirp3; mdirp3=t;
		//}

		/* Adjust priorities so that monsters don't reverse direction unless they
		   really have to */
	   dir = this.direction;
	   if (dir.x) { // What is the reverse direction of Monster?
			dir = { x: this.direction.x>0 ? -1 : 1, y: 0 }; 
	   } else if (dir.y) {
			dir = { x: 0, y: this.direction.y>0 ? -1 : 1 }; 
	   }

		if (dir.x==mdirp1.x && dir.y==mdirp1.y) {
		  mdirp1 = mdirp2;
		  mdirp2 = mdirp3;
		  mdirp3 = mdirp4;
		  mdirp4 = dir;
		}

		if (dir.x==mdirp2.x && dir.y==mdirp2.y) {
		  mdirp2 = mdirp3;
		  mdirp3 = mdirp4;
		  mdirp4 = dir;
		}

		if (dir.x==mdirp3.x && dir.y==mdirp3.y) {
		  mdirp3 = mdirp4;
		  mdirp4 = dir;
		}

		/* Introduce a randno element on levels <6 : occasionally swap p1 and p3 */
		//if (digger.Main.randno(digger.Main.levof10()+5)==1 && digger.Main.levof10()<6) {
		//  t      = mdirp1;
		//  mdirp1 = mdirp3;
		//  mdirp3 = t;
		//}

		/* Check field and find direction */

		if ( this.canEnterTile( npMonster.x + mdirp1.x, npMonster.y + mdirp1.y )) {
		    this.target = {x: npMonster.x + mdirp1.x, y: npMonster.y + mdirp1.y };
			dir = mdirp1;
		} else if (this.canEnterTile( npMonster.x + mdirp2.x, npMonster.y + mdirp2.y )) {
			this.target = {x: npMonster.x + mdirp1.x, y: npMonster.y + mdirp1.y };
			dir = mdirp2;
	    } else if (this.canEnterTile( npMonster.x + mdirp3.x, npMonster.y + mdirp3.y )) {
			this.target = {x: npMonster.x + mdirp1.x, y: npMonster.y + mdirp1.y };
			dir = mdirp3;
		} else if (this.canEnterTile( npMonster.x + mdirp4.x, npMonster.y + mdirp4.y )) {
			dir = mdirp4;
	    } else {
			dir = null;
			return;
			debug("Monster.NEIN");
		}		
		
		// FIXME calculate this without pixels
		var targetX = (npMonster.x + dir.x) * this._map.getTileWidth() ;
		var targetY = (npMonster.y + dir.y) * this._map.getTileHeight() ;

		/*this.target = {x: targetX + this._map.getEntityOffsetWidth(this) + this._map.getOffsetX(), 
			y: targetY + this._map.getEntityOffsetHeight(this) + this._map.getOffsetY() };*/
		this.moveToField(npMonster.x + dir.x, npMonster.y + dir.y);

		/* Monsters don't care about the field: they go where they want. */
		if (this.isHobbin()) {
		  dir = mdirp1;
		}

		/* Monsters take a time penalty for changing direction */
		if (this.direction!=dir) {
		  this.t++;
		}

		/* Save the new direction */
		this.direction = dir;

	  /* Monsters digger */
		if (this.isHobbin()) {
			// FIXME create tunnel
			//	digger.Drawing.eatfield(npMonster.x,npMonster.y,this.direction);
		}

	  /* (Draw new tunnels) and move monster */
	  this.vy = this.vx = 0;
	  if ( this.direction.x ) {
		this.vx = this.hspeed * this.direction.x;
	  } else if (this.direction.y) {
		this.vy = this.vspeed * this.direction.y;
	  }

	  /* If digger's gone, don't bother */
	  if (digger.action=="die") {
		this.vx = 0;
		this.vy = 0;
	  }

	  /* Increase time counter for monster */
	  if (!this.isHobbin() && this.hnt<100) {
		this.hnt++;
	  }

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
//		  digger.Bags.removebags(clbits); /* Monsters eat bags */
//	  }

	  /* Increase monster cross counter */
	  //if (this.nob && ((clbits&0x3f00)!=0) && digger.digonscr) {
	//	this.hnt++;
	  //}

	  /* See if bags push monster back */
	  //if (!push) {
		//digger.Drawing.drawmon(mon,this.nob,this.hdir,npMonster.x,npMonster.y);
		//digger.Main.incpenalty();
		//if (this.nob) /* The other way to create monster: stuck on h-bag */
		//  this.hnt++;
		//if ((this.direction==2 || this.direction==6) && this.nob)
		  //this.direction=digger.reversedir(this.direction); /* If vertical, give up */
	  //}
	  
	  
	  // FIXME Bonus stuff
	}
}