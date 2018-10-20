var game;
var srcPumpArray=["./img/001.png","./img/002.png","./img/003.png","./img/004.png","./img/005.png","./img/006.png","./img/007.png","./img/008.png","./img/009.png","./img/010.png","./img/011.png","./img/012.png","./img/013.png","./img/014.png","./img/015.png","./img/016.png"];
var srcFauxArray=["./img/001-owl.png","./img/002-ghost.png","./img/003-mummy.png","./img/004-scarecrow.png","./img/005-pumpkin.png","./img/006-black-cat.png","./img/007-frankenstein.png"];

function Game() {
  this.canvas= document.getElementById("canvas");
  this.ctx= this.canvas.getContext("2d");

  //datos iniciales de puntos y vidas
  this.life=3;
  this.points=0;

  //array que almacena las calabazas elegidas random de la fuente srcPumpArray
  this.displayPumps=[];
  this.falsePumps=[];

 
}

//genera la tabla con botones para poder jugar
Game.prototype.generateDOM=function(){
  var randomArr=randomArray(srcPumpArray);
  for (i=0;i<8;i++){
    this.displayPumps[i]=randomArr[i];
  }
  crearTablaDOM(this.displayPumps);
  document.getElementById("scoreTxt").innerText=this.points;
  document.getElementById("lifeTxt").innerText=this.life;
}


//genera los objetos falsos
Game.prototype.generateFalsePump=function(){
  var randomArr=randomArray(srcFauxArray);
  
  for (i=0;i<7;i++){
    this.falsePumps[i]=randomArr[i];
  }

    //genera la src random de la falsa calabaza
    var iRam= Math.floor(Math.random()*3);
    var srcRam=this.falsePumps[iRam];

    this.flyingF=new Component(this);

    //configuracion de X relativa a la calabaza para que no salgan pegadas
    if(this.flyingP.x>350){
      this.flyingF.x=this.flyingP.x-350;
    } else {
      this.flyingF.x=this.flyingP.x+350;
    }

    this.flyingF.img.src=srcRam;
    this.flyingF.id=srcRam;

    //distancia en Y relativa
    this.flyingF.y=-10;

    if (this.points<=20){
      this.flyingF.gravity=2;
    } else {
      this.flyingF.gravity=2.5;
    }
    
}


//genera una calabaza cada vez que se le llama
Game.prototype.generatePumpkin=function(){
  
  var xRam = Math.floor(Math.random()*(800-100)+100);
  var iRam= Math.floor(Math.random()*7);
  var srcRam=this.displayPumps[iRam];
 
  this.flyingP=new Component(this);
  this.flyingP.x=xRam;
  this.flyingP.img.src=srcRam;
  this.flyingP.id=srcRam;

  
 //cambio de velocidad inicial segun niveles
  if (this.points>20){
    this.flyingP.gravity=3;
  } else if (this.points>30){
      this.flyingP.gravity=3.5;
  }

}


// dibuja sobre el canvas los objetos
Game.prototype.start=function(){
  var that=this;
      that.interval = setInterval(function(){
      
        //nivel 0 - solo salen calabazas
        if(that.points<=10){
          that.flyingP.move();
          that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
          that.flyingP.draw();
          
        } else {
        //nivel 1 y 2 - salen calabazas y objetos
          that.flyingF.move();
          that.flyingP.move();
          that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
          that.flyingP.draw();
          that.flyingF.draw();
        }
      
      //SOLUCION CUANDO LA CALABAZA PASA POR EL CANVAS SIN CLICK - RESTA VIDA
      if(that.flyingP.y>that.canvas.height){
        that.life--;
        document.getElementById("lifeTxt").innerText=that.life;
        if(that.life<=0){
          clearInterval(that.interval);
          that.gameOver();
        } else {
          
          if(that.points<=10){
            clearInterval(that.interval);
            that.generatePumpkin();
            that.start();
          } else {
            clearInterval(that.interval);
            that.generatePumpkin();
            that.generateFalsePump();
            that.start();
          }
        } 
      }
      
    },8);
}

//comprueba que la calabaza coincide y arranca juego de nuevo cuando click
Game.prototype.checkImg=function(imgDOM){
  if(imgDOM==this.flyingP.id){
    this.points++;
    document.getElementById("scoreTxt").innerText=this.points;
    
    if(this.points<=10){
      clearInterval(this.interval);
      this.generatePumpkin();
      this.start();
    } else {
      clearInterval(this.interval);
      this.generatePumpkin();
      this.generateFalsePump();
      this.start();
    }

  } else {
    this.life--;
    clearInterval(this.interval);
      if(this.life<=0){
        clearInterval(this.interval);
        document.getElementById("lifeTxt").innerText=this.life;
        this.gameOver();
        
      } else {
        document.getElementById("lifeTxt").innerText=this.life;
        if(this.points<=10){
          clearInterval(this.interval);
          this.generatePumpkin();
          this.start();
        } else {
          clearInterval(this.interval);
          this.generatePumpkin();
          this.generateFalsePump();
          this.start();
        }
    } 
  }

}

Game.prototype.gameOver = function() {
  this.ctx.font = "150px 'Creepster'";
  this.ctx.fillStyle = "white";
  this.ctx.textAlign = "center";
  this.ctx.fillText("Game Over", this.canvas.width/2, this.canvas.height/2); 
  document.getElementById("start-button").classList.add("hide");
  document.getElementById("replay-button").classList.toggle("hide");
}

Game.prototype.youWin = function() {
  this.ctx.font = "150px 'Creepster'";
  this.ctx.fillStyle = "white";
  this.ctx.textAlign = "center";
  this.ctx.fillText("You Win!!", this.canvas.width/2, this.canvas.height/2); 
}


function randomArray(arr){
  var m = arr.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

function crearTablaDOM(arr){
  for (i=0; i < arr.length; i++) {
    var img=document.getElementById("item"+i);
    img.src=arr[i];
  }
}



