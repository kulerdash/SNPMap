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
    return json;
}

function decidesize(size) {
    if (size < 20) {
        return size * 2;
    } /*else if (size < 40) {
        return (0.4 * size + 12) * 3;
    }*/ else {
        return (0.15 * size + 17) * 2;
    }
}

function writewords(wordlist, weblist, rsnumber) {
    // 引入 ECharts 主模块
    if (wordlist['Check'] === 1) {
        var myChart = echarts.init(document.getElementById('main'));
        var categories = [];
        var data = [];
        var data2 = [];
        // 指定图表的配置项和数据
        if (wordlist['Disease']['number'] !== 0) {
            categories.push({ name: 'Disease' });
            data2.push('Disease');
        }
        if (wordlist['Chemical']['number'] !== 0) {
            categories.push({ name: 'Chemical' });
            data2.push('Chemical');
        }
        if (wordlist['Gene']['number'] !== 0) {
            categories.push({ name: 'Gene' });
            data2.push('Gene');
        }
        var q = 0;
        for (m = 0; m < wordlist['Disease']['data'].length; m++) {
            data.push({ category: q, name: wordlist['Disease']['data'][m].name, value: wordlist['Disease']['data'][m].value, symbolSize: decidesize(wordlist['Disease']['data'][m].value), des: 'des' + wordlist['Disease']['data'][m].name });
            if (m === wordlist['Disease']['data'].length - 1) q += 1;
        }
        for (m = 0; m < wordlist['Chemical']['data'].length; m++) {
            data.push({ category: q, name: wordlist['Chemical']['data'][m].name, value: wordlist['Chemical']['data'][m].value, symbolSize: decidesize(wordlist['Chemical']['data'][m].value), des: 'des' + wordlist['Chemical']['data'][m].name });
            if (m === wordlist['Chemical']['data'].length - 1) q += 1;
        }
        for (m = 0; m < wordlist['Gene']['data'].length; m++) {
            data.push({ category: q, name: wordlist['Gene']['data'][m].name, value: wordlist['Gene']['data'][m].value, symbolSize: decidesize(wordlist['Gene']['data'][m].value), des: 'des' + wordlist['Gene']['data'][m].name });
            if (m === wordlist['Gene']['data'].length - 1) q += 1;
        }
        var arrangedata = data;
        for (m = arrangedata.length - 1; m >= 0; m--) {
            for (n = 0; n < m - 1; n++) {
                if (arrangedata[n]['value'] < data[n + 1]['value']) {
                    t = arrangedata[n];
                    arrangedata[n] = arrangedata[n + 1];
                    arrangedata[n + 1] = t;
                }
            }
        }
        var webfinal = [];
        for (m = 0; m < weblist.length; m++) {
            word1 = weblist[m][0][0];
            word2 = weblist[m][0][1];
            thevalue = weblist[m][1];
            if (thevalue >= 2) { webfinal.push({ source: word1, target: word2, value: thevalue, lineStyle: { width: thevalue / 2 }, name: word1 + ' TO ' + word2 }); }
        }
        var tfinal = JSON.stringify(webfinal);
        webfinal = JSON.parse(tfinal);
        var option = {
            tooltip: {
                formatter: function (x) {
                    if (x.data.category === 0) {
                        return data2[0] + ' <br />' + x.data.name + ': ' + x.data.value;
                    } else if (x.data.category === 1) {
                        return data2[1] + ' <br />' + x.data.name + ': ' + x.data.value;
                    } else {
                        return data2[2] + ' <br />' + x.data.name + ': ' + x.data.value;
                    }
                }
            },
            legend: [{
                // selectedMode: 'single',
                data: data2
            }],
            toolbox: {
                // 显示工具箱
                show: true,
                feature: {
                    saveAsImage: {//保存图片
                        show: true,
                        title: 'Save as image'
                    },
                    dataView: { //数据视图
                        show: true,
                        title: 'Original data',
                        readOnly: true,
                        optionToContent: function (opt) {
                            var table = '<table class="pure-table"><tbody><tr>'
                                + '<th>' + 'Keyword' + '</th>'
                                + '<th>' + 'Value' + '</th>'
                                + '</tr>';
                            for (var m = 0, l = data.length; m < l; m++) {
                                table += '<tr>'
                                    + '<td>' + arrangedata[m]['name'] + '</td>'
                                    + '<td>' + arrangedata[m]['value'] + '</td>'
                                    + '</tr>';
                            }
                            table += '</tbody></table>';
                            return table;

                        }
                    },
                    restore: { //重置
                        show: true,
                        title: 'Restore'
                    }
                }
            },
            animationDuration: 500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph', // 类型:关系图
                    layout: 'force', //图的布局，类型为力导图
                    roam: true,
                    focusNodeAdjacency: true,
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    force: {
                        repulsion: 2000/*,
                        edgeLength: [300, 1000]*/
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        /*fontSize: function (x) {
                            return (x.data['symbolSize']).toString();
                        },*/
                        formatter: function (x) {
                            if (x.data.value >= 3) {
                                return x.data.name;
                            } else {
                                return '';
                            }
                        }
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.3
                    },
                    emphasis: {

                    },

                    // 数据
                    data: data,
                    links: webfinal,
                    categories: categories
                }
            ]
        };
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

