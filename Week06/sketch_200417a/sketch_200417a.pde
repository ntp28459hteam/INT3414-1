import peasy.*;
import processing.sound.*;
import controlP5.*;

class ShapeObject {
    public PShape shade;
    public String detail;
    public String name;
    public String obj_file;
    public ShapeObject(String name, String detail, String obj_file) {
        this.shade = null;
        this.detail = detail;
        this.name = name;
        this.obj_file = obj_file;

    }
}

PeasyCam cam;
SoundFile file;

ControlP5 cp5;

int myColor = color(255);

int c1, c2;

float n, n1;
float angle;
float concentration;
float viewOff;

PVector half = new PVector();
PVector mouse = new PVector();

PShape box;

ShapeObject models[] = new ShapeObject[0];

int currentIndex = 0;

Textarea detailTextarea;

void setup() {
    size(1000, 700, P3D);

    //file = new SoundFile(this, "Land Me.mp3");
    //file.play();


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

    JSONArray values;

    values = loadJSONArray("models.json");

    for (int i = 0; i < values.size(); i++) {

        JSONObject object = values.getJSONObject(i);
        
        String detail = object.getString("detail");
        String name = object.getString("name");
        String obj_file = object.getString("obj_file");

        models = (ShapeObject[]) append(models, new ShapeObject(name, detail,obj_file));
        cp5.addButton(name).setPosition(10, 10 + 30 * i).setSize(160, 20).setId(i).setGroup(g1);

    }
    loadData(0);
    cp5.setAutoDraw(false);
    ambientLight(255, 255,255);
    Group g2 = cp5.addGroup("Thong tin hien vat")
        .setPosition(770, 60)
        .setBackgroundHeight(250)
        .setWidth(200)
        .setBackgroundColor(color(255, 50));
    detailTextarea = cp5.addTextarea("txt")
        .setPosition(5, 5)
        .setSize(190, 240)
        .setFont(createFont("arial", 12))
        .setLineHeight(14)
        .setColor(color(255, 255, 255))
        .setGroup(g2);
    detailTextarea.setText(models[0].detail);

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
    

    shape(models[currentIndex].shade);
    models[currentIndex].shade.rotateY(.01);
    
    translate(0, 500, 0);
    scale(15, 15, 15);
    shape(box);
    
    concentration = map(cos(frameCount * .01), -1, 1, 12, 100);
    mouse.set(mouseX - half.x, mouseY - half.y, viewOff);
    mouse.normalize();
    hint(DISABLE_DEPTH_TEST);
    cam.beginHUD();
    gui();
    cam.endHUD();
    hint(ENABLE_DEPTH_TEST);

}

void gui() {
    if (keyPressed && key == ' ') {
        detailTextarea.scroll((float) mouseX / (float) width);
    }
    if (keyPressed && key == 'l') {
        detailTextarea.setLineHeight(mouseY);
    }

    cp5.draw();

}

void controlEvent(ControlEvent theEvent) {
    currentIndex = theEvent.getController().getId();
    loadData(currentIndex);
    detailTextarea.setText(models[currentIndex].detail);

}
void loadData(int index) {
    if (models[index].shade == null) {
        PShape shape = loadShape(models[index].obj_file);
        shape.setFill(0xffffffff);
        shape.setSpecular(0xfffff7d5);
        models[index].shade = shape;
    }
}
