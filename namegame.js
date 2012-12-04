// Module dependencies
var colors = require('colors')
    , fs = require('fs')
    , http = require('http')
    , program = require('commander')
    , sugar = require('sugar');

// Prefixes
var prefixes = [
    'be'
    , 'do'
    , 're'
];

// Words
var words = [
    'deed'
    , 'help'
    , 'friend'
    , 'quest'
    , 'love'
    , 'true'
    , 'play'
    , 'game'
    , 'fun'
    , 'good'
    , 'buddy'
    , 'happy'
    , 'boost'
];

// Suffixes
var suffixes = [
    'str'
    , 'ify'
    , 'fly'
    , 'spot'
    , 'r'
    , 'ly'
    , 'space'
    , 'place'
    , 'ful'
    , 'quest'
    , 'zy'
    , 'tsy'
    , 'sauce'
    , 'boost'
];

var names = new Array();

// Just the words
words.each(function(word) {
    names.push(word);
});

// Each word with a prefix
words.each(function(word) {
    prefixes.each(function(prefix) {
        names.push(prefix + word);
    });
});

// Each word with a suffix
words.each(function(word) {
    suffixes.each(function(suffix){
        names.push(word + suffix);
    });
});

// Each word with both a prefix and a suffix
words.each(function(word) {
    suffixes.each(function(suffix) {
        prefixes.each(function(prefix) {
            names.push(prefix + word + suffix);
        });
    });
});

var startups = names.sortBy();
var len = startups.count();
var msg = '\nGenerated ' + len + ' startup names! Checking to see which ones are available...\n';
var log = fs.createWriteStream(new Date().getTime().toString() + '.log', {'flags': 'a'});

console.log(msg.bold.yellow);

startups.each(function(startup) {
    // Set up your DNS API provider's options here. I use RoboWhoIs but you should be able to use any API you prefer.
    var options = {
          host: 'api.robowhois.com'
        , method: 'GET'
        , path: '/whois/' + startup + '.com/availability'
        , auth: 'YOUR API KEY HERE'
    };

    http.request(options, function(response) {
        var domainData = '';

        response.on('data', function(chunk) {
            domainData += chunk;
        });

        response.on('end', function() {
            var obj = JSON.parse(domainData);
            if(obj.error) {
                console.log('ERROR!'.bold.red.inverse + ' ' + obj.error.name + ' while checking ' + startup);
                log.write('ERROR!\n' + options.path.toString() + '\n' + obj.error.name + ' while checking ' + startup + '\nEND ERROR\n\n');
            } else if(obj.response.available && !obj.response.registered) {
               console.log(startup.bold.green.inverse);
               log.write('SUCCESS!' + options.path.toString() + '\n' + domainData + '\n\n');
            }
        });
    }).end();
});
