#include <SoftwareSerial.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <Servo.h>

const char* ssid = "Luftmensch";        // Tên mạng WiFi
const char* password = "9876123456";    // Mật khẩu WiFi
#define rxPin D7
#define txPin D8
AsyncWebServer server(80);

#define pinServo D2
#define pinGas D1

bool phathiengas = false;


Servo servo;

SoftwareSerial serial_ESP(rxPin,txPin);//rx tx
void Read_Uno(void);
void SendRequest(void);
void xulyResponse(void);
String dataSEND = "";
String response = "";

void handleRoot(AsyncWebServerRequest *request) ;


void MoCua(void);
void DongCua(void);
void xulyDK();

int angle;
String t1;

void setup() {
   servo.attach(pinServo);
    servo.write(120);
  pinMode(rxPin,INPUT);
  pinMode(txPin,OUTPUT);
  pinMode(pinGas,INPUT);
  Serial.begin(115200);
  serial_ESP.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());



  server.on("/", HTTP_POST, handleRoot);
  server.begin();
  Serial.println("ok server esp");

  serial_ESP.print("ESP da khoi dong!");serial_ESP.flush();
}




void loop() {



     int khigas = analogRead(pinGas);  
    if(khigas>700 && phathiengas == false){
      dataSEND = "homename=sm1&rogas=true";
      phathiengas = true;SendRequest();xulyResponse();serial_ESP.print(dataSEND+"*");serial_ESP.flush();
      dataSEND = "";response = "";

      
    }
    if(khigas<=700 && phathiengas == true){

      phathiengas = false;
      dataSEND = "homename=sm1&rogas=false";
      SendRequest();xulyResponse();serial_ESP.print(dataSEND+"*");serial_ESP.flush();dataSEND = "";response = "";
    }



      if(t1.indexOf("dooropen:true") >= 0  ){
        MoCua(); t1 = "";
      }
      if(t1.indexOf("dooropen:false") >= 0){
        DongCua(); t1 = "";
      }
    // servo.write(k);
      
      Read_Uno();

}


void SendRequest(void){
  if(WiFi.status() == WL_CONNECTED){
    WiFiClient client;
    HTTPClient http;
    if (http.begin(client, "http://192.168.10.25:5000/SmartHome")) {  // Địa chỉ của server và endpoint nhận yêu cầu POST
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      
      int httpResponseCode = http.POST(dataSEND);
      if (httpResponseCode > 0) {
        response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end();
    }
  }
}



void Read_Uno(){
  while(serial_ESP.available()){
    char inchar = (char)serial_ESP.read();
    if(inchar != '*'){
      dataSEND += inchar;
    }
    else{
      Serial.print("data la :");
      Serial.println(dataSEND);
      xulyDK();
      SendRequest();xulyResponse();
      dataSEND = "";response = "";
      break;
    }
  }
}
void xulyDK(){
  if(dataSEND.indexOf("dooropen=true")>=0){
    MoCua();
  }
  if(dataSEND.indexOf("dooropen=false")>=0){
    DongCua();
  }
}
void MoCua(){
  
      for(angle = 120; angle > 0; angle--)
  {
  servo.write(angle);
  delay(10);
  }
}
void DongCua(){
  
  for(angle = 0; angle < 120; angle++)
  {
  servo.write(angle);
  delay(10);
  }


}
void xulyResponse(){
  serial_ESP.print(response+"*");
  serial_ESP.flush();

}
void handleRoot(AsyncWebServerRequest *request) {
  int paramCount = request->params();
  
for (int i = 0; i < paramCount; i++) {
  
  String paramValue = request->getParam(i)->value();
  String paramName = request->getParam(i)->name();
  

  Serial.println(paramName + ":" + paramValue);

  String tmp = paramName + ":" + paramValue + "*";

  t1 = tmp;

  serial_ESP.print(tmp);
  
  serial_ESP.flush(); 
 

  // if (paramValue.equals("batden")) {
  //   digitalWrite(2, HIGH);
  // } else if (paramValue.equals("tatden")) {
  //   digitalWrite(2, LOW);
  // }
  } 
  request->send(200, "text/plain", "Hello from ESP!");
  
}
