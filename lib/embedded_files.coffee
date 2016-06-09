###
PDFEmbeddedFiles - handles embedded files representation in the PDF document
###

utf8 = require 'utf8'

class PDFEmbeddedFiles
  constructor: (@document, @embeddedFiles) ->
    for key, embeddedFile of @embeddedFiles
      streamRef = @streamRef(embeddedFile)
      @embeddedFiles[key]._fileRef = @fileRef(embeddedFile, streamRef)

  streamRef: (embeddedFile) ->
    ref = @document.ref
      Type: 'EmbeddedFile'
      Subtype: embeddedFile.mime
      Params: { ModDate: embeddedFile.updatedAt }
    ref.write(utf8.encode(embeddedFile.content))
    ref

  fileRef: (embeddedFile, streamRef) ->
    @document.ref
      F: new String(embeddedFile.name)
      UF: new String(utf8.encode(embeddedFile.name))
      Desc: new String(embeddedFile.description)
      Type: 'Filespec'
      AFRelationship: embeddedFile.AFRelationship ? ''
      EF:
        F: streamRef
        UF: streamRef

  names: ->
    Names: @embeddedFiles.map (embeddedFile) ->
      embeddedFile._fileRef.namedReference(embeddedFile.name)

  associatedFiles: ->
    @document.ref @embeddedFiles.map (embeddedFile) ->
      embeddedFile._fileRef

  end: ->
    for embeddedFile in @embeddedFiles
      embeddedFile._fileRef.data.EF.F.end()
      embeddedFile._fileRef.end()


module.exports = PDFEmbeddedFiles
