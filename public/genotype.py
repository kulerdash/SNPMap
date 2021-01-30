#encoding:utf-8
'''
@File    :   genotype.py
@Time    :   2020/10/27 20:22:30
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here
import time

import json

import os

def genoinfo(lines, filename):
    info = {}
    for i in range(1, len(lines)):
        if lines[i].count('}}')>0:
            endline = i
            break
    for i in range(1, endline):
        cut = lines[i].find('=')
        key = lines[i][1:cut]
        value = lines[i][cut+1:].strip('\n')
        info[key] = value
    g = open('data\\out\\basic\\alleles\\'+filename.strip('.txt')+'.json', 'w', encoding='utf-8')
    g.write(json.dumps(info))

def main():
    time_start = time.time()
    print('Running Python genotype analysis...')
    filelist = os.listdir('data\\samples\\alleles')
    for i in range(0, len(filelist)):
        if filelist[i].count('.txt')>0 and filelist[i].count('Rs')>0:
            with open('data\\samples\\alleles\\'+filelist[i]) as f:
                lines = f.readlines()
            genoinfo(lines, filelist[i])
            print(filelist[i] + ' is finished.')
    time_end = time.time()
    print('time cost',time_end-time_start,'s')

if __name__ == '__main__':
    main()