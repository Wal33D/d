
window.addEventListener("DOMContentLoaded", () => {
     const {
        runCmd,
        textTruncate
    } = require("./apis_js/jstools.js");

    const menuButton = document.getElementById("menu-btn");
    const minimizeButton = document.getElementById("minimize-btn");
    const maxUnmaxButton = document.getElementById("max-unmax-btn");
    const closeButton = document.getElementById("close-btn");
    const tuyaSettingsButton = document.getElementById("tuyaSettings-btn");

    menuButton.addEventListener("click", e => {
        window.openMenu(e.x, e.y);
    });

    minimizeButton.addEventListener("click", e => {
        window.minimizeWindow();
    });

    maxUnmaxButton.addEventListener("click", e => {
        const icon = maxUnmaxButton.querySelector("i.far");

        window.maxUnmaxWindow();
        if (window.isWindowMaximized()) {
            icon.classList.remove("fa-square");
            icon.classList.add("fa-clone");
        } else {
            icon.classList.add("fa-square");
            icon.classList.remove("fa-clone");
        }
    });
    closeButton.addEventListener("click", e => {
        window.closeWindow();
    });


});
 window.addEventListener('load', (event) => {
        const tuyaApi = require("./apis_js/tuyaApi.js");
    const wolApi = require("./apis_js/wolApi.js");
    tuyaApi.init();
    wolApi.init();
        setInterval(function() {
        tuyaApi.updateStatus();
    }, 15000);
    setInterval(function() {
        wolApi.updateStatus();
    }, 30000);


});