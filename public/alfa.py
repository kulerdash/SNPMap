#encoding:utf-8
'''
@File    :   alfa.py
@Time    :   2020/12/05 15:04:16
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here
import time

import requests

import sys

import json

import re

import os

def main():
    time_start = time.time()
    filename = sys.argv[1]
    searchObj = re.search(r'([0-9]+)', filename)
    if searchObj:
        filename = 'Rs' + filename
    h = open('data\\out\\ALFA\\'+filename+'.json', 'w', encoding='utf-8')
    h.truncate(0)
    urld = 'https://api.ncbi.nlm.nih.gov/variation/v0/refsnp/' + filename.strip('Rs') +'/frequency'
    res = requests.get(urld)
    h.write(res.text)
    print(filename + ' ALFA population data download is completed.')
    time_end = time.time()
    print('time cost',time_end-time_start,'s')

if __name__ == '__main__':
    main()