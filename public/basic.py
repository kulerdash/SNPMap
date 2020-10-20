#encoding:utf-8
'''
@File    :   basic.py
@Time    :   2020/10/19 19:51:54
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here
import json

import re

def basicinfo(lines, filename):
    info = {}
    pop = {
        "geography": {}
    }
    for i in range(1, len(lines)):
        if lines[i].count('}}')>0:
            endline = i
            break
    for i in range(1, endline):
        cut = lines[i].find('=')
        key = lines[i][1:cut]
        value = lines[i][cut+1:].strip('\n')
        info[key] = value
    if lines[endline].count('{{ population diversity')>0:
        for i in range(endline+1, len(lines)):
            if lines[i].count('}}')>0:
                endline2 = i
                print(endline2)
                break
        for i in range(endline+1, endline2):
            if lines[i].count('=')>0:
                cut = lines[i].find('=')
                key = lines[i][1:cut]
                value = lines[i][cut+1:].strip('\n')
                print(key)
                print(value)
                pop[key] = value
            else:
                place = lines[i][1:4]
                s1 = lines[i].index('|', 1)
                s2 = lines[i].index('|', s1+1)
                s3 = lines[i].index('|', s2+1)
                value1 = float(lines[i][6:s2-1])
                value2 = float(lines[i][s2+1:s3-1])
                value3 = float(lines[i][s3+1:])
                pop['geography'][place] = [value1, value2, value3]
        g = open('data\\out\\population\\'+filename.strip('.txt')+'.json', 'w', encoding='utf-8')
        g.write(json.dumps(pop))
    g = open('data\\out\\basic\\'+filename.strip('.txt')+'.json', 'w', encoding='utf-8')
    g.write(json.dumps(info))