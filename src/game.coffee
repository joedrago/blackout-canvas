CARD_IMAGE_W = 120
CARD_IMAGE_H = 162
CARD_IMAGE_OFF_X = 4
CARD_IMAGE_OFF_Y = 4
CARD_IMAGE_ADV_X = CARD_IMAGE_W
CARD_IMAGE_ADV_Y = CARD_IMAGE_H
CARD_RENDER_SCALE = 4 # 1/x of the screen's height

class Game
  constructor: (@width, @height, @context) ->
    @cardHeight = Math.floor(@height / CARD_RENDER_SCALE)
    @cardWidth  = Math.floor(@cardHeight * CARD_IMAGE_W / CARD_IMAGE_H)
    @images =
      cards: "img/cards.png"
      logo: "img/logo.png"

    @x = 100
    @y = 100
    @which = 0

  renderCard: (v, x, y) ->
    rank = Math.floor(v % 13)
    suit = Math.floor(v / 13)
    @context.save()
    @context.translate x, y
    @context.drawImage @images.cards,
      CARD_IMAGE_OFF_X + (CARD_IMAGE_ADV_X * rank), CARD_IMAGE_OFF_Y + (CARD_IMAGE_ADV_Y * suit),
      CARD_IMAGE_W, CARD_IMAGE_H,
      0, 0,
      @cardWidth, @cardHeight
    @context.restore()

  render: ->
    @renderCard(@which, @x - (@cardWidth / 2), @y - (@cardHeight / 2))

  mouseDown: (@x, @y) ->
    @which = (@which + 1) % 52
  mouseMove: (@x, @y) ->
  mouseUp: (x, y) ->

module.exports = Game
