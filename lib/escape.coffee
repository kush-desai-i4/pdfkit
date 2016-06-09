###
PDFEscape - escape PDF "Name objects" or "Strings"
###

class PDFEscape
  #
  # Escape Strings as required by the spec
  # Strings are the ones wrapped in parenthesis, e.g. (Foo)
  #
  @escapeString: (s) ->
    escapableRe = /[\n\r\t\b\f\(\)\\]/g
    escapable =
      '\n': '\\n'
      '\r': '\\r'
      '\t': '\\t'
      '\b': '\\b'
      '\f': '\\f'
      '\\': '\\\\'
      '(': '\\('
      ')': '\\)'

    s.replace escapableRe, (c) ->
      return escapable[c]

  #
  # Escape Name Objects as described in 3.2.4 “Name Objects' of PDF1.7 reference
  # Name Objects are the ones starting with a slash, e.g. /Foo
  #
  # Note: This initial version only deals with known cases.
  #   e.g. mime-types: "text/xml" => "text#2Fxml"
  #
  # TODO: implement this for all escapable characters described in the spec:
  # "it is recommended but not required for characters whose codes are outside the range 33 to 126."
  #
  @escapeName: (s)->
    escapableRe = /\//g
    escapable =
      '/': '#2F'

    s.replace escapableRe, (c) ->
      return escapable[c]

module.exports = PDFEscape
