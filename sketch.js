/*
Rachel Potter 
Final Project for Creative Programmming II 
May 17, 2021 

BlazeFace tenplate by Jeff Thompson 
Jeff on collision detection: 
https://www.jeffreythompson.org/collision-detection/point-rect.php

Info on blazeface face detection:
https://github.com/tensorflow/tfjs-models/tree/master/blazeface
https://arxiv.org/abs/1907.05047

Formulas for petal class came from: 
https://editor.p5js.org/abrock/sketches/SyyaEusom

Sakura PNG download: 
https://pngtree.com/so/cherry-blossoms

All other images belong to Castle Point Anime Convention 
*/

let video;  // webcam input
let model;  // BlazeFace machine-learning model
let face;   // detected face

// print details when a face is first found
let firstFace = true;

let petals = []; //array that holds cherry blossom petals
let angle = 0; // angle of flowers 
let hair, sakura, castle;

// For gradient function 
let Y_AXIS = 1;
let X_AXIS = 2;

// Location of the sun 
let sunY;

// Initialize so you can switch screens 
// 1 starts at opening screen, 2 starts at video 
let vidStatus = 1; 

// Turning to true allows you to bypass phase 1 by 
// Clicking the spacebar 
let editMode = false; 
// Switch to false to get error system back (may make) sketch 
// Slower though 
p5.disableFriendlyErrors = true;

let font = 'futura-pt'; 
// Font sizes for each line
let mainFontSizeLine1 = 50; 
let mainFontSizeLine2 = 50; 
let line2LocationY; 


function preload() {
  hair = loadImage('images/pinkyEdited.png');
  sakura = loadImage('images/sakura.png');
  castle = loadImage('images/castle.png');
} // preload 


function setup() {
  createCanvas(1140, 980);

  video = createCapture(VIDEO);
  video.hide();

  sakura.resize(60, 0);

  hair.resize(1200, 0); 

  // Where the sun starts 
  sunY = height + height/3;

  let line2LocationY = (height/2) + 100; 

  // load the BlazeFace model
  loadFaceModel();
} // setup 


// TensorFlow requires the loading of the model to be done in an asynchronous function
// this means it will load in the background and be available to us when it's done
async function loadFaceModel() {
  model = await blazeface.load();
} // loadFaceModel 


