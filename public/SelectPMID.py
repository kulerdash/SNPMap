#encoding:utf-8
'''
@File    :   wordmatch.py
@Time    :   2020/09/27 15:13:26
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here

import json

from api.PMIDRetrieve.SubmitPMIDListAmended import SubmitPMIDList

def GetPMID(text, num, filename):
    g = open('data\\out\\PMIDList\\'+filename, 'w', encoding='utf-8')
    for i in range(0, num):
        g.write(str(text[i])+'\n')
    '''
    for i in range(0, num):
        g = open('data\\out\\abstractPMID\\'+text[i]+'.txt', 'w', encoding='utf-8')
        g.write(str(text[i])+'\n')
    '''
    g = open('data\\out\\PMIDList\\'+filename.strip('.txt')+'.json', 'w', encoding='utf-8')
    g.write(json.dumps(list(map(int, text))))