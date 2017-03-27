var noble = require('noble');

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning(['bbb0', 'B6FD7210-32D4-4427-ACA7-99DF89E10380']);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function (peripheral) {
  console.log('Discovered', peripheral.advertisement.localName, peripheral.address);
  connectAndSetUp(peripheral);
});

function connectAndSetUp(peripheral) {
  peripheral.connect(function (error) {
    var serviceUUIDs = ['bbb0'];
    var characteristicUUIDs = ['bbb1'];
    peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
  });
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
  var potCharacteristic = characteristics[0];
  potCharacteristic.on('data', function (data, isNotification) {
    var potData = data.readFloatLE(0);
    console.log('pot value is', potData.toFixed(1));
  });

  potCharacteristic.subscribe(); // ignore callback
  potCharacteristic.read();      // ignore callback
}

