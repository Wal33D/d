const fs = require('fs');
const CloudTuya = require('../apis_js/tuya/cloudtuya');
const Light = require('../apis_js/tuya/light');
const img_on = "<img src='data:image/png;base64,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'>";
const img_off = "<img src='data:image/png;base64,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'>";
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
            state = false;
        }
    } else {
        thisSwitch.turnOff();
        for (var i = 0, row; row = table.rows[i]; i++) {
            row.cells[1].innerHTML = img_off;
            state = true;

        }
    }
}

function onOffButtonInit(data) {
    function waitUser() {
        var buttonRow = document.getElementById("tuyaButtonRow");
        var devicePane = document.getElementById("tuyaDevices");
        $("#tuyaButtonRow :input").prop("disabled", true);
        $("#tuyaDevices :input").prop("disabled", true);

        devicePane.disabled = true;
        devicePane.style.opacity = "0.3";
        buttonRow.disabled = true;
        buttonRow.style.background = "grey";
        buttonRow.style.opacity = "0.3";
        setTimeout(function() {
            $("#tuyaButtonRow :input").prop("disabled", false);
            $("#tuyaDevices :input").prop("disabled", false);
            devicePane.disabled = false;
            devicePane.style.opacity = "1";
            buttonRow.disabled = false;
            buttonRow.style.background = "none";
            buttonRow.style.opacity = "1";
        }, 2000);
    }

    data[0].forEach(element => createElement(element, data[1], data[2]))
    document.getElementById("tuyaOnAll").addEventListener("click", e => {
        data[0].forEach(element => toggleSwitch(element.id, data[1], data[2], true));
        waitUser()
    });
    document.getElementById("tuyaOffAll").addEventListener("click", e => {
        data[0].forEach(element => toggleSwitch(element.id, data[1], data[2], false));
        waitUser()
    });
}

function getStateImg(device) {
    var state = device.data.state
    if (state == true) return img_on;
    return img_off;
}

function createElement(device, token, api) {
    var state = device.data.state
    var table = document.getElementById("tuyaDevices");
    var tr = document.createElement("tr");
    var name = document.createElement("td");
    var status = document.createElement("td");
    var thisSwitch = createTuyaDevice(device.id, api)

    tr.appendChild(name);
    tr.appendChild(status);
    table.appendChild(tr);

    name.appendChild(document.createTextNode(textTruncate(device.name)));
    status.appendChild(document.createTextNode(" "));
    status.innerHTML = img_off;
    if (state == true) status.innerHTML = img_on;

    tr.addEventListener('click', function() {
        if (state == true) {
            thisSwitch.turnOff();
            status.innerHTML = img_off;
            state = false;
        } else {
            thisSwitch.turnOn();
            status.innerHTML = img_on;
            state = true
        }
    });
}

function createTuyaDevice(id, api) {
    return new Light({
        api: api,
        deviceId: id
    });
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
        for (var i = table.rows.length - 1; i > -1; i--) {
            table.deleteRow(i);
        }
        devices.forEach(element => createElement(element, token, api))
    }

}