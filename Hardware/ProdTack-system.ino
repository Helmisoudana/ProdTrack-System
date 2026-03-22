#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <time.h>

// ----- WIFI -----
const char* ssid = "huawei nova 7i";
const char* password = "opbc4089";
const char* serverName = "http://192.168.43.82:5000/api/machine";
int machine_id = 1;

// ----- OLED -----
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// ----- RFID -----
#define SS_PIN 5
#define RST_PIN 4
MFRC522 mfrc522(SS_PIN, RST_PIN);

// ----- LEDS -----
#define LED_GREEN 27
#define LED_RED 14
#define LED_BLUE 26

// ----- BUZZER -----
#define BUZZER 25

// ----- Variables -----
unsigned long previousMillis = 0;
const long interval = 500;
bool ledState = false;

void setup() {
  Serial.begin(115200);

  // LEDs et buzzer
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  // WIFI
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  // RFID
  SPI.begin(18, 19, 23, 5);
  mfrc522.PCD_Init();

  // OLED
  Wire.begin(21, 22);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  display.setRotation(2);   // 🔄 ROTATION 180°

  display.clearDisplay();
  display.setTextColor(WHITE);

  // Message démarrage
  display.setTextSize(2);
  display.setCursor(10, 20);
  display.println("Ouverture");
  display.setCursor(10, 45);
  display.println("Systeme");
  display.display();
  delay(2000);
  display.clearDisplay();

  // Configuration NTP
  configTime(0, 0, "pool.ntp.org");
}

void loop() {
  afficherMessage("ProdTrack");

  // Clignotement LED bleu
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    ledState = !ledState;
    digitalWrite(LED_BLUE, ledState);
  }

  // Détection carte RFID
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      if (mfrc522.uid.uidByte[i] < 0x10) uid += "0";
      uid += String(mfrc522.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();

    tone(BUZZER, 2000, 150);
    afficherUID(uid);
    envoyerHTTP(uid);

    delay(3000);
  }
}

// ----- AFFICHER UID -----
void afficherUID(String uid) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 10);
  display.print("Carte detectee");
  display.setCursor(0, 30);
  display.print(uid);
  display.setCursor(0, 50);
  display.print("Envoi...");
  display.display();
}

// ----- ENVOI HTTP -----
void envoyerHTTP(String uid) {
  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["uid"] = uid;
    doc["machine_id"] = machine_id;

    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
      echec();
      return;
    }

    char timestamp[25];
    strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%S", &timeinfo);
    doc["timestamp"] = timestamp;

    String json;
    serializeJson(doc, json);

    int httpCode = http.POST(json);

    if (httpCode == 200) {
      succes();
    } else {
      echec();
    }

    http.end();
  } else {
    echec();
  }
}

// ----- SUCCESS -----
void succes() {
  digitalWrite(LED_GREEN, HIGH);
  tone(BUZZER, 2000, 500);
  afficherMessage("Succes");
  delay(1000);
  digitalWrite(LED_GREEN, LOW);
  display.clearDisplay();
}

// ----- ECHEC -----
void echec() {
  digitalWrite(LED_RED, HIGH);
  tone(BUZZER, 500, 1000);
  afficherMessage("Echec");
  delay(1500);
  digitalWrite(LED_RED, LOW);
  display.clearDisplay();
}

// ----- MESSAGE OLED -----
void afficherMessage(String msg) {
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(15, 25);
  display.print(msg);
  display.display();
}