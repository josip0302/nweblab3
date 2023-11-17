
// varijable koja predstavlja objekt kojim upravlja igrač
var myGamePiece;

// lista "dummy" objekata koji predstavljaju asteroide
var myGamePieceList = [];

// varijabla koja predstavlja maksimalnu brzinu dummy objekata
var speed=2;

// varijabla koja bilježi početno vrijeme igre
var timestart;

// varijabla u koju se pohranjuje vrijeme proteklo za vrijeme igre
var endTime;

// mapa koja nam bilježi koji su tipke pritisnute
let keysPressed = {37:false,
                   38:false,
                   39:false,
                   40:false};

// lista nijansi sive koje su nasumično biraju za dummy objekte
var listOfGrey=["#A8A8A8","#888888","#787878","#696969","#686868"];

//funkcija koje započinje igru inicijalizira objekt kojim upravlja igrač,kreira pet dummy objekata 
function startGame() {
     
    //inicijalizacija glavnog objekta, postavlja se na crvenu boju, pozicionira se na sredinu canvasa i daje mu se atribut main koji dummy objekti nemaju
    myGamePiece = new component(70, 70, "red",1520/2,715/2, "main");

    // funkcija stvara 5 dummy objekata
    createDummy(5);
   
    // pozivom ove fukcije započinje igra
    myGameArea.start();
   
}

//objekt koji predstavalja canvas i prostor na kojem se igra odvija
var myGameArea = {
    canvas: document.createElement("canvas"),
    

    // funkcija koja inicijalizira igru i sve varijable bitne za početak igre, u njoj se postavljaju svi potrebni atributi i iz local storagea se vadi dosadasnji rekord ako postoji a ako ne trenutno vrijeme se postavlja tamo
    // postavljaju se također dva intervala, prvi koji poziva updateGameArea svakih 20 milisekundi i drugi koji dodaje 2 dummy objekta svakih 10 sekundi
    start: function () {
        timestart=new Date();
        this.canvas.id = "myGameCanvas";
        this.canvas.width = 1520;
        this.canvas.height = 715;
        this.context = this.canvas.getContext("2d");
       
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        
        this.interval = setInterval(updateGameArea, 20);
        this.interval2 = setInterval(createDummy, 10000,2);
        var time=0;
        if(localStorage.bestTime){
            time=localStorage.bestTime;
        }else{
            localStorage.bestTime=time;
        }
        document.getElementById("najbolje").innerHTML=formatTime(time);
    },

    //funkcija koja zaustavlja igru prekida intervale i proverava je li dosadašnji rekord srušen, ako jest, novi rekord se pohranjuje u localstorage
    stop: function () {
        if( localStorage.bestTime < endTime){
            localStorage.bestTime=endTime;
        }
        clearInterval(this.interval);
        clearInterval(this.interval2);
    },

    // funkcija koje čisti cijelu igru
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },


    //funkcija koja pohranjuje vrijeme proteklo dosad u varijablu endtime i postavlja ga na html stranicu u div s id-jem trenutno
    updateTime:function(){
       
        endTime=new Date().getTime()-timestart.getTime();
       document.getElementById("trenutno").innerHTML=formatTime(endTime);
      
    }
}


// osnovni objekt u igri koje čini glavni objekt i dummy objekte, postavlja mu se širina,visina,tip,brzina i položaj
function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed_x = type === 'main' ? 0 : 1;
    this.speed_y = type === 'main' ? 0 : 1;
    this.x = x;
    this.y = y;

    // funkcija update postavlja objekt na svoje mjesto u canvas objektu
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

    // funkcija računa novu poziciju objekta s obzirom na njegov trenutno položaj, ako je van canvasa preusmjeruje se untra, a ako je unutra nastavlja u svom smjeru, tako da igra bude zanimljivija s više objekata koji ostaju u canvasu
    this.newPos = function () {
        if (type !== 'main') {
           if (this.x - this.width / 2 < 0)
                this.speed_x = this.speed_x>0?this.speed_x:this.speed_x*-1;
            else if ((this.x + this.width / 2) >= myGameArea.context.canvas.width)
                this.speed_x = this.speed_x>0?this.speed_x*-1:this.speed_x;
            if (this.y - this.height / 2 < 0)
                this.speed_y = this.speed_y>0?this.speed_y*-1:this.speed_y;
           else if ((this.y + this.height / 2) >= myGameArea.context.canvas.height)
                this.speed_y = this.speed_y>0?this.speed_y:this.speed_y*-1;
            this.x += this.speed_x;
            this.y -= this.speed_y;
        }
    }

    // funkcija kojom se postavlja brzina objekta na x osi
    this.setSpeedX=function(newSpeed){
        this.speed_x=newSpeed;
    }
     // funkcija kojom se postavlja brzina objekta na y osi
    this.setSpeedY=function(newSpeed){
        this.speed_y=newSpeed;
    }
}

