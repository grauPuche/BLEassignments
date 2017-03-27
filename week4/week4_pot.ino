#include <CurieBLE.h>

#define potPin A0
//int potValue = 0;


BLEPeripheral blePeripheral;
BLEService potService = BLEService("BBB0");
BLEFloatCharacteristic potCharacteristic = BLEFloatCharacteristic("BBB1", BLERead | BLENotify);
BLEDescriptor potDescriptor = BLEDescriptor("2901", "pot value");

unsigned long previousMillis = 0;
unsigned short interval = 50;

void setup() {
  Serial.begin(9600);

  Serial.println(F("BLE Potentiometer"));

  blePeripheral.setLocalName("_Potentiometer");
  blePeripheral.setDeviceName("_Potentiometer");
  blePeripheral.setAdvertisedServiceUuid(potService.uuid());

  blePeripheral.addAttribute(potService);
  blePeripheral.addAttribute(potCharacteristic);
  blePeripheral.addAttribute(potDescriptor);

  blePeripheral.begin();
}


void loop() {
  //  potValue = analogRead(potPin);
  //  Serial.println(potValue);

  blePeripheral.poll();

  if (millis() - previousMillis > interval) {
    pollPot();
    previousMillis = millis();
  }
}

void pollPot() {
  float pot = calculatePot();

  if (potCharacteristic.value() != pot) {
    potCharacteristic.setValue(pot);
    Serial.println(pot);
  }
}

float calculatePot() {
  int potValue = analogRead(potPin);

  float voltage = potValue / 1024.0;

  float pot = voltage * 100;

  return pot;
}
