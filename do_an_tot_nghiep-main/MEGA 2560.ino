#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>
#include <MFRC522.h>
#include <SoftwareSerial.h>
#include "DHT.h"   



#define rxPin 11
#define txPin 10

#define RST_PIN         38
#define SS_PIN          53



int pinRain = A1;       bool prehaverain; 
int pinCamBienAnhSang = A8;     int preanhsang = -1;
// int pinCamBienGas = A7;      int khigas; bool phathiengas = false;
int pinCoi = A4;
int ledphongkhach = A10;
int ledphongngu = A11;
int ledphongbep = A12;
 int but1 = A13;
int but2 = A14;
int but3 = A15;
int but4 = A5;
int pinQuat = A6;

int pinCambienNhietdoDoam = A2;    const int DHTTYPE = DHT21;  DHT dht(pinCambienNhietdoDoam, DHTTYPE); int nhietdo ; int doam ;int preT = 0; int preH = 0;

int UID[4], i;
MFRC522 mfrc522(SS_PIN, RST_PIN);

 
SoftwareSerial serial_MEGA =  SoftwareSerial(rxPin, txPin);String UARTreceive="";
String uidcard= "";
LiquidCrystal_I2C lcd(0x27, 16, 2); int ModeLcd = 0;int indexPW = 0;char PW[6] ;String matkhau;char key;bool IsLoginSuccess = false;int angle =0;
const byte ROWS  = 4;
const byte COLS = 4;
char hexaKeys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
byte rowPins[ROWS] = {9, 8, 7, 6};byte colPins[COLS] = {5, 4, 3, 2};Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);
bool troitoi = false;


int solansaimk = 0;



void refreshPW(void);
void SwitchMode(int tmp);
void xulyMode(void);
void Read_ESP(void);
void xulyUARTreceive(void);
void nhapPW(void);
void readCard(void);
void xulybattat();
void baochay();
void tatchay();
void toggleLED(int buttonPin, int ledPin);
void toggleQuat();

// -------------------------------------------------------------------------------SET UP-----------------------------------------------------------------------------------------------------------------
void setup() {
  

  Serial.begin(9600);
  Serial.println("da khoi dong");
  SPI.begin();    
  mfrc522.PCD_Init();
  lcd.begin(16,2);                    
  lcd.backlight(); 
  pinMode(pinCamBienAnhSang,INPUT);
  // pinMode(pinCamBienGas, INPUT);
  //pinMode(A2, INPUT);
  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);
  serial_MEGA.begin(9600);
  pinMode(pinCoi,OUTPUT);
  pinMode(ledphongkhach, OUTPUT);pinMode(ledphongngu, OUTPUT);pinMode(ledphongbep, OUTPUT);
  dht.begin(); 
  pinMode(pinRain,INPUT);
  pinMode(but1, INPUT_PULLUP); pinMode(but2, INPUT_PULLUP);pinMode(but3, INPUT_PULLUP);
  pinMode(but4, INPUT_PULLUP);pinMode(pinQuat, OUTPUT);
}


// -------------------------------------------------------------------------------LOOP-----------------------------------------------------------------------------------------------------------------

void loop() {

  
  
  key = customKeypad.getKey();
  xulyMode();
  


  // khigas = analogRead(pinCamBienGas);  
  //   if(khigas>700 && phathiengas == false){
  //     baochay();
  //     Serial.println("co chay");
  //     phathiengas = true;
  //     serial_MEGA.print("homename=sm1&rogas=true*");serial_MEGA.flush(); delay(100); 
      
  //   }
  //   if(khigas<=700 && phathiengas == true){
  //     tatchay();
  //     phathiengas = false;
  //     serial_MEGA.print("homename=sm1&rogas=false*");serial_MEGA.flush(); delay(100);

  //   }

    int anhsang = digitalRead(pinCamBienAnhSang);
    if(anhsang != preanhsang){
      preanhsang = anhsang;
      if(anhsang == 1){
          digitalWrite(ledphongkhach, 1);
          serial_MEGA.print("homename=sm1&ledphongkhach=bat*");serial_MEGA.flush();delay(1000);
          serial_MEGA.print("homename=sm1&light=false*");serial_MEGA.flush();
      }
      else{
          digitalWrite(ledphongkhach, 0);serial_MEGA.print("homename=sm1&ledphongkhach=tat*");serial_MEGA.flush();delay(1000);
          serial_MEGA.print("homename=sm1&light=true*");serial_MEGA.flush();

      }
    }


    toggleLED(but1, ledphongkhach,"ledphongkhach"); 
    toggleLED(but2, ledphongngu,"ledphongngu"); 
    toggleLED(but3,ledphongbep,"ledphongbep");
    toggleQuat();

      doam = dht.readHumidity();    
      nhietdo = dht.readTemperature(); 
      bool haverain = digitalRead(pinRain);
      
      if(nhietdo != preT || doam!= preH){
        serial_MEGA.print("homename=sm1&nhietdo=" + String(nhietdo) + "&doam=" + String(doam) +  "*");serial_MEGA.flush();  delay(100); preT = nhietdo;preH = doam;
      }


      if(haverain != prehaverain){
        Serial.println(haverain);
        serial_MEGA.print("homename=sm1&haverain=" + String(haverain) + "*");serial_MEGA.flush(); delay(100);  prehaverain = haverain;
      }
      
    if(IsLoginSuccess){
      Read_ESP();
    } 
      // Read_ESP();
  }
  
  

  
  
  





