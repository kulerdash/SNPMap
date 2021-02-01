#encoding:utf-8
'''
@File    :   rest.py
@Time    :   2020/12/15 15:03:00
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here
import re

import os

import sys

import time

import json

from wordmatch import wordsearch, clearredundancy

from SelectPMID import GetPMID

from api.PMIDRetrieve.SubmitPMIDListAmended import SubmitPMIDList

from clean import cleansing

from lemminflect import getLemma


def arrange(a, filename):
    info = {'Check':1, 'Gene':{'number':0, 'data':[]}, 'Disease':{'number':0, 'data':[]}, 'Chemical':{'number':0, 'data':[]}}
    if len(a)>10 and a[0]['value']>2:
        for j in range(0, len(a)):
            if a[j]['value']>2:
                info[a[j]['type']]['number'] += a[j]['value']
                info[a[j]['type']]['data'].append(a[j])
    else:
        info['Check'] = 0
    g = open('data/out/keyword/arranged/'+filename, 'w', encoding='utf-8')
    g.write(json.dumps(info))


def getweb(a, filename):
    with open('data/out/PMIDList/'+filename.strip('.txt')+'.json', 'r', encoding = 'utf-8') as fp:
        pmidlist = json.load(fp)
    abstract = {}
    webresult = {}
    testresult = {}
    b = []
    if len(a)>10 and a[0]['value']>2:
        for i in range(0, len(a)):
            if a[i]['value'] > 2:
                b.append(a[i])
    a = b
    for i in range (0, len(pmidlist)):
        artwordlist = []
        filelist = os.listdir('data/out/abstractPMID')
        if 'PMID'+str(pmidlist[i])+'.json' in filelist:
            with open('data/out/abstractPMID/PMID'+str(pmidlist[i])+'.json', 'r', encoding = 'utf-8') as gp:
                article = json.load(gp)
            abstract[pmidlist[i]] = article
            artwordbiglist = article['passages'][0]['annotations'] + article['passages'][1]['annotations']
            for j in range (0, len(artwordbiglist)):
                fire = artwordbiglist[j]['text']
                fire = getLemma(fire, upos='NOUN', lemmatize_oov=True)
                fire = "".join(tuple(fire))
                fire = fire.lower()
                artwordlist.append(fire)
            for j in range (0, len(a)):
                for k in range (j+1, len(a)):
                    if a[j]['name'].lower() in artwordlist and a[k]['name'].lower() in artwordlist:
                        if a[j]['name']+'$]['+a[k]['name'] not in testresult:
                            webresult[a[j]['name'], a[k]['name']] = 1
                            testresult[a[j]['name']+'$]['+a[k]['name']] = True
                        else:
                            webresult[a[j]['name'], a[k]['name']] += 1
    return webresult

def main():
    # 读取Samples文件夹内文件按行读取到列表中
    time_start = time.time()
    filename = sys.argv[1]
    searchObj = re.search(r'([0-9]+)', filename)
    if searchObj:
        filename = 'Rs' + filename
    filename = filename + '.txt'
    if filename.count('.txt')>0 and filename.count('Rs')>0:
        g = open('data/out/abstract/'+filename.strip('.txt')+'.json', 'w', encoding='utf-8')
        kd = str(SubmitPMIDList('data/out/PMIDList/'+filename, 'biocjson', ''), encoding="utf-8")
        kd = kd.replace('}\n', '},\n')
        kd = kd.rstrip('\n')
        kd = kd.rstrip(',')
        kd = '[\n'+kd+'\n]'
        g.write(kd)
        with open('data/out/abstract/'+filename.strip('.txt')+'.json', 'r', encoding='utf-8') as tae:
            al = json.load(tae)
        cleansing(al, filename)
        with open('data/out/abstract/'+filename.strip('.txt')+'.json', 'r',encoding='utf-8') as fp:
            maxdata = json.load(fp)
            for j in range(0, len(maxdata)):
                g = open('data/out/abstractPMID/PMID'+maxdata[j]['id']+'.json', 'w', encoding='utf-8')
                g.truncate(0)
                with open('data/out/abstractPMID/PMID'+maxdata[j]['id']+'.json', 'a', encoding='utf-8') as gp:
                    json.dump(maxdata[j], gp)
        #wordsearch('Temp/Abstract/Abstract'+filelist[i].strip('.txt')+'.json')
        final = wordsearch('data/out/abstract/'+filename.strip('.txt')+'.json')
        from operator import itemgetter
        sortedfinal = sorted(final,key=lambda x:x["value"])#根据单词个数进行排序
        #sortedfinal = array(sortedfinal)
        sortedfinal = sortedfinal[::-1]
        sortedfinal = clearredundancy(sortedfinal)
        sortedfinal = sorted(sortedfinal,key=lambda x:x["value"])#根据单词个数进行排序
        #sortedfinal = array(sortedfinal)
        sortedfinal = sortedfinal[::-1]
        h = open('data/out/keyword/'+filename.strip('.txt')+'.json', 'w', encoding='utf-8')
        h.write(json.dumps(sortedfinal))
        h.close()
        with open('data/out/keyword/'+filename.strip('.txt')+'.json', 'r', encoding='utf-8') as f:
            a = json.loads(f.read())
        arrange(a, filename.strip('.txt')+'.json')
        webresult = getweb(sortedfinal, filename)
        g = open('data/out/webwork/'+filename.strip('.txt')+'.json', 'a', encoding='utf-8')
        g.truncate(0)
        webresult = sorted(webresult.items(),key=lambda x:x[1])#根据单词个数进行排序
        webresult = webresult[::-1]
        with open('data/out/webwork/'+filename.strip('.txt')+'.json', 'a', encoding='utf-8') as hp:
            json.dump(webresult, hp)
        print(filename + ' is finished.')
    time_end = time.time()
    print('time cost',time_end-time_start,'s')

if __name__ == '__main__':
    main()