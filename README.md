Node, Bitmap Color Palette Transform
====================================

A simple node application that reads a bitmap file with fs, reads the binary data from buffer, modifies the palette information from the buffer and writes the modified buffer to a new file.

Use
---

From the command line we can call index.js and specify two parameters - a bitmap file to read from and one to write to. By default (specifying no arguments), index.js will read from 'test.bmp' and write to 'altered.bmp'

`` node index.js 'newFile.bmp' 'subDir/alteredNewFile.bmp' ``
