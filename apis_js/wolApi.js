const fs = require('fs')
const {
    runCmd,
    textTruncate,
    sort
} = require("../apis_js/jstools.js");

class wolDevice {
    constructor(name, ip, mac, status) {
        this.name = name || "N/A";
        this.ip = ip;
        this.mac = mac;
        this.status = status || "null"
    }
}
async function updateStatus(waiting = false) {
    const path = './savedata/status.csv'
    var devices = [];
    scanToCSV();

    fc = (fs.readFileSync('./savedata/status.csv').toString().split('\n'));
    fc.shift();
    var table = document.getElementById("pcDevices");
    for (var i = table.rows.length - 1; i > -1; i--) {
        table.deleteRow(i);
    }
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
    $('#pcDevLoading').hide();
    $('#pcDevices').fadeIn();
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

        var table = document.getElementById("pcDevices");
        var tr = document.createElement("tr");
        var pc_name = document.createElement("td");
        var state = document.createElement("td");

        tr.appendChild(pc_name);

        tr.appendChild(state);
        table.appendChild(tr);

        pc_name.appendChild(document.createTextNode(textTruncate(wDevice.name)));
        state.appendChild(document.createTextNode(wDevice.status));
        tr.setAttribute("id", wDevice.ip);

        if (wDevice.status == "null" || waiting) {
            state.innerHTML = '<img src=' + "./assets/null.png" + '></img>'
        } else if (wDevice.status == "Off") {
            state.innerHTML = '<img src=' + "./assets/Off.png" + '></img>'
        } else if (wDevice.status == "On") {
            state.innerHTML = '<img src=' + "./assets/On.png" + '></img>'
        }
        tr.addEventListener('click', function() {
            alert(document.getElementById(this.id).children[1].innerHTML);
            document.getElementById(this.id).children[1].innerHTML = '<img src=' + "./assets/null.png" + '></img>'
             
       if (document.getElementById(this.id).children[1].innerHTML == '<img src=' + "./assets/Off.png" + '></img>') {
            state.innerHTML = '<img src=' + "./assets/Off.png" + '></img>'
            runCmd("./savedata/WakeMeOnLan.exe /wakeup " + this.id);

        } else if (document.getElementById(this.id).children[1].innerHTML == '<img src=' + "./assets/On.png" + '></img>') {
            state.innerHTML = '<img src=' + "./assets/On.png" + '></img>'
            runCmd('start ./savedata/psshutdown.exe \\\\' + this.id + ' -u Admin -p Aladdin1991!');

        }
    
        });

    }





}

function getWolDevices(array) {
    var wolDevices = [];
    for (i in array) {
        var mac = (array[i].split('Device_')[1].split(']')[0].toString().replace(',', '')).toString().trim();
        var name = (array[i].split('Name=')[1].toString().split('\n')[0]).toString().trim() || "N/A";
        var ip = (array[i].split('IPAddress=')[1].toString().split('\n')[0]).toString().trim();
        if (!ip == "") {
            wolDevices.push(new wolDevice(name, ip, mac));
        }
    }
    return devices.sort(function(a, b) {
        sort(a, b);
    });
}

async function scanToCSV() {
    runCmd("./savedata/WakeMeOnLan.exe /scan /scomma ./savedata/status.csv");
}

async function wakeUpAll() {
    runCmd("./savedata/WakeMeOnLan.exe /wakeupall");
}

async function shutdownAll() {
    var val = "";
    updateStatus(true).then(e => e.forEach(el => {
        if (!el.name.includes("N/A")) {
            runCmd('start ./savedata/psshutdown.exe \\\\' + el.name + ' -u Admin -p Aladdin1991!');
        }
    }));

}

function onOffButtonInit() {
    document.getElementById("pcOnAll").addEventListener("click", e => {
        wakeUpAll();
    });
    document.getElementById("pcOffAll").addEventListener("click", e => {
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
//put srttings gear on panel for config prefs and maybe to remove certain pcs by mac maybe make a ban file and add macs to it and scan the ban list on init have a Button to clear the ban list