function draw() {
  // if the video is active and the model has been loaded, get the face from this frame
  if (video.loadedmetadata && model !== undefined) {
    getFace();
  }

  // if we have face data and sketch is in phase 2, show video and filter 
  if (face !== undefined && vidStatus % 2 == 0) {
  	imageMode(CORNER); 
    image(video, 0,0, width,height);

    // if this is the first face we've found, print the info
    if (firstFace) {
      console.log(face);
      firstFace = false;
    } // if 

    // The model returns us a variety of info (see the output in the console) but the
    // most useful will probably be landmarks, which correspond to facial features
    let rightEye = face.landmarks[0];
    let leftEye =  face.landmarks[1];
    let nose =     face.landmarks[2];
    let rightEar = face.landmarks[4];
    let leftEar =  face.landmarks[5];
    // Bounding Box points 
    let topLeft = face.topLeft; 
    let bottomRight = face.bottomRight; 

    // the points are given based on the dimensions of the video, which may be different 
    // than your canvas – we can convert them using map()!
    rightEye = scalePoint(rightEye);
    leftEye =  scalePoint(leftEye);
    nose =     scalePoint(nose);
    topLeft = scalePoint(topLeft)
    bottomRight = scalePoint(bottomRight); 
    // width of bounding box / face 
    let w = bottomRight.x - topLeft.x;
    // diameter of hair 
    let dia = w * 5;
    
    // Draw hair
    push(); 
    angleMode(DEGREES); 
    translate(nose.x, nose.y); 
    let headAngle = atan2(rightEye.y-leftEye.y , rightEye.x-leftEye.x); 
    rotate(headAngle + 180); 
    imageMode(CENTER);  
    image(hair, 0, 0-10, dia, dia); 
    pop(); 
  } 
  else {  // If you're not showing the video 
    background(199, 240, 238);

    let time = millis() / 1000; 
    let t = frameCount / 100; //updates time

    noStroke();
    // Get the sunset effect
    let endColor = color(199, 240, 238); 
    let beginColor = color(98, 168, 165); 
    let red = map(sunY, height, height / 2.5, 98, 199); 
    let green = map(sunY, height, height / 2.5, 168, 240);
    let blue =  map(sunY, height, height / 2.5, 165, 238);
    let transition = color(red, green, blue); 
    setGradient(0, 0, width, height, transition, endColor, Y_AXIS); 

    rotatingFlowers(2 * height / 5);

    noStroke(); 

    for (var i = 0; i < 10; i++) {
      petals.push(new Petal()); //append petal object
    } //random number of petals each frame

    //loop through petals
    for (let blossom of petals) {
      blossom.update(t); //update petal position
      blossom.display(); //draw petal
    } // for 

    if (time > 3.5) {
      fill(255, 212, 0);
      ellipseMode(CENTER);
      ellipse(width / 2, sunY, height/2);
      if (sunY > height / 2.5) {
        sunY -= 2;
      } // if 
    } // if 

    if (sunY <= height/2.5) { // If the sun is in it's final spot 
    	// Get upper left corner coordinated 
    	let circleTopLeftX = (width/2) - (height/4); 
    	let circleTopLeftY = (height/2.5) - (height/4); 
    	if (mouseX >= circleTopLeftX && mouseX <= circleTopLeftX + height/2 && mouseY >= circleTopLeftY && mouseY <= circleTopLeftY + height/2) {
    		// Chnage sun when hovering 
    		fill(236,70,48); 
    		circle(width/2, sunY, height/2); 
    	}
    	
    	imageMode(CENTER); 
    	image(castle, width/2, height/3, 300, 300); 
    
    	rectMode(CENTER); 
 		
 		// Button 
    	fill(241, 84, 119, 125); 
    	rect(width/2, 3 * height/4, width/3, height/9); 
    	// Text for button 
    	noStroke();
    	fill(255);
    	textAlign(CENTER);
    	textFont(font);
    	textSize(35);
    	text('Click here for filter!', width/2 , 3 * height/4 + 10); 

   		// Get top left coordinated of the button 
    	let topLeftX = (width/2) - (width/3)/2; 
    	let topLeftY = (3 * height/4) - (height/9)/2; 
    	if (mouseX >= topLeftX && mouseX <= topLeftX + (width/3) && mouseY >= topLeftY && mouseY <= topLeftY + (height/9)) {
    		// change button when hovering 
    		fill(241, 84, 119, 200); 
    		rect(width/2, 3 * height/4, width/3, height/9);

    		noStroke();
    		fill(255);
    		textAlign(CENTER);
    		textFont(font);
    		textSize(35);
    		text('Click here for filter!', width/2 , 3 * height/4 + 10); 
    		if (mouseIsPressed) {
    			// Change phase if cutton is pressed 
    			vidStatus += 1; 
    		} // if 
    	} // if 
    } // if the sun is in place 

    // Main text 
    noStroke();
    fill(0);
    textAlign(CENTER);
    textFont(font);
    textSize(mainFontSizeLine1);
    text("CASTLE POINT", width/2, (height/2) + 50);
    textSize(mainFontSizeLine2);
    text("ANIME CONVENTION", width/2, line2LocationY); 

    // Get text width 
    let line1Width = textWidth("CASTLE POINT"); 
    let line2Width = textWidth("ANIME CONVENTION"); 
    // Get Upper Left Corners 
    let text1UpperLeftX = (width/2) - (line1Width/2); 
    let text1UpperLeftY = (height/2); 
    let text2UpperLeftX = (width/2) - (line2Width/2); 
    let text2UpperLeftY = (height/2) + 50;

    // Change line 1 font size when hovering 
    // Notse that base font size of 50 pts is ~67 px 
    if (mouseX >= text1UpperLeftX && mouseX <= text1UpperLeftX + line1Width && mouseY >=text1UpperLeftY && mouseY <= text1UpperLeftY + 67) {
    	mainFontSizeLine1 = 72; 
    } else {
    	mainFontSizeLine1 = 50; 
    } // else 
    // Change line 2 font size when hovering 
    if (mouseX >= text2UpperLeftX && mouseX <= text2UpperLeftX + line2Width && mouseY >=text2UpperLeftY && mouseY <= text2UpperLeftY + 67) {
    	mainFontSizeLine2 = 72; 
    	line2LocationY = (height/2) + 110; 
    } else {
    	mainFontSizeLine2 = 50; 
    	line2LocationY = (height/2) + 100; 
    } // else 

    // See upper left corners of text 
    // circle(text1UpperLeftX, text1UpperLeftY, 10)
    // circle(text2UpperLeftX, text2UpperLeftY, 10)
    // //circle(text1UpperLeftX + line1Width)

    rotatingFlowers(2 * height / 5); 
  } // else 
} // draw


