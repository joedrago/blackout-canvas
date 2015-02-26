function eventToMousePos(event, elem) {
    if (elem == undefined){
        elem = document.body;
    }

    console.log("ELEMENT SIZE: ", elem);

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

//    // parent offsets
//    var par = elem;
//    while (par !== null) {
//        if (isTouch){
//            // touch events offset scrolling with pageX/Y
//            // so scroll offset not needed for them
//            pos.x -= parseInt(par.offsetLeft);
//            pos.y -= parseInt(par.offsetTop);
//        }else{
//            pos.x += parseInt(par.scrollLeft - par.offsetLeft);
//            pos.y += parseInt(par.scrollTop - par.offsetTop);
//        }
//
//        par = par.offsetParent || null;
//    }

    //Mouse.x /= Stage.scaleFactor;
    //Mouse.y /= Stage.scaleFactor;

    return pos;
}


function debug() {
    console.log("DEBUG FUNCTION");
    console.log("window size " + window.innerWidth + ", " + window.innerHeight + "," + window.devicePixelRatio);

    var canvas = FastCanvas.create(); // specific to FastCanvas
    var context = canvas.getContext("2d");
    var myImage = FastCanvas.createImage(); // specific to FastCanvas
    myImage.onload = function(){
           context.setTransform(1, 0, 0, 1, 0, 0);
           context.translate(660, 340);
           context.rotate(Math.PI);
           context.drawImage(myImage, 0, 0);
           FastCanvas.render(); // specific to FastCanvas
    }
    myImage.src = "img/logo.png";

    var isTouchSupported = "ontouchstart" in window;
    var startEventName = isTouchSupported ? "touchstart" : "mousedown";
    var moveEventName = isTouchSupported ? "touchmove" : "mousemove";
    var endEventName = isTouchSupported ? "touchend" : "mouseup";

    document.addEventListener(moveEventName, function(evt, elem) {
        evt.preventDefault()
        var pos = eventToMousePos(evt, elem);
        //return if window.pointerId != null
        //window.pointerId = evt.pointerId
        console.log("move: " + pos.x + ", " + pos.y);
        console.log(evt);
    }, false);

//$('#screenCanvas').on 'pointermove', (evt) ->
//evt.preventDefault()
//return if window.pointerId != evt.pointerId
//window.engine.mouseMove Math.floor(evt.clientX / window.scale), Math.floor(evt.clientY / window.scale)
//
//$('#screenCanvas').on 'pointerup', (evt) ->
//evt.preventDefault()
//return if window.pointerId != evt.pointerId
//window.pointerId = null
//window.engine.mouseUp Math.floor(evt.clientX / window.scale), Math.floor(evt.clientY / window.scale)

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
        document.addEventListener('deviceready', this.onDeviceReady, false);
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
