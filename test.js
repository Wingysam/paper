const IRC = require('irc-framework')
var bot = new IRC.Client();
bot.connect({
	host: 'irc.freenode.net',
	port: 6667,
	nick: 'oifnofwefiwqonfoinoqiw'
});

bot.on('message', function(event) {
  	if (event.message.indexOf('hello') === 0) {
  		  event.reply('Hi!');
  	}
  	
  	if (event.message.match(/^!join /)) {
  	    var to_join = event.message.split(' ');
  		event.reply('Joining ' + to_join + '..');
  		bot.join(to_join);
  	}
});


// Or a quicker to match messages...
bot.matchMessage(/^hi/, function(event) {
	event.reply('hello there!');
});
