class CurveModification
{
   constructor(_var, _RandDuration, _BaseDuration, _RandAmplitude,  _BaseAmplitude) {
      this.BaseDuration = _BaseDuration;
      this.RandDuration = _RandDuration;

      this.BaseAmplitude = _BaseAmplitude;
      this.RandAmplitude = _RandAmplitude;

      let rand_flip = Math.random() < 0.5 ? 1 : -1;
      this.elapsedDisabledTime = 0;
      this.elapsedTime = 0;
      this.duration = random(this.RandDuration) + this.BaseDuration;// = _duration;
      this.amplitude = (random(this.RandAmplitude) + this.BaseAmplitude) * rand_flip;// = _amplitude;
      this.defVar = _var;
      this.var = _var;
      this.isActive = true;
      this.disableDuration = 0;
      this.activate();
   }

   activate()
   {
      let rand_flip = Math.random() < 0.5 ? 1 : -1;
      this.duration = random(this.RandDuration) + this.BaseDuration;
      this.amplitude = (random(this.RandAmplitude) + this.BaseAmplitude) * rand_flip;
      // console.log("New Duration = " + this.duration);
      // console.log("New Amplitude = " + this.amplitude);
      // this.defVar = _var;
      // this.var = _var;
      this.isActive = true;
      this.elapsedTime = 0;
   }

   de_activate()
   {
      this.isActive = false;
      this.disableDuration = random(1000) + 0;
      this.elapsedDisabledTime = 0;
   }

   update()
   {
      this.elapsedTime += deltaTime;
      this.elapsedDisabledTime += deltaTime;
      if(this.elapsedTime > this.duration && this.isActive)
      {
         this.de_activate();
      }
      if(this.elapsedDisabledTime > this.disableDuration && this.isActive == false)
      {
         console.log( this.elapsedDisabledTime + " > " + this.disableDuration );
         this.activate(0,0 );
      }
   }
   output()
   {
      if(this.isActive)
      {
         let period = (2 * PI) / this.duration; 
         let output = this.amplitude * sin(this.elapsedTime * period);
         console.log("Added -> " + output);
         return output;
      }
      else
      {
         return this.defVar;
      }
   }
}



class Curve
{
   constructor(_quack)
   {
      this.elapsedTime = 0;
      this.offset = -windowWidth;
      this.vertOffset = windowHeight/2;
      this.phase_shift = 0;
      this.channel_width = 250;
      this.channel_width_change = 0;
      this.channel_width_change_duration = 0;
      this.channel_width_change_startTime = 0;
      this.vert_shift = 0;
      this.amplitude = 120;
      this.period = 0.2;
      this.nForPrint = 0;
      this.temp = 0;

      this.visualStepSize = 5;

      this.rootCurvePoints = [];
      this.topCurvePoints = [];
      this.botCurvePoints = [];
      //this.curveChangeAlgo();


      this.vert_shift_modifier = new CurveModification(this.vert_shift, 4000, 1000, 4, 2);
      this.vert_shift_modifier_large = new CurveModification(this.vert_shift, 30000, 30000,  2, 0.5);
      // this.vert_shift_modifier.activate();

      this.channel_width_modifier = new CurveModification(0, 4000, 1000, -0.01 * 40, 0.01);
      // this.channel_width_modifier.activate();

      this.changeVariable = 0;


      this.randomModificationInterval = 0;
      this.timeSinceLastModification = 0;


      this.quack = _quack;

      this.CurveImage = loadImage('GlowSphere.png');

   }

   curveOutput(x)
   {
      return this.amplitude * sin((x + this.phase_shift) * this.period) + this.vert_shift;
   }

   topChannel(x)
   {
      return this.curveOutput(x) - this.channel_width; 
   }

   botChannel(x)
   {
      return this.curveOutput(x) + this.channel_width; 
   }


   curveChangeAlgo()
   {
      // if(this.timeSinceLastModification >= this.randomModificationInterval)
      // {
      //    let rand_flip = Math.random() < 0.5 ? 1 : -1;
      //    if(!this.channel_width_modifier.isActive)
      //    {
      //       let duration_ = random(4000) + 1000;
      //       this.channel_width_modifier.activate(duration_, -0.01 * random(40));
      //       this.randomModificationInterval = duration_ + random(1000);
      //    }
      //    if(!this.vert_shift.isActive)
      //    {
      //       let duration_ = random(4000) + 1000;
      //       this.vert_shift_modifier.activate(duration_, random(4) * rand_flip + 2);
      //       this.randomModificationInterval = duration_ + random(1000);
      //    }
      //    this.period = random(10 * 0.02);

      //    this.timeSinceLastModification = 0;
      // }
   }
   // pushToPointArray()
   // {

   // }


   drawCurvePoints()
   {
      //console.log(this.rootCurvePoints.length);
      for(let j = this.rootCurvePoints.length; j >= 0; j--)
      {
         
         fill(255, 255, 255);
         strokeWeight(0);
         
         // image(this.CurveImage, (j * this.visualStepSize) - this.offset, this.topCurvePoints[j] - this.quack.y, 20, 20);
         // image(this.CurveImage, (j * this.visualStepSize) - this.offset, this.botCurvePoints[j] - this.quack.y, 20, 20);
         circle((j * this.visualStepSize) - this.offset, this.topCurvePoints[j] - this.quack.y, 10);// + this.vertOffset);
         circle((j * this.visualStepSize) - this.offset, this.botCurvePoints[j] - this.quack.y, 10);// + this.vertOffset);
      }
   }

   despawnPoints()
   {
      if(this.topCurvePoints.length > windowWidth * 0.2) {
         for(let n = 0; n < 1; n++)
         {
            this.topCurvePoints.shift();
            this.botCurvePoints.shift();
            this.rootCurvePoints.shift();
            
         }
         this.offset -= 1 * this.visualStepSize;
      }

   }

   update()
   {

      this.elapsedTime += deltaTime;
      this.timeSinceLastModification += deltaTime;

      this.channel_width += -0.05;


      this.curveChangeAlgo();
      this.vert_shift_modifier.update();
      this.channel_width_modifier.update();
      this.vert_shift_modifier_large.update();

      for(let i = 0; i < 2; i++)
      {

         this.vert_shift += this.vert_shift_modifier_large.output() + this.vert_shift_modifier.output();

         this.channel_width += this.channel_width_modifier.output();

         if(this.channel_width <= 150)
         {
            this.channel_width = 150;
         }

         //console.log(this.offset * (deltaTime/1000) * 10);


         
         this.nForPrint += 1;
         if(this.nForPrint % 1 == 0)
         {
            this.temp += 0.2;
            this.channel_width += this.changeVariable;
            this.offset += this.visualStepSize;
            // this.vert_shift += 0.1;
            let out = this.curveOutput(this.temp);
            this.rootCurvePoints.push(out);
            this.topCurvePoints.push(this.topChannel(this.temp));
            this.botCurvePoints.push(this.botChannel(this.temp));
         }

         this.despawnPoints();
   
      }

      


      //console.log(this.topCurvePoints.length);
      this.drawCurvePoints();

      if (keyIsDown(UP_ARROW))
      {
        this.changeVariable = 0.1;
      }
      else if (keyIsDown(DOWN_ARROW))
      {
        this.changeVariable = -0.1;
      }
      else
      {
         this.changeVariable = 0;
      }
   }
}
