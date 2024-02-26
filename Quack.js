class Quack
{
   constructor()
   {
   this.isJumping = false;
   this.jumpForce = -0.5;
   this.gravity = 0.2;
   this.timeDilation = 0.1;

   this.radius = 25;

   this.elapsedTime = 0;
   this.y = (-windowHeight/2);
   this.x = 300;
   this.acceleration = 0.00;
   this.velocity = 0;
   this.img = loadImage("Duck.png");
   this. isDead = false;
   this.curve;

   this.angularPos = 0;
   this.angularVel = 0.1;
   this.angularAcc = 0;
   }

   borderCollision() {
      if(this.elapsedTime > 2) 
      {
         if(windowHeight/2 > (curve.botCurvePoints[60] - this.y) - this.radius) {
            console.log("out");
            //this.velocity -= 1;
            this.angularAcc += 0.5;
            this.isDead = true;
            fill(255, 0, 0);
            //location.replace('QuackenBird/game.html');
         }
         if(windowHeight/2 < (curve.topCurvePoints[60] - this.y) + this.radius) {
            console.log("Out Top");
            this.angularAcc += 0.5;
            this.isDead = true;
            // location.reaplace('game.html');
            //location.replace('QuackenBird/game.html');
            fill(0,0,255);
         }
      }
   }

   update()
   {
      this.elapsedTime += deltaTime / 1000;
      this.timeDilation += 0.000001;

      if(this.elapsedTime > 2)
      {
         document.getElementById('score').innerText = `Score: ${Math.round(this.elapsedTime)}`;

         this.acceleration += this.gravity;
         if(!this.isDead)
         {
            // Forces
            if(this.isJumping)
            {
               this.acceleration += this.jumpForce;
            }
         }

         // Physics Update
         this.velocity += this.acceleration * deltaTime * this.timeDilation;
         this.y += this.velocity * deltaTime * this.timeDilation;
         this.acceleration = 0;
         this.borderCollision();


         if(this.isJumping)
         {
            this.angularAcc += (this.angularPos + 1)*-0.01;
         }
         else
         {
            this.angularAcc += (this.angularPos - 0.8)*-0.01;
         }

         this.angularAcc += this.angularVel * -0.4;

         this.angularVel += this.angularAcc;
         this.angularPos += this.angularVel;
         this.angularAcc = 0;
      }
      



      // Draw
      stroke(200, 30, 10)
      fill(color(220, 50, 10));
      //circle(this.x, windowHeight/2, this.radius*2, this.radius*2);

      push();
      translate(this.x, windowHeight/2);
      imageMode(CENTER);
      rotate(this.angularPos);
      image(this.img, 0, 0, this.radius*3, this.radius*3);
      pop();


   }

   jump()
   {
      this.acceleration -= 3;
   }
}