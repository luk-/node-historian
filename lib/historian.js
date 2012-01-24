var fs = require('fs')
  , colors = require('colors');


var historian = {};


historian.use = function (name) {
  
  if (typeof(name) === 'number') {
    
  }
  
  var config = JSON.stringify( { main: name } );

  fs.writeFile(__dirname + '/../conf/config.json', config, function() {
    console.log('now using: ' + name);
  });

}


historian.add = function (clipboard, string) {
  
  if (!clipboard) return console.log('No historian selected'.bold);

  var stream = fs.createWriteStream(__dirname + '/../var/' + clipboard, {flags: 'a'});

  if (string) {
    stream.write(string + '\n');
    return;
  }

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  
  if (process.stdin.writable === true) {
    process.stdin.on('data', function (chunk) {
      stream.write(chunk);
    });
  }
  else {
    console.error('Not enough arguments. Try `hijs --usage`');
    process.exit();
  }
  
  process.stdin.on('end', function() {} );

}


historian.paste = function (clipboard, ident) {

  if (ident && isNaN(ident)) {
    var stream = fs.createReadStream(__dirname + '/../conf/alias.json');
  }

  else {
    var stream = fs.createReadStream(__dirname + '/../var/' + clipboard, {encoding: 'utf8'});
  } 
  

  stream.on('data', function(data) {

    try { 
      var obj = JSON.parse(data);
      return console.log(obj[ident]);
    }

    catch (e) {

      var out = data.replace(/\n$/, '').split(/\n/);
      
      if (ident) {
	return process.stdout.write(out[ident]);
      }

      out.forEach(function(k, v) {
	console.log(colors.green(v) + ': ' + k);
      });

    }

  });

  stream.on('error', function(err) {
    return console.error(err);
  });

}


historian.ls = function (current) {

  fs.readdir(__dirname + '/../var/', function(err, files) {
    if (err) return console.error(err);

    files.forEach(function(key) {

      var color = 'white';
      if (key === current) var color = 'red';

      console.log('- ' + colors[color](key));
    });

  });
  
  if (current) return console.log('current: ' + current.red.bold);

}


historian.examine = function (clipboard) {
  
  if (!clipboard) return console.log('No historian selected'.bold);
  
  var stream = fs.createReadStream(__dirname + '/../var/' + clipboard)
    , lines = 0
    , chars = 0;

  stream.on('data', function(data) {
    chars += data.toString().match(/./g).length
  , lines += data.toString().match(/\n/g).length;
  });

  stream.on('end', function() {
    console.log(clipboard + '\n' + chars + ' characters\n' + lines + ' lines');
  });

  stream.on('error', function(err) {
    return console.error(err);
  });

}


historian.alias = function (key, value) {

  var readStream = fs.createReadStream(__dirname + '/../conf/alias.json');

  readStream.on('data', function (data) {

    try {

      var obj = JSON.parse(data);

      if (key && value) {

        obj[key] = value;
        obj = JSON.stringify(obj);

	fs.createWriteStream(__dirname + '/../conf/alias.json').write(obj);

      } 
      
      else {

	obj = obj[key] || obj;
	return console.log(obj);

      }

    } catch (e) 
        {
      return console.error('JSON Parsing error: ' + e);
    }


  });

}

module.exports = historian;
