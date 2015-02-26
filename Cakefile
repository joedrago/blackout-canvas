fs = require 'fs'
path = require 'path'
browserify  = require 'browserify'
coffeeify  = require 'coffeeify'
watch = require 'node-watch'
util = require 'util'

files = {
  'boot': './src/boot.coffee'
  'game': './src/game.coffee'
}

execute = ->
  b = browserify
    debug: true

  for name, filename of files
    b.require filename, { expose: name }
  b.transform coffeeify
  b.bundle (err, result) ->
    if not err
      fs.writeFile "./www/js/bundle.js", result, (err) ->
        if not err
          util.log "build complete"
        else
          util.error "browserify failed: " + err
    else
      console.error "failed " + err

task 'build', 'Build', (options) ->
  execute()

task 'watch', 'Watch for changes', (options) ->
  fileList = []
  for name, filename of files
    fileList.push filename
  startWatch fileList, execute
  execute()

startWatch = (files, fn) ->
  console.log "Watching: #{files}"
  for file in files then do (file) ->
    watch file, (filename) ->
      fn()
