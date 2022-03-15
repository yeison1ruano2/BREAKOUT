const grid=document.querySelector('.grid');
const scoreDisplay=document.querySelector('#score');
const stateDisplay=document.querySelector('#state');
const blockWidth=100;
const blockHeight=20;
const boardWidth=560;
const boardHeight=300;
let timerId;
let score=0;
const ballDiameter=20;
let xDirection=-2;
let yDirection=2;

const userStart=[230,10];
let currentPosition=userStart;
const ballStart=[270,40];
let ballCurrentPosition=ballStart;

//crear un block
class Block{
    constructor(xAxis,yAxis){
        this.bottomLeft=[xAxis,yAxis];
        this.bottomRight=[xAxis + blockWidth,yAxis];
        this.topLeft=[xAxis,yAxis + blockHeight];
        this.topRight=[xAxis + blockWidth,yAxis + blockHeight];
    };
}

//todos los blocks
const blocks=[
    new Block(10,270),
    new Block(120,270),
    new Block(230,270),
    new Block(340,270),
    new Block(450,270),

    new Block(10,240),
    new Block(120,240),
    new Block(230,240),
    new Block(340,240),
    new Block(450,240),

    new Block(10,210),
    new Block(120,210),
    new Block(230,210),
    new Block(340,210),
    new Block(450,210),
];



//dibujar my block
function addBlocks(){
    
    for (let i=0;i<blocks.length;i++){
        const block=document.createElement('div');
        block.classList.add('block');
        block.style.left=blocks[i].bottomLeft[0] + 'px';
        block.style.bottom=blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block);
    }
}    
addBlocks();

//agregar usuario
const user=document.createElement('div');
user.classList.add('user');
draUser();
grid.appendChild(user);

// dibujar el usuario
function draUser(){
    user.style.left=currentPosition[0] + 'px';
    user.style.bottom=currentPosition[1] + 'px';
}

//dibujar la bola
function drawBall(){
    ball.style.left=ballCurrentPosition[0] + 'px';
    ball.style.bottom=ballCurrentPosition[1] + 'px';
}

//mover usuario
function moveUser(e){
    switch(e.key){
        case 'ArrowLeft':
            if(currentPosition[0]>0){
                currentPosition[0]-=10;
                draUser();
            }
            break;
        case 'ArrowRight':
            if(currentPosition[0]<boardWidth-blockWidth){
                currentPosition[0]+=10;
                draUser();
            }
            break;
    }
}

document.addEventListener('keydown',moveUser);

//agregar bola
const ball=document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

//mover bola
function moveBall(){
    ballCurrentPosition[0] +=xDirection;
    ballCurrentPosition[1] +=yDirection;
    drawBall();
    checkForCollisions();
}

timerId=setInterval(moveBall,15);

//verificar para colision
function checkForCollisions(){
    //verificar el cuadro de colision
    for(let i=0;i<blocks.length;i++){
        if(
            (ballCurrentPosition[0]>blocks[i].bottomLeft[0] && ballCurrentPosition[0]<blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter)> blocks[i].bottomLeft[1] && ballCurrentPosition[1]<blocks[i].topLeft[1])
        ){
            const allBlocks=Array.from(document.querySelectorAll('.block'));
            allBlocks[i].classList.remove('block');
            blocks.splice(i,1);
            changeDirection();
            score ++;
            scoreDisplay.innerHTML=score;

            //verificar si gano
            if(blocks.length===0){
                stateDisplay.innerHTML='Ganaste';
                clearInterval(timerId);
                document.removeEventListener('keydown',moveUser);
            }
        }
    }

    //verificar para muro de colision
    if(ballCurrentPosition[0]>=(boardWidth-ballDiameter) || 
       ballCurrentPosition[1]>=(boardHeight-ballDiameter) ||
       ballCurrentPosition[0]<=0){
        changeDirection()
    }

    //verificar colicion de usuario
    if(
        (ballCurrentPosition[0]>currentPosition[0] && ballCurrentPosition[0]<currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1]>currentPosition[1] && ballCurrentPosition[1]<currentPosition[1] + blockHeight)
    ){
        changeDirection();
    }

    // verificar el game over
    if(ballCurrentPosition[1]<=0){
        clearInterval(timerId);
        stateDisplay.innerHTML='Perdiste';
        document.removeEventListener('keydown',moveUser);
    }
}

function changeDirection(){
    if(xDirection===2 && yDirection===2){
        yDirection=-2;
        return;
    }
    if(xDirection===2 && yDirection===-2){
        xDirection=-2;
        return;
    }
    if(xDirection===-2 && yDirection===-2){
        yDirection=2;
        return;
    }
    if(xDirection===-2 && yDirection===2){
        xDirection=2;
        return
    }
}