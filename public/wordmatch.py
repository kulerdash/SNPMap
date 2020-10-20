#encoding:utf-8
'''
@File    :   JSONPack.py
@Time    :   2020/10/02 22:00:59
@Author  :   kulerdash 
@Version :   1.0
@Contact :   thmei0406@icloud.com
@WebSite :   github.com/kulerdash
'''
# Start typing your code from here
import json

from lemminflect import getLemma

def clearredundancy(inputed):
    a_list = inputed
    b_list = {}
    for i in range(0, len(a_list)):
        for j in range(0, len(a_list)):
            if a_list[i]['name'].lower() == a_list[j]['name'].lower() and a_list[i]['name'] != a_list[j]['name'] \
            and a_list[i]['value'] > a_list[j]['value'] and a_list[j]['name'] not in b_list.keys():
                a_list[i]['value'] += a_list[j]['value']
                b_list[a_list[j]['name']] = True
    for key in b_list:
        for k in range(len(a_list)-1, -1, -1):
            if a_list[k]['name'] == key:
                a_list.pop(k)
                break
    return a_list

def wordsearch(filename):
    with open(filename) as fp:
        a = json.load(fp)
    count = []
    index = {}
    l = 0
    for i in range(0, len(a)):
        check = {}
        for j in range(0, len(a[i]['passages'])):
            for k in range(0, len(a[i]['passages'][j]['annotations'])):
                list_words = list()
                tp = a[i]['passages'][j]['annotations'][k]['infons']['type']
                tx = a[i]['passages'][j]['annotations'][k]['text']
                if tp != 'Gene':
                    tx = getLemma(tx, upos='NOUN', lemmatize_oov=True)
                    tx = "".join(tuple(tx))
                if (tp == 'Gene' or tp == 'Disease' or tp == 'Chemical')\
                and tx not in check.keys():
                    if tx not in index.keys():
                        index[tx] = l
                        l = l+1
                        count.append({});
                        count[index[tx]]['name'] = tx
                        count[index[tx]]['value'] = 1
                    elif tx in index.keys():
                        count[index[tx]]['value'] += 1
                    check[tx] = True
                '''
                list_words += (re.findall('[a-zA-Z0-9]+', tx))
                for l in range(0, len(list_words)):
                    if tp != 'Gene':
                        list_words[l] = getLemma(list_words[l], upos='NOUN', lemmatize_oov=True)
                        list_words[l] = "".join(tuple(list_words[l]))
                    if (tp == 'Gene' or tp == 'Disease' or tp == 'Chemical')\
                    and list_words[l] not in check.keys():
                        if list_words[l] not in count.keys():
                            count[list_words[l]] = 1
                        elif list_words[l] in count.keys():
                            count[list_words[l]] += 1
                        check[list_words[l]] = True
                '''
    #print(count)
    return(count)