function wordcloudlist(wordlist, rsnumber) {
    var myCharted = echarts.init(document.getElementById('wordcloud'));
    var keywordscloud = [];
    for (var ms = 0; ms < wordlist.length; ms++) {
        keywordscloud.push({ name: wordlist[ms]['name'], value: wordlist[ms]['value'] });
    }
    var option = {
        tooltip: {
            show: true
        },
        series: [{
            name: 'Keyword',
            type: 'wordCloud',
            sizeRange: [15, 120],
            gridSize: 20,
            rotationRange: [0, 0],
            rotationStep: 45,
            textRotation: [0],
            shape: 'circle',
            drawOutOfBound: false,
            textStyle: {
                normal: {
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 250),
                            Math.round(Math.random() * 250),
                            Math.round(Math.random() * 250)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: keywordscloud
        }]
    };
    myCharted.setOption(option);
}

function getbasics(rsnumber) {
    $.ajax({
        url: "/file/basic/" + rsnumber, //json文件位置
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (data) {
            var basics = data;
            for (var key in basics) {
                obj = document.getElementById(key);
                if (!(obj)) {
                    console.log(key + ' does not exist!')
                } else {
                    document.getElementById(key).innerHTML = basics[key];
                }
            }
        }
    })
    var basics = load('/data/out/basic/Rs' + rsnumber + '.json');
    return basics;
}

function getgenotype(rsnumber, basics) {
    $.ajax({
        url: "/file/genotype/" + rsnumber + basics['geno1'], //json文件位置
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (data) {
            var genos1 = data;
            if (genos1 !== null) {
                document.getElementById("geno1Mag").innerHTML = genos1['magnitude'];
                document.getElementById("geno1Sum").innerHTML = genos1['summary'];
                repute1 = genos1['repute'];
                if (repute1 === 'Bad') {
                    obj = document.getElementById('geno1id');
                    obj.setAttribute("class", "bad");
                } else if (repute1 === 'Good') {
                    obj = document.getElementById('geno1id');
                    obj.setAttribute("class", "good");
                }
            }
        }
    })
    $.ajax({
        url: "/file/genotype/" + rsnumber + basics['geno2'], //json文件位置
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (data) {
            var genos2 = data;
            if (genos2 !== null) {
                document.getElementById("geno2Mag").innerHTML = genos2['magnitude'];
                document.getElementById("geno2Sum").innerHTML = genos2['summary'];
                repute2 = genos2['repute'];
                if (repute2 === 'Bad') {
                    obj = document.getElementById('geno2id');
                    obj.setAttribute("class", "bad");
                } else if (repute2 === 'Good') {
                    obj = document.getElementById('geno2id');
                    obj.setAttribute("class", "good");
                }
            }
        }
    })
    $.ajax({
        url: "/file/genotype/" + rsnumber + basics['geno3'], //json文件位置
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (data) {
            var genos3 = data;
            if (genos3 !== null) {
                document.getElementById("geno3Mag").innerHTML = genos3['magnitude'];
                document.getElementById("geno3Sum").innerHTML = genos3['summary'];
                repute3 = genos3['repute'];
                if (repute3 === 'Bad') {
                    obj = document.getElementById('geno3id');
                    obj.setAttribute("class", "bad");
                } else if (repute3 === 'Good') {
                    obj = document.getElementById('geno3id');
                    obj.setAttribute("class", "good");
                }
            }
        }
    })
}

function getpopulation(rsnumber) {
    $.ajax({
        url: "/file/population/" + rsnumber, //json文件位置
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (data) {
            var poplist = data;
            if (poplist !== null) {
                var myChart = echarts.init(document.getElementById('main2'));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (x) {
                            var tendername;
                            var ans;
                            switch (x.name) {
                                case 'CEU':
                                    tendername = 'Utah residents with Northern or Western European ancestry';
                                    break;
                                case 'HCB':
                                    tendername = 'Han Chinese in Beijing, China';
                                    break;
                                case 'JPT':
                                    tendername = 'Japanese in Tokyo, Japan';
                                    break;
                                case 'YRI':
                                    tendername = 'Yoruba in Ibadan, Nigeria';
                                    break;
                                case 'ASW':
                                    tendername = 'African ancestry in Southwest USA';
                                    break;
                                case 'CHB':
                                    tendername = 'Han Chinese in Beijing, China';
                                    break;
                                case 'CHD':
                                    tendername = 'Chinese in metropolitan Denver, CO, United States';
                                    break;
                                case 'GIH':
                                    tendername = 'Gujarati Indians in Houston, TX, United States';
                                    break;
                                case 'LWK':
                                    tendername = 'Luhya in Webuye, Kenya';
                                    break;
                                case 'MEX':
                                    tendername = 'Mexican ancestry in Los Angeles, CA, United States';
                                    break;
                                case 'MXL':
                                    tendername = 'Mexican ancestry in Los Angeles, CA, United States';
                                    break;
                                case 'MKK':
                                    tendername = 'Maasai in Kinyawa, Kenya';
                                    break;
                                case 'TSI':
                                    tendername = 'Toscani in Italia';
                            }
                            ans = tendername + '<br / >' + poplist['geno1'] + ': ' + poplist['geography'][x.name][0];
                            ans += '<br />' + poplist['geno2'] + ': ' + poplist['geography'][x.name][1];
                            ans += '<br />' + poplist['geno3'] + ': ' + poplist['geography'][x.name][2];
                            return ans;
                        }
                    },
                    toolbox: {
                        // 显示工具箱
                        show: true,
                        feature: {
                            saveAsImage: {//保存图片
                                show: true,
                                title: 'Save as image'
                            },
                            dataView: { //数据视图
                                show: true,
                                title: 'Original data',
                                readOnly: true,
                                optionToContent: function (opt) {

                                }
                            }
                        }
                    },
                    legend: {
                        data: []
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        max: 100
                    },
                    yAxis: {
                        type: 'category',
                        data: []
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight',
                                formatter: function (x) {
                                    if (x.data > 3) {
                                        return x.data;
                                    } else {
                                        return '';
                                    }
                                }
                            },
                            data: []
                        },
                        {
                            name: '',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight',
                                formatter: function (x) {
                                    if (x.data > 3) {
                                        return x.data;
                                    } else {
                                        return '';
                                    }
                                }
                            },
                            data: []
                        },
                        {
                            name: '',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight',
                                formatter: function (x) {
                                    if (x.data > 3) {
                                        return x.data;
                                    } else {
                                        return '';
                                    }
                                }
                            },
                            data: []
                        },
                    ]
                };
                option['legend']['data'].push(poplist['geno1']);
                option['legend']['data'].push(poplist['geno2']);
                option['legend']['data'].push(poplist['geno3']);
                option['series'][0]['name'] = poplist['geno1'];
                option['series'][1]['name'] = poplist['geno2'];
                option['series'][2]['name'] = poplist['geno3'];
                var lend = Object.keys(poplist['geography']);
                var len = lend.length;
                for (i = len - 1; i > -1; i--) {
                    for (j = 0; j < i; j++) {
                        if (poplist['geography'][lend[j]][0] > poplist['geography'][lend[j + 1]][0]) {
                            var jh = lend[j];
                            lend[j] = lend[j + 1];
                            lend[j + 1] = jh;
                        }
                    }
                }
                var i = 0;
                for (sam = 0; sam < len; sam++) {
                    key = lend[sam];
                    if ((poplist['geography'][key][0] !== 0 || poplist['geography'][key][1] !== 0 || poplist['geography'][key][2] !== 0) && key !== 'HCB') {
                        option['yAxis']['data'].push(key);
                        option['series'][0]['data'].push(poplist['geography'][key][0]);
                        option['series'][1]['data'].push(poplist['geography'][key][1]);
                        option['series'][2]['data'].push(poplist['geography'][key][2]);
                        i += 1;
                    }
                }
                myChart.setOption(option, 'xml');
            } else {
                document.getElementById('populationchart').innerHTML = 'Not enough information to render map';
            }
        }
    })
}

