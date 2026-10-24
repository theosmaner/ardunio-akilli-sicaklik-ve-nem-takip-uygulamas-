/*
 * Kodla — Modül 1: Temel Giriş ve Çıkışlar (Bölüm 1 - 10)
 *
 * Bölüm formatı (tüm modül dosyalarında aynı):
 *   n     : bölüm numarası
 *   m     : modül numarası (1-4)
 *   cat   : filtre kategorisi -> basic | sensors | motors | advanced
 *   lvl   : zorluk -> 1 Başlangıç, 2 Orta, 3 İleri
 *   icon  : bileşen ikon anahtarı (assets/js/icons.js)
 *   t, d  : [TR, EN] başlık ve açıklama
 *   tags  : arama için ek anahtar kelimeler
 *   parts : [ikon, ad (string veya [TR, EN]), adet]
 *   wire  : [kaynak, hedef, not?]  (her biri string veya [TR, EN])
 *   libs  : gerekli kütüphaneler (Kütüphane Yöneticisi adları)
 *   tip   : [TR, EN] ipucu
 *   code  : Arduino kodu. "//: Türkçe || English" yorumları seçili dile göre gösterilir.
 */
window.KODLA = window.KODLA || { chapters: [] };

KODLA.chapters.push(
  {
    n: 1, m: 1, cat: 'basic', lvl: 1, icon: 'led',
    t: ['Merhaba Dünya: Blink', 'Hello World: Blink'],
    d: [
      'Arduino\'nun üzerindeki dahili LED\'i (pin 13) bir saniye aralıklarla yakıp söndürerek ilk programını yükle. setup(), loop(), pinMode() ve digitalWrite() kavramlarını öğren.',
      'Upload your very first sketch by blinking the on-board LED (pin 13) once per second. Learn the basics of setup(), loop(), pinMode() and digitalWrite().'
    ],
    tags: 'blink led dahili builtin delay digitalWrite pinMode ilk',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['usb', ['USB Kablo', 'USB Cable'], 1]
    ],
    wire: [
      [['Arduino USB girişi', 'Arduino USB port'], ['Bilgisayar', 'Computer'], ['Ek kablo gerekmez; dahili LED pin 13\'e bağlıdır.', 'No extra wiring; the built-in LED is tied to pin 13.']]
    ],
    tip: ['Arduino IDE\'de Araçlar > Kart menüsünden doğru kartı, Araçlar > Port menüsünden doğru portu seçmeyi unutma.', 'Make sure the right board (Tools > Board) and port (Tools > Port) are selected in the Arduino IDE.'],
    code: `//: Bölüm 1 - Blink || Chapter 1 - Blink
//: Dahili LED'i 1 saniye aralıkla yakıp söndürür || Blinks the built-in LED every second

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);   //: Pin 13'ü çıkış yap || Set pin 13 as output
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);  //: LED yanar || LED on
  delay(1000);                      //: 1000 ms bekle || Wait 1000 ms
  digitalWrite(LED_BUILTIN, LOW);   //: LED söner || LED off
  delay(1000);
}`
  },
  {
    n: 2, m: 1, cat: 'basic', lvl: 1, icon: 'led',
    t: ['Harici LED ve Direnç', 'External LED and Resistor'],
    d: [
      'Breadboard üzerinde harici bir LED\'i akım sınırlayıcı direnç ile bağla. Ohm Kanunu\'nu ve LED polaritesini (anot/katot) uygulamalı olarak öğren.',
      'Wire an external LED on a breadboard with a current-limiting resistor. Learn Ohm\'s law and LED polarity (anode/cathode) hands-on.'
    ],
    tags: 'led direnc resistor breadboard ohm anot katot',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['led', ['LED (5mm, kırmızı)', 'LED (5mm, red)'], 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 2]
    ],
    wire: [
      ['Pin 8', ['220Ω direncin 1. ucu', 'Resistor (220Ω) leg 1']],
      [['220Ω direncin 2. ucu', 'Resistor (220Ω) leg 2'], ['LED Anot (+, uzun bacak)', 'LED Anode (+, long leg)']],
      [['LED Katot (−, kısa bacak)', 'LED Cathode (−, short leg)'], 'GND']
    ],
    tip: ['5V − 2V (LED) = 3V; 3V / 220Ω ≈ 14 mA. Bu, LED ve Arduino pini için güvenli bir akımdır.', '5V − 2V (LED) = 3V; 3V / 220Ω ≈ 14 mA — a safe current for both the LED and the Arduino pin.'],
    code: `//: Bölüm 2 - Harici LED || Chapter 2 - External LED
const int LED_PIN = 8;   //: LED'in bağlı olduğu pin || Pin the LED is connected to

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`
  },
  {
    n: 3, m: 1, cat: 'basic', lvl: 1, icon: 'traffic',
    t: ['Trafik Lambası Simülasyonu', 'Traffic Light Simulation'],
    d: [
      'Kırmızı, sarı ve yeşil üç LED ile gerçek bir trafik ışığı döngüsü oluştur. Birden fazla çıkışı sırayla kontrol etmeyi öğren.',
      'Build a realistic traffic light cycle with red, yellow and green LEDs. Learn to sequence multiple outputs.'
    ],
    tags: 'trafik traffic lamba led sequence kirmizi sari yesil',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['led', ['LED (kırmızı, sarı, yeşil)', 'LED (red, yellow, green)'], 3],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 3],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 5]
    ],
    wire: [
      ['Pin 12', ['220Ω → Kırmızı LED Anot', '220Ω → Red LED Anode']],
      ['Pin 11', ['220Ω → Sarı LED Anot', '220Ω → Yellow LED Anode']],
      ['Pin 10', ['220Ω → Yeşil LED Anot', '220Ω → Green LED Anode']],
      [['Tüm LED Katotları', 'All LED Cathodes'], ['GND hattı', 'GND rail']]
    ],
    tip: ['Bekleme sürelerini değiştirerek gerçek kavşak zamanlamalarını taklit edebilirsin.', 'Tweak the delays to mimic real intersection timings.'],
    code: `//: Bölüm 3 - Trafik Lambası || Chapter 3 - Traffic Light
const int RED = 12;
const int YELLOW = 11;
const int GREEN = 10;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void setLights(int r, int y, int g) {
  digitalWrite(RED, r);
  digitalWrite(YELLOW, y);
  digitalWrite(GREEN, g);
}

void loop() {
  setLights(HIGH, LOW, LOW);    //: Kırmızı: dur || Red: stop
  delay(5000);
  setLights(HIGH, HIGH, LOW);   //: Kırmızı + Sarı: hazırlan || Red + Yellow: get ready
  delay(1500);
  setLights(LOW, LOW, HIGH);    //: Yeşil: geç || Green: go
  delay(5000);
  setLights(LOW, HIGH, LOW);    //: Sarı: yavaşla || Yellow: slow down
  delay(2000);
}`
  },
  {
    n: 4, m: 1, cat: 'basic', lvl: 1, icon: 'button',
    t: ['Buton ile LED Kontrolü', 'Controlling an LED with a Button'],
    d: [
      'Bir push buton ile LED\'i yak. digitalRead() fonksiyonunu ve dahili pull-up direncini (INPUT_PULLUP) kullanmayı öğren.',
      'Light an LED with a push button. Learn digitalRead() and the internal pull-up resistor (INPUT_PULLUP).'
    ],
    tags: 'buton button push digitalRead input pullup giris',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['button', ['Push Buton', 'Push Button'], 1],
      ['led', 'LED', 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 4]
    ],
    wire: [
      [['Buton 1. bacak', 'Button leg 1'], 'Pin 2'],
      [['Buton 2. bacak (çapraz)', 'Button leg 2 (diagonal)'], 'GND'],
      ['Pin 13', ['220Ω → LED Anot', '220Ω → LED Anode']],
      [['LED Katot', 'LED Cathode'], 'GND']
    ],
    tip: ['INPUT_PULLUP ile buton basılı değilken HIGH, basılıyken LOW okunur. Harici direnç gerekmez!', 'With INPUT_PULLUP the pin reads HIGH when released and LOW when pressed — no external resistor needed!'],
    code: `//: Bölüm 4 - Buton ile LED || Chapter 4 - Button and LED
const int BUTTON_PIN = 2;
const int LED_PIN = 13;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);  //: Dahili pull-up aktif || Internal pull-up enabled
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  //: Basılıyken LOW okunur || Reads LOW while pressed
  if (digitalRead(BUTTON_PIN) == LOW) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`
  },
  {
    n: 5, m: 1, cat: 'basic', lvl: 2, icon: 'button',
    t: ['Aç/Kapa Buton ve Debounce', 'Toggle Button with Debounce'],
    d: [
      'Her basışta LED\'in durumunu değiştir. Mekanik buton sıçramasını (bounce) millis() tabanlı debounce algoritmasıyla engelle.',
      'Toggle the LED on every press. Eliminate mechanical contact bounce with a millis()-based debounce algorithm.'
    ],
    tags: 'toggle debounce millis buton button state durum',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['button', ['Push Buton', 'Push Button'], 1],
      ['led', 'LED', 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 4]
    ],
    wire: [
      [['Buton 1. bacak', 'Button leg 1'], 'Pin 2'],
      [['Buton 2. bacak', 'Button leg 2'], 'GND'],
      ['Pin 13', ['220Ω → LED Anot', '220Ω → LED Anode']],
      [['LED Katot', 'LED Cathode'], 'GND']
    ],
    tip: ['delay() yerine millis() kullanmak, programın başka işler yaparken butonu da dinleyebilmesini sağlar.', 'Using millis() instead of delay() keeps your sketch responsive while it does other work.'],
    code: `//: Bölüm 5 - Toggle + Debounce || Chapter 5 - Toggle + Debounce
const int BUTTON_PIN = 2;
const int LED_PIN = 13;
const unsigned long DEBOUNCE_MS = 50;

bool ledState = false;
int lastReading = HIGH;
int stableState = HIGH;
unsigned long lastChange = 0;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int reading = digitalRead(BUTTON_PIN);

  //: Okuma değiştiyse zamanlayıcıyı sıfırla || Reset timer when the reading changes
  if (reading != lastReading) {
    lastChange = millis();
  }

  //: Değer 50 ms boyunca sabit kaldıysa geçerli say || Accept the value once stable for 50 ms
  if (millis() - lastChange > DEBOUNCE_MS && reading != stableState) {
    stableState = reading;
    if (stableState == LOW) {          //: Yeni basış || New press
      ledState = !ledState;
      digitalWrite(LED_PIN, ledState);
    }
  }

  lastReading = reading;
}`
  },
  {
    n: 6, m: 1, cat: 'basic', lvl: 1, icon: 'pot',
    t: ['Potansiyometre ve Seri Monitör', 'Potentiometer and Serial Monitor'],
    d: [
      'Potansiyometreden analog değer oku (0-1023), voltaja çevir ve Seri Monitör\'e yazdır. analogRead() ve Serial haberleşmeyi keşfet.',
      'Read an analog value (0-1023) from a potentiometer, convert it to volts and print it to the Serial Monitor. Discover analogRead() and Serial.'
    ],
    tags: 'potansiyometre potentiometer analogRead serial seri monitor adc voltaj',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['pot', ['10kΩ Potansiyometre', '10kΩ Potentiometer'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 3]
    ],
    wire: [
      [['Pot sol bacak', 'Pot left leg'], '5V'],
      [['Pot orta bacak (silecek)', 'Pot middle leg (wiper)'], 'A0'],
      [['Pot sağ bacak', 'Pot right leg'], 'GND']
    ],
    tip: ['Seri Monitör\'ü Araçlar menüsünden aç ve baud hızını 9600 olarak ayarla. Seri Çizici ile grafik de görebilirsin.', 'Open the Serial Monitor from Tools and set it to 9600 baud. Try the Serial Plotter for a live graph.'],
    code: `//: Bölüm 6 - Potansiyometre || Chapter 6 - Potentiometer
const int POT_PIN = A0;

void setup() {
  Serial.begin(9600);   //: Seri haberleşmeyi başlat || Start serial communication
}

void loop() {
  int raw = analogRead(POT_PIN);           //: 0 - 1023
  float volts = raw * (5.0 / 1023.0);      //: Voltaja çevir || Convert to volts

  Serial.print("Ham: ");
  Serial.print(raw);
  Serial.print("  Voltaj: ");
  Serial.print(volts, 2);
  Serial.println(" V");

  delay(200);
}`
  },
  {
    n: 7, m: 1, cat: 'basic', lvl: 1, icon: 'led',
    t: ['PWM ile LED Parlaklığı (Fade)', 'LED Brightness with PWM (Fade)'],
    d: [
      'analogWrite() ve PWM pinleri (~3, 5, 6, 9, 10, 11) ile LED\'i yavaşça aydınlatıp karart. Potansiyometre ile parlaklığı elle de kontrol et.',
      'Use analogWrite() and the PWM pins (~3, 5, 6, 9, 10, 11) to fade an LED smoothly, then control brightness manually with a potentiometer.'
    ],
    tags: 'pwm fade analogWrite parlaklik brightness map',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['led', 'LED', 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['pot', ['10kΩ Potansiyometre', '10kΩ Potentiometer'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 6]
    ],
    wire: [
      ['Pin ~9 (PWM)', ['220Ω → LED Anot', '220Ω → LED Anode']],
      [['LED Katot', 'LED Cathode'], 'GND'],
      [['Pot orta bacak', 'Pot middle leg'], 'A0'],
      [['Pot dış bacaklar', 'Pot outer legs'], '5V / GND']
    ],
    tip: ['map() fonksiyonu 0-1023 aralığını 0-255 PWM aralığına dönüştürür.', 'map() converts the 0-1023 ADC range into the 0-255 PWM range.'],
    code: `//: Bölüm 7 - PWM Parlaklık || Chapter 7 - PWM Brightness
const int LED_PIN = 9;    //: PWM destekli pin (~) || PWM-capable pin (~)
const int POT_PIN = A0;

void setup() {
  pinMode(LED_PIN, OUTPUT);

  //: Açılışta bir kez yumuşak geçiş || One smooth fade on startup
  for (int b = 0; b <= 255; b++) {
    analogWrite(LED_PIN, b);
    delay(5);
  }
  for (int b = 255; b >= 0; b--) {
    analogWrite(LED_PIN, b);
    delay(5);
  }
}

void loop() {
  int raw = analogRead(POT_PIN);
  int brightness = map(raw, 0, 1023, 0, 255);  //: Ölçekle || Scale
  analogWrite(LED_PIN, brightness);
  delay(10);
}`
  },
  {
    n: 8, m: 1, cat: 'basic', lvl: 1, icon: 'rgb',
    t: ['RGB LED ile Renk Karışımı', 'Color Mixing with an RGB LED'],
    d: [
      'Ortak katotlu bir RGB LED\'in kırmızı, yeşil ve mavi kanallarını PWM ile sürerek milyonlarca renk üret ve renk geçişleri yap.',
      'Drive the red, green and blue channels of a common-cathode RGB LED with PWM to mix colors and create smooth transitions.'
    ],
    tags: 'rgb led renk color pwm karisim ortak katot',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['rgb', ['RGB LED (ortak katot)', 'RGB LED (common cathode)'], 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 3],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 4]
    ],
    wire: [
      ['Pin ~9', ['220Ω → R (kırmızı) bacak', '220Ω → R (red) leg']],
      ['Pin ~10', ['220Ω → G (yeşil) bacak', '220Ω → G (green) leg']],
      ['Pin ~11', ['220Ω → B (mavi) bacak', '220Ω → B (blue) leg']],
      [['Ortak katot (en uzun bacak)', 'Common cathode (longest leg)'], 'GND']
    ],
    tip: ['Ortak anotlu LED kullanıyorsan uzun bacağı 5V\'a bağla ve değerleri 255 - değer olarak ters çevir.', 'For a common-anode LED, tie the long leg to 5V and invert the values (255 - value).'],
    code: `//: Bölüm 8 - RGB LED || Chapter 8 - RGB LED
const int R_PIN = 9;
const int G_PIN = 10;
const int B_PIN = 11;

void setColor(int r, int g, int b) {
  analogWrite(R_PIN, r);
  analogWrite(G_PIN, g);
  analogWrite(B_PIN, b);
}

void setup() {
  pinMode(R_PIN, OUTPUT);
  pinMode(G_PIN, OUTPUT);
  pinMode(B_PIN, OUTPUT);
}

void loop() {
  setColor(255, 0, 0);   delay(700);   //: Kırmızı || Red
  setColor(0, 255, 0);   delay(700);   //: Yeşil || Green
  setColor(0, 0, 255);   delay(700);   //: Mavi || Blue
  setColor(255, 107, 0); delay(700);   //: Turuncu || Orange

  //: Gökkuşağı geçişi || Rainbow fade
  for (int i = 0; i < 256; i++) {
    setColor(255 - i, i, 0);
    delay(4);
  }
  for (int i = 0; i < 256; i++) {
    setColor(0, 255 - i, i);
    delay(4);
  }
  for (int i = 0; i < 256; i++) {
    setColor(i, 0, 255 - i);
    delay(4);
  }
}`
  },
  {
    n: 9, m: 1, cat: 'basic', lvl: 1, icon: 'ldr',
    t: ['LDR ile Otomatik Gece Lambası', 'Automatic Night Light with an LDR'],
    d: [
      'Işığa duyarlı direnç (LDR) ve gerilim bölücü devre ile ortam ışığını ölç; hava karardığında LED otomatik olarak yansın.',
      'Measure ambient light with a photoresistor (LDR) in a voltage divider and switch an LED on automatically when it gets dark.'
    ],
    tags: 'ldr isik light photoresistor gece lambasi night gerilim bolucu',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['ldr', ['LDR (Foto Direnç)', 'LDR (Photoresistor)'], 1],
      ['resistor', ['10kΩ Direnç', '10kΩ Resistor'], 1],
      ['led', 'LED', 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 5]
    ],
    wire: [
      [['LDR 1. bacak', 'LDR leg 1'], '5V'],
      [['LDR 2. bacak', 'LDR leg 2'], ['A0 ve 10kΩ → GND', 'A0 and 10kΩ → GND'], ['Gerilim bölücü oluşturur', 'Forms a voltage divider']],
      ['Pin 13', ['220Ω → LED Anot', '220Ω → LED Anode']],
      [['LED Katot', 'LED Cathode'], 'GND']
    ],
    tip: ['Eşik değerini (THRESHOLD) kendi odanın ışık koşullarına göre Seri Monitör\'den okuyarak ayarla.', 'Calibrate THRESHOLD by reading values from the Serial Monitor in your own room lighting.'],
    code: `//: Bölüm 9 - Gece Lambası || Chapter 9 - Night Light
const int LDR_PIN = A0;
const int LED_PIN = 13;
const int THRESHOLD = 400;   //: Karanlık eşiği || Darkness threshold

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(LDR_PIN);   //: Karanlıkta değer düşer || Value drops in the dark
  Serial.println(light);

  if (light < THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);     //: Karanlık: LED yanar || Dark: LED on
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  delay(100);
}`
  },
  {
    n: 10, m: 1, cat: 'basic', lvl: 1, icon: 'buzzer',
    t: ['Buzzer ile Melodi Çalma', 'Playing Melodies with a Buzzer'],
    d: [
      'Pasif buzzer ve tone() fonksiyonu ile notaları çal. Nota frekanslarını diziler hâlinde saklayıp kısa bir melodi besteleyerek programla.',
      'Play musical notes with a passive buzzer and tone(). Store note frequencies in arrays and program a short melody.'
    ],
    tags: 'buzzer melodi melody tone nota ses sound pasif passive',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['buzzer', ['Pasif Buzzer', 'Passive Buzzer'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 2]
    ],
    wire: [
      [['Buzzer (+)', 'Buzzer (+)'], 'Pin 8'],
      [['Buzzer (−)', 'Buzzer (−)'], 'GND']
    ],
    tip: ['Aktif buzzer tek tonda öter; melodi için mutlaka pasif buzzer kullan.', 'Active buzzers only beep at one pitch — use a passive buzzer for melodies.'],
    code: `//: Bölüm 10 - Melodi || Chapter 10 - Melody
const int BUZZER_PIN = 8;

//: Nota frekansları (Hz) || Note frequencies (Hz)
#define NOTE_C4 262
#define NOTE_D4 294
#define NOTE_E4 330
#define NOTE_F4 349
#define NOTE_G4 392
#define NOTE_A4 440
#define NOTE_B4 494
#define NOTE_C5 523

int melody[]    = { NOTE_C4, NOTE_D4, NOTE_E4, NOTE_F4, NOTE_G4, NOTE_A4, NOTE_B4, NOTE_C5 };
int durations[] = { 4, 4, 4, 4, 4, 4, 4, 2 };   //: 4 = çeyrek, 2 = yarım || 4 = quarter, 2 = half

void setup() {
  int count = sizeof(melody) / sizeof(melody[0]);
  for (int i = 0; i < count; i++) {
    int noteMs = 1000 / durations[i];
    tone(BUZZER_PIN, melody[i], noteMs);
    delay(noteMs * 1.3);           //: Notalar arası boşluk || Gap between notes
  }
  noTone(BUZZER_PIN);
}

void loop() {
  //: Melodi bir kez çalınır; tekrar için RESET'e bas || Plays once; press RESET to replay
}`
  }
);
