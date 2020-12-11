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

import os

def main():
    time_start = time.time()
    filelist = os.listdir('data\\out\\abstract')
    for i in range(0, len(filelist)):
        h = open('data\\out\\ALFA\\'+filelist[i], 'w', encoding='utf-8')
        h.truncate(0)
        urld = 'https://api.ncbi.nlm.nih.gov/variation/v0/refsnp/' + filelist[i].strip('.json').strip('Rs') +'/frequency'
        res = requests.get(urld)
        h.write(res.text)
        print(filelist[i] + 'is finished.')
    time_end = time.time()
    print('time cost',time_end-time_start,'s')

if __name__ == '__main__':
    main()