var levelPlan = [
    "               ",
    "               ",
    "               ",     // T - tank
    "        xxx    ",     // x - wall
    "               ",     // F - finish
    "               ",
    "               ",
    "               ",
    "T    x   x    F",
    "xxxxxxxxxxxxxxx"
];


var tankPosition = {};
var wayStatus = true;
var statusShot = "none";   // "none" - не выпущена, true - выпущена летит,
                           // false - выпущена и попала в цель




                                                    // --------------  LEVEL --------------------//

function Level(plan) {
    if (document.getElementsByClassName("bigFuckingShot")[0]) {
        container.removeChild(document.getElementsByClassName("bigFuckingShot")[0]);
    }
    this.width = plan[0].length*40 + "px";
    this.height = plan.length*40 + "px";
    for (var i = 0; i < plan.length; i++) {
        for (var j = 0; j < plan[i].length; j++) {
            if (plan[i][j] === "T") {
                if (!tankPosition.posX) {
                    var posObject = new Position(j, i);
                    tankPosition.posX = posObject.planObjPosX;
                    tankPosition.posY = posObject.planObjPosY;
                }
                var tank = new Tank(tankPosition);
            }
            if (plan[i][j] === "x") {
                var posObject = new Position(j, i);
                var wall = new Wall(posObject.planObjPosX, posObject.planObjPosY);
            }
            if (plan[i][j] === "F") {
                var posObject = new Position(j, i);
                var wall = new Finish(posObject.planObjPosX, posObject.planObjPosY);
            }

        }
    }
}

function Position(planObjPosX, planObjPosY) {
    this.planObjPosX = planObjPosX*40;
    this.planObjPosY = planObjPosY*40;
}

function ReversePosition(tankPos) {
    this.planObjPosX = parseInt((tankPos.posX+50)/40);
    this.planObjPosY = parseInt((tankPos.posY+35)/40);
}

                                                    // --------------  WALL --------------------//

function Wall(wallPosX, wallPosY) {
    this.posX = wallPosX;
    this.posY = wallPosY;

    var wallContainer = document.createElement("div");
    container.appendChild(wallContainer);
    wallContainer.className = "wallContainer";
    wallContainer.style.left = this.posX + "px";
    wallContainer.style.top = this.posY + "px";
}

                                                    // --------------  FINISH --------------------//


function Finish(finishPosX, finishPosY) {
    this.posX = finishPosX;
    this.posY = finishPosY;

    var finishContainer = document.createElement("div");
    container.appendChild(finishContainer);
    finishContainer.className = "finishContainer";
    finishContainer.style.left = this.posX + "px";
    finishContainer.style.top = this.posY + "px";
}

                                                    // --------------  TANK --------------------//

function Tank(tankPos) {
    this.posX = tankPos.posX;
    this.posY = tankPos.posY;

    var tankContainer = document.createElement("div");
    container.appendChild(tankContainer);
    tankContainer.className = "tankContainer";
    tankContainer.style.left = this.posX + "px";
    tankContainer.style.top = this.posY + "px";

    for (var i = 0; i < 7; i++) {
        var brick = document.createElement("div");
        tankContainer.appendChild(brick);
        brick.className = "brick";
        switch (i) {
            case 0: brick.style.width = "10px";
                    brick.style.left = "20px";
                    break;
            case 1: brick.style.width = "30px";
                    brick.style.left = "15px";
                    break;
            case 2: brick.style.width = "20px";
                    brick.style.left = "15px";
                    break;
            case 3: brick.style.width = "40px";
                    brick.style.left = "5px";
                    break;
            case 4: brick.style.width = "50px";
                    brick.style.left = "0px";
                    break;
            case 5: brick.style.width = "50px";
                    brick.style.left = "0px";
                    break;
            case 6: brick.style.width = "40px";
                    brick.style.left = "5px";
                    break;

        }
        brick.style.top = 5*i +"px";
    }
}

Tank.prototype.runForward = function() {
    Tank.prototype.checkWay(levelPlan);
    if (tankPosition.posX < 550 && wayStatus === true) {
        tankPosition.posX = tankPosition.posX + 5;
    }
}

Tank.prototype.runBackward = function() {
    if (tankPosition.posX > 0  ) {
        tankPosition.posX = tankPosition.posX - 5;
        wayStatus = true;
    }
}

Tank.prototype.checkWay = function(plan) {
    var nextStep = new ReversePosition(tankPosition);
    if (plan[nextStep.planObjPosY][nextStep.planObjPosX] === "x") {
        wayStatus = false;
    }
    if (plan[nextStep.planObjPosY][nextStep.planObjPosX] === "F") {
        wayStatus = "finished";
        Game.prototype.finished();
    }
}


                                                    // --------------  BULLET --------------------//

