#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP085.h>
#include <SPI.h>
#include "LittleFS.h"

Adafruit_BMP085 tSens;


// Replace with your network credentials
const char* ssid = "your_network";
const char* password = "pass";

const char* PARAM_INPUT_1 = "output";
const char* PARAM_INPUT_2 = "state";
const char* PARAM_INPUT_5 = "LED1";
const char* PARAM_INPUT_6 = "LED2";

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

//bmp180 temperature
int getTemp(){
  return tSens.readTemperature();
}

void setLEDPower(int stripNum, int levelPWM){
  analogWrite(stripNum, levelPWM);
}

void setup(){
  // Serial port for debugging purposes
  Serial.begin(9600);
  
  if (!tSens.begin()) {
    Serial.println("Could not find a valid BMP185 sensor, check wiring!");
    while (1) {}
  }

  if(!LittleFS.begin()){
    Serial.println("An Error has occurred while mounting LittleFS");
    return;
  }

  pinMode(14, OUTPUT);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println(".");
  }

  // Print ESP8266 Local IP Address
  Serial.println(WiFi.localIP());

  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(LittleFS, "/index.html", String(), false);
  });

  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(LittleFS, "/style.css", "text/css");
  });

  server.on("/main.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(LittleFS, "/main.js");
  });

  //тут запрос с датчика температуры/давления
  server.on("/temperature", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", String(getTemp()).c_str());
  });

  //этим можно вкл/выкл пины, можно, но зачем? (позже удалить)
  server.on("/update", HTTP_GET, [] (AsyncWebServerRequest *request) {
    String inputMessage1;
    String inputMessage2;
    // GET input1 value on <ESP_IP>/update?output=<inputMessage1>&state=<inputMessage2>
    if (request->hasParam(PARAM_INPUT_1) && request->hasParam(PARAM_INPUT_2)) {
      inputMessage1 = request->getParam(PARAM_INPUT_1)->value();
      inputMessage2 = request->getParam(PARAM_INPUT_2)->value();
      digitalWrite(inputMessage1.toInt(), inputMessage2.toInt());
    }
    else {
      inputMessage1 = "No message sent";
      inputMessage2 = "No message sent";
    }
    Serial.print("GPIO: ");
    Serial.print(inputMessage1);
    Serial.print(" - Set to: ");
    Serial.println(inputMessage2);
    request->send(200, "text/plain", "OK");
  });

  //тут обработка запросов для лент и кулера
  server.on("/pwm",HTTP_GET, [] (AsyncWebServerRequest *request) {
    String msg1;
    String msg2;
    String oneLED;

    //лента 1
    if(request->hasParam(PARAM_INPUT_5)){
      oneLED = request->getParam(PARAM_INPUT_5)->value();
      setLEDPower(12, oneLED.toInt());
      request->send(200, "text/plain", "OK");
    };

    //лента 2
    if(request->hasParam(PARAM_INPUT_6)){
      oneLED = request->getParam(PARAM_INPUT_6)->value();
      setLEDPower(13, oneLED.toInt());
      request->send(200, "text/plain", "OK");
    };
  });

  // Start server
  server.begin();
  
  digitalWrite(14,HIGH);
}

void loop(){
  
}