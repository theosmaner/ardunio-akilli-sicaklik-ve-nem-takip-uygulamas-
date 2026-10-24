/*
 * Kodla — Modül 2: Sensörler ve Çevresel Ölçüm (Bölüm 11 - 22)
 * Format açıklaması için bkz. m1.js
 */
window.KODLA = window.KODLA || { chapters: [] };

KODLA.chapters.push(
  {
    n: 11, m: 2, cat: 'sensors', lvl: 1, icon: 'dht',
    t: ['DHT11 Sıcaklık ve Nem Sensörü', 'DHT11 Temperature & Humidity Sensor'],
    d: [
      'DHT11 sensörü ile ortam sıcaklığını (°C) ve bağıl nemi (%) ölç, hissedilen sıcaklığı hesapla ve sonuçları Seri Monitör\'e yazdır.',
      'Measure ambient temperature (°C) and relative humidity (%) with a DHT11, compute the heat index and print the results to the Serial Monitor.'
    ],
    tags: 'dht11 dht22 sicaklik nem temperature humidity sensor iklim',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['DHT11 Modülü (3 pinli)', 'DHT11 Module (3-pin)'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 3]
    ],
    wire: [
      ['DHT11 VCC (+)', '5V'],
      ['DHT11 DATA (S)', 'Pin 2'],
      ['DHT11 GND (−)', 'GND']
    ],
    libs: ['DHT sensor library (Adafruit)', 'Adafruit Unified Sensor'],
    tip: ['DHT11 en fazla saniyede bir okuma yapabilir; daha sık okumak hatalı (NaN) değerler döndürür.', 'The DHT11 can only be read about once per second; reading faster returns NaN errors.'],
    code: `//: Bölüm 11 - DHT11 || Chapter 11 - DHT11
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11     //: DHT22 kullanıyorsan değiştir || Change if using a DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  delay(2000);   //: Ölçümler arası bekleme || Wait between readings

  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Sensor okunamadi!");
    return;
  }

  float heatIndex = dht.computeHeatIndex(t, h, false);  //: Hissedilen || Feels like

  Serial.print("Sicaklik: ");
  Serial.print(t);
  Serial.print(" C  |  Nem: %");
  Serial.print(h);
  Serial.print("  |  Hissedilen: ");
  Serial.print(heatIndex);
  Serial.println(" C");
}`
  },
  {
    n: 12, m: 2, cat: 'sensors', lvl: 1, icon: 'ultrasonic',
    t: ['HC-SR04 Ultrasonik Mesafe Ölçer', 'HC-SR04 Ultrasonic Distance Meter'],
    d: [
      'Ses dalgalarının yankı süresini ölçerek nesnelere olan mesafeyi santimetre cinsinden hesapla. pulseIn() ve ses hızı formülünü öğren.',
      'Calculate distance to objects in centimeters by timing ultrasonic echoes. Learn pulseIn() and the speed-of-sound formula.'
    ],
    tags: 'hc-sr04 ultrasonik ultrasonic mesafe distance pulseIn sonar',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['HC-SR04 Ultrasonik Sensör', 'HC-SR04 Ultrasonic Sensor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 4]
    ],
    wire: [
      ['HC-SR04 VCC', '5V'],
      ['HC-SR04 Trig', 'Pin 9'],
      ['HC-SR04 Echo', 'Pin 10'],
      ['HC-SR04 GND', 'GND']
    ],
    tip: ['Ses havada ~343 m/s (0.0343 cm/µs) hızla ilerler. Süre gidiş-dönüş olduğu için 2\'ye bölünür.', 'Sound travels ~343 m/s (0.0343 cm/µs). The echo time is a round trip, so divide by 2.'],
    code: `//: Bölüm 12 - Ultrasonik Mesafe || Chapter 12 - Ultrasonic Distance
const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
}

float readDistanceCm() {
  //: 10 µs tetik darbesi gönder || Send a 10 µs trigger pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  //: Yankı süresini ölç (zaman aşımı 30 ms) || Measure echo time (30 ms timeout)
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return -1;      //: Menzil dışı || Out of range
  return duration * 0.0343 / 2.0;
}

void loop() {
  float cm = readDistanceCm();
  if (cm < 0) {
    Serial.println("Menzil disi");
  } else {
    Serial.print("Mesafe: ");
    Serial.print(cm, 1);
    Serial.println(" cm");
  }
  delay(200);
}`
  },
  {
    n: 13, m: 2, cat: 'sensors', lvl: 1, icon: 'pir',
    t: ['PIR Hareket Sensörü (HC-SR501)', 'PIR Motion Sensor (HC-SR501)'],
    d: [
      'Pasif kızılötesi (PIR) sensör ile ortamdaki insan hareketini algıla ve hareket olduğunda LED yakıp Seri Monitör\'e bildir.',
      'Detect human movement with a passive infrared (PIR) sensor, light an LED and log events to the Serial Monitor.'
    ],
    tags: 'pir hareket motion hc-sr501 kizilotesi infrared guvenlik',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['HC-SR501 PIR Sensör', 'HC-SR501 PIR Sensor'], 1],
      ['led', 'LED', 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 5]
    ],
    wire: [
      ['PIR VCC', '5V'],
      ['PIR OUT', 'Pin 2'],
      ['PIR GND', 'GND'],
      ['Pin 13', ['220Ω → LED Anot', '220Ω → LED Anode']],
      [['LED Katot', 'LED Cathode'], 'GND']
    ],
    tip: ['PIR sensör açıldıktan sonra ~30-60 saniye kalibrasyon süresine ihtiyaç duyar. Üzerindeki trimpotlarla hassasiyet ve süreyi ayarlayabilirsin.', 'The PIR needs ~30-60 seconds to calibrate after power-up. Use its trimpots to adjust sensitivity and hold time.'],
    code: `//: Bölüm 13 - PIR Hareket || Chapter 13 - PIR Motion
const int PIR_PIN = 2;
const int LED_PIN = 13;
int lastState = LOW;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Sensor isiniyor (30 sn)...");
  delay(30000);                    //: Kalibrasyon süresi || Calibration time
  Serial.println("Hazir!");
}

void loop() {
  int motion = digitalRead(PIR_PIN);
  digitalWrite(LED_PIN, motion);

  //: Sadece durum değiştiğinde yaz || Print only on state change
  if (motion != lastState) {
    Serial.println(motion == HIGH ? "Hareket algilandi!" : "Hareket bitti.");
    lastState = motion;
  }
}`
  },
  {
    n: 14, m: 2, cat: 'sensors', lvl: 2, icon: 'gas',
    t: ['MQ-2 Gaz ve Duman Dedektörü', 'MQ-2 Gas & Smoke Detector'],
    d: [
      'MQ-2 sensörü ile LPG, metan ve duman yoğunluğunu ölç. Belirlenen eşik aşıldığında buzzer ile sesli alarm ve kırmızı LED ile görsel uyarı ver.',
      'Measure LPG, methane and smoke concentration with an MQ-2. Trigger an audible buzzer alarm and red LED when a threshold is exceeded.'
    ],
    tags: 'mq2 mq-2 gaz gas duman smoke alarm lpg metan dedektor',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['MQ-2 Gaz Sensörü Modülü', 'MQ-2 Gas Sensor Module'], 1],
      ['buzzer', ['Aktif Buzzer', 'Active Buzzer'], 1],
      ['led', ['LED (kırmızı)', 'LED (red)'], 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 7]
    ],
    wire: [
      ['MQ-2 VCC', '5V'],
      ['MQ-2 GND', 'GND'],
      ['MQ-2 A0', 'A0'],
      [['Buzzer (+)', 'Buzzer (+)'], 'Pin 8'],
      ['Pin 13', ['220Ω → Kırmızı LED Anot', '220Ω → Red LED Anode']],
      [['Buzzer (−) ve LED Katot', 'Buzzer (−) and LED Cathode'], 'GND']
    ],
    tip: ['MQ serisi sensörlerin ısıtıcısı vardır; doğru ölçüm için ilk kullanımda 24 saat, her açılışta ise en az 1-2 dakika ısınmalıdır.', 'MQ sensors contain a heater: burn in for 24 h before first use and allow 1-2 minutes of warm-up at each power-on.'],
    code: `//: Bölüm 14 - MQ-2 Gaz Alarmı || Chapter 14 - MQ-2 Gas Alarm
const int GAS_PIN = A0;
const int BUZZER_PIN = 8;
const int LED_PIN = 13;
const int GAS_THRESHOLD = 350;   //: Ortamına göre kalibre et || Calibrate for your room

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Sensor isiniyor...");
  delay(20000);                  //: Isınma süresi || Warm-up time
}

void loop() {
  int gasLevel = analogRead(GAS_PIN);
  Serial.print("Gaz seviyesi: ");
  Serial.println(gasLevel);

  if (gasLevel > GAS_THRESHOLD) {
    //: Alarm: yanıp sönen LED ve kesikli bip || Alarm: blinking LED and pulsed beep
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(BUZZER_PIN, HIGH);
    delay(150);
    digitalWrite(LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    delay(150);
  } else {
    digitalWrite(LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    delay(500);
  }
}`
  },
  {
    n: 15, m: 2, cat: 'sensors', lvl: 1, icon: 'soil',
    t: ['Toprak Nem Sensörü', 'Soil Moisture Sensor'],
    d: [
      'Saksı toprağının nem oranını ölç, yüzdeye çevir ve toprak kuruduğunda uyarı LED\'i yak. Bitkilerin ne zaman sulanması gerektiğini öğren.',
      'Measure soil moisture in a plant pot, convert it to a percentage and light a warning LED when the soil is dry.'
    ],
    tags: 'toprak soil nem moisture bitki plant sulama kapasitif',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['Toprak Nem Sensörü (kapasitif önerilir)', 'Soil Moisture Sensor (capacitive recommended)'], 1],
      ['led', 'LED', 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 5]
    ],
    wire: [
      [['Sensör VCC', 'Sensor VCC'], '5V'],
      [['Sensör GND', 'Sensor GND'], 'GND'],
      [['Sensör AOUT', 'Sensor AOUT'], 'A0'],
      ['Pin 13', ['220Ω → LED Anot', '220Ω → LED Anode']],
      [['LED Katot', 'LED Cathode'], 'GND']
    ],
    tip: ['DRY_VALUE ve WET_VALUE değerlerini sensörü havada ve bir bardak suda tutarak kendin ölç.', 'Measure DRY_VALUE and WET_VALUE yourself by holding the sensor in air and in a glass of water.'],
    code: `//: Bölüm 15 - Toprak Nem || Chapter 15 - Soil Moisture
const int SOIL_PIN = A0;
const int LED_PIN = 13;

const int DRY_VALUE = 620;   //: Havadaki değer || Reading in air
const int WET_VALUE = 280;   //: Sudaki değer || Reading in water

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(SOIL_PIN);
  int percent = map(raw, DRY_VALUE, WET_VALUE, 0, 100);
  percent = constrain(percent, 0, 100);

  Serial.print("Toprak nemi: %");
  Serial.println(percent);

  //: %30'un altı kuru kabul edilir || Below 30% is considered dry
  digitalWrite(LED_PIN, percent < 30 ? HIGH : LOW);
  delay(1000);
}`
  },
  {
    n: 16, m: 2, cat: 'sensors', lvl: 1, icon: 'thermo',
    t: ['LM35 Analog Sıcaklık Sensörü', 'LM35 Analog Temperature Sensor'],
    d: [
      'Her 1°C için 10 mV çıkış veren LM35 sensörü ile hassas sıcaklık ölç. Analog voltajı dereceye çevirmeyi ve ortalama ile gürültü azaltmayı öğren.',
      'Measure temperature precisely with the LM35 (10 mV per °C). Learn to convert analog voltage to degrees and reduce noise by averaging.'
    ],
    tags: 'lm35 sicaklik temperature analog termometre thermometer',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['thermo', ['LM35 Sıcaklık Sensörü', 'LM35 Temperature Sensor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 3]
    ],
    wire: [
      [['LM35 sol pin (+Vs, düz yüz sana bakarken)', 'LM35 left pin (+Vs, flat side facing you)'], '5V'],
      [['LM35 orta pin (Vout)', 'LM35 middle pin (Vout)'], 'A0'],
      [['LM35 sağ pin (GND)', 'LM35 right pin (GND)'], 'GND']
    ],
    tip: ['Pinleri ters bağlarsan LM35 çok hızlı ısınır! Hemen gücü kes ve bağlantıyı kontrol et.', 'If wired backwards the LM35 gets hot fast! Cut power immediately and check the pinout.'],
    code: `//: Bölüm 16 - LM35 || Chapter 16 - LM35
const int LM35_PIN = A0;
const int SAMPLES = 10;

void setup() {
  Serial.begin(9600);
}

void loop() {
  //: 10 ölçümün ortalamasını al || Average 10 samples
  long sum = 0;
  for (int i = 0; i < SAMPLES; i++) {
    sum += analogRead(LM35_PIN);
    delay(10);
  }
  float raw = sum / (float)SAMPLES;

  float millivolts = raw * (5000.0 / 1023.0);
  float celsius = millivolts / 10.0;      //: 10 mV = 1 °C

  Serial.print("Sicaklik: ");
  Serial.print(celsius, 1);
  Serial.println(" C");
  delay(1000);
}`
  },
  {
    n: 17, m: 2, cat: 'sensors', lvl: 1, icon: 'rain',
    t: ['Yağmur Sensörü', 'Rain Sensor'],
    d: [
      'Yağmur damlası algılayıcı plaka ile yağışın başlangıcını ve şiddetini tespit et. Hem dijital (DO) hem analog (AO) çıkışları kullan.',
      'Detect the onset and intensity of rain with a raindrop sensing plate, using both the digital (DO) and analog (AO) outputs.'
    ],
    tags: 'yagmur rain damla water su hava weather',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['Yağmur Sensörü (plaka + LM393 modül)', 'Rain Sensor (plate + LM393 module)'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 4]
    ],
    wire: [
      [['Modül VCC', 'Module VCC'], '5V'],
      [['Modül GND', 'Module GND'], 'GND'],
      [['Modül AO', 'Module AO'], 'A0'],
      [['Modül DO', 'Module DO'], 'Pin 2']
    ],
    tip: ['Plakayı sürekli beslemek korozyonu hızlandırır. Uzun süreli projelerde VCC\'yi bir dijital pinden verip sadece ölçüm anında aç.', 'Constant power corrodes the plate. For long-term builds, power VCC from a digital pin and switch it on only while measuring.'],
    code: `//: Bölüm 17 - Yağmur Sensörü || Chapter 17 - Rain Sensor
const int RAIN_ANALOG = A0;
const int RAIN_DIGITAL = 2;

void setup() {
  pinMode(RAIN_DIGITAL, INPUT);
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(RAIN_ANALOG);   //: Islandıkça değer düşer || Value drops when wet
  bool raining = digitalRead(RAIN_DIGITAL) == LOW;

  Serial.print("Analog: ");
  Serial.print(value);
  Serial.print("  Durum: ");

  if (!raining)          Serial.println("Kuru");
  else if (value > 600)  Serial.println("Hafif yagmur");
  else if (value > 300)  Serial.println("Yagmur");
  else                   Serial.println("Saganak!");

  delay(1000);
}`
  },
  {
    n: 18, m: 2, cat: 'sensors', lvl: 2, icon: 'mic',
    t: ['Ses Sensörü ile Alkışla Yanan Lamba', 'Clap-Activated Lamp with a Sound Sensor'],
    d: [
      'KY-038 ses sensörü ile alkış sesini algıla; her alkışta LED\'in durumunu değiştir. Yazılımsal kilitleme süresiyle yanlış tetiklemeleri önle.',
      'Detect claps with a KY-038 sound sensor and toggle an LED on each clap. Prevent false triggers with a software lockout period.'
    ],
    tags: 'ses sound mikrofon microphone ky-038 alkis clap lamba',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['KY-038 Ses Sensörü', 'KY-038 Sound Sensor'], 1],
      ['led', 'LED', 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 5]
    ],
    wire: [
      ['KY-038 +', '5V'],
      ['KY-038 G', 'GND'],
      ['KY-038 D0', 'Pin 2'],
      ['Pin 13', ['220Ω → LED Anot', '220Ω → LED Anode']],
      [['LED Katot', 'LED Cathode'], 'GND']
    ],
    tip: ['Modül üzerindeki mavi trimpotu, sessiz ortamda D0 LED\'i tam sönecek şekilde ayarla.', 'Turn the blue trimpot until the D0 LED just turns off in a quiet room.'],
    code: `//: Bölüm 18 - Alkış Lambası || Chapter 18 - Clap Lamp
const int SOUND_PIN = 2;
const int LED_PIN = 13;
const unsigned long LOCKOUT_MS = 400;   //: Tekrar tetiklemeyi engelle || Ignore re-triggers

bool lampOn = false;
unsigned long lastClap = 0;

void setup() {
  pinMode(SOUND_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  if (digitalRead(SOUND_PIN) == HIGH && millis() - lastClap > LOCKOUT_MS) {
    lampOn = !lampOn;                   //: Durumu değiştir || Toggle state
    digitalWrite(LED_PIN, lampOn);
    lastClap = millis();
  }
}`
  },
  {
    n: 19, m: 2, cat: 'sensors', lvl: 1, icon: 'ir',
    t: ['IR Engel Algılama Sensörü', 'IR Obstacle Avoidance Sensor'],
    d: [
      'Kızılötesi verici-alıcı çifti ile yakındaki engelleri algıla. Robotlarda çizgi izleme ve engel tespiti için temel oluştur.',
      'Detect nearby obstacles with an infrared emitter/receiver pair — the foundation for line-following and obstacle-detecting robots.'
    ],
    tags: 'ir kizilotesi infrared engel obstacle tcrt5000 robot',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['IR Engel Sensörü Modülü', 'IR Obstacle Sensor Module'], 1],
      ['buzzer', ['Aktif Buzzer', 'Active Buzzer'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 5]
    ],
    wire: [
      [['Sensör VCC', 'Sensor VCC'], '5V'],
      [['Sensör GND', 'Sensor GND'], 'GND'],
      [['Sensör OUT', 'Sensor OUT'], 'Pin 7'],
      [['Buzzer (+)', 'Buzzer (+)'], 'Pin 8'],
      [['Buzzer (−)', 'Buzzer (−)'], 'GND']
    ],
    tip: ['Algılama mesafesi (2-30 cm) modül üzerindeki potansiyometre ile ayarlanır. Siyah yüzeyler IR ışığı emer ve algılanması zordur.', 'Detection range (2-30 cm) is set by the onboard pot. Black surfaces absorb IR and are harder to detect.'],
    code: `//: Bölüm 19 - IR Engel Sensörü || Chapter 19 - IR Obstacle Sensor
const int IR_PIN = 7;
const int BUZZER_PIN = 8;

void setup() {
  pinMode(IR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  //: Engel varken çıkış LOW olur || Output goes LOW when an obstacle is present
  bool obstacle = digitalRead(IR_PIN) == LOW;

  digitalWrite(BUZZER_PIN, obstacle ? HIGH : LOW);
  if (obstacle) Serial.println("Engel algilandi!");
  delay(100);
}`
  },
  {
    n: 20, m: 2, cat: 'sensors', lvl: 1, icon: 'tilt',
    t: ['Eğim ve Titreşim Sensörü', 'Tilt & Vibration Sensor'],
    d: [
      'SW-520D eğim sensörü ile bir nesnenin devrilip devrilmediğini algıla. Basit bir hırsızlık veya düşme uyarı sistemi kur.',
      'Detect whether an object has been tipped over using an SW-520D tilt switch, and build a simple tamper or fall alert.'
    ],
    tags: 'egim tilt titresim vibration sw-520d dusme hirsiz',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['SW-520D Eğim Sensörü', 'SW-520D Tilt Switch'], 1],
      ['buzzer', ['Aktif Buzzer', 'Active Buzzer'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 4]
    ],
    wire: [
      [['Eğim sensörü 1. bacak', 'Tilt switch leg 1'], 'Pin 2'],
      [['Eğim sensörü 2. bacak', 'Tilt switch leg 2'], 'GND'],
      [['Buzzer (+)', 'Buzzer (+)'], 'Pin 8'],
      [['Buzzer (−)', 'Buzzer (−)'], 'GND']
    ],
    tip: ['Sensörün içinde hareket eden metal bilyeler vardır; dik dururken kontak kapalıdır, eğilince açılır.', 'Inside are rolling metal balls: the contact is closed when upright and opens when tilted.'],
    code: `//: Bölüm 20 - Eğim Sensörü || Chapter 20 - Tilt Sensor
const int TILT_PIN = 2;
const int BUZZER_PIN = 8;

void setup() {
  pinMode(TILT_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  //: Dik: LOW (kontak kapalı), Eğik: HIGH || Upright: LOW (closed), Tilted: HIGH
  bool tilted = digitalRead(TILT_PIN) == HIGH;

  if (tilted) {
    Serial.println("Egim algilandi!");
    tone(BUZZER_PIN, 2000, 200);
  }
  delay(250);
}`
  },
  {
    n: 21, m: 2, cat: 'sensors', lvl: 2, icon: 'thermo',
    t: ['DS18B20 Su Geçirmez Sıcaklık Sensörü', 'DS18B20 Waterproof Temperature Sensor'],
    d: [
      '1-Wire protokolüyle çalışan DS18B20 ile sıvıların ve toprağın sıcaklığını ±0.5°C hassasiyetle ölç. Tek pinde birden fazla sensör kullanmayı öğren.',
      'Measure liquid and soil temperature to ±0.5°C with the 1-Wire DS18B20, and learn to run multiple sensors on a single pin.'
    ],
    tags: 'ds18b20 onewire 1-wire su gecirmez waterproof sicaklik temperature dallas',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['breadboard', 'Breadboard', 1],
      ['thermo', ['DS18B20 Su Geçirmez Prob', 'DS18B20 Waterproof Probe'], 1],
      ['resistor', ['4.7kΩ Direnç (pull-up)', '4.7kΩ Resistor (pull-up)'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 4]
    ],
    wire: [
      [['DS18B20 Kırmızı (VDD)', 'DS18B20 Red (VDD)'], '5V'],
      [['DS18B20 Siyah (GND)', 'DS18B20 Black (GND)'], 'GND'],
      [['DS18B20 Sarı (DATA)', 'DS18B20 Yellow (DATA)'], 'Pin 2'],
      [['4.7kΩ direnç', '4.7kΩ resistor'], ['DATA ile 5V arasına', 'Between DATA and 5V'], ['1-Wire hattı için zorunlu pull-up', 'Mandatory pull-up for the 1-Wire bus']]
    ],
    libs: ['OneWire', 'DallasTemperature'],
    tip: ['Aynı pine paralel bağlanan her sensör, getTempCByIndex(0), (1), (2)... ile ayrı ayrı okunabilir.', 'Each sensor wired in parallel on the same pin can be read separately with getTempCByIndex(0), (1), (2)...'],
    code: `//: Bölüm 21 - DS18B20 || Chapter 21 - DS18B20
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_PIN 2

OneWire oneWire(ONE_WIRE_PIN);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
  Serial.print("Bulunan sensor sayisi: ");
  Serial.println(sensors.getDeviceCount());
}

void loop() {
  sensors.requestTemperatures();             //: Ölçüm başlat || Start conversion
  float tempC = sensors.getTempCByIndex(0);  //: İlk sensör || First sensor

  if (tempC == DEVICE_DISCONNECTED_C) {
    Serial.println("Sensor baglantisi yok!");
  } else {
    Serial.print("Sicaklik: ");
    Serial.print(tempC, 2);
    Serial.println(" C");
  }
  delay(1000);
}`
  },
  {
    n: 22, m: 2, cat: 'sensors', lvl: 1, icon: 'joystick',
    t: ['Joystick Modülü', 'Joystick Module'],
    d: [
      'İki eksenli analog joystick ile X/Y konumunu ve butona basışı oku. Konumu yön bilgisine (yukarı, aşağı, sol, sağ) çevir.',
      'Read X/Y position and the push button from a dual-axis analog joystick, and translate position into directions (up, down, left, right).'
    ],
    tags: 'joystick analog x y eksen axis oyun game kontrol',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['joystick', ['Joystick Modülü (KY-023)', 'Joystick Module (KY-023)'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 5]
    ],
    wire: [
      ['Joystick GND', 'GND'],
      ['Joystick +5V', '5V'],
      ['Joystick VRx', 'A0'],
      ['Joystick VRy', 'A1'],
      ['Joystick SW', 'Pin 2']
    ],
    tip: ['Merkezde değerler ~512 civarındadır. Küçük titremeleri yok saymak için bir "ölü bölge" (DEADZONE) kullan.', 'Values hover around ~512 at rest. Use a DEADZONE to ignore small jitters.'],
    code: `//: Bölüm 22 - Joystick || Chapter 22 - Joystick
const int X_PIN = A0;
const int Y_PIN = A1;
const int SW_PIN = 2;
const int DEADZONE = 150;

void setup() {
  pinMode(SW_PIN, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int x = analogRead(X_PIN) - 512;   //: Merkezi 0 yap || Center at 0
  int y = analogRead(Y_PIN) - 512;
  bool pressed = digitalRead(SW_PIN) == LOW;

  String dir = "MERKEZ";
  if (y < -DEADZONE)      dir = "YUKARI";
  else if (y > DEADZONE)  dir = "ASAGI";
  if (x < -DEADZONE)      dir = "SOL";
  else if (x > DEADZONE)  dir = "SAG";

  Serial.print("X: ");  Serial.print(x);
  Serial.print("  Y: "); Serial.print(y);
  Serial.print("  Yon: "); Serial.print(dir);
  Serial.println(pressed ? "  [BUTON]" : "");
  delay(100);
}`
  }
);
