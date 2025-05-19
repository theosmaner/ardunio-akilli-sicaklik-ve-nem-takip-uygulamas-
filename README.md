Kullanılan Malzemeler:

Arduino Uno

DHT11 Sıcaklık ve Nem Sensörü

16x2 LCD Ekran (I2C modülü ile)

Buzzer

Breadboard ve jumper kablolar

Bu proje bir DHT11 sensörü ile ortam sıcaklığı ve nemi ölçer, 
verileri bir LCD ekrana yazdırır ve sıcaklık belirli bir eşik değeri geçerse buzzer ile uyarı verir.

Devre Şeması Açıklaması

DHT11 Sensörü:

VCC → Arduino 5V

GND → Arduino GND

DATA → Arduino pin 2

LCD 16x2 (I2C Modül):

VCC → Arduino 5V

GND → Arduino GND

SDA → Arduino A4

SCL → Arduino A5
