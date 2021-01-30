#encoding:utf-8
'''
@File    :   PubmedRead.py
@Time    :   2020/09/25 11:01:15
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here
import re

import os

import time

import json

from wordmatch import wordsearch, clearredundancy

from SelectPMID import GetPMID

from api.PMIDRetrieve.SubmitPMIDListAmended import SubmitPMIDList

from clean import cleansing

def main():
    # 读取Samples文件夹内文件按行读取到列表中
    time_start = time.time()
    print('Running Python database analysis...')
    filelist = os.listdir('data\\samples')
    for i in range(0, len(filelist)):
        if filelist[i].count('.txt')>0 and filelist[i].count('Rs')>0:
            with open('data\\samples\\'+filelist[i]) as f:
                lines = f.readlines()
            list_pmid = list()
            for j in range(0, len(lines)):#确定扫描单词范围的起始行
                if lines[j].count('PMID')>0:
                    startline = j
                    break
            for j in range(startline, len(lines)):
                list_pmid += (re.findall(r'PMID=([0-9]+)', lines[j]))#将单个英语单词一一保存入字典list_words中
                list_pmid += (re.findall(r'PMID[|]([0-9]+)', lines[j]))
            GetPMID(list_pmid, len(list_pmid),filelist[i])
            g = open('data\\out\\abstract\\'+filelist[i].strip('.txt')+'.json', 'w', encoding='utf-8')
            kd = str(SubmitPMIDList('data\\out\\PMIDList\\'+filelist[i], 'biocjson', ''), encoding="utf-8")
            kd = kd.replace('}\n', '},\n')
            kd = kd.rstrip('\n')
            kd = kd.rstrip(',')
            kd = '[\n'+kd+'\n]'
            g.write(kd)
            with open('data\\out\\abstract\\'+filelist[i].strip('.txt')+'.json', 'r', encoding='utf-8') as tae:
                al = json.load(tae)
            cleansing(al, filelist[i])
            with open('data\\out\\abstract\\'+filelist[i].strip('.txt')+'.json', 'r',encoding='utf-8') as fp:
                maxdata = json.load(fp)
                for j in range(0, len(maxdata)):
                    g = open('data\\out\\abstractPMID\\PMID'+maxdata[j]['id']+'.json', 'w', encoding='utf-8')
                    g.truncate(0)
                    with open('data\\out\\abstractPMID\\PMID'+maxdata[j]['id']+'.json', 'a', encoding='utf-8') as gp:
                        json.dump(maxdata[j], gp)
            '''
            for j in range(0, len(list_pmid)):
                g = open('data\\out\\abstractPMID\\PMID'+list_pmid[j]+'.json', 'w', encoding='utf-8')
                kd = str(SubmitPMIDList('data\\out\\abstractPMID\\'+list_pmid[j]+'.txt', 'biocjson', ''), encoding="utf-8")
                g.write(kd)
            '''
            '''
            for j in range(0, len(list_pmid)):
                g = open('data\\out\\abstractPMID\\temp.txt', 'w', encoding='utf-8')
                g.write(str(list_pmid[j])+'\n')
                kd = str(SubmitPMIDList('data\\out\\abstractPMID\\temp.txt', 'biocjson', ''), encoding='utf-8')
                h = open('data\\out\\abstractPMID\\PMID'+list_pmid[j]+'.json', 'w', encoding='utf-8')
                h.write(kd)
                g.truncate(0)
            '''
            #wordsearch('Temp\\Abstract\\Abstract'+filelist[i].strip('.txt')+'.json')
            final = wordsearch('data\\out\\abstract\\'+filelist[i].strip('.txt')+'.json')
            from operator import itemgetter
            sortedfinal = sorted(final,key=lambda x:x["value"])#根据单词个数进行排序
            #sortedfinal = array(sortedfinal)
            sortedfinal = sortedfinal[::-1]
            sortedfinal = clearredundancy(sortedfinal)
            sortedfinal = sorted(sortedfinal,key=lambda x:x["value"])#根据单词个数进行排序
            #sortedfinal = array(sortedfinal)
            sortedfinal = sortedfinal[::-1]
            h = open('data\\out\\keyword\\'+filelist[i].strip('.txt')+'.json', 'w', encoding='utf-8')
            h.write(json.dumps(sortedfinal))
            print(filelist[i] + ' is finished.')
    time_end = time.time()
    print('time cost',time_end-time_start,'s')

if __name__ == '__main__':
    main()