/*
 * Kodla — Modül 4: Haberleşme ve İleri Uygulamalar (Bölüm 31 - 42)
 * Format açıklaması için bkz. m1.js
 */
window.KODLA = window.KODLA || { chapters: [] };

KODLA.chapters.push(
  {
    n: 31, m: 4, cat: 'motors', lvl: 2, icon: 'remote',
    t: ['IR Kumanda ile Kontrol', 'Control with an IR Remote'],
    d: [
      'TSOP/VS1838B kızılötesi alıcı ile TV kumandasının tuş kodlarını oku ve farklı tuşlarla LED\'leri kontrol et.',
      'Read button codes from a TV remote with a TSOP/VS1838B infrared receiver and control LEDs with different keys.'
    ],
    tags: 'ir kumanda remote vs1838b tsop kizilotesi infrared irremote',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['VS1838B IR Alıcı', 'VS1838B IR Receiver'], 1],
      ['remote', ['IR Kumanda', 'IR Remote'], 1],
      ['led', 'LED', 2],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 2],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 6]
    ],
    wire: [
      [['IR Alıcı OUT (sol pin)', 'IR Receiver OUT (left pin)'], 'Pin 11'],
      [['IR Alıcı GND (orta pin)', 'IR Receiver GND (middle pin)'], 'GND'],
      [['IR Alıcı VCC (sağ pin)', 'IR Receiver VCC (right pin)'], '5V'],
      ['Pin 5', ['220Ω → LED 1 Anot', '220Ω → LED 1 Anode']],
      ['Pin 6', ['220Ω → LED 2 Anot', '220Ω → LED 2 Anode']],
      [['LED Katotları', 'LED Cathodes'], 'GND']
    ],
    libs: ['IRremote (v4.x)'],
    tip: ['Önce Seri Monitör\'den kendi kumandanın tuş kodlarını öğren, sonra koddaki 0x45 / 0x46 değerlerini değiştir.', 'First read your own remote\'s key codes from the Serial Monitor, then replace 0x45 / 0x46 in the code.'],
    code: `//: Bölüm 31 - IR Kumanda || Chapter 31 - IR Remote
#include <IRremote.hpp>

const int IR_PIN = 11;
const int LED1 = 5;
const int LED2 = 6;

void setup() {
  Serial.begin(9600);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  IrReceiver.begin(IR_PIN, ENABLE_LED_FEEDBACK);
  Serial.println("Kumanda tusuna basin...");
}

void loop() {
  if (IrReceiver.decode()) {
    uint8_t cmd = IrReceiver.decodedIRData.command;
    Serial.print("Tus kodu: 0x");
    Serial.println(cmd, HEX);

    //: Kendi kumandanın kodlarıyla değiştir || Replace with your remote's codes
    if (cmd == 0x45) digitalWrite(LED1, !digitalRead(LED1));
    if (cmd == 0x46) digitalWrite(LED2, !digitalRead(LED2));

    IrReceiver.resume();   //: Sonraki sinyale hazırlan || Ready for the next signal
  }
}`
  },
  {
    n: 32, m: 4, cat: 'advanced', lvl: 2, icon: 'keypad',
    t: ['4x4 Keypad ile Şifreli Kilit', 'Password Lock with a 4x4 Keypad'],
    d: [
      '4x4 tuş takımıyla şifre girişi al; doğru şifrede servo kilit açılsın ve yeşil LED yansın, yanlışta kırmızı LED uyarsın.',
      'Take password input from a 4x4 keypad: the servo lock opens with a green LED on success, and a red LED warns on failure.'
    ],
    tags: 'keypad tus takimi sifre password kilit lock servo guvenlik',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['keypad', ['4x4 Membran Keypad', '4x4 Membrane Keypad'], 1],
      ['servo', ['SG90 Servo', 'SG90 Servo'], 1],
      ['led', ['LED (yeşil + kırmızı)', 'LED (green + red)'], 2],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 2],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 14]
    ],
    wire: [
      [['Keypad R1, R2, R3, R4 (satırlar)', 'Keypad R1, R2, R3, R4 (rows)'], 'Pin 9, 8, 7, 6'],
      [['Keypad C1, C2, C3, C4 (sütunlar)', 'Keypad C1, C2, C3, C4 (columns)'], 'Pin 5, 4, 3, 2'],
      [['Servo sinyal', 'Servo signal'], 'Pin 11'],
      [['Servo + / −', 'Servo + / −'], '5V / GND'],
      ['Pin 12', ['220Ω → Yeşil LED', '220Ω → Green LED']],
      ['Pin 13', ['220Ω → Kırmızı LED', '220Ω → Red LED']]
    ],
    libs: ['Keypad (Mark Stanley)', ['Servo (Arduino IDE ile gelir)', 'Servo (bundled with the IDE)']],
    tip: ['"*" tuşu girişi temizler, "#" tuşu şifreyi onaylar. Şifreyi PASSWORD değişkeninden değiştirebilirsin.', '"*" clears input and "#" submits. Change the code via the PASSWORD variable.'],
    code: `//: Bölüm 32 - Şifreli Kilit || Chapter 32 - Password Lock
#include <Keypad.h>
#include <Servo.h>

const byte ROWS = 4;
const byte COLS = 4;
char keys[ROWS][COLS] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};
byte rowPins[ROWS] = { 9, 8, 7, 6 };
byte colPins[COLS] = { 5, 4, 3, 2 };

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
Servo lock;

const String PASSWORD = "1234";   //: Şifreni buradan değiştir || Change your code here
const int GREEN_LED = 12;
const int RED_LED = 13;
String input = "";

void setup() {
  Serial.begin(9600);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  lock.attach(11);
  lock.write(0);                  //: Kilitli konum || Locked position
}

void loop() {
  char key = keypad.getKey();
  if (!key) return;

  if (key == '*') {               //: Girişi temizle || Clear input
    input = "";
    Serial.println("Temizlendi");
  } else if (key == '#') {        //: Onayla || Submit
    if (input == PASSWORD) {
      Serial.println("Kilit acildi!");
      digitalWrite(GREEN_LED, HIGH);
      lock.write(90);
      delay(3000);
      lock.write(0);
      digitalWrite(GREEN_LED, LOW);
    } else {
      Serial.println("Hatali sifre!");
      for (int i = 0; i < 3; i++) {
        digitalWrite(RED_LED, HIGH); delay(150);
        digitalWrite(RED_LED, LOW);  delay(150);
      }
    }
    input = "";
  } else {
    input += key;
    Serial.print("*");
  }
}`
  },
  {
    n: 33, m: 4, cat: 'advanced', lvl: 3, icon: 'rfid',
    t: ['RFID Kart Okuyucu (RC522)', 'RFID Card Reader (RC522)'],
    d: [
      'MFRC522 modülü ile 13.56 MHz RFID kart ve anahtarlıkların benzersiz UID kodunu oku. Yetkili kartlarla çalışan bir geçiş kontrol sistemi kur.',
      'Read the unique UID of 13.56 MHz RFID cards and key fobs with an MFRC522 module and build an access-control system for authorized cards.'
    ],
    tags: 'rfid rc522 mfrc522 kart card nfc uid spi gecis access',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['rfid', ['RC522 RFID Modülü + Kart/Anahtarlık', 'RC522 RFID Module + Card/Fob'], 1],
      ['led', ['LED (yeşil + kırmızı)', 'LED (green + red)'], 2],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 2],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 10]
    ],
    wire: [
      ['RC522 SDA (SS)', 'Pin 10'],
      ['RC522 SCK', 'Pin 13'],
      ['RC522 MOSI', 'Pin 11'],
      ['RC522 MISO', 'Pin 12'],
      ['RC522 RST', 'Pin 9'],
      ['RC522 GND', 'GND'],
      ['RC522 3.3V', ['3.3V (5V DEĞİL!)', '3.3V (NOT 5V!)'], ['5V modüle zarar verir', '5V will damage the module']],
      ['Pin 5 / Pin 6', ['220Ω → Yeşil / Kırmızı LED', '220Ω → Green / Red LED']]
    ],
    libs: ['MFRC522 (GithubCommunity)'],
    tip: ['Kartını okutup Seri Monitör\'de görünen UID\'yi koddaki AUTHORIZED dizisine yaz.', 'Scan your card and copy the UID shown in the Serial Monitor into the AUTHORIZED array.'],
    code: `//: Bölüm 33 - RFID || Chapter 33 - RFID
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9
const int GREEN_LED = 5;
const int RED_LED = 6;

MFRC522 rfid(SS_PIN, RST_PIN);

//: Yetkili kart UID'si (kendi kartınla değiştir) || Authorized UID (replace with yours)
byte AUTHORIZED[4] = { 0xDE, 0xAD, 0xBE, 0xEF };

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  Serial.println("Kartinizi okutun...");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  Serial.print("UID:");
  bool match = (rfid.uid.size == 4);
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(rfid.uid.uidByte[i], HEX);
    if (i < 4 && rfid.uid.uidByte[i] != AUTHORIZED[i]) match = false;
  }
  Serial.println();

  int led = match ? GREEN_LED : RED_LED;
  Serial.println(match ? "Erisim onaylandi" : "Erisim reddedildi");
  digitalWrite(led, HIGH);
  delay(1500);
  digitalWrite(led, LOW);

  rfid.PICC_HaltA();        //: Kartı beklemeye al || Halt the card
  rfid.PCD_StopCrypto1();
}`
  },
  {
    n: 34, m: 4, cat: 'advanced', lvl: 2, icon: 'clock',
    t: ['RTC DS3231 Gerçek Zamanlı Saat', 'RTC DS3231 Real-Time Clock'],
    d: [
      'Pil destekli DS3231 RTC modülü ile elektrik kesilse bile doğru zamanı koru. Tarih ve saati okuyup LCD veya Seri Monitör\'de göster.',
      'Keep accurate time even through power loss with a battery-backed DS3231 RTC. Read the date and time and display them.'
    ],
    tags: 'rtc ds3231 ds1307 saat clock zaman time tarih date i2c',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['clock', ['DS3231 RTC Modülü (CR2032 pilli)', 'DS3231 RTC Module (with CR2032)'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 4]
    ],
    wire: [
      ['DS3231 VCC', '5V'],
      ['DS3231 GND', 'GND'],
      ['DS3231 SDA', 'A4'],
      ['DS3231 SCL', 'A5']
    ],
    libs: ['RTClib (Adafruit)'],
    tip: ['Saat ilk yüklemede bilgisayarın derleme zamanına ayarlanır. I2C hattını LCD ile paylaşabilirsin (farklı adresler).', 'The clock is set to your PC\'s compile time on first upload. It can share the I2C bus with an LCD (different addresses).'],
    code: `//: Bölüm 34 - RTC DS3231 || Chapter 34 - RTC DS3231
#include <Wire.h>
#include <RTClib.h>

RTC_DS3231 rtc;
const char* DAYS[7] = { "Pazar", "Pazartesi", "Sali", "Carsamba", "Persembe", "Cuma", "Cumartesi" };

void print2(int v) {
  if (v < 10) Serial.print('0');   //: Başa sıfır ekle || Zero-pad
  Serial.print(v);
}

void setup() {
  Serial.begin(9600);
  if (!rtc.begin()) {
    Serial.println("RTC bulunamadi!");
    while (true);
  }
  if (rtc.lostPower()) {
    //: Derleme zamanına ayarla || Set to compile time
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
}

void loop() {
  DateTime now = rtc.now();

  print2(now.day());   Serial.print('.');
  print2(now.month()); Serial.print('.');
  Serial.print(now.year());
  Serial.print("  ");
  print2(now.hour());  Serial.print(':');
  print2(now.minute()); Serial.print(':');
  print2(now.second());
  Serial.print("  ");
  Serial.print(DAYS[now.dayOfTheWeek()]);
  Serial.print("  |  ");
  Serial.print(rtc.getTemperature());   //: Dahili sıcaklık || Built-in temperature
  Serial.println(" C");

  delay(1000);
}`
  },
  {
    n: 35, m: 4, cat: 'motors', lvl: 2, icon: 'bluetooth',
    t: ['Bluetooth HC-05 ile Telefon Kontrolü', 'Phone Control via Bluetooth HC-05'],
    d: [
      'HC-05 Bluetooth modülü ve SoftwareSerial ile akıllı telefondan Arduino\'ya komut gönder; LED\'i aç/kapa ve durum bilgisini telefona geri yolla.',
      'Send commands from a smartphone to the Arduino with an HC-05 module and SoftwareSerial — toggle an LED and report status back to the phone.'
    ],
    tags: 'bluetooth hc-05 hc-06 telefon phone softwareserial kablosuz wireless uart',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['bluetooth', ['HC-05 Bluetooth Modülü', 'HC-05 Bluetooth Module'], 1],
      ['resistor', ['1kΩ + 2kΩ Direnç (gerilim bölücü)', '1kΩ + 2kΩ Resistors (voltage divider)'], 2],
      ['led', 'LED', 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 6]
    ],
    wire: [
      ['HC-05 VCC', '5V'],
      ['HC-05 GND', 'GND'],
      ['HC-05 TXD', ['Pin 10 (Arduino RX)', 'Pin 10 (Arduino RX)']],
      ['HC-05 RXD', ['Pin 11 → 1kΩ → RXD, RXD → 2kΩ → GND', 'Pin 11 → 1kΩ → RXD, RXD → 2kΩ → GND'], ['HC-05 RX pini 3.3V mantık seviyesindedir', 'HC-05 RX uses 3.3V logic']],
      ['Pin 13', ['LED (dahili LED de olur)', 'LED (built-in LED works too)']]
    ],
    tip: ['Telefonda "Serial Bluetooth Terminal" gibi bir uygulamayla eşleş (varsayılan PIN: 1234 veya 0000) ve 1 / 0 / ? gönder.', 'Pair with an app like "Serial Bluetooth Terminal" (default PIN 1234 or 0000) and send 1 / 0 / ?.'],
    code: `//: Bölüm 35 - Bluetooth HC-05 || Chapter 35 - Bluetooth HC-05
#include <SoftwareSerial.h>

SoftwareSerial bt(10, 11);   //: RX, TX
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  bt.begin(9600);            //: HC-05 varsayılan hızı || HC-05 default baud
  Serial.println("Bluetooth hazir");
}

void loop() {
  if (bt.available()) {
    char c = bt.read();
    Serial.print("Gelen: ");
    Serial.println(c);

    if (c == '1') {
      digitalWrite(LED_PIN, HIGH);
      bt.println("LED ACIK");
    } else if (c == '0') {
      digitalWrite(LED_PIN, LOW);
      bt.println("LED KAPALI");
    } else if (c == '?') {
      bt.println(digitalRead(LED_PIN) ? "Durum: ACIK" : "Durum: KAPALI");
    }
  }

  //: Seri Monitör'den telefona mesaj gönder || Forward Serial Monitor text to the phone
  if (Serial.available()) {
    bt.write(Serial.read());
  }
}`
  },
  {
    n: 36, m: 4, cat: 'advanced', lvl: 3, icon: 'sd',
    t: ['SD Kart ile Veri Kaydı (Data Logger)', 'SD Card Data Logger'],
    d: [
      'Micro SD kart modülü ile sensör verilerini CSV dosyasına zaman damgasıyla kaydet. Kaydettiğin veriyi Excel\'de grafiğe dönüştür.',
      'Log sensor readings with timestamps to a CSV file on a micro SD card, then chart your data in Excel.'
    ],
    tags: 'sd kart card data logger veri kayit csv excel spi',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sd', ['Micro SD Kart Modülü', 'Micro SD Card Module'], 1],
      ['sd', ['Micro SD Kart (FAT32)', 'Micro SD Card (FAT32)'], 1],
      ['ldr', ['LDR + 10kΩ (örnek sensör)', 'LDR + 10kΩ (sample sensor)'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 8]
    ],
    wire: [
      ['SD CS', 'Pin 10'],
      ['SD MOSI', 'Pin 11'],
      ['SD MISO', 'Pin 12'],
      ['SD SCK', 'Pin 13'],
      ['SD VCC', '5V'],
      ['SD GND', 'GND'],
      [['LDR gerilim bölücü çıkışı', 'LDR divider output'], 'A0']
    ],
    libs: [['SD (Arduino IDE ile gelir)', 'SD (bundled with the IDE)']],
    tip: ['Kartı FAT32 olarak biçimlendir. Dosya adları 8.3 formatında olmalıdır (ör. LOG.CSV).', 'Format the card as FAT32. File names must follow the 8.3 format (e.g. LOG.CSV).'],
    code: `//: Bölüm 36 - SD Data Logger || Chapter 36 - SD Data Logger
#include <SPI.h>
#include <SD.h>

const int CS_PIN = 10;
const int SENSOR_PIN = A0;
const unsigned long INTERVAL = 5000;   //: 5 saniyede bir kayıt || Log every 5 seconds
unsigned long lastLog = 0;

void setup() {
  Serial.begin(9600);
  if (!SD.begin(CS_PIN)) {
    Serial.println("SD kart baslatilamadi!");
    while (true);
  }
  //: Dosya yoksa başlık satırı yaz || Write header if file is new
  if (!SD.exists("LOG.CSV")) {
    File f = SD.open("LOG.CSV", FILE_WRITE);
    f.println("zaman_sn,isik");
    f.close();
  }
  Serial.println("Kayit basladi");
}

void loop() {
  if (millis() - lastLog >= INTERVAL) {
    lastLog = millis();
    int value = analogRead(SENSOR_PIN);

    File f = SD.open("LOG.CSV", FILE_WRITE);
    if (f) {
      f.print(millis() / 1000);
      f.print(",");
      f.println(value);
      f.close();                 //: Veriyi karta yaz || Flush data to the card
      Serial.print("Kaydedildi: ");
      Serial.println(value);
    } else {
      Serial.println("Dosya acilamadi!");
    }
  }
}`
  },
  {
    n: 37, m: 4, cat: 'advanced', lvl: 2, icon: 'dht',
    t: ['Akıllı Sıcaklık ve Nem Takip Sistemi', 'Smart Temperature & Humidity Monitor'],
    d: [
      'DHT11 ile ortam sıcaklığını ve nemini ölç, verileri I2C LCD ekrana yazdır ve sıcaklık eşik değerini geçtiğinde buzzer ile uyarı ver. Bu deponun çıkış noktası olan proje!',
      'Measure temperature and humidity with a DHT11, show the data on an I2C LCD and sound a buzzer when the temperature crosses a threshold. The project this repository started from!'
    ],
    tags: 'akilli sicaklik nem takip dht11 lcd buzzer alarm monitor proje project',
    parts: [
      ['board', 'Arduino Uno', 1],
      ['sensor', ['DHT11 Sıcaklık ve Nem Sensörü', 'DHT11 Temperature & Humidity Sensor'], 1],
      ['lcd', ['16x2 LCD Ekran (I2C modüllü)', '16x2 LCD (with I2C backpack)'], 1],
      ['buzzer', ['Aktif Buzzer', 'Active Buzzer'], 1],
      ['breadboard', 'Breadboard', 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 9]
    ],
    wire: [
      ['DHT11 VCC', '5V'],
      ['DHT11 GND', 'GND'],
      ['DHT11 DATA', 'Pin 2'],
      ['LCD VCC', '5V'],
      ['LCD GND', 'GND'],
      ['LCD SDA', 'A4'],
      ['LCD SCL', 'A5'],
      [['Buzzer (+)', 'Buzzer (+)'], 'Pin 7'],
      [['Buzzer (−)', 'Buzzer (−)'], 'GND']
    ],
    libs: ['DHT sensor library (Adafruit)', 'Adafruit Unified Sensor', 'LiquidCrystal I2C (Frank de Brabander)'],
    tip: ['TEMP_LIMIT değerini değiştirerek alarm eşiğini ayarla. LCD adresi 0x27 değilse 0x3F dene.', 'Change TEMP_LIMIT to adjust the alarm threshold. If the LCD isn\'t at 0x27, try 0x3F.'],
    code: `//: Bölüm 37 - Akıllı Sıcaklık ve Nem Takip Sistemi || Chapter 37 - Smart Temperature & Humidity Monitor
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#define DHTPIN 2           //: DHT11 veri pini || DHT11 data pin
#define DHTTYPE DHT11
#define BUZZER 7           //: Buzzer pini || Buzzer pin
const float TEMP_LIMIT = 30.0;   //: Alarm eşiği (°C) || Alarm threshold (°C)

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);   //: LCD I2C adresi 0x27 olabilir || LCD I2C address may be 0x27

void setup() {
  lcd.init();
  lcd.backlight();
  dht.begin();
  pinMode(BUZZER, OUTPUT);
  digitalWrite(BUZZER, LOW);
  lcd.print("Sistem Basladi");
  delay(2000);
  lcd.clear();
}

void loop() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temp) || isnan(humidity)) {
    lcd.setCursor(0, 0);
    lcd.print("Sensor hatasi!  ");
    delay(2000);
    return;
  }

  lcd.setCursor(0, 0);
  lcd.print("Sicaklik: ");
  lcd.print(temp, 1);
  lcd.print("C ");

  lcd.setCursor(0, 1);
  lcd.print("Nem: %");
  lcd.print(humidity, 0);
  lcd.print(temp > TEMP_LIMIT ? "  SICAK!" : "        ");

  //: Eşik aşıldıysa alarm || Alarm when over the limit
  digitalWrite(BUZZER, temp > TEMP_LIMIT ? HIGH : LOW);

  delay(2000);
}`
  },
  {
    n: 38, m: 4, cat: 'advanced', lvl: 2, icon: 'car',
    t: ['Park Sensörü Sistemi', 'Parking Sensor System'],
    d: [
      'Ultrasonik sensör, buzzer ve üç renkli LED göstergeyle arabalardaki gibi bir park asistanı yap: engel yaklaştıkça bip sesi hızlansın.',
      'Build a car-style parking assistant with an ultrasonic sensor, buzzer and a three-color LED bar: the beeping speeds up as obstacles get closer.'
    ],
    tags: 'park sensor parking ultrasonik hc-sr04 buzzer led araba car',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['HC-SR04 Ultrasonik Sensör', 'HC-SR04 Ultrasonic Sensor'], 1],
      ['buzzer', ['Aktif Buzzer', 'Active Buzzer'], 1],
      ['led', ['LED (yeşil, sarı, kırmızı)', 'LED (green, yellow, red)'], 3],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 3],
      ['breadboard', 'Breadboard', 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 10]
    ],
    wire: [
      ['HC-SR04 Trig', 'Pin 9'],
      ['HC-SR04 Echo', 'Pin 10'],
      ['HC-SR04 VCC / GND', '5V / GND'],
      [['Buzzer (+)', 'Buzzer (+)'], 'Pin 8'],
      ['Pin 5', ['220Ω → Yeşil LED', '220Ω → Green LED']],
      ['Pin 6', ['220Ω → Sarı LED', '220Ω → Yellow LED']],
      ['Pin 7', ['220Ω → Kırmızı LED', '220Ω → Red LED']],
      [['Tüm katotlar ve Buzzer (−)', 'All cathodes and Buzzer (−)'], 'GND']
    ],
    tip: ['Mesafe aralıklarını (FAR, NEAR, DANGER) aracının veya robotunun boyutuna göre ayarla.', 'Tune the distance bands (FAR, NEAR, DANGER) to the size of your car or robot.'],
    code: `//: Bölüm 38 - Park Sensörü || Chapter 38 - Parking Sensor
const int TRIG = 9, ECHO = 10, BUZZER = 8;
const int GREEN = 5, YELLOW = 6, RED = 7;
const int FAR = 100, NEAR = 50, DANGER = 15;   //: cm

int readCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long d = pulseIn(ECHO, HIGH, 30000);
  return d == 0 ? 999 : d * 0.0343 / 2;
}

void leds(int g, int y, int r) {
  digitalWrite(GREEN, g);
  digitalWrite(YELLOW, y);
  digitalWrite(RED, r);
}

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(RED, OUTPUT);
}

void loop() {
  int cm = readCm();

  if (cm > FAR) {                 //: Güvenli || Safe
    leds(LOW, LOW, LOW);
    digitalWrite(BUZZER, LOW);
    delay(100);
  } else if (cm <= DANGER) {      //: Çok yakın: sürekli ses || Too close: continuous tone
    leds(HIGH, HIGH, HIGH);
    digitalWrite(BUZZER, HIGH);
    delay(100);
  } else {
    leds(HIGH, cm < NEAR, LOW);
    //: Mesafe azaldıkça bip aralığı kısalır || Beep gap shrinks as distance drops
    int gap = map(cm, DANGER, FAR, 60, 600);
    digitalWrite(BUZZER, HIGH);
    delay(60);
    digitalWrite(BUZZER, LOW);
    delay(gap);
  }
}`
  },
  {
    n: 39, m: 4, cat: 'advanced', lvl: 2, icon: 'plant',
    t: ['Otomatik Bitki Sulama Sistemi', 'Automatic Plant Watering System'],
    d: [
      'Toprak nem sensörü, röle ve mini su pompasıyla bitkini kendi kendine sulayan bir sistem kur. Histerezis ile pompanın sürekli açılıp kapanmasını önle.',
      'Build a self-watering system with a soil moisture sensor, relay and mini water pump. Use hysteresis to stop the pump from rapid cycling.'
    ],
    tags: 'sulama watering bitki plant pompa pump role relay toprak soil histerezis',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['Kapasitif Toprak Nem Sensörü', 'Capacitive Soil Moisture Sensor'], 1],
      ['relay', ['5V Röle Modülü', '5V Relay Module'], 1],
      ['pump', ['Mini Dalgıç Pompa (3-6V) + hortum', 'Mini Submersible Pump (3-6V) + tubing'], 1],
      ['battery', ['Pompa için 4xAA pil yuvası', '4xAA battery pack for the pump'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 8]
    ],
    wire: [
      [['Sensör AOUT', 'Sensor AOUT'], 'A0'],
      [['Sensör VCC / GND', 'Sensor VCC / GND'], '5V / GND'],
      [['Röle IN', 'Relay IN'], 'Pin 7'],
      [['Röle VCC / GND', 'Relay VCC / GND'], '5V / GND'],
      [['Pil (+)', 'Battery (+)'], ['Röle COM', 'Relay COM']],
      [['Röle NO', 'Relay NO'], ['Pompa (+)', 'Pump (+)']],
      [['Pompa (−)', 'Pump (−)'], ['Pil (−)', 'Battery (−)']]
    ],
    tip: ['Pompayı asla kuru çalıştırma. Elektronik kısımları su kabından uzak ve yüksekte tut.', 'Never run the pump dry. Keep the electronics well away from and above the water container.'],
    code: `//: Bölüm 39 - Otomatik Sulama || Chapter 39 - Auto Watering
const int SOIL_PIN = A0;
const int RELAY_PIN = 7;
const int DRY_VALUE = 620, WET_VALUE = 280;   //: Kalibrasyon || Calibration

const int START_BELOW = 30;   //: %30'un altında sula || Water below 30%
const int STOP_ABOVE = 55;    //: %55'e gelince dur || Stop at 55%
bool pumping = false;

void pump(bool on) {
  pumping = on;
  digitalWrite(RELAY_PIN, on ? LOW : HIGH);   //: Aktif-LOW röle || Active-LOW relay
}

void setup() {
  digitalWrite(RELAY_PIN, HIGH);
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int moisture = constrain(map(analogRead(SOIL_PIN), DRY_VALUE, WET_VALUE, 0, 100), 0, 100);

  //: Histerezis: iki farklı eşik || Hysteresis: two separate thresholds
  if (!pumping && moisture < START_BELOW) pump(true);
  if (pumping && moisture > STOP_ABOVE)   pump(false);

  Serial.print("Nem: %");
  Serial.print(moisture);
  Serial.println(pumping ? "  [POMPA ACIK]" : "");
  delay(1000);
}`
  },
  {
    n: 40, m: 4, cat: 'advanced', lvl: 3, icon: 'robot',
    t: ['Engelden Kaçan Robot', 'Obstacle-Avoiding Robot'],
    d: [
      'L298N, iki DC motor, servo üzerinde HC-SR04 ile otonom bir robot araba yap. Engel görünce dur, sağa-sola bak ve en açık yöne dön.',
      'Build an autonomous robot car with an L298N, two DC motors and an HC-SR04 on a servo. It stops at obstacles, looks left and right and turns toward the clearest path.'
    ],
    tags: 'robot araba car otonom autonomous engel obstacle l298n servo hc-sr04',
    parts: [
      ['board', 'Arduino Uno', 1],
      ['robot', ['2WD Robot Şasi + 2 DC Motor', '2WD Robot Chassis + 2 DC Motors'], 1],
      ['driver', ['L298N Motor Sürücü', 'L298N Motor Driver'], 1],
      ['sensor', ['HC-SR04 Ultrasonik Sensör', 'HC-SR04 Ultrasonic Sensor'], 1],
      ['servo', ['SG90 Servo (sensör tutucu)', 'SG90 Servo (sensor mount)'], 1],
      ['battery', ['2x 18650 Pil + Yuva (7.4V)', '2x 18650 Cells + Holder (7.4V)'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 14]
    ],
    wire: [
      ['L298N ENA / ENB', 'Pin ~5 / Pin ~6'],
      ['L298N IN1 / IN2', 'Pin 7 / Pin 8'],
      ['L298N IN3 / IN4', 'Pin 9 / Pin 10'],
      ['L298N OUT1-2 / OUT3-4', ['Sol motor / Sağ motor', 'Left motor / Right motor']],
      ['L298N 12V / GND', ['Pil (+) / Pil (−) + Arduino GND', 'Battery (+) / Battery (−) + Arduino GND']],
      ['L298N 5V', ['Arduino 5V (Arduino\'yu besler)', 'Arduino 5V (powers the Arduino)']],
      ['HC-SR04 Trig / Echo', 'Pin 2 / Pin 4'],
      [['Servo sinyal', 'Servo signal'], 'Pin 3']
    ],
    libs: [['Servo (Arduino IDE ile gelir)', 'Servo (bundled with the IDE)']],
    tip: ['Servo kütüphanesi pin 9 ve 10\'da PWM\'i devre dışı bırakır; bu yüzden hız (ENA/ENB) için 5 ve 6, yön için 9/10 dijital olarak kullanılır.', 'The Servo library disables PWM on pins 9 and 10, so speed (ENA/ENB) uses 5 and 6 while 9/10 are used as plain digital direction pins.'],
    code: `//: Bölüm 40 - Engelden Kaçan Robot || Chapter 40 - Obstacle-Avoiding Robot
#include <Servo.h>

const int ENA = 5, IN1 = 7, IN2 = 8;    //: Sol motor || Left motor
const int ENB = 6, IN3 = 9, IN4 = 10;   //: Sağ motor || Right motor
const int TRIG = 2, ECHO = 4;
const int SPEED = 170;
const int SAFE_CM = 25;

Servo head;

int readCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long d = pulseIn(ECHO, HIGH, 30000);
  return d == 0 ? 300 : d * 0.0343 / 2;
}

void drive(int left, int right) {
  //: -255..255 arası hız || Speed between -255..255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0);
  analogWrite(ENA, abs(left));
  analogWrite(ENB, abs(right));
}

int lookAt(int angle) {
  head.write(angle);
  delay(350);
  return readCm();
}

void setup() {
  int pins[] = { ENA, IN1, IN2, ENB, IN3, IN4, TRIG };
  for (int p : pins) pinMode(p, OUTPUT);
  pinMode(ECHO, INPUT);
  head.attach(3);
  head.write(90);              //: İleri bak || Look ahead
  delay(1000);
}

void loop() {
  if (readCm() > SAFE_CM) {
    drive(SPEED, SPEED);       //: İleri || Forward
    delay(50);
    return;
  }

  drive(0, 0);                 //: Dur || Stop
  drive(-SPEED, -SPEED);       //: Biraz geri || Back up a little
  delay(300);
  drive(0, 0);

  int right = lookAt(20);
  int left = lookAt(160);
  head.write(90);

  //: Daha açık tarafa dön || Turn toward the clearer side
  if (left > right) drive(-SPEED, SPEED);
  else              drive(SPEED, -SPEED);
  delay(400);
  drive(0, 0);
}`
  },
  {
    n: 41, m: 4, cat: 'advanced', lvl: 2, icon: 'shield',
    t: ['Hareket Algılamalı Hırsız Alarmı', 'Motion-Triggered Burglar Alarm'],
    d: [
      'PIR sensör, siren efekti veren buzzer ve kurma/devre dışı bırakma butonuyla eksiksiz bir ev güvenlik alarmı oluştur. Durum makinesi (state machine) mantığını öğren.',
      'Create a complete home security alarm with a PIR sensor, a siren-effect buzzer and an arm/disarm button. Learn state-machine logic.'
    ],
    tags: 'alarm hirsiz burglar guvenlik security pir siren state machine durum',
    parts: [
      ['board', 'Arduino Uno / Nano', 1],
      ['sensor', ['HC-SR501 PIR Sensör', 'HC-SR501 PIR Sensor'], 1],
      ['buzzer', ['Pasif Buzzer', 'Passive Buzzer'], 1],
      ['button', ['Push Buton', 'Push Button'], 1],
      ['led', ['LED (kırmızı)', 'LED (red)'], 1],
      ['resistor', ['220Ω Direnç', '220Ω Resistor'], 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 8]
    ],
    wire: [
      ['PIR OUT', 'Pin 2'],
      ['PIR VCC / GND', '5V / GND'],
      [['Buton', 'Button'], ['Pin 3 ↔ GND', 'Pin 3 ↔ GND']],
      [['Buzzer (+) / (−)', 'Buzzer (+) / (−)'], 'Pin 8 / GND'],
      ['Pin 13', ['220Ω → Kırmızı LED → GND', '220Ω → Red LED → GND']]
    ],
    tip: ['Butona basınca 10 saniyelik çıkış süresinden sonra alarm kurulur. Alarm çalarken butona basmak susturur ve devre dışı bırakır.', 'Pressing the button arms the alarm after a 10-second exit delay. Pressing it while ringing silences and disarms.'],
    code: `//: Bölüm 41 - Hırsız Alarmı || Chapter 41 - Burglar Alarm
const int PIR = 2, BUTTON = 3, BUZZER = 8, LED = 13;

enum State { DISARMED, ARMING, ARMED, ALARM };
State state = DISARMED;
unsigned long stateStart = 0;

void setState(State s) {
  state = s;
  stateStart = millis();
  noTone(BUZZER);
}

bool buttonPressed() {
  static int last = HIGH;
  int now = digitalRead(BUTTON);
  bool pressed = (last == HIGH && now == LOW);
  last = now;
  if (pressed) delay(30);
  return pressed;
}

void setup() {
  pinMode(PIR, INPUT);
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  bool pressed = buttonPressed();
  unsigned long t = millis() - stateStart;

  switch (state) {
    case DISARMED:
      digitalWrite(LED, LOW);
      if (pressed) { setState(ARMING); Serial.println("Kuruluyor..."); }
      break;

    case ARMING:                                   //: 10 sn çıkış süresi || 10 s exit delay
      digitalWrite(LED, (t / 250) % 2);
      if (pressed) setState(DISARMED);
      else if (t > 10000) { setState(ARMED); Serial.println("Alarm KURULDU"); }
      break;

    case ARMED:
      digitalWrite(LED, (t / 1000) % 2 == 0 && (t % 1000) < 80);  //: Kısa flaş || Short blink
      if (pressed) setState(DISARMED);
      else if (digitalRead(PIR) == HIGH) { setState(ALARM); Serial.println("HAREKET! ALARM!"); }
      break;

    case ALARM:
      digitalWrite(LED, (t / 100) % 2);
      tone(BUZZER, 800 + (t % 1000));              //: Siren efekti || Siren sweep
      if (pressed) { setState(DISARMED); Serial.println("Devre disi"); }
      break;
  }
}`
  },
  {
    n: 42, m: 4, cat: 'advanced', lvl: 3, icon: 'home',
    t: ['Akıllı Ev Prototipi', 'Smart Home Prototype'],
    d: [
      'Tüm öğrendiklerini birleştir: Bluetooth ile telefondan lambayı (röle) ve kapıyı (servo) kontrol et, DHT11 ile sıcaklığı izle ve otomatik fan kuralı ekle.',
      'Bring it all together: control a lamp (relay) and door (servo) from your phone over Bluetooth, monitor temperature with a DHT11 and add an automatic fan rule.'
    ],
    tags: 'akilli ev smart home iot bluetooth hc-05 role servo dht11 otomasyon automation',
    parts: [
      ['board', 'Arduino Uno', 1],
      ['bluetooth', ['HC-05 Bluetooth Modülü', 'HC-05 Bluetooth Module'], 1],
      ['relay', ['2 Kanal Röle Modülü', '2-Channel Relay Module'], 1],
      ['servo', ['SG90 Servo (kapı)', 'SG90 Servo (door)'], 1],
      ['sensor', ['DHT11 Sensör', 'DHT11 Sensor'], 1],
      ['resistor', ['1kΩ + 2kΩ Direnç', '1kΩ + 2kΩ Resistors'], 2],
      ['breadboard', 'Breadboard', 1],
      ['wire', ['Jumper Kablo', 'Jumper Wires'], 16]
    ],
    wire: [
      ['HC-05 TXD', 'Pin 10'],
      ['HC-05 RXD', ['Pin 11 (1kΩ/2kΩ bölücü ile)', 'Pin 11 (via 1kΩ/2kΩ divider)']],
      ['HC-05 VCC / GND', '5V / GND'],
      [['Röle IN1 (lamba)', 'Relay IN1 (lamp)'], 'Pin 7'],
      [['Röle IN2 (fan)', 'Relay IN2 (fan)'], 'Pin 6'],
      [['Servo sinyal (kapı)', 'Servo signal (door)'], 'Pin 9'],
      ['DHT11 DATA', 'Pin 2'],
      [['Tüm modüller VCC / GND', 'All modules VCC / GND'], '5V / GND']
    ],
    libs: ['DHT sensor library (Adafruit)', 'Adafruit Unified Sensor', ['Servo (Arduino IDE ile gelir)', 'Servo (bundled with the IDE)']],
    tip: ['Komutlar: L1/L0 lamba, D1/D0 kapı, F1/F0 fan, A otomatik fan modu, S durum raporu. Her komuttan sonra satır sonu gönder.', 'Commands: L1/L0 lamp, D1/D0 door, F1/F0 fan, A auto-fan mode, S status report. End each command with a newline.'],
    code: `//: Bölüm 42 - Akıllı Ev Prototipi || Chapter 42 - Smart Home Prototype
#include <SoftwareSerial.h>
#include <Servo.h>
#include <DHT.h>

SoftwareSerial bt(10, 11);     //: RX, TX
DHT dht(2, DHT11);
Servo door;

const int LAMP_RELAY = 7;
const int FAN_RELAY = 6;
const float FAN_ON_TEMP = 28.0;

bool lamp = false, fan = false, doorOpen = false, autoFan = true;
unsigned long lastCheck = 0;

void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);   //: Aktif-LOW röle || Active-LOW relay
}

void report() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  bt.print("Sicaklik: "); bt.print(t, 1);
  bt.print("C  Nem: %");  bt.println(h, 0);
  bt.print("Lamba: ");    bt.print(lamp ? "ACIK" : "KAPALI");
  bt.print("  Fan: ");    bt.print(fan ? "ACIK" : "KAPALI");
  bt.print(autoFan ? " (oto)" : "");
  bt.print("  Kapi: ");   bt.println(doorOpen ? "ACIK" : "KAPALI");
}

void handle(String cmd) {
  cmd.trim();
  cmd.toUpperCase();
  if (cmd == "L1") lamp = true;
  else if (cmd == "L0") lamp = false;
  else if (cmd == "F1") { fan = true;  autoFan = false; }
  else if (cmd == "F0") { fan = false; autoFan = false; }
  else if (cmd == "A")  autoFan = true;
  else if (cmd == "D1") doorOpen = true;
  else if (cmd == "D0") doorOpen = false;
  else if (cmd != "S") { bt.println("Bilinmeyen komut"); return; }

  setRelay(LAMP_RELAY, lamp);
  setRelay(FAN_RELAY, fan);
  door.write(doorOpen ? 90 : 0);
  report();
}

void setup() {
  digitalWrite(LAMP_RELAY, HIGH);
  digitalWrite(FAN_RELAY, HIGH);
  pinMode(LAMP_RELAY, OUTPUT);
  pinMode(FAN_RELAY, OUTPUT);
  door.attach(9);
  door.write(0);
  dht.begin();
  bt.begin(9600);
  bt.println("Akilli Ev hazir! Komutlar: L1 L0 D1 D0 F1 F0 A S");
}

void loop() {
  if (bt.available()) {
    handle(bt.readStringUntil('\\n'));
  }

  //: Otomatik fan: 5 sn'de bir kontrol || Auto fan: check every 5 s
  if (autoFan && millis() - lastCheck > 5000) {
    lastCheck = millis();
    float t = dht.readTemperature();
    if (!isnan(t)) {
      bool shouldRun = t > FAN_ON_TEMP;
      if (shouldRun != fan) {
        fan = shouldRun;
        setRelay(FAN_RELAY, fan);
        bt.println(fan ? "Oto: Fan acildi" : "Oto: Fan kapandi");
      }
    }
  }
}`
  }
);
