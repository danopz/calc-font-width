#!/usr/bin/env node

const fontManager = require('font-manager'),
    fontkit = require('fontkit'),
    fs = require('fs'),
    path = require('path'),
    rootDir = path.dirname(__dirname),
    filesDir = path.join(rootDir, 'files');

fontManager.getAvailableFonts(function (fonts) {
    fonts.forEach(function (fontData) {
        var fileName = [
            fontData.family,
            fontData.weight,
            fontData.width,
            +fontData.italic,
            fontData.style
        ].join('_').replace(/ /g, '-').toLowerCase() + '.json';

        fontkit.open(fontData.path, function (err, font) {
            if (!err && font.characterSet) {
                var widths = {};

                font.characterSet.forEach(function (value) {
                    widths[value] = font.glyphForCodePoint(value).advanceWidth / font.unitsPerEm;
                });

                fs.writeFile(path.join(filesDir, fileName), JSON.stringify(widths), function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    });
});