function getalfa(rsnumber) {
    $.ajax({
        url: "/file/alfa/" + rsnumber, //json文件位置
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (data) { //请求成功完成后要执行的方法 
            poplist = data
            if (poplist !== null) {
                pop = [];
                tlegend = [];
                for (var i in poplist['results']) {
                    var ref = poplist['results'][i]['ref'];
                    for (var j in poplist['results'][i]['counts']) {
                        for (var k in poplist['results'][i]['counts'][j]['allele_counts']) {
                            var total = 0;
                            var fire = poplist['results'][i]['counts'][j]['allele_counts'][k];
                            for (var l in poplist['results'][i]['counts'][j]['allele_counts'][k]) {
                                total = total + poplist['results'][i]['counts'][j]['allele_counts'][k][l];
                            }
                            for (var l in poplist['results'][i]['counts'][j]['allele_counts'][k]) {
                                fire[l] = 100 * fire[l] / total;
                                fire[l] = fire[l].toFixed(1);
                            }
                            if (tlegend.length === 0) {
                                for (var l in poplist['results'][i]['counts'][j]['allele_counts'][k]) {
                                    tlegend.push(l);
                                }
                            }
                            var tendername;
                            switch (k) {
                                case 'SAMN10492695':
                                    tendername = 'European';
                                    break;
                                case 'SAMN10492698':
                                    tendername = 'African American';
                                    break;
                                case 'SAMN10492696':
                                    tendername = 'African Others';
                                    break;
                                case 'SAMN10492703':
                                    tendername = 'African (Note 1)';
                                    break;
                                case 'SAMN10492697':
                                    tendername = 'East Asian';
                                    break;
                                case 'SAMN10492702':
                                    tendername = 'South Asian';
                                    break;
                                case 'SAMN10492701':
                                    tendername = 'Other Asian';
                                    break;
                                case 'SAMN10492704':
                                    tendername = 'Asian (Note 2)';
                                    break;
                                case 'SAMN10492699':
                                    tendername = 'Latin American 1';
                                    break;
                                case 'SAMN10492700':
                                    tendername = 'Latin American 2';
                                    break;
                                case 'SAMN11605645':
                                    tendername = 'Other';
                                    break;
                                case 'SAMN10492705':
                                    tendername = 'Total (Note 3)';
                            }
                            pop.push({
                                name: tendername,
                                data: fire
                                //data: poplist['results'][i]['ref'][j]['allele_counts'][k]
                            });
                        }
                    }
                }
                var myChart = echarts.init(document.getElementById('alfamain'));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        //formatter: 
                    },
                    toolbox: {
                        // 显示工具箱
                        show: true,
                        feature: {
                            saveAsImage: {//保存图片
                                show: true,
                                title: 'Save as image'
                            },
                            dataView: { //数据视图
                                show: true,
                                title: 'Original data',
                                readOnly: true,
                                optionToContent: function (opt) {

                                }
                            }
                        }
                    },
                    legend: {
                        data: []
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        max: 100
                    },
                    yAxis: {
                        type: 'category',
                        data: []
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight',
                                formatter: function (x) {
                                    if (x.data > 3) {
                                        return x.data;
                                    } else {
                                        return '';
                                    }
                                }
                            },
                            data: []
                        }
                    ]
                };
                for (i = 1; i < tlegend.length; i++) {
                    option['series'].push({
                        name: '',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            show: true,
                            position: 'insideRight',
                            formatter: function (x) {
                                if (x.data > 3) {
                                    return x.data;
                                } else {
                                    return '';
                                }
                            }
                        },
                        data: []
                    });
                }
                for (i = 0; i < tlegend.length; i++) {
                    option['legend']['data'].push(tlegend[i]);
                    option['series'][i]['name'] = tlegend[i];
                }
                len = pop.length;
                for (i = len - 1; i > -1; i--) {
                    for (j = 0; j < i; j++) {
                        if (pop[j]['data'][tlegend[0]] > pop[j + 1]['data'][tlegend[0]]) {
                            var jh = pop[j];
                            pop[j] = pop[j + 1];
                            pop[j + 1] = jh;
                        }
                    }
                }
                for (sam = 0; sam < len; sam++) {
                    var bool = false;
                    for (san = 0; san < tlegend.length; san++) {
                        if (pop[sam][tlegend[san]] !== 0) {
                            bool = true;
                        }
                    }
                    if (bool) {
                        option['yAxis']['data'].push(pop[sam]['name']);
                        for (san = 0; san < tlegend.length; san++) {
                            option['series'][san]['data'].push(pop[sam]['data'][tlegend[san]]);
                        }
                    }
                }
                myChart.setOption(option, 'xml');
                console.log('seehere');
                console.log(option);
            } else {
                document.getElementById('alfamain').innerHTML = 'Not enough information to render map';
            }
        }
    })
}