void xulyMode(){
  switch (ModeLcd) {
  // ======================================================================================================== home screen
  case 0:
    if(key && key == '#'){
      ModeLcd = 9;lcd.clear(); key = NULL;break;
    } 
    lcd.setCursor(0, 0);lcd.print("Hi, Tran Dung");
    lcd.setCursor(0, 1);lcd.print("Welcome, Home!");
    break;
  
  // ======================================================================================================== nhap password
  case 1:
    if(key && key == '*'){
      SwitchMode(0);break;
    }
    lcd.setCursor(0,0) ;lcd.print("Enter password:");
    nhapPW();
    serial_MEGA.print("homename=sm1&change0=1&password=" + matkhau +  "*");serial_MEGA.flush(); delay(500);// doi cho server phan hoi ve esp
    Read_ESP();
    refreshPW();
    SwitchMode(0);
    break;
  // ======================================================================================================== hien thi nhiet do
  case 2:
    if(key && key == '*'){SwitchMode(0);break;}
    lcd.setCursor(0,0);lcd.print("  Humidity:");
    lcd.setCursor(0,1);lcd.print(String(doam) + " %"); 
    break;    
    // ======================================================================================================== hien thi nhiet do
  case 3:
    if(key && key == '*'){SwitchMode(0);break;}
    lcd.setCursor(0,0);lcd.print("  Temperature:");
    lcd.setCursor(0,1);lcd.print(String(nhietdo) + " C"); 
    break;    
  // ======================================================================================================== doi mat khau
  case 10:
    if(key && key == '*'){SwitchMode(0);break;}
    lcd.setCursor(0,0);lcd.print("Change password:");
    nhapPW();
    serial_MEGA.print("homename=sm1&change1=1&password=" + matkhau + "*");serial_MEGA.flush();delay(500);
    Read_ESP();
    refreshPW();
    SwitchMode(0);
    break;
  // ======================================================================================================== cham rfid card
  case 11:
    if(key && key == '*'){SwitchMode(0);break;}
    lcd.setCursor(0,0);lcd.print("RFID Card: ");
    readCard();
    Read_ESP();
    break;  
  // ========================================================================================================  dang xuat va dong cua 
  case 12:
    lcd.setCursor(0,0);lcd.print("You locked");lcd.setCursor(0,1);lcd.print("the door!");IsLoginSuccess = false;delay(2000);
    serial_MEGA.print("homename=sm1&dooropen=false*");serial_MEGA.flush();delay(500);
    SwitchMode(0);
    break;
  case 13:
    lcd.setCursor(0,0);lcd.print("You opened");lcd.setCursor(0,1);lcd.print("the door!");delay(2000);
    serial_MEGA.print("homename=sm1&dooropen=true*");serial_MEGA.flush();delay(500);
    SwitchMode(0);
    break;
  // ========================================================================================================
  case 9:
    if(IsLoginSuccess==false){
      if(key && key == '1'){  // nhap password
      SwitchMode(1);break;
      } 
      if(key && key == '2'){  // cham rfid card
          SwitchMode(11);break;
      }
    }
    
    if(IsLoginSuccess){     
      if(key && key == '4'){  // hien thi doam
        SwitchMode(2);break;
      }
      if(key && key == '5'){
        SwitchMode(3);break;
      }
      if(key && key == '3'){  // doi mat khau
        SwitchMode(10);break;
      }
      if(key && key == 'A'){   // khoa cua
        SwitchMode(12);break;
      }
      if(key && key == 'B'){  // mo cua
        SwitchMode(13);break;
      }
    }
    lcd.setCursor(0,0);lcd.print("Select feature:");
    lcd.setCursor(0,1);lcd.print(" ");
    if(key && key=='*')  SwitchMode(0);
    
    break;


  // ========================================================================================================
  default:
    break;
  }
}
  // ========================================================================================================
