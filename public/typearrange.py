#encoding:utf-8
'''
@File    :   typearrange.py
@Time    :   2020/10/27 21:44:14
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here
import os

import json

import time

def arrange(a, filename):
    info = {'Check':1, 'Gene':{'number':0, 'data':[]}, 'Disease':{'number':0, 'data':[]}, 'Chemical':{'number':0, 'data':[]}}
    if len(a)>10 and a[0]['value']>2:
        for j in range(0, len(a)):
            if a[j]['value']>2:
                info[a[j]['type']]['number'] += a[j]['value']
                info[a[j]['type']]['data'].append(a[j])
    else:
        info['Check'] = 0
    g = open('data\\out\\keyword\\arranged\\'+filename, 'w', encoding='utf-8')
    g.write(json.dumps(info))

def main():
    time_start = time.time()
    print('Running Python typearrange analysis...')
    filelist = os.listdir('data\\out\\keyword')
    for i in range(0, len(filelist)):
        if filelist[i].count('.json')>0 and filelist[i].count('Rs')>0:
            with open('data\\out\\keyword\\'+filelist[i], 'r', encoding='utf-8') as f:
                a = json.load(f)
            arrange(a, filelist[i])
            print(filelist[i] + 'is finished.')
    time_end = time.time()
    print('time cost',time_end-time_start,'s')

if __name__ == '__main__':
    main()