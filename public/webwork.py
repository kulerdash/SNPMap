#encoding:utf-8
'''
@File    :   webwork.py
@Time    :   2020/11/20 10:17:57
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here
import json

import os

import time

from lemminflect import getLemma

def getweb(a, filename):
    with open('data\\out\\PMIDList\\'+filename, 'r', encoding = 'utf-8') as fp:
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
        filelist = os.listdir('data\\out\\abstractPMID')
        if 'PMID'+str(pmidlist[i])+'.json' in filelist:
            with open('data\\out\\abstractPMID\\PMID'+str(pmidlist[i])+'.json', 'r', encoding = 'utf-8') as gp:
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
    time_start = time.time()
    filelist = os.listdir('data\\out\\keyword')
    for i in range(0, len(filelist)):
        if filelist[i].count('.json')>0 and filelist[i].count('Rs')>0:
            with open('data\\out\\keyword\\'+filelist[i]) as f:
                a = json.load(f)
            webresult = getweb(a, filelist[i])
            g = open('data\\out\\webwork\\'+filelist[i], 'a', encoding='utf-8')
            g.truncate(0)
            webresult = sorted(webresult.items(),key=lambda x:x[1])#根据单词个数进行排序
            webresult = webresult[::-1]
            with open('data\\out\\webwork\\'+filelist[i], 'a', encoding='utf-8') as hp:
                json.dump(webresult, hp)
    time_end = time.time()
    print('time cost',time_end-time_start,'s')

if __name__ == '__main__':
    main()