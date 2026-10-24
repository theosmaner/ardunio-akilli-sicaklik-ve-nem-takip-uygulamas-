/*
 * Kodla — Modül 3: Ekranlar ve Sürücüler (Bölüm 23 - 30)
 * Format açıklaması için bkz. m1.js
 */
window.KODLA = window.KODLA || { chapters: [] };

KODLA.chapters.push(
  {
    n: 23, m: 3, cat: 'sensors', lvl: 1, icon: 'lcd',
    t: ['16x2 LCD Ekran (I2C)', '16x2 LCD Display (I2C)'],
    d: [
      'I2C modüllü 16x2 karakter LCD\'ye sadece 4 kabloyla metin yazdır, imleci konumlandır ve özel karakter (derece simgesi) oluştur.',
      'Print text to a 16x2 character LCD with an I2C backpack using only 4 wires, position the cursor and create a custom character (degree symbol).'
    ],
    tags: 'lcd 16x2 i2c ekran display karakter liquidcrystal',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['lcd', ['16x2 LCD + I2C Modülü (PCF8574)', '16x2 LCD + I2C Backpack (PCF8574)'], 1],
      ['wire', ['Dişi-Erkek Jumper Kablo', 'Female-Male Jumper Wires'], 4]
    ],
    wire: [
      ['I2C GND', 'GND'],
      ['I2C VCC', '5V'],
      ['I2C SDA', ['A4 (Uno/Nano SDA)', 'A4 (Uno/Nano SDA)']],
      ['I2C SCL', ['A5 (Uno/Nano SCL)', 'A5 (Uno/Nano SCL)']]
    ],
    libs: ['LiquidCrystal I2C (Frank de Brabander)'],
    tip: ['Ekranda bir şey görünmüyorsa modülün arkasındaki mavi trimpotla kontrastı ayarla. Adres 0x27 değilse 0x3F dene veya I2C Scanner çalıştır.', 'Blank screen? Adjust the contrast trimpot on the back. If the address isn\'t 0x27, try 0x3F or run an I2C scanner.'],
    code: `//: Bölüm 23 - I2C LCD || Chapter 23 - I2C LCD
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);   //: Adres, sütun, satır || Address, columns, rows

//: Özel derece (°) karakteri || Custom degree (°) character
byte degree[8] = {
  0b00110,
  0b01001,
  0b01001,
  0b00110,
  0b00000,
  0b00000,
  0b00000,
  0b00000
};

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.createChar(0, degree);

  lcd.setCursor(0, 0);        //: Sütun 0, satır 0 || Column 0, row 0
  lcd.print("Merhaba Kodla!");
  lcd.setCursor(0, 1);
  lcd.print("Sicaklik: 24");
  lcd.write(byte(0));         //: Derece simgesi || Degree symbol
  lcd.print("C");
}

void loop() {
  //: Sağ alt köşede saniye sayacı || Seconds counter in the bottom-right corner
  lcd.setCursor(13, 1);
  lcd.print(millis() / 1000 % 1000);
  delay(1000);
}`
  },
  {
    n: 24, m: 3, cat: 'sensors', lvl: 2, icon: 'oled',
    t: ['0.96" OLED Ekran (SSD1306)', '0.96" OLED Display (SSD1306)'],
    d: [
      '128x64 piksel OLED ekrana metin, çizgi, daire ve dolgu grafikleri çiz. Adafruit GFX kütüphanesi ile animasyonlu bir ilerleme çubuğu oluştur.',
      'Draw text, lines, circles and filled shapes on a 128x64 OLED and build an animated progress bar with the Adafruit GFX library.'
    ],
    tags: 'oled ssd1306 128x64 i2c ekran display grafik graphics gfx',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['oled', ['0.96" OLED I2C (SSD1306)', '0.96" OLED I2C (SSD1306)'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 4]
    ],
    wire: [
      ['OLED GND', 'GND'],
      ['OLED VCC', '5V'],
      ['OLED SCL', 'A5'],
      ['OLED SDA', 'A4']
    ],
    libs: ['Adafruit SSD1306', 'Adafruit GFX Library'],
    tip: ['SSD1306 kütüphanesi ~1 KB RAM kullanır (Uno\'nun yarısı). Uzun metinleri F("...") makrosuyla flash belleğe taşı.', 'The SSD1306 buffer uses ~1 KB of RAM (half of an Uno). Move long strings to flash with the F("...") macro.'],
    code: `//: Bölüm 24 - OLED Ekran || Chapter 24 - OLED Display
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H 64

Adafruit_SSD1306 display(SCREEN_W, SCREEN_H, &Wire, -1);

void setup() {
  Serial.begin(9600);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {   //: I2C adresi 0x3C || I2C address 0x3C
    Serial.println(F("OLED bulunamadi"));
    while (true);
  }
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(2);
  display.setCursor(22, 4);
  display.println(F("KODLA"));
  display.drawCircle(110, 12, 8, SSD1306_WHITE);
  display.drawLine(0, 26, 127, 26, SSD1306_WHITE);
  display.display();
}

void loop() {
  //: Animasyonlu ilerleme çubuğu || Animated progress bar
  for (int p = 0; p <= 100; p += 2) {
    display.fillRect(0, 34, 128, 30, SSD1306_BLACK);
    display.setTextSize(1);
    display.setCursor(0, 36);
    display.print(F("Yukleniyor: %"));
    display.print(p);
    display.drawRect(0, 50, 128, 12, SSD1306_WHITE);
    display.fillRect(2, 52, map(p, 0, 100, 0, 124), 8, SSD1306_WHITE);
    display.display();
    delay(40);
  }
}`
  },
  {
    n: 25, m: 3, cat: 'sensors', lvl: 2, icon: 'segment',
    t: ['7 Segment Gösterge ile Sayaç', '7-Segment Display Counter'],
    d: [
      'Ortak katotlu 7 segment göstergede 0-9 rakamlarını göster. Rakam desenlerini bit dizisi olarak saklayıp döngüyle segmentleri sürmeyi öğren.',
      'Show digits 0-9 on a common-cathode 7-segment display. Learn to store digit patterns as bit arrays and drive segments in a loop.'
    ],
    tags: '7 segment seven display gosterge sayac counter rakam digit',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['segment', ['7 Segment Gösterge (ortak katot)', '7-Segment Display (common cathode)'], 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 7],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 9]
    ],
    wire: [
      [['Segment a', 'Segment a'], ['Pin 2 (220Ω ile)', 'Pin 2 (via 220Ω)']],
      [['Segment b', 'Segment b'], ['Pin 3 (220Ω ile)', 'Pin 3 (via 220Ω)']],
      [['Segment c', 'Segment c'], ['Pin 4 (220Ω ile)', 'Pin 4 (via 220Ω)']],
      [['Segment d', 'Segment d'], ['Pin 5 (220Ω ile)', 'Pin 5 (via 220Ω)']],
      [['Segment e', 'Segment e'], ['Pin 6 (220Ω ile)', 'Pin 6 (via 220Ω)']],
      [['Segment f', 'Segment f'], ['Pin 7 (220Ω ile)', 'Pin 7 (via 220Ω)']],
      [['Segment g', 'Segment g'], ['Pin 8 (220Ω ile)', 'Pin 8 (via 220Ω)']],
      [['Ortak katot (COM)', 'Common cathode (COM)'], 'GND']
    ],
    tip: ['Her segmente ayrı direnç koy; tek ortak direnç kullanırsan yanan segment sayısına göre parlaklık değişir.', 'Give every segment its own resistor; a single shared resistor makes brightness vary with the number of lit segments.'],
    code: `//: Bölüm 25 - 7 Segment || Chapter 25 - 7-Segment
//: Segment pinleri: a, b, c, d, e, f, g || Segment pins: a, b, c, d, e, f, g
const int SEG_PINS[7] = { 2, 3, 4, 5, 6, 7, 8 };

//: Her rakam için abcdefg deseni || abcdefg pattern for each digit
const byte DIGITS[10] = {
  0b1111110,  // 0
  0b0110000,  // 1
  0b1101101,  // 2
  0b1111001,  // 3
  0b0110011,  // 4
  0b1011011,  // 5
  0b1011111,  // 6
  0b1110000,  // 7
  0b1111111,  // 8
  0b1111011   // 9
};

void showDigit(int n) {
  for (int i = 0; i < 7; i++) {
    //: En soldaki bit 'a' segmentidir || Leftmost bit is segment 'a'
    bool on = bitRead(DIGITS[n], 6 - i);
    digitalWrite(SEG_PINS[i], on ? HIGH : LOW);
  }
}

void setup() {
  for (int i = 0; i < 7; i++) {
    pinMode(SEG_PINS[i], OUTPUT);
  }
}

void loop() {
  for (int n = 0; n <= 9; n++) {
    showDigit(n);
    delay(1000);
  }
}`
  },
  {
    n: 26, m: 3, cat: 'sensors', lvl: 2, icon: 'matrix',
    t: ['MAX7219 8x8 LED Matris', 'MAX7219 8x8 LED Matrix'],
    d: [
      'MAX7219 sürücülü 8x8 LED matris üzerinde kalp ve gülen yüz animasyonu göster. Sadece 3 pinle 64 LED\'i kontrol etmeyi öğren.',
      'Animate a heart and a smiley on an 8x8 LED matrix driven by a MAX7219 — controlling 64 LEDs with just 3 pins.'
    ],
    tags: 'max7219 matris matrix 8x8 led animasyon animation ledcontrol spi',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['matrix', ['MAX7219 8x8 LED Matris Modülü', 'MAX7219 8x8 LED Matrix Module'], 1],
      ['wire', ['Dişi-Erkek Jumper Kablo', 'Female-Male Jumper Wires'], 5]
    ],
    wire: [
      ['MAX7219 VCC', '5V'],
      ['MAX7219 GND', 'GND'],
      ['MAX7219 DIN', 'Pin 12'],
      ['MAX7219 CS', 'Pin 10'],
      ['MAX7219 CLK', 'Pin 11']
    ],
    libs: ['LedControl (Eberhard Fahle)'],
    tip: ['Birden fazla modülü zincirleyebilirsin (DOUT → sonraki DIN). LedControl\'deki son parametre modül sayısıdır.', 'Daisy-chain multiple modules (DOUT → next DIN). The last LedControl parameter is the module count.'],
    code: `//: Bölüm 26 - LED Matris || Chapter 26 - LED Matrix
#include <LedControl.h>

//: DIN, CLK, CS, modül sayısı || DIN, CLK, CS, number of modules
LedControl lc = LedControl(12, 11, 10, 1);

byte heart[8] = {
  0b00000000,
  0b01100110,
  0b11111111,
  0b11111111,
  0b11111111,
  0b01111110,
  0b00111100,
  0b00011000
};

byte smile[8] = {
  0b00111100,
  0b01000010,
  0b10100101,
  0b10000001,
  0b10100101,
  0b10011001,
  0b01000010,
  0b00111100
};

void drawFrame(byte frame[8]) {
  for (int row = 0; row < 8; row++) {
    lc.setRow(0, row, frame[row]);
  }
}

void setup() {
  lc.shutdown(0, false);     //: Uyku modundan çık || Wake up from power-saving
  lc.setIntensity(0, 6);     //: Parlaklık 0-15 || Brightness 0-15
  lc.clearDisplay(0);
}

void loop() {
  drawFrame(heart);
  delay(1000);
  drawFrame(smile);
  delay(1000);
}`
  },
  {
    n: 27, m: 3, cat: 'motors', lvl: 1, icon: 'servo',
    t: ['Servo Motor Kontrolü (SG90)', 'Servo Motor Control (SG90)'],
    d: [
      'SG90 mikro servo motoru 0-180° arasında hassas açılarla döndür. Potansiyometre ile servo açısını gerçek zamanlı kontrol et.',
      'Rotate an SG90 micro servo to precise angles between 0-180° and control its angle in real time with a potentiometer.'
    ],
    tags: 'servo sg90 motor aci angle pwm potansiyometre',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['servo', ['SG90 Mikro Servo', 'SG90 Micro Servo'], 1],
      ['pot', ['10kΩ Potansiyometre', '10kΩ Potentiometer'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 6]
    ],
    wire: [
      [['Servo Turuncu (sinyal)', 'Servo Orange (signal)'], 'Pin 9'],
      [['Servo Kırmızı (+)', 'Servo Red (+)'], '5V'],
      [['Servo Kahverengi (−)', 'Servo Brown (−)'], 'GND'],
      [['Pot orta bacak', 'Pot middle leg'], 'A0'],
      [['Pot dış bacaklar', 'Pot outer legs'], '5V / GND']
    ],
    libs: [['Servo (Arduino IDE ile gelir)', 'Servo (bundled with the IDE)']],
    tip: ['Birden fazla servo veya MG996R gibi büyük servolar için harici 5V güç kaynağı kullan ve GND\'leri birleştir.', 'For multiple servos or big ones like the MG996R, use an external 5V supply and tie the grounds together.'],
    code: `//: Bölüm 27 - Servo Motor || Chapter 27 - Servo Motor
#include <Servo.h>

Servo myServo;
const int SERVO_PIN = 9;
const int POT_PIN = A0;

void setup() {
  myServo.attach(SERVO_PIN);

  //: Açılışta tarama hareketi || Sweep on startup
  for (int a = 0; a <= 180; a += 5) {
    myServo.write(a);
    delay(20);
  }
  for (int a = 180; a >= 0; a -= 5) {
    myServo.write(a);
    delay(20);
  }
}

void loop() {
  int raw = analogRead(POT_PIN);
  int angle = map(raw, 0, 1023, 0, 180);   //: 0-180 derece || 0-180 degrees
  myServo.write(angle);
  delay(15);
}`
  },
  {
    n: 28, m: 3, cat: 'motors', lvl: 2, icon: 'stepper',
    t: ['Step Motor (28BYJ-48 + ULN2003)', 'Stepper Motor (28BYJ-48 + ULN2003)'],
    d: [
      '28BYJ-48 step motoru ULN2003 sürücü kartıyla tam tur ve hassas adımlarla döndür. Saat yönü ve tersi yönde hız kontrolü yap.',
      'Spin a 28BYJ-48 stepper through full revolutions and precise steps with a ULN2003 driver board, controlling speed in both directions.'
    ],
    tags: 'step stepper 28byj-48 uln2003 motor adim hassas',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['stepper', ['28BYJ-48 Step Motor (5V)', '28BYJ-48 Stepper Motor (5V)'], 1],
      ['driver', ['ULN2003 Sürücü Kartı', 'ULN2003 Driver Board'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 6]
    ],
    wire: [
      ['ULN2003 IN1', 'Pin 8'],
      ['ULN2003 IN2', 'Pin 9'],
      ['ULN2003 IN3', 'Pin 10'],
      ['ULN2003 IN4', 'Pin 11'],
      ['ULN2003 (+) 5-12V', ['5V (veya harici 5V)', '5V (or external 5V)']],
      ['ULN2003 (−)', 'GND'],
      [['Motor soketi', 'Motor connector'], ['ULN2003 beyaz soket', 'ULN2003 white socket']]
    ],
    libs: [['Stepper (Arduino IDE ile gelir)', 'Stepper (bundled with the IDE)']],
    tip: ['Koddaki pin sırası 8, 10, 9, 11 şeklindedir (IN1, IN3, IN2, IN4). Bu, 28BYJ-48\'in doğru dönmesi için gereklidir!', 'The pin order in code is 8, 10, 9, 11 (IN1, IN3, IN2, IN4) — required for the 28BYJ-48 to turn correctly!'],
    code: `//: Bölüm 28 - Step Motor || Chapter 28 - Stepper Motor
#include <Stepper.h>

const int STEPS_PER_REV = 2048;   //: 28BYJ-48 tam tur adım sayısı || Steps per revolution

//: Sıra önemli: IN1, IN3, IN2, IN4 || Order matters: IN1, IN3, IN2, IN4
Stepper stepper(STEPS_PER_REV, 8, 10, 9, 11);

void setup() {
  stepper.setSpeed(12);           //: RPM (en fazla ~15) || RPM (max ~15)
  Serial.begin(9600);
}

void loop() {
  Serial.println("Saat yonu: 1 tur");
  stepper.step(STEPS_PER_REV);
  delay(500);

  Serial.println("Ters yon: yarim tur");
  stepper.step(-STEPS_PER_REV / 2);
  delay(500);
}`
  },
  {
    n: 29, m: 3, cat: 'motors', lvl: 2, icon: 'motor',
    t: ['DC Motor Sürme (L298N)', 'Driving a DC Motor (L298N)'],
    d: [
      'L298N H-köprü sürücü ile bir DC motorun dönüş yönünü ve PWM ile hızını kontrol et. Motorları neden doğrudan Arduino\'ya bağlamamamız gerektiğini öğren.',
      'Control a DC motor\'s direction and PWM speed with an L298N H-bridge, and learn why motors must never be wired directly to the Arduino.'
    ],
    tags: 'dc motor l298n h-kopru h-bridge surucu driver hiz speed yon',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['driver', ['L298N Motor Sürücü', 'L298N Motor Driver'], 1],
      ['motor', ['DC Motor (6-12V)', 'DC Motor (6-12V)'], 1],
      ['battery', ['7-12V Harici Güç Kaynağı', '7-12V External Power Supply'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 7]
    ],
    wire: [
      ['L298N ENA', ['Pin ~9 (ENA jumper\'ını çıkar)', 'Pin ~9 (remove the ENA jumper)']],
      ['L298N IN1', 'Pin 8'],
      ['L298N IN2', 'Pin 7'],
      ['L298N OUT1 / OUT2', ['DC Motor uçları', 'DC Motor terminals']],
      ['L298N 12V', ['Harici güç (+)', 'External supply (+)']],
      ['L298N GND', ['Harici güç (−) VE Arduino GND', 'External supply (−) AND Arduino GND'], ['Ortak toprak şarttır!', 'A common ground is required!']]
    ],
    tip: ['Motoru asla Arduino pininden doğrudan besleme: bir pin en fazla ~40 mA verir, motorlar yüzlerce mA çeker ve geri EMF kartı bozabilir.', 'Never power a motor from an Arduino pin: a pin supplies ~40 mA max, motors draw hundreds and their back-EMF can destroy the board.'],
    code: `//: Bölüm 29 - DC Motor (L298N) || Chapter 29 - DC Motor (L298N)
const int ENA = 9;   //: PWM hız pini || PWM speed pin
const int IN1 = 8;
const int IN2 = 7;

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
}

void motor(int speed) {
  //: speed: -255 (geri) ... 0 (dur) ... 255 (ileri) || -255 (reverse) ... 0 (stop) ... 255 (forward)
  digitalWrite(IN1, speed > 0 ? HIGH : LOW);
  digitalWrite(IN2, speed < 0 ? HIGH : LOW);
  analogWrite(ENA, abs(speed));
}

void loop() {
  //: Yavaşça hızlan || Ramp up
  for (int s = 0; s <= 255; s += 5) {
    motor(s);
    delay(30);
  }
  delay(1000);
  motor(0);          //: Dur || Stop
  delay(800);
  motor(-180);       //: Geri yönde orta hız || Medium speed in reverse
  delay(2000);
  motor(0);
  delay(800);
}`
  },
  {
    n: 30, m: 3, cat: 'motors', lvl: 1, icon: 'relay',
    t: ['Röle Modülü ile Yüksek Güç Kontrolü', 'Switching High Power with a Relay'],
    d: [
      '5V röle modülü ile lamba, fan veya pompa gibi yüksek güçlü cihazları aç/kapa. NO/NC kontaklarını ve aktif-LOW tetiklemeyi anla.',
      'Switch high-power devices like lamps, fans or pumps with a 5V relay module. Understand NO/NC contacts and active-LOW triggering.'
    ],
    tags: 'role relay modul yuksek guc high power lamba fan pompa',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['relay', ['5V Tek Kanal Röle Modülü', '5V Single-Channel Relay Module'], 1],
      ['button', ['Push Buton', 'Push Button'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 5]
    ],
    wire: [
      [['Röle VCC', 'Relay VCC'], '5V'],
      [['Röle GND', 'Relay GND'], 'GND'],
      [['Röle IN', 'Relay IN'], 'Pin 7'],
      [['Buton', 'Button'], ['Pin 2 ↔ GND', 'Pin 2 ↔ GND']],
      [['Yük (lamba vb.)', 'Load (lamp etc.)'], ['Röle COM ve NO kontakları', 'Relay COM and NO contacts']]
    ],
    tip: ['⚠️ 220V şebeke gerilimi hayati tehlike taşır! Denemelerini önce 12V LED şerit veya DC fan gibi düşük gerilimli yüklerle yap.', '⚠️ Mains voltage can kill! Practice with low-voltage loads like a 12V LED strip or DC fan first.'],
    code: `//: Bölüm 30 - Röle || Chapter 30 - Relay
const int RELAY_PIN = 7;
const int BUTTON_PIN = 2;

//: Çoğu modül aktif-LOW çalışır || Most modules are active-LOW
const int RELAY_ON = LOW;
const int RELAY_OFF = HIGH;

bool relayState = false;
int lastButton = HIGH;

void setup() {
  digitalWrite(RELAY_PIN, RELAY_OFF);   //: Açılışta kapalı başla || Start switched off
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  int button = digitalRead(BUTTON_PIN);

  if (button == LOW && lastButton == HIGH) {   //: Basma anı || Press edge
    relayState = !relayState;
    digitalWrite(RELAY_PIN, relayState ? RELAY_ON : RELAY_OFF);
    delay(50);                                 //: Basit debounce || Simple debounce
  }
  lastButton = button;
}`
  }
);
