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

function decidesize(size) {
    if (size < 20) {
        return size * 4;
    } else if (size < 40) {
        return (0.4 * size + 12) * 4;
    } else {
        return (0.15 * size + 22) * 4;
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
        console.log(arrangedata);
        console.log('ori ' + weblist);
        var webfinal = [];
        for (m = 0; m < weblist.length; m++) {
            word1 = weblist[m][0][0];
            word2 = weblist[m][0][1];
            thevalue = weblist[m][1];
            if (thevalue >= 4) { webfinal.push({ source: word1, target: word2, value: thevalue, name: word1 + ' TO ' + word2 }); }
        }
        var tfinal = JSON.stringify(webfinal);
        webfinal = JSON.parse(tfinal);
        console.log('weblist ' + JSON.stringify(webfinal));
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
                        repulsion: 1000,
                        edgeLength: [10, 50]
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        /*fontSize: function (x) {
                            return (x.data['symbolSize']).toString();
                        },*/
                        formatter: function (x) {
                            if (x.data.value >= 9) {
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
                        lineStyle: {
                            width: 10
                        }
                    },

                    // 数据
                    data: data,
                    links: webfinal,
                    categories: categories
                }
            ]
        };
        console.log(option);
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
    var basics = load('data/out/basic/Rs' + rsnumber + '.json');
    for (var key in basics) {
        obj = document.getElementById(key);
        if (!(obj)) {
            console.log(key + ' does not exist!')
        } else {
            document.getElementById(key).innerHTML = basics[key];
        }
    }
    return basics;
}