void xulyUARTreceive(){

  xulybattat("ledphongkhach:tat", ledphongkhach, 0);
  xulybattat("ledphongkhach:bat", ledphongkhach, 1);
  xulybattat("ledphongngu:tat", ledphongngu, 0);
  xulybattat("ledphongngu:bat", ledphongngu, 1);
  xulybattat("ledphongbep:tat", ledphongbep, 0);
  xulybattat("ledphongbep:bat", ledphongbep, 1);
  xulybattat("quat:true",pinQuat,1);
  xulybattat("quat:false",pinQuat,0);

  if(UARTreceive.indexOf("rogas=true") >= 0){
    baochay();
  }
  if(UARTreceive.indexOf("rogas=false") >= 0){
    tatchay();
  }

  if (UARTreceive.indexOf("Mật khẩu chính xác") >= 0) {
    IsLoginSuccess = true;lcd.clear();lcd.setCursor(0,0);lcd.print("Your password");lcd.setCursor(0,1);lcd.print("is correct!");delay(2000);solansaimk = 0;
  }
  if(UARTreceive.indexOf("Mật khẩu sai rồi") >=0){
    lcd.clear();lcd.setCursor(0,0);lcd.print("Your password");lcd.setCursor(0,1);lcd.print("is incorrect!");delay(2000); solansaimk++;
     
    if(solansaimk>=3){
      long tmp = solansaimk-2;
      tmp *= 30000;
      lcd.clear();lcd.setCursor(0,0);lcd.print("Wait " + String(tmp/1000) +   "s before");lcd.setCursor(0,1);lcd.print("trying again!");Serial.print(tmp);delay(tmp); 
    }
  }
  if(UARTreceive.indexOf("Thẻ chính xác") >= 0){
    IsLoginSuccess = true;lcd.clear();lcd.setCursor(0,0);lcd.print("Your card");lcd.setCursor(0,1);lcd.print("is accepted!");delay(2000);SwitchMode(0);
  }
  if(UARTreceive.indexOf("Thẻ sai rồi") >= 0){
    lcd.clear();lcd.setCursor(0,0);lcd.print("Your card");lcd.setCursor(0,1);lcd.print("is not accepted!");delay(2000);SwitchMode(0);
  }
  if(UARTreceive.indexOf("Mật khẩu đã đổi") >= 0){
    lcd.clear();lcd.setCursor(0,0);lcd.print("Change password");lcd.setCursor(0,1);lcd.print("successfully!");delay(2000);SwitchMode(0);
  }
  
}


void xulybattat( String command, int pin, bool state) {
  if (UARTreceive.indexOf(command) >= 0) {
    digitalWrite(pin, state);
  }
}

void toggleLED(int buttonPin, int ledPin ,String tmp) {
  if (digitalRead(buttonPin) == LOW) {
    while (digitalRead(buttonPin) == LOW); 
    digitalWrite(ledPin, !digitalRead(ledPin)); 
    if(digitalRead(ledPin) == 0){
      serial_MEGA.print("homename=sm1&" + tmp + "=tat*"   );serial_MEGA.flush();
    }
    else{
      serial_MEGA.print("homename=sm1&" + tmp + "=bat*"   );serial_MEGA.flush();
    }
  }
}

void toggleQuat(){
  if(digitalRead(but4)==LOW){
    while (digitalRead(but4)==LOW) ;
      digitalWrite(pinQuat,!digitalRead(pinQuat));
      if(digitalRead(pinQuat)==0){
        serial_MEGA.print("homename=sm1&quat=false*");serial_MEGA.flush();
      }
      else{
        serial_MEGA.print("homename=sm1&quat=true*");serial_MEGA.flush();

      }
    
  }
}


void Read_ESP(){
  while(serial_MEGA.available()){
    char inchar = (char)serial_MEGA.read();
    if(inchar != '*'){
       UARTreceive+= inchar;
    }
    else{
      Serial.print("uart = ");
      Serial.println(UARTreceive);
      xulyUARTreceive();
      UARTreceive = "";         
      break;
    }
  }
}
  // ========================================================================================================

void refreshPW(){
  indexPW = 0 ; memset(PW, 0, sizeof(PW));
}
void SwitchMode(int tmp){
  ModeLcd = tmp;lcd.clear(); key = NULL;
}



void nhapPW(){

  while(indexPW<5){
      key = customKeypad.getKey();

      if(key){
        if(key=='#'){
          SwitchMode(0);break;
        }
        lcd.setCursor(indexPW,1);lcd.print(key);delay(200);lcd.setCursor(indexPW,1);lcd.print('*'); PW[indexPW] = key; indexPW++;
      }
    }
    PW[indexPW] = '\0';
    matkhau = PW ;Serial.println("matkhau :" + matkhau);
}
void readCard(){
  if (! mfrc522.PICC_IsNewCardPresent()) { 
    return; 
  }
  if (! mfrc522.PICC_ReadCardSerial()){  
    return;  
  } 
  for (byte i = 0; i < mfrc522.uid.size; i++) {   
    UID[i] = mfrc522.uid.uidByte[i];
    uidcard+=String(UID[i]); 
  }
  Serial.println("uidcard=" + uidcard);
  serial_MEGA.print("homename=sm1&idcard=" + uidcard + "*");serial_MEGA.flush();delay(500);
  uidcard="";
  mfrc522.PICC_HaltA();  
  mfrc522.PCD_StopCrypto1(); 
}
void baochay(){
  digitalWrite(pinCoi,1);
}

void tatchay(){
  digitalWrite(pinCoi, 0);
}
