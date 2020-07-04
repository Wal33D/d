const {
    runCmd,
    textTruncate
} = require("../apis_js/jstools.js");
module.exports = {
    init: async function() {
        const fs = require('fs')
        const path = './savedata/WakeMeOnLan.cfg'
        try {
            if (fs.existsSync(path)) {
                $('#pcDevLoading').hide();
                await init().then($('#pcDevices').fadeIn() && $('#pcDevLoading').hide());
            } else {
                // show waiting
                $('#pcDevLoading').fadeIn();
                require('node-run-cmd').run('./savedata/WakeMeOnLan.exe /scan');
                setTimeout(function() {
                    init();
                    $('#pcDevLoading').hide();
                    $('#pcDevices').fadeIn();
                }, 10000);
            }
        } catch (err) {}
        //ask wol to produce csv file containing current status 
        scanToCSV();
    },
    updateStatus: async function() {
        const fs = require('fs')
        const path = './savedata/status.csv'
        var devices = [];
        var fc = "";
        var ip = "";
        var name = "";
        var mac = "";
        var status = "";
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

        realSetDevices(devices);
    }
}

class wolDevice {
    constructor(name, ip, mac, status) {
        this.name = name || "N/A";
        this.ip = ip;
        this.mac = mac;
        this.status = status || "null"
    }
}


async function realSetDevices(devices) {

    devices.sort((a, b) => {
        const num1 = Number(a.ip.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
        const num2 = Number(b.ip.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
        return num1 - num2;
    });
    for (i in devices) {
        var wDevice = devices[i];
        //if device has no name lets assume for now its not relevant to the pc wol pane
        if (wDevice.name == "N/A") {
            continue;
        }
        var table = document.getElementById("pcDevices");
        var tr = document.createElement("tr");
        var pc_name = document.createElement("td");
        var pc_ip = document.createElement("td");
        var state = document.createElement("td");

        tr.appendChild(pc_name);
        tr.appendChild(pc_ip);
        tr.appendChild(state);
        table.appendChild(tr);

        pc_name.appendChild(document.createTextNode(textTruncate(wDevice.name)));
        //  pc_ip.appendChild(document.createTextNode(wDevice.ip));
        state.appendChild(document.createTextNode(wDevice.status));

          if(wDevice.status=="null"){state.innerHTML = '<img src=' + "./assets/null.png" + '></img>' }
               if(wDevice.status=="Off"){ state.innerHTML = '<img src=' + "./assets/Off.png" + '></img>'} 
          if(wDevice.status=="On"){ state.innerHTML = '<img src=' + "./assets/On.png" + '></img>'}

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
    return wolDevices;
}

async function scanNetwork() {
    var child = require('child_process').execFile;
    var executablePath = "./savedata/WakeMeOnLan.exe";
    var parameters = ["/scan"];

    child(executablePath, parameters, function(err, data) {
        console.log(err)
        console.log(data.toString());
    });
}

async function scanToCSV() {
    runCmd("./savedata/WakeMeOnLan.exe /scan /scomma ./savedata/status.csv");
}

async function wakeUpAll() {
    runCmd("./savedata/WakeMeOnLan.exe /wakeupall");
    alert("powered on");
}

function onOffButtonInit() {
    document.getElementById("pcOnAll").addEventListener("click", e => {
        wakeUpAll();
    });
    document.getElementById("pcOffAll").addEventListener("click", e => {});
}

async function init() {
    await scanNetwork().then(setDevices());
    onOffButtonInit();
}

async function setDevices() {
    var fs = require('fs');
    var arr = [];
    var fc = await fs.readFileSync('./savedata/WakeMeOnLan.cfg').toString();
    //Merge Arrays around seeminlgy randomly placed config info 
    if (fc.includes("[General]")) {
        var p1p = fc.split("[General]")[0].split('[');
        var p2p = fc.split("[General]")[1].split('[');
        //Merge Arrays around seeminlgy randomly placed config info 
        for (var i = 1; i < p1p.length; i++) {
            arr.push(p1p[i])
        }
        for (var i = 1; i < p2p.length; i++) {
            arr.push(p2p[i])
        }
    } else {
        var f = fc.split('[')
        f.shift()
        f.forEach(e => arr.push(e))
    }

    //gotta wait here make this async or when u clean it up youll get a weird valye from the file 
    //yeah make seperate method for file load use then or await when u call it from this method or pass it into this method
    var devices = getWolDevices(arr);

    devices.sort((a, b) => {
        const num1 = Number(a.ip.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
        const num2 = Number(b.ip.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
        return num1 - num2;
    });

    for (i in devices) {
        var wDevice = devices[i];
        //if device has no name lets assume for now its not relevant to the pc wol pane
        if (wDevice.name == "N/A") {
            continue;
        }
        var table = document.getElementById("pcDevices");
        var tr = document.createElement("tr");
        var pc_name = document.createElement("td");
        var pc_ip = document.createElement("td");
        var state = document.createElement("td");

        tr.appendChild(pc_name);
        tr.appendChild(pc_ip);
        tr.appendChild(state);
        table.appendChild(tr);

        pc_name.appendChild(document.createTextNode(textTruncate(wDevice.name)));
        //  pc_ip.appendChild(document.createTextNode(wDevice.ip));
        state.appendChild(document.createTextNode("on"));
        state.innerHTML = '<img src=' + "./assets/null.png" + '></img>';
    }

}
//put srttings gear on panel for config prefs and maybe to remove certain pcs by mac maybe make a ban file and add macs to it and scan the ban list on init have a Button to clear the ban list