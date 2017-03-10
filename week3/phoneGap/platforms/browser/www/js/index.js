var POT_SERVICE = 'BBB0';
var POTVALUE_CHARACTERISTIC = 'BBB1';

var app = {
    initialize: function() {
        this.bindEvents();
        this.showMainPage();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', this.onBackButton, false);
        deviceList.addEventListener('click', this.connect, false);
        refreshButton.addEventListener('click', this.refreshDeviceList, false);
        disconnectButton.addEventListener('click', this.disconnect, false);
    },
    onDeviceReady: function() {
        FastClick.attach(document.body); // https://github.com/ftlabs/fastclick
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empty the list
        ble.scan([POT_SERVICE], 5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {
        var listItem = document.createElement('li');
        listItem.innerHTML = device.name + '<br/>' +
            device.id + '<br/>' +
            'RSSI: ' + device.rssi;
        listItem.dataset.deviceId = device.id;
        deviceList.appendChild(listItem);
    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId;
        ble.connect(deviceId, app.onConnect, app.onError);
    },
    onConnect: function(peripheral) {
        app.peripheral = peripheral;
        app.showDetailPage();

        var failure = function(reason) {
            navigator.notification.alert(reason, null, 'POTVALUE Error');
        };

        // subscribe to be notified when the PotValue changes
        ble.startNotification(
            peripheral.id,
            POT_SERVICE,
            POTVALUE_CHARACTERISTIC,
            app.onPotValueChange,
            failure
        );

        // read the initial value
        ble.read(
            peripheral.id,
            POT_SERVICE,
            POTVALUE_CHARACTERISTIC,
            app.onPotValueChange,
            failure
        );

    },
    onPotValueChange: function(buffer) {
        var data = new Float32Array(buffer);
        var mover = data[0];
        statusDiv.innerHTML = "<img src='img.png' style='margin-top:" + mover + "px;'>";
    },
    disconnect: function(e) {
        if (app.peripheral && app.peripheral.id) {
            ble.disconnect(app.peripheral.id, app.showMainPage, app.onError);
        }
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onBackButton: function() {
        if (mainPage.hidden) {
            app.disconnect();
        } else {
            navigator.app.exitApp();
        }
    },
    onError: function(reason) {
        navigator.notification.alert(reason, app.showMainPage, 'Error');
    }
};

app.initialize();
