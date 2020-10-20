var express = require('express');
var fs = require('fs');
var router = express.Router();

router.post('/', function(req, res, next) {
    if (!req.body) {
        res.render('error', { title: 'Express' });
    }
    var dat = req.body;
    console.log(dat);
    console.log(typeof(dat));
    jsonstr = JSON.stringify(dat);
    fs.writeFile('./public/temp/form.json', jsonstr, function(err) {
        if (err) {
           console.error(err);
        }else{
            console.log('Form read.');
        }
             
    });
    res.render('rs', { title: 'Express' });
    
});

module.exports = router;
