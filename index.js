// index.js
'use strict';

var FS = require('fs'),
    PATH = require('path'),
    SVGO = require('svgo'),
    cheerio = require('cheerio'),
    rootPath = PATH.resolve(__dirname, 'source/'),
    svgo = new SVGO(/*{ custom config object }*/);
var  p

var dirCallback = function (e, arr, path) {
	if(e){
    console.log(e)
  }else{
    console.log(arr.length)
    arr.forEach(function(item){
      handleItem(item, path);
    });
  }
}

var exist = function(f){
  return FS.existsSync(f);
}

var isFile = function(f){
  return FS.existsSync(f) && FS.statSync(f).isFile();
}

var isDirectory = function(f, dir){
  return FS.existsSync(f) && FS.statSync(f).isDirectory();
}

var dealDir = function(path) {
	FS.readdir(path, function(e, arr){
		dirCallback(e, arr, path)
	})
}

var dealFile = function (file) {
	/*FS.readFile(file, 'utf8', function(err, data) {
    if (err) {
        throw err;
    }
    svgo.optimize(data, function(result) {
        console.log(result);
        
    });
	});*/
	var fxml = FS.readFileSync(file, 'utf-8')
	var map = new Map();
	var $ = cheerio.load(fxml, {
    normalizeWhitespace: true,
    // xmlMode: true
	});
	// console.log($.html())
	var fills = $('path').attr('fill');	
	for(var key in fills) {
		console.log(key)
		map.set(key, 'colorfill')
	}

	console.log(map)
	// FS.readFileSync(file, 'utf-8')
	// FS.writeFileSync(file, data, 'utf-8')
}

var handleItem = function (item, path) {
	var itemPath = PATH.resolve(path, item)
	console.log(itemPath +' : isDir>' +isDirectory(itemPath)+' isFile:'+isFile(itemPath))
	if(isDirectory(itemPath)){
		dealDir(itemPath)
	}else if (isFile(itemPath)) {
		dealFile(itemPath)
	}else{
		console.log('Can read this file: '+ itemPath)
	}
}
// 正式开始处理文件
dealDir(rootPath);