/*var geo = poplist['geography'];
        var mapFeatures = echarts.getMap('world').geoJson.features;
        mapFeatures.forEach(function(v){
            // 地区名称
            var name = v.properties.name;
            // 地区经纬度
            geoCoordMap[name] = v.properties.cp;
            data.push({
                    "name":name,
                    "value":[
                            {name:"2013",value:Math.round(Math.random() * 100 + 10)},
                            {name:"2014",value:Math.round(Math.random() * 100 + 10)},
                            {name:"2015",value:Math.round(Math.random() * 100 + 10)}
                            ]
                })
        });
                
        var option = {
            title: {  
                
                
                sublink: 'http://esa.un.org/wpp/Excel-Data/population.htm',  
                left: 'center',  
                top: 'top'  
            },  
           /* tooltip: {  
                trigger: 'item',  
                formatter: function (params) {  
                    var value = (params.value + '').split('.');  
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')  
                            + '.' + value[1];  
                    return params.seriesName + '<br/>' + params.name + ' : ' + value;  
                }  
            },*/
/*visualMap: {  
    min: 0,  
    max: 1000000,  
    text:['High','Low'],  
    realtime: false,  
    calculable: true,  
    color: ['orangered','yellow','lightskyblue']  
},  
series: [  
    {  
        name: 'World Population (2010)',  
        type: 'map',  
        mapType: 'world',  
        roam: true,  
        itemStyle:{  
            emphasis:{label:{show:true}}  
        }
    }
]
}
myChart.setOption(option, 'xml');*/