function getgenotype(rsnumber, basics) {
    var genos1 = load('data/out/basic/alleles/Rs' + rsnumber + basics['geno1'] + '.json');
    var genos2 = load('data/out/basic/alleles/Rs' + rsnumber + basics['geno2'] + '.json');
    var genos3 = load('data/out/basic/alleles/Rs' + rsnumber + basics['geno3'] + '.json');
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

function getpopulation(rsnumber) {
    var poplist = load('data/out/population/Rs' + rsnumber + '.json');
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
        /*var place = [];
        var div = Math.ceil(len / 4) + 1;
        var hang = Math.floor(100 / div);
        jord = len;
        for (i = 0; i < len; i++) {
            if (poplist['geography'][lend[i]][0] == 0 && poplist['geography'][lend[i]][1] == 0 && poplist['geography'][lend[i]][2] == 0) {
                jord -= 1;
            }
        }
        for (i = 0; i < jord; i++) {
            var t = i + 1;
            var divt = Math.ceil(t / 4);
            var hangt = hang * divt;
            var liet;
            if (t % 4 !== 0) {
                liet = 20 * (t % 4);
            } else {
                liet = 80;
            }
            var resulting = [liet.toString() + '%', hangt.toString() + '%'];
            console.log(resulting);
            place.push(resulting);
        }*/
        var i = 0;
        console.log(lend);
        for (sam = 0; sam < len; sam++) {
            key = lend[sam];
            if ((poplist['geography'][key][0] !== 0 || poplist['geography'][key][1] !== 0 || poplist['geography'][key][2] !== 0) && key !== 'HCB') {
                option['yAxis']['data'].push(key);
                option['series'][0]['data'].push(poplist['geography'][key][0]);
                option['series'][1]['data'].push(poplist['geography'][key][1]);
                option['series'][2]['data'].push(poplist['geography'][key][2]);
                /*tender = {
                    name: '',
                    label: {},
                    type: 'pie',
                    radius: [40, 60],
                    center: place[i],
                    encode: {
                        itemName: 'population group',
                        value: key
                    }
                }
                switch (key) {
                    case 'CEU':
                        tender.name = 'Utah residents with Northern or Western European ancestry';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'CEU'
                            }
                        };
                        break;
                    case 'HCB':
                        tender.name = 'Han Chinese in Beijing, China';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'HCB'
                            }
                        };
                        break;
                    case 'JPT':
                        tender.name = 'Japanese in Tokyo, Japan';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'JPT'
                            }
                        };
                        break;
                    case 'YRI':
                        tender.name = 'Yoruba in Ibadan, Nigeria';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'YRI'
                            }
                        };
                        break;
                    case 'ASW':
                        tender.name = 'African ancestry in Southwest USA';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'ASW'
                            }
                        };
                        break;
                    case 'CHB':
                        tender.name = 'Han Chinese in Beijing, China';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'CHB'
                            }
                        };
                        break;
                    case 'CHD':
                        tender.name = 'Chinese in metropolitan Denver, CO, United States';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'CHD'
                            }
                        };
                        break;
                    case 'GIH':
                        tender.name = 'Gujarati Indians in Houston, TX, United States';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'GIH'
                            }
                        };
                        break;
                    case 'LWK':
                        tender.name = 'Luhya in Webuye, Kenya';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'LWK'
                            }
                        };
                        break;
                    case 'MEX':
                        tender.name = 'Mexican ancestry in Los Angeles, CA, United States';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'MEX'
                            }
                        };
                        break;
                    case 'MXL':
                        tender.name = 'Mexican ancestry in Los Angeles, CA, United States';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'MXL'
                            }
                        };
                        break;
                    case 'MKK':
                        tender.name = 'Maasai in Kinyawa, Kenya';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'MKK'
                            }
                        };
                        break;
                    case 'TSI':
                        tender.name = 'Toscani in Italia';
                        tender.label = {
                            normal: {
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    color: '#000000'
                                },
                                formatter: 'TSI'
                            }
                        };
                }
                option['series'].push(tender);*/
                i += 1;
            }
        }
        myChart.setOption(option, 'xml');
    } else {
        document.getElementById('populationchart').innerHTML = 'Not enough information to render map';
    }
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
    var pmidlist = load('data/out/abstract/Rs' + rsnumber + '.json');
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
    /*for (i=0; i<pmidlist.length; i++) {
        var node1 = document.createElement('tr');
        node1.setAttribute('id', 'article'+i.toString());
        document.getElementById('articleform').appendChild(node1);
        var node2 = document.createElement('td');
        var node4 = document.createElement('td');
        var node6 = document.createElement('td');
        var refnode = document.createElement('a');
        var pmid = pmidlist[i]['id'];
        var year = pmidlist[i]['passages'][0]['infons']['year'];
        var title = pmidlist[i]['passages'][0]['text'];
        var journal = pmidlist[i]['passages'][0]['infons']['journal'];
        var authors = pmidlist[i]['passages'][0]['infons']['authors'];
        var keywords = pmidlist[i]['passages'][1]['annotations'];
        var checkkey = {};
        var keyform = '';
        for (j=0; j<keywords.length; j++) {
            keytype = keywords[j]['infons']['type'];
            if (keywords[j]['text'] in checkkey) {

            } else if (keytype === 'Disease' || keytype === 'Chemical' || keytype === 'Gene') {
                if (keyform === '') {
                    keyform = keywords[j]['text'];
                } else {
                    keyform = keyform+', '+keywords[j]['text'];
                }
                checkkey[keywords[j]['text']] = true;
            }
        }
        var textnode1 = document.createTextNode(pmid);
        var textnode3 = document.createTextNode(title);
        var textnode5 = document.createTextNode(keyform);
        refnode.appendChild(textnode1);
        refnode.setAttribute('href', 'https://pubmed.ncbi.nlm.nih.gov/'+pmid+'/');
        refnode.setAttribute('target', '_blank');
        node2.appendChild(refnode);
        node4.appendChild(textnode3);
        node6.appendChild(textnode5);
        document.getElementById('article'+i.toString()).appendChild(node2);
        document.getElementById('article'+i.toString()).appendChild(node4);
        document.getElementById('article'+i.toString()).appendChild(node6);
    }*/
}

var req = load('temp/form.json');
console.log(req.name);
console.log(typeof (req.name));
var patt1 = /rs[0-9]+/;
var patt2 = /[0-9]+/;
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
document.title = 'Rs' + rsnumber;    // 设置title的值。
var wordlist = load('data/out/keyword/arranged/Rs' + rsnumber + '.json');
var weblist = load('data/out/webwork/Rs' + rsnumber + '.json');
writewords(wordlist, weblist, rsnumber);
console.log("title=" + document.title);
document.getElementById("rstitle").innerHTML = 'Rs' + rsnumber;
mybasics = getbasics(rsnumber);
getgenotype(rsnumber, mybasics);
getpopulation(rsnumber);
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