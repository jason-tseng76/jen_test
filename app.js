var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
process.env.NODE_ENV = app.get('env');
console.log('NODE_ENV='+process.env.NODE_ENV);

var helmet = require('helmet');
app.use(helmet());

app.all('/', function(req, res) {
	res.send('...');
});
app.all('/jason', function(req, res) {
	console.log(req.path);
	res.send('Jason index ...!!22233');
});

app.listen(port, function () {
	console.log('Listening on port : ' + port);
});

