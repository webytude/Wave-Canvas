// modified version of random-normal
function normalPool(o){var r=0;do{var a=Math.round(normal({mean:o.mean,dev:o.dev}));if(a<o.pool.length&&a>=0)return o.pool[a];r++}while(r<100)}function randomNormal(o){if(o=Object.assign({mean:0,dev:1,pool:[]},o),Array.isArray(o.pool)&&o.pool.length>0)return normalPool(o);var r,a,n,e,l=o.mean,t=o.dev;do{r=(a=2*Math.random()-1)*a+(n=2*Math.random()-1)*n}while(r>=1);return e=a*Math.sqrt(-2*Math.log(r)/r),t*e+l}

const NUM_PARTICLES = 1000;

const SPEED = 20000; // Milliseconds

let particles = [];

function rand(low, high) {
  return Math.random() * (low - high) + high;
}
                       
function dotAmplitude(dotTotal){
  return (dotTotal / 40)+8;
}
                       
function dotAlpha(dotTotal){
  return dotTotal / 1000;
}
                       
function dotStart(dotTotal){
  // return performance.now() - rand(0, SPEED);
  return performance.now() - dotTotal*300;
}
                       
                       
                       
                       

function createParticle(canvas, dotTotal) {
  const colour = {
    r: 50,
    g: 200,
    b: 255,
    a: dotAlpha(dotTotal)
  };
  return {
    x: -2,
    y: -2,
    diameter: 0.22,
    duration: SPEED,
    amplitude: dotAmplitude(dotTotal),
    offsetY: 0,
    arc: Math.PI * 2,
    startTime:dotStart(dotTotal),
    colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
  }
}

function moveParticle(particle, canvas, time) {
  const progress = ((time - particle.startTime) % particle.duration) / particle.duration;
  return {
    ...particle,
    x: progress,
    y: ((Math.sin(progress * particle.arc) * particle.amplitude) + particle.offsetY),
  };
}

function drawParticle(particle, canvas, ctx) {
  canvas = document.getElementById('particle-canvas');
  const vh = canvas.height / 100;

  ctx.fillStyle = particle.colour;
  ctx.beginPath();
  ctx.ellipse(
    particle.x * canvas.width,
    particle.y * vh + (canvas.height / 2),
    particle.diameter * vh,
    particle.diameter * vh,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function draw(time, canvas, ctx) {
  // Move particles
  particles.forEach((particle, index) => {
    particles[index] = moveParticle(particle, canvas, time);
  })

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the particles
  particles.forEach((particle) => {
    drawParticle(particle, canvas, ctx);
  })

  // Schedule next frame
  requestAnimationFrame((time) => draw(time, canvas, ctx));
}

function initializeCanvas() {
  let canvas = document.getElementById('particle-canvas');
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  let ctx = canvas.getContext("2d");

  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx = canvas.getContext("2d");
  })

  return [canvas, ctx];
}

function startAnimation() {
  const [canvas, ctx] = initializeCanvas();

  // Create a bunch of particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(createParticle(canvas, i));
  }
  
  requestAnimationFrame((time) => draw(time, canvas, ctx));
};

// Start animation when document is loaded
(function () {
  if (document.readystate !== 'loading') {
    startAnimation();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      startAnimation();
    })
  }
}());