// A little utility function that converts positions 
// in the video to the canvas' dimensions
function scalePoint(pt) {
  let x = map(pt[0], 0,video.width, 0,width);
  let y = map(pt[1], 0,video.height, 0,height);
  return createVector(x, y);
} // scalePoint


// Like loading the model, TensorFlow requires
// we get the face data using an async function
async function getFace() {
  // get predictions using the video as an input source (can also be an image
  // or canvas!)
  const predictions = await model.estimateFaces(
    document.querySelector('video'),
    false
  ); // estimate faces 
  // false means we want positions rather than tensors (ie useful screen locations 
  // instead of super-mathy bits)
  // if we there were no predictions, set the face to undefined
  if (predictions.length === 0) {
    face = undefined;
  } // if 
  // otherwise, grab the first face
  else {
    face = predictions[0];
  } // else
} // getFace 


function rotatingFlowers(radiusOffset) {
  push();
  translate(width / 2, height / 2);
  // the angle of rotation - increase value and then rotate to that angle
  angle += radians(1);
  rotate(angle);
  pop();

  // Use a for-loop to create a ring of squares a degrees apart around the center
  for (let ang = 0; ang < radians(360); ang += radians(20)) {
    push();
    translate(width / 2, height / 2); // move origin to center
    rotate(ang); // rotate each by a
    translate(0, radiusOffset); // then offset vertically
    rotate(-angle); // spin around the other way
    imageMode(CENTER);
    image(sakura, 0, 0);
    pop();
  } // for
} // RotatingFlowers


// So we can get random numbers faster usinng js 
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
} // getRandomNumber


class Petal {
  // initialize coordinates
  constructor() {
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(10, 0 * PI);
    this.size = random(5, 10);
    this.radius = sqrt(random(pow(width / 1, 2)));
  }

  update(time) {
    // x position follows a circle
    let w = 0.1; // angular speed
    let a = w * time + this.initialangle;
    this.posX = width / 1 + this.radius * tan(a); //calculates tangent of the angle the petals fall
    this.posY += pow(this.size, 0.5);

    // delete petal if past end of screen
    if (this.posY > height) {
      let index = petals.indexOf(this);
      petals.splice(index, 1);
    } // if 
  } // update

  display() {
    fill(241, 84, 119, 100);
    ellipse(this.posX, this.posY, this.size, getRandomNumber(3, 10));
  } // display 
} // class petal 


function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    } // for 
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    } // for 
  } // elif 
} // setGradient


function keyPressed() {
  // console.log(key);
  // console.log(keyCode);
  // Note; space bar = keyCode 32
  if (keyCode === 32) {
  	if (editMode) {
  		vidStatus += 1; 
  	} // if 
  } // if 
} // keyPressed

