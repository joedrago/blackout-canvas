Game = require 'game'

# -----------------------------------------------------------------------------

eventToMousePos = (event, elem) ->
  if elem == undefined
    elem = document.body

  isTouch = false
  pos =
    x: 0
    y: 0

  if event.touches
    # touch screen events
    if event.touches.length
      isTouch = true
      pos.x = parseInt event.touches[0].clientX
      pos.y = parseInt event.touches[0].clientY
  else
    # mouse events
    pos.x = parseInt(event.clientX)
    pos.y = parseInt(event.clientY)

  # accounts for border
  pos.x -= elem.clientLeft
  pos.y -= elem.clientTop

  return pos

# -----------------------------------------------------------------------------

class App
  constructor: ->
    @isPhone = !!window.cordova
    @isTouchSupported = "ontouchstart" in window
    @dragging = false
    @pendingImages = 0
    if @isTouchSupported
      @eventNames =
        down: 'touchstart'
        move: 'touchmove'
        up:   'touchend'
    else
      @eventNames =
        down: 'mousedown'
        move: 'mousemove'
        up:   'mouseup'

  onMouseDown: (evt, elem) ->
    @dragging = true
    evt.preventDefault()
    pos = eventToMousePos(evt, elem)
    @game.mouseDown pos.x, pos.y

  onMouseMove: (evt, elem) ->
    return if not @dragging
    evt.preventDefault()
    pos = eventToMousePos(evt, elem)
    @game.mouseMove pos.x, pos.y

  onMouseUp: (evt, elem) ->
    @dragging = false
    evt.preventDefault()
    pos = eventToMousePos(evt, elem)
    @game.mouseUp pos.x, pos.y

  onPause: ->
    console.log 'onPause'

  onResume: ->
    console.log 'onResume'

  render: ->
    @context.clearRect 0, 0, @width, @height
    @context.setTransform(1, 0, 0, 1, 0, 0)
    @game.render()
    FastCanvas.render()

    requestAnimationFrame => @render()

  onImageLoaded: (info) ->
    @pendingImages--
    if @pendingImages == 0
      console.log 'All images loaded. Beginning render loop.'
      requestAnimationFrame => @render()

  initGraphics: ->
    console.log "initGraphics: window size #{window.innerWidth}, #{window.innerHeight}, #{window.devicePixelRatio}"
    @width = window.innerWidth
    @height = window.innerHeight
    @canvas = FastCanvas.create !window.cordova
    @context = @canvas.getContext "2d"
    @game = new Game @width, @height, @context
    for imageName, imageUrl of @game.images
      @pendingImages++
      console.log "loading image #{@pendingImages} '#{imageName}': #{imageUrl}"
      @game.images[imageName] = FastCanvas.createImage()
      @game.images[imageName].onload = @onImageLoaded.bind(this)
      @game.images[imageName].src = imageUrl
    console.log "game created: #{JSON.stringify(Object.keys(@game))}"

  onDeviceReady: ->
    console.log 'onDeviceReady'
    document.addEventListener @eventNames.down, @onMouseDown.bind(this), false
    document.addEventListener @eventNames.move, @onMouseMove.bind(this), false
    document.addEventListener @eventNames.up,   @onMouseUp.bind(this),   false

    # this forces Android's WebView to not do dumb things with scale
    gameViewport = document.getElementById('gameViewport')
    scale = 1 / window.devicePixelRatio
    viewportSettings = "user-scalable=no, initial-scale=#{scale}, maximum-scale=#{scale}, minimum-scale=#{scale}, width=device-width, height=device-height"
    console.log "viewportSettings: #{viewportSettings}"
    gameViewport.setAttribute 'content', viewportSettings

    setTimeout(@initGraphics.bind(this), 0)

  boot: ->
    console.log 'blackout boot()'
    if @isPhone
      document.addEventListener 'deviceready', @onDeviceReady.bind(this), false
      document.addEventListener 'pause', @onPause.bind(this), false
      document.addEventListener 'resume', @onResume.bind(this), false
    else
      @onDeviceReady()

# -----------------------------------------------------------------------------

app = new App
app.boot()
