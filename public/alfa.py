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
        filename = 'rs' + filename
    h = open('data/out/ALFA/'+filename+'.json', 'w', encoding='utf-8')
    h.truncate(0)
    urld = 'https://api.ncbi.nlm.nih.gov/variation/v0/refsnp/' + filename.strip('rs') +'/frequency'
    res = requests.get(urld).text
    resjs = json.loads(res)
    for key in resjs['results']:
        key1 = key
    for key in resjs['results'][key1]['counts']:
        key2 = key
    newinfo = {'id': 'rs'+filename.strip('rs'), 'ref': resjs['results'][key1]['ref']}
    for the1 in resjs['results'][key1]['counts'][key2]['allele_counts']:
        total = 0
        altnum = 0
        alt = ''
        for the2 in resjs['results'][key1]['counts'][key2]['allele_counts'][the1]:
            total += resjs['results'][key1]['counts'][key2]['allele_counts'][the1][the2]
            if (the2 != resjs['results'][key1]['ref']) and (resjs['results'][key1]['counts'][key2]['allele_counts'][the1][the2] > altnum):
                alt = the2
                altnum = resjs['results'][key1]['counts'][key2]['allele_counts'][the1][the2]
        if the1 == 'SAMN10492695':
            location = 'European'
        elif the1 == 'SAMN10492698':
            location = 'African American'
        elif the1 == 'SAMN10492696':
            location = 'African Others'
        elif the1 == 'SAMN10492703':
            location = 'African'
        elif the1 == 'SAMN10492697':
            location = 'East Asian'
        elif the1 == 'SAMN10492702':
            location = 'South Asian'
        elif the1 == 'SAMN10492701':
            location = 'Other Asian'
        elif the1 == 'SAMN10492704':
            location = 'Asian'
        elif the1 == 'SAMN10492699':
            location = 'Latin American 1'
        elif the1 == 'SAMN10492700':
            location = 'Latin American 2'
        elif the1 == 'SAMN11605645':
            location = 'Other'
        elif the1 == 'SAMN10492705':
            location = 'Total'
        newinfo[location] = str(total) + ':' + str(altnum)
        newinfo['alt'] = alt
    h.write(str(newinfo))
    print(filename + ' ALFA population data download is completed.')
    time_end = time.time()
    print('time cost',time_end-time_start,'s')

if __name__ == '__main__':
    main()