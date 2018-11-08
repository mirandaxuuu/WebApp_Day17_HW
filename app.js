const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const request = require('request');
const accessKey = '008b882bc469731393a0753a43a30769';
const fs = require('fs');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

// app.get('/', function(req, res){
//   res.render('index');
// });

app.get('/app', function(req, res){
	res.render('detect', {answer: null, error: null});
});


app.post('/app', function(req, res){

	//get the input
	let textInput = req.body.text;
	// console.log(textInput);

	//ULI encode
	let textEncoded = encodeURIComponent(textInput);
	// console.log(textEncoded);

	//set the url
	let url = `http://apilayer.net/api/detect?access_key=${accessKey}&query=${textEncoded}`;


  request(url, function (err, response, body) {
    if(err){
      res.render('detect', {answer: null, error: 'Sorry, there is an error'});
    } else {
      let answer = JSON.parse(body)
      if(answer.results[0].language_name == undefined){
        res.render('detect', {answer: null, error: 'Sorry, there is an error'});
      } else {
        let answerText = `The language of your text is ${answer.results[0].language_name}. I am ${answer.results[0].probability} percent sure about my answer.`;
        res.render('detect', {answer: answerText, error: null});
      }
    }
  }); //close request

}) //close app.post




app.get('/',function(req,res){
    res.render('index', {msg: null, error: null});
})

app.post('/',function(req,res){

    // var exists = fs.existsSync('userInfo.json');
    // if (exists) {
    //   console.log('loading userInfo.json file');
    //   var txt = fs.readFileSync('userInfo.json', 'utf8');
    //   var userInfo = JSON.parse(txt);
    // } else {
    //   console.log('The file is empty');
    //   userInfo = {};
    // }

    var txt = fs.readFileSync('userInfo.json', 'utf8');
    var userInfo = JSON.parse(txt);

    var username = req.body.username;
    var password = req.body.password;

    console.log(username);
    console.log(password);

    userInfo[username] = password;

    var reply = {
      status: 'success',
      username: username,
      password: password
    }

    console.log('adding: ' + JSON.stringify(reply));

    var json = JSON.stringify(userInfo, null, 2);
    fs.writeFile('userInfo.json',json,'utf8',finished)
    if(password != undefined){
        res.render('index', {msg: 'success', error: null});
    }
})

function finished(err) {
    console.log('finished writing json file');
    // res.send(reply);
} 



app.listen(3000, function(){
  console.log('app is running on port 3000');
})

