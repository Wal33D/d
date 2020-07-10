const fs = require('fs')
const {
    runCmd,
    textTruncate,
    sort
} = require("../apis_js/jstools.js");
const img_off = "<img alt='off' src='data:image/png;base64,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'>";
const img_on = "<img alt='on' src='data:image/png;base64,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'>";
const img_waiting = "<img alt='waiting' src='data:image/png;base64,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'>";
const status_csv_path = './savedata/status.csv';
const wol_path = "./savedata/WakeMeOnLan.exe"
const psshutdown_path = "./savedata/psshutdown.exe"
const device_table_id = "pcDevices";
const power_on_id = "pcOnAll"
const power_off_id = "pcOffAll"
const power_button_row = "pcButtonRow"
const psexec_creds = " -u Admin -p Aladdin1991!"

class wolDevice {
    constructor(name, ip, mac, status) {
        this.name = name || "N/A";
        this.ip = ip;
        this.mac = mac;
        this.status = status || "waiting"
    }
}

function waitUser(state) {
    var opacity = "0.3"
    var background = "grey"
    if (!state) opacity = 1;
    if (!state) background = "none";

    var buttonRow = document.getElementById(power_button_row);
    var devicePane = document.getElementById(device_table_id);
    $("#pcButtonRow :input").prop("disabled", state);
    $("#pcDevices :input").prop("disabled", state);

    devicePane.disabled = state;
    buttonRow.disabled = state;
    devicePane.style.opacity = opacity;
    buttonRow.style.opacity = opacity;
    buttonRow.style.background = background;
}

async function updateStatus(waiting = false) {
    await scanToCSV();
    var devices = [];
    var fc = importFromCSV();
    wipeDeviceTable();

    try {
        for (i in fc) {
            ip = fc[i].split(',')[0]
            name = fc[i].split(',')[1]
            mac = fc[i].split(',')[2]
            if (fc[i].split(',')[5].match("Off") || fc[i].split(',')[5].match("On")) {
                status = fc[i].split(',')[5];
            } else {
                status = fc[i].split(',')[6];
            }
            devices.push(new wolDevice(name, ip, mac, status));
        }
    } catch (e) {}
    setDeviceStatus(devices, waiting);

    return devices;
}

async function setDeviceStatus(devices, waiting = false) {
    devices.sort(function(a, b) {
        sort(a, b);
    });
    for (i in devices) {
        var wDevice = devices[i];
        //if device has no name lets assume for now its not relevant to the pc wol pane
        if (wDevice.name == "N/A") continue;

        var table = document.getElementById(device_table_id);
        var tr = document.createElement("tr");
        var pc_name = document.createElement("td");
        var state = document.createElement("td");

        tr.appendChild(pc_name);
        tr.appendChild(state);
        table.appendChild(tr);

        pc_name.appendChild(document.createTextNode(textTruncate(wDevice.name)));
        state.appendChild(document.createTextNode(wDevice.status));
        tr.setAttribute("id", wDevice.ip);

        if (wDevice.status == "waiting" || waiting) {
            state.innerHTML = img_waiting
        } else if (wDevice.status == "Off") {
            state.innerHTML = img_off
        } else if (wDevice.status == "On") {
            state.innerHTML = img_on
        }

        tr.addEventListener('click', function() {
            if (document.getElementById(this.id).children[1].innerHTML.includes('off')) {
                alert(wol_path + " /wakeup " + this.id);
            } else if (document.getElementById(this.id).children[1].innerHTML.includes('on')) {
                alert('start ' + psshutdown_path + ' \\\\' + this.id + psexec_creds);
            }
            document.getElementById(this.id).children[1].innerHTML = img_waiting
        });
    }
    $('#pcDevLoading').hide();
    $('#pcDevices').fadeIn();
}

async function scanToCSV() {
    runCmd(wol_path + " /scan /scomma ./savedata/status.csv");
}

async function setDevicesToWaiting() {
    var table = document.getElementById(device_table_id);
    for (var i = table.rows.length - 1; i > -1; i--) table.rows.item(i).children[1].innerHTML = img_waiting;
    return await scanToCSV();
}

async function wakeUpAll() {
    runCmd(wol_path + " /wakeupall");
    setDevicesToWaiting();
}

async function shutdownAll() {
    var table = document.getElementById(device_table_id);
    for (var i = table.rows.length - 1; i > -1; i--) runCmd('start ' + psshutdown_path + ' \\\\' + table.rows.item(i).id + psexec_creds);
    setDevicesToWaiting();
}

function wipeDeviceTable() {
    var table = document.getElementById(device_table_id);
    for (var i = table.rows.length - 1; i > -1; i--) {
        table.deleteRow(i);
    }
}

function importFromCSV() {
    fc = (fs.readFileSync(status_csv_path).toString().split('\n'));
    fc.shift();
    return fc;
}

function onOffButtonInit() {
    document.getElementById(power_on_id).addEventListener("click", e => {
        waitUser(true);
        setTimeout(function() {
            waitUser(false);
        }, 35000);
        wakeUpAll();
    });
    document.getElementById(power_off_id).addEventListener("click", e => {
        waitUser(true);
        setTimeout(function() {
            waitUser(false);
        }, 35000);
        shutdownAll();
    });
}

async function init() {
    await updateStatus();
    onOffButtonInit();
}

module.exports = {
    init,
    updateStatus
};