function Bullet() {
    var shotPosition = {
        posX: parseInt(tankPosition.posX),
        posY: parseInt(tankPosition.posY)
    };
    statusShot = true;
    if (timeout) {clearTimeout(timeout);}
    var bigFuckingShot = document.createElement("div");
    bigFuckingShot.className = "bigFuckingShot";
    container.appendChild(bigFuckingShot);
    bigFuckingShot.style.left = shotPosition.posX + 50 + "px";
    bigFuckingShot.style.top = shotPosition.posY + 5 + "px";

    var interval1 = setInterval(function(){
        shotPosition.posX = shotPosition.posX + 5;
        bigFuckingShot.style.left = shotPosition.posX + 50 + "px";
        {
            Bullet.prototype.hitTheWall(levelPlan, shotPosition);
            if (statusShot === false) {
                clearInterval(interval1);
                statusShot = "none";
            }
        }
        //console.log(shotPosition.posX);
    }, 100);


    var timeout = setTimeout(function() {
        if (statusShot === true) {
            clearInterval(interval1);
            Bullet.prototype.autoBoom();
        }
    }, 2000);

}

Bullet.prototype.autoBoom = function() {
    var counterBoom = 2;
    if (timeout2) {clearTimeout(timeout2);}
    var bigFuckingShot = document.getElementsByClassName("bigFuckingShot")[0];
    bigFuckingShot.style.backgroundColor = "#fff";
    bigFuckingShot.style.border = "1px solid red";
    bigFuckingShot.style.borderRadius = "5px";
    var interval2 = setInterval(function(){
        bigFuckingShot.style.width = 5 + counterBoom + "px";
        bigFuckingShot.style.height = 5 + counterBoom + "px";
        bigFuckingShot.style.left = bigFuckingShot.offsetLeft - Math.floor(counterBoom/4) +"px";
        bigFuckingShot.style.top = bigFuckingShot.offsetTop - Math.floor(counterBoom/4) +"px";
        counterBoom = counterBoom + 1;
        if (counterBoom === 6) bigFuckingShot.style.backgroundColor = "red";
    },100);
    var timeout2 = setTimeout(function(){
        clearInterval(interval2);
        container.removeChild(bigFuckingShot);
    },600);
    statusShot = "none";
}

Bullet.prototype.hitTheWall = function(plan, shotPos) {

    var bigFuckingShot = document.getElementsByClassName("bigFuckingShot")[0];
    var checkBulletPos = new ReversePosition(shotPos);
        if (levelPlan[checkBulletPos.planObjPosY][checkBulletPos.planObjPosX] === "x") {
            var num = checkBulletPos.planObjPosX + 1;
            levelPlan[checkBulletPos.planObjPosY] = levelPlan[checkBulletPos.planObjPosY].slice(0,
                num-1) + " " + levelPlan[checkBulletPos.planObjPosY].slice(num);
            container.removeChild(bigFuckingShot);
            statusShot = false;

            var wallContainer = document.getElementsByClassName("wallContainer");
            for (var i = 0; i < wallContainer.length; i++) {
                container.removeChild(wallContainer[i]);
            }

            var tankContainer = document.getElementsByClassName("tankContainer")[0];
            container.removeChild(tankContainer);

            var level = new Level(levelPlan);
        }
    }


                                                    // --------------  GAME --------------------//


function Game() {

    var level = new Level(levelPlan);
    //Game.prototype.showedControlInformation();

    addEventListener("keydown", function(event) {
        if (event.keyCode === 39)
            Tank.prototype.runForward();
            var tankContainer = document.getElementsByClassName("tankContainer")[0];
            container.removeChild(tankContainer);
            var tank = new Tank(tankPosition);
    });

    addEventListener("keydown", function(event) {
        if (event.keyCode === 37)
            Tank.prototype.runBackward();
            var tankContainer = document.getElementsByClassName("tankContainer")[0];
            container.removeChild(tankContainer);
            var tank = new Tank(tankPosition);
    });

    addEventListener("keydown", function(event) {
        if (event.keyCode === 32)
            if (statusShot === "none") {
                statusShot = true;
                var bullet = new Bullet();
            }
    });

}

/*Game.prototype.showedControlInformation = function() {
    var controlMessage = document.createElement("div");
    document.body.appendChild(controlMessage);
    controlMessage.className= "controlMessage";
}*/

Game.prototype.finished = function() {
    var gameWin = document.createElement("div");
    container.appendChild(gameWin);
    gameWin.className= "gameWin";

    var gameWinMessage = document.createElement("div");
    gameWin.appendChild(gameWinMessage);
    gameWinMessage.className= "gameWinMessage";
    gameWinMessage.innerHTML = "You Win!!!";

}

var game = new Game();
