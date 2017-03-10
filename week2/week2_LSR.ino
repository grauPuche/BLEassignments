#include <CurieBLE.h>

#define sensorPin A0
//int sensorValue = 0;


BLEPeripheral blePeripheral;
BLEService lightSensorService = BLEService("BBB0");
BLEFloatCharacteristic lightCharacteristic = BLEFloatCharacteristic("BBB1", BLERead | BLENotify);
BLEDescriptor lightDescriptor = BLEDescriptor("2901", "Light value");

unsigned long previousMillis = 0;
unsigned short interval = 2000;

void setup() {
  Serial.begin(9600);

  Serial.println(F("BLE Light sensor"));

  blePeripheral.setLocalName("_Light Sensor");
  blePeripheral.setDeviceName("_Light Sensor");
  blePeripheral.setAdvertisedServiceUuid(lightSensorService.uuid());

  blePeripheral.addAttribute(lightSensorService);
  blePeripheral.addAttribute(lightCharacteristic);
  blePeripheral.addAttribute(lightDescriptor);

  blePeripheral.begin();
}


void loop() {
  //  sensorValue = analogRead(sensorPin);
  //  Serial.println(sensorValue);

  blePeripheral.poll();

  if (millis() - previousMillis > interval) {
    pollLightSensor();
    previousMillis = millis();
  }
}

void pollLightSensor() {
  float light = calculateLight();

  if (lightCharacteristic.value() != light) {
    lightCharacteristic.setValue(light);
    Serial.println(light);
  }
}

float calculateLight() {
  int sensorValue = analogRead(sensorPin);

  float voltage = sensorValue / 1024.0;

  float light = voltage * 100;

  return light;
}
