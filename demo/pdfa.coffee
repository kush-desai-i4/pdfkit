PDFDocument = require '../lib/document'
fs = require 'fs'

#
# you could read this from a file (e.g. server) or generate it (e.g. in the browser)
#
fileContent = '<?xml version="1.0" encoding="UTF-8"?><note>Hello World</note>'

#
# we can embed files in the pdf (/EmbeddedFiles)
# if PDF/A-3 is requested, files will also appear in PDF/A-3 Associated Files (/AF) section
#
embeddedFiles = [{
  name: 'Hello world.xml',
  mime: 'text/xml',
  description: 'Foo',
  AFRelationship: 'Alternative',
  updatedAt: new Date(),
  content: fileContent
}]

#
# we can give additional XMP RDF to be injected in the pdf
# Note: do not include attribute "rdf:about" as it is added automatically
#       with the correct file identifier
#
anotherXmpRdf =
  '<rdf:Description>' + "\n" +
  '  <note>hello</note>' + "\n" +
  '</rdf:Description>'

#
# pdf document creation
#
doc = new PDFDocument
  pdfa: true,
  pdfaAdditionalXmpRdf: anotherXmpRdf
  embeddedFiles: embeddedFiles
  info:
    Title: 'PDF/A Demo'
    Keywords: 'PDF/A; PDFKit'
    Author: 'John Doe'
    Subject: 'Creating a PDF/A with PDFKit'

doc.registerFont('DefaultFont', __dirname + '/fonts/DejaVuSans.ttf')
doc.pipe fs.createWriteStream(__dirname + '/pdfa-demo.pdf')
doc.font('DefaultFont')
   .text('Hello PDF/A!', 100, 100)
doc.end()
