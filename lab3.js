var myGamePiece;
var myGamePieceList = [];
var speed=2;
var timestart=new Date();
var endTime="";
let keysPressed = {37:false,
                   38:false,
                   39:false,
                   40:false};
var listOfGrey=["#A8A8A8","#888888","#787878","#696969","#686868"];

function startGame() {

    myGamePiece = new component(70, 70, "red",1520/2,715/2, "main");
    createDummy(10);
   
   
    myGameArea.start();
   
}
var myGameArea = {
    canvas: document.createElement("canvas"),

    start: function () {
        this.canvas.id = "myGameCanvas";
        this.canvas.width = 1520;
        this.canvas.height = 715;
        this.context = this.canvas.getContext("2d");
       
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        
        this.interval = setInterval(updateGameArea, 20);
        this.interval2 = setInterval(createDummy, 10000,10);
        var time=0;
        if(localStorage.bestTime){
            time=localStorage.bestTime;
        }else{
            localStorage.bestTime=time;
        }
        document.getElementById("najbolje").innerHTML=formatTime(time);
    },
    stop: function () {
        if( localStorage.bestTime < endTime){
            localStorage.bestTime=endTime;
        }
        clearInterval(this.interval);
        clearInterval(this.interval2);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    updateTime:function(){
       
        endTime=new Date().getTime()-timestart.getTime();
       document.getElementById("trenutno").innerHTML=formatTime(endTime);
      
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed_x = type === 'main' ? 0 : 1;
    this.speed_y = type === 'main' ? 0 : 1;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.shadowBlur = 7;
        ctx.shadowColor = "black";
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();

    }
    this.newPos = function () {
        if (type !== 'main') {
           if (this.x - this.width / 2 < 0)
                this.speed_x = 2;
            else if ((this.x + this.width / 2) >= myGameArea.context.canvas.width)
                this.speed_x = -2;
            if (this.y - this.height / 2 < 0)
                this.speed_y = -2;
           else if ((this.y + this.height / 2) >= myGameArea.context.canvas.height)
                this.speed_y = 2;
            this.x += this.speed_x;
            this.y -= this.speed_y;
        }
    }
    this.setSpeedX=function(newSpeed){
        this.speed_x=newSpeed;
    }
    this.setSpeedY=function(newSpeed){
        this.speed_y=newSpeed;
    }
}

function inRange(x, min, max) {
    return ((x >= min) && (x <= max));
}
function getRandomNumber(min,max) {
    return ((Math.random() * (max - min)) + min);
}
function createDummy(n){
    for (let i = 0; i < n; i++) {
        let greyIndex=Math.floor(getRandomNumber(0,4));
        let w = getRandomNumber(60,100);
        let h = getRandomNumber(60,100);
        let x = getRandomNumber(-100,100);
        let y = getRandomNumber(-100,100);
        x=(x<0?x-20:x+1550);
        y=(y<0?y-20:y+ 745);
        let sx= Math.random() * speed*(x<0?1:-1);
        let sy= Math.random() * speed*(y<0?1:-1);
        let newc=new component(w, h, listOfGrey[greyIndex], x, y);
        let a=true;
        for (let j = 0; j < myGamePieceList.length; j++) {
        if(   inside(newc,myGamePieceList[j]) || inside(myGamePieceList[j],newc) ){
            a=false;
           }
        }
        if( inside(newc,myGamePiece)){
            a=false;
        }
        if(a){
        
        newc.setSpeedX(sx);
        newc.setSpeedY(sy);
        myGamePieceList.push(newc);
        }else{
            i--;
            console.log(i)
        }
    }
}

function contactx(c1, c2) {
    if ((inRange(c1.x + c1.width / 2, c2.x - 2*speed - c2.width / 2, c2.x + 2*speed - c2.width / 2) ||
            inRange(c1.x - c1.width / 2, c2.x - 2*speed + c2.width / 2, c2.x + 2*speed + c2.width / 2)) && (
            inRange(c2.y + c2.height / 2, c1.y - c1.height / 2, c1.y + c1.height / 2) ||
            inRange(c2.y - c2.height / 2, c1.y - c1.height / 2, c1.y + c1.height / 2)||
            inRange(c1.y + c1.height / 2, c2.y - c2.height / 2, c2.y + c2.height / 2) ||
            inRange(c1.y - c1.height / 2, c2.y - c2.height / 2, c2.y + c2.height / 2))){
        return true;
    }
    return false;

}

function contacty(c1, c2) {
    if ((inRange(c1.y + c1.height / 2, c2.y - 2*speed - c2.height / 2, c2.y + 2*speed- c2.height / 2) ||
            inRange(c1.y - c1.height / 2, c2.y - 2*speed + c2.height / 2, c2.y + 2*speed + c2.height / 2)) && (
            inRange(c2.x + c2.width / 2, c1.x - c1.width / 2, c1.x + c1.width/ 2) ||
            inRange(c2.x - c2.width / 2, c1.x - c1.width / 2, c1.x + c1.width / 2) ||
            inRange(c1.x + c1.width / 2, c2.x - c2.width / 2, c2.x + c2.width/ 2) ||
            inRange(c1.x - c1.width / 2, c2.x - c2.width / 2, c2.x + c2.width / 2))) {
        return true;
    }
    return false;
}
function inside(c1, c2){
 
if(((inRange(c1.y, c2.y - c2.height- c1.height , c2.y + c2.height+ c1.height ))&&(
    inRange(c1.x, c2.x - c2.width- c1.width , c2.x + c2.width+ c1.width)
   ))||
    (inRange(c2.y, c1.y - c1.height- c2.height , c1.y + c1.height+ c2.height ))&&(
        inRange(c2.x, c1.x - c1.width- c2.width , c1.x + c1.width+ c2.width))){
        return true;
    }
return false;

}
function formatTime(vrijeme){
    if(vrijeme==0){
        return "00:00.000";
    }
        let min =Math.floor((vrijeme/(1000*60)));
        let sek=Math.floor(((vrijeme - min*1000*60))/1000);
        let mils=Math.floor(((vrijeme - min*1000*60-sek*1000)));

        return (min<10?"0"+min.toString():min.toString()) + ":" + (sek<10?"0"+sek.toString():sek.toString())+"."+mils.toString();
}

function colision(c1, c2) {
    if (contactx(c1, c2) || contactx(c2, c1)) {
        if (c1.type === 'main' || c2.type === 'main') {
            myGameArea.stop();
        } else {
            console.log(1);
            var newspeed = c1.speed_x;
            c1.setSpeedX(c2.speed_x);
            c2.setSpeedX( newspeed);
        }
    }
    if (contacty(c1, c2) || contacty(c2, c1)) {
        if (c1.type === 'main' || c2.type === 'main') {
            myGameArea.stop();
        } else {
            var newspeed = c1.speed_y;
            c1.setSpeedY(c2.speed_y);
            c2.setSpeedY( newspeed);
        }
    }

}
document.addEventListener('keydown', (event) => {
    keysPressed[event.keyCode] = true;
 });

 document.addEventListener('keyup', (event) => {
    keysPressed[event.keyCode]=false;
 });




function updateGameArea() {
    myGameArea.updateTime();
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
    for (let i = 0; i < myGamePieceList.length; i++) {
        myGamePieceList[i].newPos();
        myGamePieceList[i].update();
        colision(myGamePiece, myGamePieceList[i]);
        // colisiony(myGamePiece, myGamePieceList[i]);
        for (let j = i + 1; j < myGamePieceList.length; j++) {
            colision(myGamePieceList[i], myGamePieceList[j]);
            //  colisiony(myGamePieceList[j], myGamePieceList[i]);
        }

    }
    if (keysPressed[37]) {
        if (myGamePiece.x - myGamePiece.width / 2 > 0) {
            myGamePiece.x -= 2*speed;
        }
    }
    if (keysPressed[39]) {
        if ((myGamePiece.x + myGamePiece.width / 2) < myGameArea.context.canvas.width) {
            myGamePiece.x += 2*speed;
        }
    }
    if (keysPressed[38]) {
        if (myGamePiece.y - myGamePiece.height / 2 > 0) {
            myGamePiece.y -= 2*speed;
        }
    }
    if (keysPressed[40]) {
        if ((myGamePiece.y + myGamePiece.height / 2) < myGameArea.context.canvas.height) {
            myGamePiece.y += 2*speed;
        }
    }
}