function reading(name) {
    var xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}

function load(filedir) {
    txt = reading(filedir);
    var json = JSON.parse(txt);
    console.log(json);
    return json;
}

function writewords(wordlist, rsnumber) {
    // 引入 ECharts 主模块
    var max = 0;
    var j = 0;
    for (m=0; m<wordlist.length; m++) {
        if (wordlist[m].value > max) {
            max = wordlist[m].value;
        }
    }
    console.log(max);
    if (max>2 && wordlist.length>10) {
        var myChart = echarts.init(document.getElementById('main'));
 
        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 10,
                data: []
            },
            series : [
                {
                    name: rsnumber,
                    type: 'pie',    // 设置图表类型为饼图
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '5',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var edge = wordlist[15].value;
        for (m=0; m<wordlist.length; m++) {
            if (wordlist[m].value>2 && wordlist[m].value>=edge) {
                option.series[0].data.push({value:wordlist[m].value, name:wordlist[m].name});
                option.legend.data.push(wordlist[m].name);
            }
        }
        console.log(option.series[0].data);

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    } else {
        document.getElementById("keywordchart").innerHTML = "Not enough information to render graph!";
        //let father = document.getElementById('keyword');
        //let word = document.createElement('p');
        //word.innerHTML = 'Not enough information to render graph.';
        //father.appendChild(word);
    }
    
}

function getbasics(rsnumber) {
    var basics = load('data/out/basic/Rs'+rsnumber+'.json');
    for (var key in basics) {
        obj = document.getElementById(key);
        if(!(obj)) {
            console.log(key+' does not exist!')
        } else {
            document.getElementById(key).innerHTML = basics[key];
        }
    }
}

var req = load('temp/form.json');
console.log(req.name);
console.log(typeof(req.name));
var patt1 = /rs[0-9]+/;
var patt2 = /[0-9]+/;
console.log(patt2.test('6886'));
console.log(patt2.test(req.name));
var rsnumber = req.name;
if (patt1.test(req.name)) {
    rsnumber = req.name;
    rsnumber = rsnumber.slice(2, rsnumber.length);
} else if (patt2.test(req.name)) {
    rsnumber = req.name;
    console.log(rsnumber);
}
console.log(rsnumber);
console.log(document.title);      // 可以获取title的值。
document.title = 'rs'+rsnumber;    // 设置title的值。
var wordlist = load('data/out/keyword/Rs'+rsnumber+'.json');
writewords(wordlist, rsnumber);
console.log("title="+document.title);
document.getElementById("rstitle").innerHTML = 'Rs'+rsnumber;
getbasics(rsnumber);

/*function run(rt) {
    console.log('rt '+rt);
    document.getElementsByTagName('title')[0].innerText = 'rs'+rt;
    var wordlist = load('data/OutRs'+rt+'.json');
    function writewords(wordlist) {
        Object.keys(wordlist).forEach(function(key){
            var father = document.getElementById('keyword');
            var word = document.createElement('p');
            word.id = key;
            word.innerHTML = key+' '+wordlist[key];
            word.style.backgroundColor = getRandomColor;
            word.style.color = '#ffffff';
            word.style.padding = '5px';
            father.appendChild(word);
        });
    }
}*/