function listarticle(rsnumber) {
    $.ajax({
        url: "/file/pmidlist/" + rsnumber, //json文件位置
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (data) {
            var pmidlist = data;
            pages = Math.ceil(pmidlist.length / 10);
            lastpage = pmidlist.length % 10;
            if (pages > 1) {
                document.getElementById('pagespills').removeAttribute('hidden');
            }
            for (i = 0; i < pages; i++) {
                var nodea = document.createElement('a');
                var josh = (i + 1).toString();
                var textnodea = document.createTextNode(josh);
                nodea.appendChild(textnodea);
                nodea.setAttribute('href', '#page' + josh);
                nodea.setAttribute('role', 'tab');
                nodea.setAttribute('data-toggle', 'tab');
                var nodeli = document.createElement('li');
                nodeli.appendChild(nodea);
                nodeli.setAttribute('role', 'presentation');
                if (i === 0) {
                    nodeli.setAttribute('class', 'active');
                }
                document.getElementById('pagespills').appendChild(nodeli);
                var nodeth1 = document.createElement('th');
                var nodeth2 = document.createElement('th');
                var nodeth3 = document.createElement('th');
                var textnodeth1 = document.createTextNode('PMID');
                var textnodeth2 = document.createTextNode('Title');
                var textnodeth3 = document.createTextNode('Keywords');
                nodeth1.appendChild(textnodeth1);
                nodeth2.appendChild(textnodeth2);
                nodeth3.appendChild(textnodeth3);
                var nodetr = document.createElement('tr');
                nodetr.appendChild(nodeth1);
                nodetr.appendChild(nodeth2);
                nodetr.appendChild(nodeth3);
                var nodetable = document.createElement('table');
                nodetable.appendChild(nodetr);
                nodetable.setAttribute('class', 'pure-table');
                nodetable.setAttribute('id', 'articleform' + josh);
                var nodedivin = document.createElement('div');
                nodedivin.appendChild(nodetable);
                nodedivin.setAttribute('class', 'col-xs-12 col-md-12');
                var nodediv = document.createElement('div');
                nodediv.appendChild(nodedivin);
                nodediv.setAttribute('role', 'tabpanel');
                nodediv.setAttribute('id', 'page' + josh);
                if (i === 0) {
                    nodediv.setAttribute('class', 'tab-pane fade in active')
                } else {
                    nodediv.setAttribute('class', 'tab-pane fade');
                }
                document.getElementById('formitself').appendChild(nodediv);
                for (j = i * 10; j < (i + 1) * 10; j++) {
                    if (j < pmidlist.length) {
                        var node1 = document.createElement('tr');
                        node1.setAttribute('id', 'article' + j.toString());
                        document.getElementById('articleform' + josh).appendChild(node1);
                        var node2 = document.createElement('td');
                        var node4 = document.createElement('td');
                        var node6 = document.createElement('td');
                        var refnode = document.createElement('a');
                        var pmid = pmidlist[j]['id'];
                        var year = pmidlist[j]['passages'][0]['infons']['year'];
                        var title = pmidlist[j]['passages'][0]['text'];
                        var journal = pmidlist[j]['passages'][0]['infons']['journal'];
                        var authors = pmidlist[j]['passages'][0]['infons']['authors'];
                        var keywords = pmidlist[j]['passages'][1]['annotations'];
                        var checkkey = {};
                        var keyform = '';
                        for (k = 0; k < keywords.length; k++) {
                            keytype = keywords[k]['infons']['type'];
                            if (keywords[k]['text'] in checkkey) {

                            } else if (keytype === 'Disease' || keytype === 'Chemical' || keytype === 'Gene') {
                                if (keyform === '') {
                                    keyform = keywords[k]['text'];
                                } else {
                                    keyform = keyform + ', ' + keywords[k]['text'];
                                }
                                checkkey[keywords[k]['text']] = true;
                            }
                        }
                        var textnode1 = document.createTextNode(pmid);
                        var textnode3 = document.createTextNode(title);
                        var textnode5 = document.createTextNode(keyform);
                        refnode.appendChild(textnode1);
                        refnode.setAttribute('href', 'https://pubmed.ncbi.nlm.nih.gov/' + pmid + '/');
                        refnode.setAttribute('target', '_blank');
                        node2.appendChild(refnode);
                        node4.appendChild(textnode3);
                        node6.appendChild(textnode5);
                        document.getElementById('article' + j.toString()).appendChild(node2);
                        document.getElementById('article' + j.toString()).appendChild(node4);
                        document.getElementById('article' + j.toString()).appendChild(node6);
                    }
                }

            }
        }
    })
}

