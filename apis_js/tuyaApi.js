const fs = require('fs');
const CloudTuya = require('../apis_js/tuya/cloudtuya');
const Light = require('../apis_js/tuya/light');
const img_on = '<img src=' + "./assets/on.png" + '></img>'
const img_off = '<img src=' + "./assets/off.png" + '></img>'
const img_switch = '<img src=' + "./assets/light_switch.png" + '></img>';
let apiKeys = require('../credentials/tuyaKeys.json');
let deviceData = require('../savedata/tuyaDevices.json');
const api = new CloudTuya({
    userName: apiKeys.userName,
    password: apiKeys.password,
    bizType: apiKeys.bizType,
    countryCode: apiKeys.countryCode,
    region: apiKeys.region,
});
const {
    textTruncate,
    sort
} = require("./jstools.js");

function toggleSwitch(deviceId, tokens, api, state) {
    var table = document.getElementById("tuyaDevices");
    var thisSwitch = new Light({
        api: api,
        deviceId: deviceId
    });
    if (state == true) {
        thisSwitch.turnOn();
        for (var i = 0, row; row = table.rows[i]; i++) {
            row.cells[1].innerHTML = img_on;
            state = "false";
        }
    } else {
        thisSwitch.turnOff();
        for (var i = 0, row; row = table.rows[i]; i++) {
            row.cells[1].innerHTML = img_off;
            state = "true";
        }
    }
}

function onOffButtonInit(data) {
    data[0].forEach(element => createElement(element, data[1], data[2]))
    document.getElementById("tuyaOnAll").addEventListener("click", e => {
        data[0].forEach(element => toggleSwitch(element.id, data[1], data[2], true));
    });
    document.getElementById("tuyaOffAll").addEventListener("click", e => {
        data[0].forEach(element => toggleSwitch(element.id, data[1], data[2], false));
    });
}

function createElement(device, token, api) {
    var state = JSON.stringify(device.data.state)
    var table = document.getElementById("tuyaDevices");
    var tr = document.createElement("tr");
    var name = document.createElement("td");
    var status = document.createElement("td");

    tr.appendChild(name);
    tr.appendChild(status);
    table.appendChild(tr);

    name.appendChild(document.createTextNode(textTruncate(device.name)));
    status.appendChild(document.createTextNode(state));
    if (state === "true") {
        status.innerHTML = img_on;
    } else {
        status.innerHTML = img_off;
    }

    tr.addEventListener('click', function() {
        var thisSwitch = new Light({
            api: api,
            deviceId: device.id
        });
        if (state === "true") {
            thisSwitch.turnOff();
            status.innerHTML = img_off;
            state = "false";
        } else {
            thisSwitch.turnOn();
            status.innerHTML = img_on;
            state = "true"
        }
    });
    return table;
}

async function init() {
    const tokens = await api.login();
    let devices = await api.find();
    devices.sort(function(a, b) {
        sort(a, b);
    });
    return [devices, tokens, api];
}

module.exports = {
    init: async function() {
        await init().then(data => onOffButtonInit(data));
        $('#tuyaDevLoading').hide();
        $('#tuyaDevices').fadeIn();
    },
    updateStatus: async function() {
        const token = await api.login();
        let devices = await api.find();
        devices.sort(function(a, b) {
            sort(a, b);
        });
        var table = document.getElementById("tuyaDevices");
        for (var i = table.rows.length-1; i > -1; i--) {
            table.deleteRow(i);
        }
       devices.forEach(element => createElement(element, token, api))
    }

}