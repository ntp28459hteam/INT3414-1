import peasy.*;

PeasyCam cam;

float angle;
float concentration;
float viewOff;

PVector half = new PVector();
PVector mouse = new PVector();

PShape models[] = new PShape[0];
int currentIndex = 0;

void setup() {
  size(683, 384, P3D);
  
  PShape pieta = loadShape("pieta.obj");
  pieta.setFill(0xffffffff);
  pieta.setSpecular(0xfffff7d5);
  models = (PShape[]) append(models, pieta);
  
  PShape head_of_david = loadShape("head-of-david.obj");
  head_of_david.setFill(0xffffffff);
  head_of_david.setSpecular(0xfffff7d5);
  models = (PShape[]) append(models, head_of_david);
  
  PShape moses = loadShape("moses.obj");
  moses.setFill(0xffffffff);
  moses.setSpecular(0xfffff7d5);
  models = (PShape[]) append(models, moses);
  
  angle = QUARTER_PI;
  viewOff = height * .86602;

  half.set(width * .5, height * .5);
  
  cam = new PeasyCam(this, 300);
  cam.setMinimumDistance(50);
  cam.setMaximumDistance(500);
}

//void draw() {
//  background(0xffffffff);
//  lights();
//  pieta.rotateY(.01);
//}

void draw() {
  background(0xff000000);

  lightSpecular(64, 64, 64);

  // Horizonal light.
  spotLight(0, 127, 255,
    -half.x, sin(frameCount * .02) * half.y, 0,
    1, 0, 0,
    PI, 25);

  // Vertical light.
  spotLight(0, 255, 127,
    cos(frameCount * .02) * half.x, -half.y, 0,
    0, 1, 0,
    PI, 25);

  // Flash light.
  spotLight(191, 170, 133,
    0, 0, viewOff,
    mouse.x, mouse.y, -1,
    angle, concentration);
   
    shape(models[currentIndex]);
    models[currentIndex].rotateY(.01);

  concentration = map(cos(frameCount * .01), -1, 1, 12, 100);
  mouse.set(mouseX - half.x, mouseY - half.y, viewOff);
  mouse.normalize();
}

void mouseClicked() {
  if (mouseX <= 170) currentIndex = (currentIndex + models.length - 1) % models.length;
  else if (mouseX >= 512) currentIndex = (currentIndex + 1) % models.length;
}