//funckija kojom se računa jeli broj u rasponu između dva broja odnsono jeli x između max i min
function inRange(x, min, max) {
    return ((x >= min) && (x <= max));
}

// funkcija kojom se generira nasumičan broj između min i max
function getRandomNumber(min,max) {
    return ((Math.random() * (max - min)) + min);
}

// funkcija koja stvara broj n dummy objekata, svakom se nasumično generira visina,težina,koordinate i brzina i ako ne doduiruje nijedan drugi objekt dodaje se u listu, inače se generira ponovo
function createDummy(n){
    for (let i = 0; i < n; i++) {
        let greyIndex=Math.floor(getRandomNumber(0,4));
        let w = getRandomNumber(60,100);
        let h = getRandomNumber(60,100);
        let x = getRandomNumber(-1000,1000);
        let y = getRandomNumber(-1000,1000);
        x=(x<0?x-20:x+1550);
        y=(y<0?y-20:y+ 745);
        let sx= Math.random() * speed;
        let sy= Math.random() * speed;
        let newc=new component(w, h, listOfGrey[greyIndex], x, y);
        let a=true;
        for (let j = 0; j < myGamePieceList.length; j++) {
        if(   inside(newc,myGamePieceList[j]) || inside(myGamePieceList[j],newc) ){
            a=false;
           }
        }
        
        if(a){
        
        newc.setSpeedX(sx);
        newc.setSpeedY(sy);
        myGamePieceList.push(newc);
        }else{
            i--;
        }
    }
}


// funkcija koje nam govori dodiruju li se dva objekta c1 i c2 na osi x
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
// funkcija koje nam govori dodiruju li se dva objekta c1 i c2 na osi y
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

//funkcija koja nam govori jeli objekt c1 u objektu c2 ili obrnuto
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


// funkcija koja nam iz vremena u milisekundama formatira string u obliku min:sek.milisekunde
function formatTime(vrijeme){
    if(vrijeme==0){
        return "00:00.000";
    }
        let min =Math.floor((vrijeme/(1000*60)));
        let sek=Math.floor(((vrijeme - min*1000*60))/1000);
        let mils=Math.floor(((vrijeme - min*1000*60-sek*1000)));

        return (min<10?"0"+min.toString():min.toString()) + ":" + (sek<10?"0"+sek.toString():sek.toString())+"."+mils.toString();
}


// funkcija koja detektira jesu li se dva objekta dotakla, ako jesu izmjenjuju brzine na komoponenti u kojoj su se dotakli ili ako je jedan od njih igračev objekt, igra se zaustavlja pozivom funkcije stop
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


//funkcija koja prati koja tipka pritisnuta i bilježi to u mapi keyspressed
document.addEventListener('keydown', (event) => {
    keysPressed[event.keyCode] = true;
 });

 //funkcija koja prati koja tipka puštena i bilježi to u mapi keyspressed
 document.addEventListener('keyup', (event) => {
    keysPressed[event.keyCode]=false;
 });



// funkcija koja svakih 20 milisekundi update-a sve varijable na nove položaje, provjerava u kojem se smjeru kreće igračev objekt i jeli se ijedan objekt sudario s igračevim objektom ili ikojim drugim
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