var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/alfa/:term', function(req, res, next) {
    var term = req.params.term;
    fs.readFile('./public/data/out/ALFA/Rs'+term+'.json', 'utf8', function(err, data) {
        if (err) {
            
        } else {
            res.send(data);
        }
    });
});

router.get('/basic/:term', function(req, res, next) {
    var term = req.params.term;
    fs.readFile('./public/data/out/basic/Rs'+term+'.json', 'utf8', function(err, data) {
        if (err) {

        } else {
            res.send(data);
        }
    });
});

router.get('/population/:term', function(req, res, next) {
    var term = req.params.term;
    fs.readFile('./public/data/out/population/Rs'+term+'.json', 'utf8', function(err, data) {
        if (err) {

        } else {
            res.send(data);
        }
    });
});

router.get('/genotype/:term', function(req, res, next) {
    var term = req.params.term;
    fs.readFile('./public/data/out/basic/alleles/Rs'+term+'.json', 'utf8', function(err, data) {
        if (err) {

        } else {
            res.send(data);
        }
    });
});

router.get('/wordlist/:term', function(req, res, next) {
    var term = req.params.term;
    fs.readFile('./public/data/out/keyword/arranged/Rs'+term+'.json', 'utf8', function(err, data) {
        if (err) {

        } else {
            res.send(data);
        }
    });
});

router.get('/newwordlist/:term', function(req, res, next) {
    var term = req.params.term;
    fs.readFile('./public/data/out/keyword/Rs'+term+'.json', 'utf8', function(err, data) {
        if (err) {

        } else {
            res.send(data);
        }
    });
});

router.get('/weblist/:term', function(req, res, next) {
    var term = req.params.term;
    fs.readFile('./public/data/out/webwork/Rs'+term+'.json', 'utf8', function(err, data) {
        if (err) {

        } else {
            res.send(data);
        }
    });
});

router.get('/pmidlist/:term', function(req, res, next) {
    var term = req.params.term;
    fs.readFile('./public/data/out/abstract/Rs'+term+'.json', 'utf8', function(err, data) {
        if (err) {

        } else {
            res.send(data);
        }
    });
});

module.exports = router;
