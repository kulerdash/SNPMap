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
    if (wordlist['Check'] === 1) {
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
                    name: 'Keyword ytpe',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],
        
                    label: {
                        position: 'inner'
                    },
                    labelLine: {
                        show: false
                    },
                    data: []
                },
                {
                    name: 'Keyword',
                    type: 'pie',    // 设置图表类型为饼图
                    radius: ['40%', '55%'],
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
        if (wordlist['Disease']['number'] !== 0) {
            option.series[0].data.push({value:wordlist['Disease']['number'], name:'Disease'});
            option.legend.data.push('Disease');
        }
        if (wordlist['Chemical']['number'] !== 0) {
            option.series[0].data.push({value:wordlist['Chemical']['number'], name:'Chemical'});
            option.legend.data.push('Chemical');
        }
        if (wordlist['Gene']['number'] !== 0) {
            option.series[0].data.push({value:wordlist['Gene']['number'], name:'Gene'});
            option.legend.data.push('Gene');
        }
        for (m=0; m<wordlist['Disease']['data'].length; m++) {
            option.series[1].data.push({value:wordlist['Disease']['data'][m].value, name:wordlist['Disease']['data'][m].name});
            option.legend.data.push(wordlist['Disease']['data'][m].name);
        }
        for (m=0; m<wordlist['Chemical']['data'].length; m++) {
            option.series[1].data.push({value:wordlist['Chemical']['data'][m].value, name:wordlist['Chemical']['data'][m].name});
            option.legend.data.push(wordlist['Chemical']['data'][m].name);
        }
        for (m=0; m<wordlist['Gene']['data'].length; m++) {
            option.series[1].data.push({value:wordlist['Gene']['data'][m].value, name:wordlist['Gene']['data'][m].name});
            option.legend.data.push(wordlist['Gene']['data'][m].name);
        }
        console.log(option.series[0].data);
        console.log(option.series[1].data);

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
    return basics;
}

function getgenotype(rsnumber, basics) {
    var genos1 = load('data/out/basic/alleles/Rs'+rsnumber+basics['geno1']+'.json');
    var genos2 = load('data/out/basic/alleles/Rs'+rsnumber+basics['geno2']+'.json');
    var genos3 = load('data/out/basic/alleles/Rs'+rsnumber+basics['geno3']+'.json');
    if (genos1 !== null) document.getElementById("geno1Mag").innerHTML = genos1['magnitude'];
    if (genos1 !== null) document.getElementById("geno1Sum").innerHTML = genos1['summary'];
    if (genos2 !== null) document.getElementById("geno2Mag").innerHTML = genos2['magnitude'];
    if (genos2 !== null) document.getElementById("geno2Sum").innerHTML = genos2['summary'];
    if (genos3 !== null) document.getElementById("geno3Mag").innerHTML = genos3['magnitude'];
    if (genos3 !== null) document.getElementById("geno3Sum").innerHTML = genos3['summary'];
    if (genos1 !== null) repute1 = genos1['repute'];
    if (genos2 !== null) repute2 = genos2['repute'];
    if (genos3 !== null) repute3 = genos3['repute'];
    if (genos1 !== null) {
        if (repute1 === 'Bad') {
            obj = document.getElementById('geno1id');
            obj.setAttribute("class", "bad");
        } else if (repute1 === 'Good') {
            obj = document.getElementById('geno1id');
            obj.setAttribute("class", "good");
        }
    }
    if (genos2 !== null) {
        if (repute2 === 'Bad') {
            obj = document.getElementById('geno2id');
            obj.setAttribute("class", "bad");
        } else if (repute2 === 'Good') {
            obj = document.getElementById('geno2id');
            obj.setAttribute("class", "good");
        }
    }
    if (genos3 !== null) {
        if (repute3 === 'Bad') {
            obj = document.getElementById('geno3id');
            obj.setAttribute("class", "bad");
        } else if (repute3 === 'Good') {
            obj = document.getElementById('geno3id');
            obj.setAttribute("class", "good");
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
document.title = 'Rs'+rsnumber;    // 设置title的值。
var wordlist = load('data/out/keyword/arranged/Rs'+rsnumber+'.json');
writewords(wordlist, rsnumber);
console.log("title="+document.title);
document.getElementById("rstitle").innerHTML = 'Rs'+rsnumber;
mybasics = getbasics(rsnumber);
getgenotype(rsnumber, mybasics);

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