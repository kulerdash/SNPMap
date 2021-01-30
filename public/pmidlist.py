#encoding:utf-8
'''
@File    :   pmidlist.py
@Time    :   2020/12/15 14:35:01
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

def GetPMID(text, num, filename):
    g = open('data\\out\\PMIDList\\'+filename, 'w', encoding='utf-8')
    for i in range(0, num):
        g.write(str(text[i])+'\n')
    g = open('data\\out\\PMIDList\\'+filename.strip('.txt')+'.json', 'w', encoding='utf-8')
    g.write(json.dumps(list(map(int, text))))

def main():
    # 读取Samples文件夹内文件按行读取到列表中
    time_start = time.time()
    filelist = os.listdir('data\\samples')
    for i in range(0, len(filelist)):
        if filelist[i].count('.txt')>0 and filelist[i].count('Rs')>0:
            with open('data\\samples\\'+filelist[i]) as f:
                lines = f.readlines()
            list_pmid = list()
            for j in range(0, len(lines)):
                if lines[j].count('PMID')>0:
                    startline = j
                    break
            for j in range(startline, len(lines)):
                list_pmid += (re.findall(r'PMID=([0-9]+)', lines[j]))
                list_pmid += (re.findall(r'PMID[|]([0-9]+)', lines[j]))
            GetPMID(list_pmid, len(list_pmid),filelist[i])
        print(filelist[i] + ' is finished.')
    time_end = time.time()
    print('time cost',time_end-time_start,'s')

if __name__ == '__main__':
    main()