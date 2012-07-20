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
	speed:  2,
	height: 34,
	width:  34,

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

	},
	draw: function(context, interpolation) {
		this.animate(context, interpolation);
	},
	step: function() {
	  var clbits;
	  var monox;
	  var monoy;
	  var dir;
	  var mdirp1;
	  var mdirp2;
	  var mdirp3;
	  var mdirp4;
	  var t;
	  var push;

	  monox=this.x;
	  monoy=this.y;
	  if (this.xr==0 && this.yr==0) {

		/* If we are here the monster needs to know which way to turn next. */

		/* Turn hobbin back into nobbin if it's had its time */

		if (this.hnt>30+(dig.Main.levof10()<<1))
		  if (!this.nob) {
			this.hnt=0;
			this.nob=true;
		  }

		/* Set up monster direction properties to chase dig */

		if (Math.abs(dig.diggery-this.y)>Math.abs(dig.diggerx-this.x)) {
		  if (dig.diggery<this.y) { mdirp1=2; mdirp4=6; }
								else { mdirp1=6; mdirp4=2; }
		  if (dig.diggerx<this.x) { mdirp2=4; mdirp3=0; }
								else { mdirp2=0; mdirp3=4; }
		}
		else {
		  if (dig.diggerx<this.x) { mdirp1=4; mdirp4=0; }
								else { mdirp1=0; mdirp4=4; }
		  if (dig.diggery<this.y) { mdirp2=2; mdirp3=6; }
								else { mdirp2=6; mdirp3=2; }
		}

		/* In bonus mode, run away from digger */

		if (dig.bonusmode) {
		  t=mdirp1; mdirp1=mdirp4; mdirp4=t;
		  t=mdirp2; mdirp2=mdirp3; mdirp3=t;
		}

		/* Adjust priorities so that monsters don't reverse direction unless they
		   really have to */

		dir=dig.reversedir(this.dir);
		if (dir==mdirp1) {
		  mdirp1=mdirp2;
		  mdirp2=mdirp3;
		  mdirp3=mdirp4;
		  mdirp4=dir;
		}
		if (dir==mdirp2) {
		  mdirp2=mdirp3;
		  mdirp3=mdirp4;
		  mdirp4=dir;
		}
		if (dir==mdirp3) {
		  mdirp3=mdirp4;
		  mdirp4=dir;
		}

		/* Introduce a randno element on levels <6 : occasionally swap p1 and p3 */

		if (dig.Main.randno(dig.Main.levof10()+5)==1 && dig.Main.levof10()<6) {
		  t=mdirp1;
		  mdirp1=mdirp3;
		  mdirp3=t;
		}

		/* Check field and find direction */

		if (fieldclear(mdirp1,this.h,this.v))
		  dir=mdirp1;
		else
		  if (fieldclear(mdirp2,this.h,this.v))
			dir=mdirp2;
		  else
			if (fieldclear(mdirp3,this.h,this.v))
			  dir=mdirp3;
			else
			  if (fieldclear(mdirp4,this.h,this.v))
				dir=mdirp4;

		/* Hobbins don't care about the field: they go where they want. */

		if (!this.nob)
		  dir=mdirp1;

		/* Monsters take a time penalty for changing direction */

		if (this.dir!=dir)
		  this.t++;

		/* Save the new direction */

		this.dir=dir;
	  }

	  /* If monster is about to go off edge of screen, stop it. */

	  if ((this.x==292 && this.dir==0) ||
		  (this.x==12 && this.dir==4) ||
		  (this.y==180 && this.dir==6) ||
		  (this.y==18 && this.dir==2))
		this.dir=-1;

	  /* Change hdir for hobbin */

	  if (this.dir==4 || this.dir==0)
		this.hdir=this.dir;

	  /* Hobbins digger */

	  if (!this.nob)
		dig.Drawing.eatfield(this.x,this.y,this.dir);

	  /* (Draw new tunnels) and move monster */

	  switch (this.dir) {
		case 0:
		  if (!this.nob)
			dig.Drawing.drawrightblob(this.x,this.y);
		  this.x+=4;
		  break;
		case 4:
		  if (!this.nob)
			dig.Drawing.drawleftblob(this.x,this.y);
		  this.x-=4;
		  break;
		case 2:
		  if (!this.nob)
			dig.Drawing.drawtopblob(this.x,this.y);
		  this.y-=3;
		  break;
		case 6:
		  if (!this.nob)
			dig.Drawing.drawbottomblob(this.x,this.y);
		  this.y+=3;
		  break;
	  }

	  /* Hobbins can eat emeralds */

	  if (!this.nob)
			dig.hitemerald((this.x-12)/20,(this.y-18)/18, (this.x-12)%20,(this.y-18)%18, this.dir);

	  /* If digger's gone, don't bother */

	  if (!dig.digonscr) {
		this.x=monox;
		this.y=monoy;
	  }

	  /* If monster's just started, don't move yet */

	  if (this.stime!=0) {
		this.stime--;
		this.x=monox;
		this.y=monoy;
	  }

	  /* Increase time counter for hobbin */

	  if (!this.nob && this.hnt<100)
		this.hnt++;

	  /* Draw monster */

	  push=true;
	  clbits=dig.Drawing.drawmon(mon,this.nob,this.hdir,this.x, this.y);
	  dig.Main.incpenalty();

	  /* Collision with another monster */

	  if ((clbits&0x3f00)!=0) {
		this.t++; /* Time penalty */
		checkcoincide(mon,clbits); /* Ensure both aren't moving in the same dir. */
		incpenalties(clbits);
	  }

	  /* Check for collision with bag */

	  if ((clbits&dig.Bags.bagbits())!=0) {
		this.t++; /* Time penalty */
		mongotgold=false;
		if (this.dir==4 || this.dir==0) { /* Horizontal push */
		  push=dig.Bags.pushbags(this.dir,clbits);
		  this.t++; /* Time penalty */
		}
		else
		  if (!dig.Bags.pushudbags(clbits)) /* Vertical push */
			push=false;
		if (mongotgold) /* No time penalty if monster eats gold */
		  this.t=0;
		if (!this.nob && this.hnt>1)
		  dig.Bags.removebags(clbits); /* Hobbins eat bags */
	  }

	  /* Increase hobbin cross counter */

	  if (this.nob && ((clbits&0x3f00)!=0) && dig.digonscr)
		this.hnt++;

	  /* See if bags push monster back */

	  if (!push) {
		this.x=monox;
		this.y=monoy;
		dig.Drawing.drawmon(mon,this.nob,this.hdir,this.x,this.y);
		dig.Main.incpenalty();
		if (this.nob) /* The other way to create hobbin: stuck on h-bag */
		  this.hnt++;
		if ((this.dir==2 || this.dir==6) && this.nob)
		  this.dir=dig.reversedir(this.dir); /* If vertical, give up */
	  }

	  /* Collision with digger */

	  if (((clbits&1)!=0) && dig.digonscr)
		if (dig.bonusmode) {
		  killmon(mon);
		  dig.Scores.scoreeatm();
		  dig.Sound.soundeatm(); /* Collision in bonus mode */
		}
		else
		  dig.killdigger(3,0); /* Kill digger */

	  /* Update co-ordinates */

	  this.h=(this.x-12)/20;
	  this.v=(this.y-18)/18;
	  this.xr=(this.x-12)%20;
	  this.yr=(this.y-18)%18;
	}
}