urled = location.pathname;
var rsnumber;
var patt1 = /\/rs\/id\/([0-9]+)/;
if (patt1.test(urled)) {
    arr = urled.split('/');
    rsnumber = arr[3];
}
document.title = 'Rs' + rsnumber;    // 设置title的值。
var data1 = null;
var data2 = null;
var ajax1 = $.ajax({
    url: "/file/wordlist/" + rsnumber, //json文件位置
    type: "GET", //请求方式为get
    dataType: "json",
    success: function (data) {
        data1 = data;
    }
});
var ajax2 = $.ajax({
    url: "/file/weblist/" + rsnumber,
    type: "GET",
    dataType: "json",
    success: function (data) {
        data2 = data;
    }
});
$.ajax({
    url: "/file/newwordlist/" + rsnumber, //json文件位置
    type: "GET", //请求方式为get
    dataType: "json", //返回数据格式为json
    success: function (data) {
        var newwordlist = data;
        wordcloudlist(newwordlist, rsnumber);
    }
})
$.when(ajax1, ajax2).done(function () {
    writewords(data1, data2, rsnumber);
});
document.getElementById("rstitle").innerHTML = 'Rs' + rsnumber;
mybasics = getbasics(rsnumber);
getgenotype(rsnumber, mybasics);
getpopulation(rsnumber);
getalfa(rsnumber);
listarticle(rsnumber);

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