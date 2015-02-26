var gPaused = false;
var thingImage;
var thingX = 100;
var thingY = 100;
var gCanvas, gContext;
var gWidth, gHeight;

function eventToMousePos(event, elem) {
    if (elem == undefined){
        elem = document.body;
    }

    var isTouch = false;
    var pos = {
        x: 0,
        y: 0
    };

    // touch screen events
    if (event.touches){
        if (event.touches.length){
            isTouch = true;
            pos.x = parseInt(event.touches[0].clientX);
            pos.y = parseInt(event.touches[0].clientY);
        }
    }else{
        // mouse events
        pos.x = parseInt(event.clientX);
        pos.y = parseInt(event.clientY);
    }

    // accounts for border
    pos.x -= elem.clientLeft;
    pos.y -= elem.clientTop;

    return pos;
}

function initGraphics() {
    gWidth = window.innerWidth;
    gHeight = window.innerHeight;
    console.log("initGraphics(): window size " + window.innerWidth + ", " + window.innerHeight + "," + window.devicePixelRatio);

    gCanvas = FastCanvas.create(!window.cordova);
    gContext = gCanvas.getContext("2d");
    thingImage = FastCanvas.createImage(); // specific to FastCanvas
    thingImage.onload = function(){
        requestAnimationFrame(render);
    }
    thingImage.src = "img/logo.png";
}

function debug() {
    console.log("DEBUG FUNCTION");
    console.log("debug(): window size " + window.innerWidth + ", " + window.innerHeight + "," + window.devicePixelRatio);

    var mvp = document.getElementById('gameViewport');
    var scale = 1 / window.devicePixelRatio;
    var viewportSettings = "user-scalable=no, initial-scale="+scale+", maximum-scale="+scale+", minimum-scale="+scale+", width=device-width, height=device-height";
    console.log("viewportSettings: " + viewportSettings);
    mvp.setAttribute('content', viewportSettings);

    var isTouchSupported = "ontouchstart" in window;
    var startEventName = isTouchSupported ? "touchstart" : "mousedown";
    var moveEventName = isTouchSupported ? "touchmove" : "mousemove";
    var endEventName = isTouchSupported ? "touchend" : "mouseup";

    document.addEventListener(moveEventName, function(evt, elem) {
        evt.preventDefault()
        var pos = eventToMousePos(evt, elem);
        thingX = pos.x;
        thingY = pos.y;
    }, false);

    document.addEventListener(startEventName, function(evt, elem) {
        evt.preventDefault()
        var pos = eventToMousePos(evt, elem);
        thingX = pos.x;
        thingY = pos.y;
    }, false);

    setTimeout(initGraphics, 0);
}

function onPause() {
    console.log("onPause");
    gPaused = true;
}

function onResume() {
    console.log("onResume");
    gPaused = false;
    requestAnimationFrame(render);
}

function render(){
    if (gPaused === true) {
        return;
    }

    gContext.clearRect(0, 0, gWidth, gHeight);
    gContext.setTransform(1, 0, 0, 1, 0, 0);
    gContext.translate(thingX, thingY);
    gContext.rotate(Math.PI / 2);
    gContext.drawImage(thingImage, 0, 0);
    FastCanvas.render();

    requestAnimationFrame(render);
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        var isPhone = !!window.cordova;
        if(isPhone) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);
        } else {
            this.onDeviceReady();
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        debug();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
