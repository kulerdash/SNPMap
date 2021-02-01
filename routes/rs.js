var express = require('express');
var fs = require('fs');
var axios = require("axios");
var router = express.Router();
var exec = require('child_process').exec;

router.get('/id/:term', function (req, res, next) {
    function readrs_promise(req) {
        return new Promise((resolve, reject) => {
            data = req.params.term;
            resolve(data);
        });
    }
    readrs_promise(req).then((value) => {
        console.log(value);
        fs.stat('./public/data/out/ALFA/rs' + value + '.json', function (err, stat) {
            if (err == null) {
                console.log('ALFA file exists');
                /*axios.get('https://api.ncbi.nlm.nih.gov/variation/v0/refsnp/' + value +'/frequency').then((resp) => {
                    //请求成功，处理resp.data中的html数据
                    console.log(resp.data);
                }).catch((err) => {
                    //请求失败，错误处理
                    console.log(err.code);
                });*/
            } else if (err.code === 'ENOENT') {
                exec("python3 alfa.py " + value,
                    { cwd: 'C:/Projects/SNPMap/public' },
                    function (error, stdout, stderr) {
                        if (error) {
                            console.info('stderr : ' + stderr);
                        }
                    });
            } else {
                console.log('ALFA: Some other error: ', err.code);
            }
        });
        fs.stat('./public/data/out/abstract/Rs' + value + '.json', function (err, stat) {
            if (err == null) {
                console.log('Abstract file exists');
            } else if (err.code === 'ENOENT') {
                exec("python3 rest.py " + value,
                    { cwd: 'C:/Projects/SNPMap/public' },
                    function (error, stdout, stderr) {
                        if (error) {
                            console.info('stderr : ' + stderr);
                        }
                    });
            } else {
                console.log('Abstract: Some other error: ', err.code);
            }
        });
        res.render('rs', { title: 'Express' });
        
    })
    
    /*if (!req.body) {
        res.render('error', { title: 'Express' });
    }
    promise.then(function (data) {
        console.log(aef);
        fs.stat('./public/data/out/ALFA/' + aef + '.json', function (err, stat) {
            if (err == null) {
                console.log('ALFA file exists');
            } else if (err.code === 'ENOENT') {
                exec("python alfa.py " + aef,
                    { cwd: 'C:/Users/kulerdash/OneDrive - zju.edu.cn/学习资料/Med/项目/expressDemo/SNPMap/public' },
                    function (error, stdout, stderr) {
                        if (error) {
                            console.info('stderr : ' + stderr);
                        }
                    });
            } else {
                console.log('ALFA: Some other error: ', err.code);
            }
        });
        fs.stat('./public/data/out/abstract/' + aef + '.json', function (err, stat) {
            if (err == null) {
                console.log('Abstract file exists');
            } else if (err.code === 'ENOENT') {
                exec("python rest.py " + aef,
                    { cwd: 'C:/Users/kulerdash/OneDrive - zju.edu.cn/学习资料/Med/项目/expressDemo/SNPMap/public' },
                    function (error, stdout, stderr) {
                        if (error) {
                            console.info('stderr : ' + stderr);
                        }
                    });
            } else {
                console.log('Abstract: Some other error: ', err.code);
            }
        });
        res.render('rs', { title: 'Express' });
    });
    promise.catch(function (err) {
        console.log('error');
    });
    /*var dat = {name: req};
    console.log(dat);
    jsonstr = JSON.stringify(dat);
    fs.writeFile('./public/temp/form.json', jsonstr, function(err) {
        if (err) {
            console.error(err);
        }else{
            console.log('Form read.');
        }
             
    });
    var isnum = /^\d+$/.test(dat['name']);
    if (isnum) {
        dat['name'] = 'Rs' + dat['name']
    }*/

});

module.exports = router;
