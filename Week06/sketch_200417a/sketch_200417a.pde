import peasy.*;
import processing.sound.*;

PeasyCam cam;
SoundFile file;

import controlP5.*;

ControlP5 cp5;

int myColor = color(255);

int c1, c2;

float n, n1;
float angle;
float concentration;
float viewOff;

PVector half = new PVector();
PVector mouse = new PVector();

PShape models[] = new PShape[0];
PShape box;
int currentIndex = 0;
String textValue = "Đức Mẹ Sầu Bi (hoặc Pietà theo tiếng Ý) là một chủ đề trong nghệ thuật Kitô giáo, miêu tả Đức Mẹ Maria ôm xác Chúa Giêsu, và thường thể hiện bằng tác phẩm điêu khắc. Đây là cảnh tượng đặc trưng nhất trong bối cảnh hạ xác Chúa Giêsu xuống khỏi cây thập giá sau khi chịu đóng đinh.";
Textarea myTextarea;

void setup() {
    size(683, 384, P3D);

    file = new SoundFile(this, "Mountain Temple.mp3");
    file.play();


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

    cp5 = new ControlP5(this);
    Group g1 = cp5.addGroup("Danh sach hien vat")
        .setPosition(20, 60)
        .setBackgroundHeight(250)
        .setWidth(180)
        .setBackgroundColor(color(255, 50));
    cp5.addButton("Pieta", 10, 10, 10, 160, 20).setId(0).setGroup(g1);
    cp5.addButton("Head Of David", 4, 10, 40, 160, 20).setId(1).setGroup(g1);
    cp5.addButton("Mose", 4, 10, 70, 160, 20).setId(2).setGroup(g1);
    cp5.setAutoDraw(false);
    ambientLight(51, 102, 126);
    Group g2 = cp5.addGroup("Thong tin hien vat")
        .setPosition(470, 60)
        .setBackgroundHeight(250)
        .setWidth(200)
        .setBackgroundColor(color(255, 50));
    myTextarea = cp5.addTextarea("txt")
        .setPosition(5, 5)
        .setSize(190, 240)
        .setFont(createFont("arial", 12))
        .setLineHeight(14)
        .setColor(color(128))

        .setGroup(g2);
    myTextarea.setText(textValue);

    PFont font = createFont("calibri", 12);
    textFont(font);
    box = loadShape("box.obj");
    box.setFill(0xffffffff);
    box.setSpecular(0xfffff7d5);
}


void draw() {
    background(0xff000000);
    lightFalloff(1, .005, 0);
    lightSpecular(96, 96, 96);
    pointLight(0, 127, 255,
        width * -.5, cos(frameCount * .05) * height, 0);
    pointLight(0, 255, 127,
        width * .5, sin(frameCount * .05) * height, 0);

    // Flash light.
    spotLight(191, 170, 133,
        0, 0, viewOff,
        mouse.x, mouse.y, -1,
        angle, concentration);

    shape(models[currentIndex]);
    models[currentIndex].rotateY(.01);

    box.rotateY(.01);
    concentration = map(cos(frameCount * .01), -1, 1, 12, 100);
    mouse.set(mouseX - half.x, mouseY - half.y, viewOff);
    mouse.normalize();
    gui();

}

void gui() {

    hint(DISABLE_DEPTH_TEST);
    cam.beginHUD();
    if (keyPressed && key == ' ') {
        myTextarea.scroll((float) mouseX / (float) width);
    }
    if (keyPressed && key == 'l') {
        myTextarea.setLineHeight(mouseY);
    }

    cp5.draw();
    cam.endHUD();
    hint(ENABLE_DEPTH_TEST);
}

void controlEvent(ControlEvent theEvent) {
    currentIndex = theEvent.getController().getId();
}
