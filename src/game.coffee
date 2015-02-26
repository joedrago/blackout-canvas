
class Game
  constructor: (@width, @height, @context) ->
    @x = 100
    @y = 100
    @images =
      logo: "img/logo.png"

  render: ->
    @context.translate @x, @y
    @context.rotate Math.PI / 2
    @context.drawImage @images.logo, 0, 0

  mouseDown: (@x, @y) ->
  mouseMove: (@x, @y) ->
  mouseUp: (x, y) ->

module.exports = Game
