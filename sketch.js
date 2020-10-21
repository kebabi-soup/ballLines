var b;

function setup() {     
    createCanvas(windowWidth, windowHeight);
    background(255);
    b = new BallSystem(27);
    b.add();
}

function draw() {
    //background(255);
    b.run();
}

function BallSystem(_n){
    this.balls = [];
    this.numOfBalls = _n || 10;
    
    this.add = function(){
        for(var i=0; i<this.numOfBalls; i++){
            this.balls.push(new Ball(random(1,3)));
        }
    }
    
    this.run = function(){
        for (var i=0; i<this.balls.length; i++){

            // Friction force
            var friction = this.balls[i].speed.copy();
            friction.mult(-1);
            friction.normalize();
            friction.mult(0.03);
            this.balls[i].applyForce(friction);
            
            this.balls[i].run();
            
            this.balls[i].checkCollisions();

            this.balls[i].aging();
        }
    }
}

function Ball(_m, _l) {
    this.speed = createVector(random(-1,1), random(-1,1));
    this.loc = _l || createVector(random(width), height/2);
    this.acc = createVector(0, 0);
    this.mass = _m || 3;
    this.d = this.mass * 10;
    
    this.maxMass = 6;
    this.agingRate = random(0.003, 0.015);

    this.run = function() {
        this.d = this.mass * 10;
        
        //this.draw();
        this.move();
        this.borders();
    }

    this.draw = function() {
        noStroke();
        noFill();
        ellipse(this.loc.x, this.loc.y, this.d, this.d);
    }

    this.move = function() {
        this.speed.add(this.acc);
        this.loc.add(this.speed);
        this.acc.mult(0);
    }

 this.borders = function(){
        if(this.loc.x < 0.2*width) this.acc.x += 0.5;
        if(this.loc.x > 0.8*width) this.acc.x += -0.5;
        if(this.loc.y < 0.1*height) this.acc.y += 0.5;
        if(this.loc.y > 0.9*height) this.acc.y += -0.5;
    }

    this.applyForce = function(f) {
        var adjustedForce = f.copy();
        adjustedForce.div(this.mass);
        this.acc.add(adjustedForce);
    }
    
    this.checkCollisions = function(){
        this.intersects = false;
        for(var i = 0; i<b.balls.length; i++){
            if(this != b.balls[i]){
                
                // get a vector in the opposite direction of the collision
                var direction = p5.Vector.sub(this.loc, b.balls[i].loc);
                
                // check for collision for the current cell
                if(direction.mag() < this.d/2 + b.balls[i].d/2){
                    
                    // DRAW LINES
                    for(var i = 0; i<b.balls.length; i++){
                        if(this != b.balls[i]){
                            var rMax = Math.sqrt(width*width + height*height);
                            
                            stroke(0, map(direction.copy().mag(), 0, rMax, 0, 255));
                            line(this.loc.x,this.loc.y,b.balls[i].loc.x,b.balls[i].loc.y);
                        }
                    }
                    
                    direction.setMag(0.8);
                    this.applyForce(direction);
                }
            }
        }
    }
    
    this.aging = function(){
        
        // make the balls grow with time
        this.mass += this.agingRate;
        if(this.mass > this.maxMass){
            if(random()<0.55){
                
                // make the two new balls
                b.balls.push(this.mitosis());
                b.balls.push(this.mitosis());
                
                // erase the previous dead cell
                var index = b.balls.indexOf(this);
                b.balls.splice(index,1);
            }
            else{
                // erase the dead cell
                var index = b.balls.indexOf(this);
                b.balls.splice(index,1);
            }
        }
    }
    
    this.mitosis = function(){
        
        // set the position for the new cell
        var childLoc = createVector(this.loc.x+5, this.loc.y+5)
        
        // create the new cell
        var childCell = new Ball(this.mass/3, childLoc);
        return childCell;
    }
}


//////// DESCRIPTION OF EXTENSION ////////

/* For the extension I created a function b to decrease the amount of code in draw and setup, I also made the balls change color as they age using lerpColor and lastly I made the balls fade into blue when the mouse button is held to better visualise the wind force.
*/
