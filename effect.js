const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particleArray;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80),
}

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX + (e.x /2.5);
    mouse.y = e.offsetY + (e.y /2.5);
});

class Particle{
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    Draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0 , Math.PI * 2, false);
        ctx.fillStyle = this.color
        ctx.fill();
    }
    Update(){

        if (mouse.x == 0) mouse.x = undefined
        if (mouse.y == 0) mouse.y = undefined

        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX
        }
        if (this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY
        }

        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)

        const moveNum = 10

        if (distance < mouse.radius + this.size){
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += moveNum;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= moveNum;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += moveNum;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= moveNum;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.Draw()
    }
}

function init(){
    particleArray =[];
    let numberOfParticles = (canvas.height * canvas.width) / 9000
    for (let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * 5) + 1
        let x = (Math.random() * ((innerWidth - size * 2) + (size * 2)) + size * 2)
        let y = (Math.random() * ((innerHeight - size * 2) + (size * 2)) + size * 2)
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5; 
        let color = '#FFC300'

        particleArray.push(new Particle(x, y, directionX, directionY, size, color))
    }
}

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight)

    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].Update();
    }
    connect();
}

function connect(){
    let oppacity = 1;
    for (let a = 0; a < particleArray.length; a++){
        for (let b = a; b < particleArray.length; b++){
            let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x)) + ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y))
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                oppacity = 1 - (distance/20000)
                ctx.strokeStyle = 'rgba(45, 85, 255,' + oppacity +  ')'
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y)
                ctx.lineTo(particleArray[b].x, particleArray[b].y)
                ctx.stroke()
            }
        }
    }
}

window.addEventListener("resize", (e) =>{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    mouse.radius = (canvas.height/80) * (canvas.width/80)
    init()
})

canvas.addEventListener("mouseleave", () =>{
    mouse.x = undefined;
    mouse.y = undefined;
})

init()
animate()