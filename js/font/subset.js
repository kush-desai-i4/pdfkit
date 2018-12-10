// Generated by CoffeeScript 1.12.7
(function() {
  var CmapTable, Subset, utils,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CmapTable = require('./tables/cmap');

  utils = require('./utils');

  Subset = (function() {
    function Subset(font) {
      this.font = font;
      this.subset = {};
      this.unicodes = {};
      this.next = 33;
    }

    Subset.prototype.use = function(character) {
      var i, j, ref;
      if (typeof character === 'string') {
        for (i = j = 0, ref = character.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          this.use(character.charCodeAt(i));
        }
        return;
      }
      if (!this.unicodes[character]) {
        this.subset[this.next] = character;
        return this.unicodes[character] = this.next++;
      }
    };

    Subset.prototype.encodeText = function(text) {
      var char, i, j, ref, string;
      string = '';
      for (i = j = 0, ref = text.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        char = this.unicodes[text.charCodeAt(i)];
        string += String.fromCharCode(char);
      }
      return string;
    };

    Subset.prototype.generateCmap = function() {
      var mapping, ref, roman, unicode, unicodeCmap;
      unicodeCmap = this.font.cmap.tables[0].codeMap;
      mapping = {};
      ref = this.subset;
      for (roman in ref) {
        unicode = ref[roman];
        mapping[roman] = unicodeCmap[unicode];
      }
      return mapping;
    };

    Subset.prototype.glyphIDs = function() {
      var ref, ret, roman, unicode, unicodeCmap, val;
      unicodeCmap = this.font.cmap.tables[0].codeMap;
      ret = [0];
      ref = this.subset;
      for (roman in ref) {
        unicode = ref[roman];
        val = unicodeCmap[unicode];
        if ((val != null) && indexOf.call(ret, val) < 0) {
          ret.push(val);
        }
      }
      return ret.sort();
    };

    Subset.prototype.glyphsFor = function(glyphIDs) {
      var additionalIDs, glyph, glyphs, id, j, len, ref;
      glyphs = {};
      for (j = 0, len = glyphIDs.length; j < len; j++) {
        id = glyphIDs[j];
        glyphs[id] = this.font.glyf.glyphFor(id);
      }
      additionalIDs = [];
      for (id in glyphs) {
        glyph = glyphs[id];
        if (glyph != null ? glyph.compound : void 0) {
          additionalIDs.push.apply(additionalIDs, glyph.glyphIDs);
        }
      }
      if (additionalIDs.length > 0) {
        ref = this.glyphsFor(additionalIDs);
        for (id in ref) {
          glyph = ref[id];
          glyphs[id] = glyph;
        }
      }
      return glyphs;
    };

    Subset.prototype.encode = function() {
      var cmap, code, glyf, glyphs, id, ids, loca, name, new2old, newIDs, nextGlyphID, old2new, oldID, oldIDs, ref, ref1, tables;
      cmap = CmapTable.encode(this.generateCmap(), 'unicode');
      glyphs = this.glyphsFor(this.glyphIDs());
      old2new = {
        0: 0
      };
      ref = cmap.charMap;
      for (code in ref) {
        ids = ref[code];
        old2new[ids.old] = ids["new"];
      }
      nextGlyphID = cmap.maxGlyphID;
      for (oldID in glyphs) {
        if (!(oldID in old2new)) {
          old2new[oldID] = nextGlyphID++;
        }
      }
      new2old = utils.invert(old2new);
      newIDs = Object.keys(new2old).sort(function(a, b) {
        return a - b;
      });
      oldIDs = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = newIDs.length; j < len; j++) {
          id = newIDs[j];
          results.push(new2old[id]);
        }
        return results;
      })();
      glyf = this.font.glyf.encode(glyphs, oldIDs, old2new);
      loca = this.font.loca.encode(glyf.offsets);
      name = this.font.name.encode();
      this.postscriptName = name.postscriptName;
      this.cmap = {};
      ref1 = cmap.charMap;
      for (code in ref1) {
        ids = ref1[code];
        this.cmap[code] = ids.old;
      }
      tables = {
        cmap: cmap.table,
        glyf: glyf.table,
        loca: loca.table,
        hmtx: this.font.hmtx.encode(oldIDs),
        hhea: this.font.hhea.encode(oldIDs),
        maxp: this.font.maxp.encode(oldIDs),
        post: this.font.post.encode(oldIDs),
        name: name.table,
        head: this.font.head.encode(loca)
      };
      if (this.font.os2.exists) {
        tables['OS/2'] = this.font.os2.raw();
      }
      return this.font.directory.encode(tables);
    };

    return Subset;

  })();

  module.exports = Subset;

}).call(this);
