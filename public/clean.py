#encoding:utf-8
'''
@File    :   clean.py
@Time    :   2020/12/11 16:21:12
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here
import json

def cleansing(al, filename):
    ka = []
    for i in range(0, len(al)):
        data1 = []
        for j in range(0, len(al[i]['passages'][0]['annotations'])):
            data1.append({"name": al[i]['passages'][0]['annotations'][j]['text'], "type": al[i]['passages'][0]['annotations'][j]['infons']['type']})
        for j in range(0, len(al[i]['passages'][1]['annotations'])):
            data1.append({"name": al[i]['passages'][1]['annotations'][j]['text'], "type": al[i]['passages'][1]['annotations'][j]['infons']['type']})
        ka.append({"id": al[i]['id'], "name": al[i]['passages'][0]['text'], "data": data1})
    with open('data\\out\\clean\\'+filename.strip('.txt')+'.json', 'w', encoding='utf-8') as fp:
        json.dump(ka, fp)
    