###
PDFNamedReference - representation of a named reference, e.g. "(file1.txt) 11 0 R"
###

class PDFNamedReference
  constructor: (@reference, @name) ->

  toString: ->
    return "(#{@name}) #{@reference}"

module.exports = PDFNamedReference
