let drops = [];
let zaryabChars = ['Z', 'A', 'R', 'Y', 'A', 'B'];
let zaryabIndex = 0;
let lastSwitchTime = 0;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('matrix-canvas');
    for (let i = 0; i < width / 10; i++) {
        drops[i] = new Drop(i * 10);
    }
}

function draw() {
    background(26, 26, 26, 150); // Semi-transparent dark background
    for (let drop of drops) {
        drop.fall();
        drop.show();
    }
    if (millis() - lastSwitchTime > 5000) { // Switch every 5 seconds
        zaryabIndex = (zaryabIndex + 1) % zaryabChars.length;
        lastSwitchTime = millis();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Drop {
    constructor(x) {
        this.x = x;
        this.y = random(-500, -50);
        this.z = random(0, 20);
        this.speed = map(this.z, 0, 20, 1, 5);
        this.chars = [];
        this.length = floor(map(this.z, 0, 20, 10, 20));
        for (let i = 0; i < this.length; i++) {
            this.chars[i] = randomChar();
        }
    }

    fall() {
        this.y += this.speed;
        if (this.y > height) {
            this.y = random(-200, -100);
            this.chars = [];
            for (let i = 0; i < this.length; i++) {
                this.chars[i] = randomChar();
            }
        }
        if (random(1) < 0.01) { // Occasionally show 'Zaryab' letter
            this.chars[floor(random(this.length))] = zaryabChars[zaryabIndex];
        }
    }

    show() {
        let bright = map(this.z, 0, 20, 50, 255);
        for (let i = 0; i < this.length; i++) {
            let c = this.chars[i];
            fill(20, 255, 200); // Neon green with fade
            text(c, this.x, this.y + i * 15);
        }
        // Mouse interaction: ripple effect
        let d = dist(this.x, this.y, mouseX, mouseY);
        if (d < 50) {
            this.y += random(-10, 10);
            this.x += random(-5, 5);
        }
    }
}

function randomChar() {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    return chars.charAt(floor(random(chars.length)));
}
