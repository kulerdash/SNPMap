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
    if (size<20) {
        return size*4;
    } else if (size<40) {
        return (0.4*size+12)*4;
    } else {
        return (0.15*size+22)*4;
    }
}

function writewords(wordlist, rsnumber) {
    // 引入 ECharts 主模块
    if (wordlist['Check'] === 1) {
        var myChart = echarts.init(document.getElementById('main'));
        var categories = [];
        var data = [];
        var data2 = [];
        // 指定图表的配置项和数据
        if (wordlist['Disease']['number'] !== 0) {
            categories.push({name: 'Disease'});
            data2.push('Disease');
        }
        if (wordlist['Chemical']['number'] !== 0) {
            categories.push({name: 'Chemical'});
            data2.push('Chemical');
        }
        if (wordlist['Gene']['number'] !== 0) {
            categories.push({name: 'Gene'});
            data2.push('Gene');
        }
        var q = 0;
        for (m = 0; m < wordlist['Disease']['data'].length; m++) {
            data.push({ category:q, name:wordlist['Disease']['data'][m].name, value:wordlist['Disease']['data'][m].value, symbolSize: decidesize(wordlist['Disease']['data'][m].value), des: 'des'+wordlist['Disease']['data'][m].name });
            if (m === wordlist['Disease']['data'].length-1) q += 1;
        }
        for (m = 0; m < wordlist['Chemical']['data'].length; m++) {
            data.push({ category:q, name:wordlist['Chemical']['data'][m].name, value:wordlist['Chemical']['data'][m].value, symbolSize: decidesize(wordlist['Chemical']['data'][m].value), des: 'des'+wordlist['Chemical']['data'][m].name });
            if (m === wordlist['Chemical']['data'].length-1) q += 1;
        }
        for (m = 0; m < wordlist['Gene']['data'].length; m++) {
            data.push({ category:q, name:wordlist['Gene']['data'][m].name, value:wordlist['Gene']['data'][m].value, symbolSize: decidesize(wordlist['Gene']['data'][m].value), des: 'des'+wordlist['Gene']['data'][m].name });
            if (m === wordlist['Gene']['data'].length-1) q += 1;
        }
        var arrangedata = data;
        for (m = arrangedata.length-1 ;m >=0;m--) {
            for (n = 0;n < m-1;n++){
                if (arrangedata[n]['value'] < data[n+1]['value']) {
                    t = arrangedata[n];
                    arrangedata[n] = arrangedata[n+1];
                    arrangedata[n+1] = t;
                }
            }
        }
        console.log(arrangedata);
        var option = {
            tooltip: {
                formatter: function (x) {
                    if (x.data.category === 0) {
                        return data2[0]+' <br />'+x.data.name+': '+x.data.value;
                    } else if (x.data.category === 1) {
                        return data2[1]+' <br />'+x.data.name+': '+x.data.value;
                    } else {
                        return data2[2]+' <br />'+x.data.name+': '+x.data.value;
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
                        optionToContent: function(opt) {
                            var table = '<table class="pure-table"><tbody><tr>'
                                         + '<th>' + 'Keyword'+ '</th>'
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
            animationDuration: 1500,
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
                    link: [],
                    categories: categories
                }
            ]
        };
        
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, 'xml');
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

function listarticle(rsnumber) {
    var pmidlist = load('data/out/abstract/Rs' + rsnumber + '.json');
    pages = Math.ceil(pmidlist.length / 10);
    lastpage = pmidlist.length % 10;
    if (pages > 1) {
        document.getElementById('pagespills').removeAttribute('hidden');
    }
    for (i = 0; i < pages; i++) {
        var nodea = document.createElement('a');
        var josh = (i+1).toString();
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
                document.getElementById('articleform'+josh).appendChild(node1);
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
writewords(wordlist, rsnumber);
console.log("title=" + document.title);
document.getElementById("rstitle").innerHTML = 'Rs' + rsnumber;
mybasics = getbasics(rsnumber);
getgenotype(rsnumber, mybasics);
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