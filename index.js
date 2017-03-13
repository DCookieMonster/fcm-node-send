var express = require('express');
var app = express();
var http = require('http');
var request = require("request");
/* GET users listing. */
var bodyParser = require('body-parser');

var FCM = require('fcm-push');

var serverKey = 'AAAA9pbYLYU:APA91bHbbf53oo4YQ3YHdvI2iD0GJUPm1DNPlT471-my0Yy9REQ2Mo-Pz3e3L8ERY6KVkWgwRPs0LvnwWXscAhGTQ3KLttC0eZbqRTvW44rBpQmS3iTKhQqEKKwTR4Yu_hnRuroJKYYE';
var fcm = new FCM(serverKey);

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: false
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/', function(request, response) {
    response.send('Hello World!')
})


app.post('/api/v1/send_push', function(req, res) {
    var token = req.body.token;
    var msg = req.body.msg;
    var message = {
        to: token, // required fill with device token or topics
        collapse_key: 'demo',
        data: {
            msg: msg
        },
        notification: {
            title: 'Title of your push notification',
            body: 'Body of your push notification'
        }
    };

//callback style
//     fcm.send(message, function(err, response){
//         if (err) {
//             console.log("Something has gone wrong!");
//             res.send("Something has gone wrong!");
//         } else {
//             console.log("Successfully sent with response: ", response);
//             res.send("Successfully sent with response: ", response);
//         }
//     });

//promise style
    fcm.send(message)
        .then(function(response){
            console.log("Successfully sent with response: ", response);
            res.send("Successfully sent with response: ", response);
        })
        .catch(function(err){
            console.log("Something has gone wrong!");
            res.send("Something has gone wrong!");
            console.error(err);
        });
});


