import vcf
import sys


# 解析当前rocord是否为前三种变异的某一种
def parse_variation_type(current_record):
    parent1_record = current_record.genotype(parent1)['GT']      # <class 'str'> e.g:'1|1', '1/1'
    parent2_record = current_record.genotype(parent2)['GT']      # <class 'str'> e.g:'0|1', '0/2'
    child_record = current_record.genotype(child)['GT']   # <class 'str'> e.g:'0|0', '1/1'
    # case 1: 0/0 + 0/0 = 0/n
    if parent1_record[0] == '0' and parent1_record[-1] == '0':
        if parent2_record[0] == '0' and parent2_record[-1] == '0':
            if child_record[0] != '0' or child_record[-1] != '0':
                return 1
    # case 2: 0/n + 0/n = n/n
    if parent1_record[0] == '0' and parent1_record[-1] != '0':
        if parent2_record[0] == '0' and parent2_record[-1] != '0':
            if child_record[0] != '0' and child_record[-1] != '0':
                return 2
    # case 3: 0/0 + 0/n = 0/n
    if parent1_record[0] == '0' and parent1_record[-1] != '0':
        if parent2_record[0] == '0' and parent2_record[-1] == '0':
            if child_record[0] == '0' and child_record[-1] != '0':
                return 3
    if parent1_record[0] == '0' and parent1_record[-1] == '0':
        if parent2_record[0] == '0' and parent2_record[-1] != '0':
            if child_record[0] == '0' and child_record[-1] != '0':
                return 3
    # ignore
    return 0


# 从第三种变异中解析出第四种变异
def parse_feather_of_case4(current_record):
    parent1_record = current_record.genotype(parent1)['GT']  # <class 'str'> e.g:'1|1', '1/1'
    parent2_record = current_record.genotype(parent2)['GT']  # <class 'str'> e.g:'0|1', '0/2'
    child_record = current_record.genotype(child)['GT']  # <class 'str'> e.g:'0|0', '1/1'
    if parent1_record[0] == '0' and parent1_record[-1] != '0':
        if parent2_record[0] == '0' and parent2_record[-1] == '0':
            if child_record[0] == '0' and child_record[-1] != '0':
                return 1
    if parent1_record[0] == '0' and parent1_record[-1] == '0':
        if parent2_record[0] == '0' and parent2_record[-1] != '0':
            if child_record[0] == '0' and child_record[-1] != '0':
                return 2


if __name__ == '__main__':
    # parent1 = 'S185'
    # parent2 = 'S186'
    # child = 'sample001'
    argv = sys.argv[1:]
    file_name = argv[0]
    parent1 = argv[1]
    parent2 = argv[2]
    child = argv[3]
    # vcf_reader = vcf.Reader(open('/Users/yj/Desktop/S184.snpindel.anno.hg19_multianno.vcf', 'r'))
    # vcf_writer1 = vcf.Writer(open('/Users/yj/Desktop/sam1.vcf', 'w'), vcf_reader)
    # vcf_writer2 = vcf.Writer(open('/Users/yj/Desktop/sam2.vcf', 'w'), vcf_reader)
    # vcf_writer3 = vcf.Writer(open('/Users/yj/Desktop/sam3.vcf', 'w'), vcf_reader)
    vcf_reader = vcf.Reader(open(file_name, 'r'))
    vcf_writer1 = vcf.Writer(open(file_name[:-4]+'_var1.vcf', 'w'), vcf_reader)
    vcf_writer2 = vcf.Writer(open(file_name[:-4]+'_var2.vcf', 'w'), vcf_reader)
    vcf_writer3 = vcf.Writer(open(file_name[:-4]+'_var3.vcf', 'w'), vcf_reader)
    # 前三种变异解析
    for record in vcf_reader:
        parse_result = parse_variation_type(record)
        if parse_result == 1:
            vcf_writer1.write_record(record)
        if parse_result == 2:
            vcf_writer2.write_record(record)
        if parse_result == 3:
            vcf_writer3.write_record(record)
    # 第四种变异解析
    vcf_reader = vcf.Reader(open(file_name[:-4]+'_var3.vcf', 'r'))
    vcf_writer4 = vcf.Writer(open(file_name[:-4]+'_var4.vcf', 'w'), vcf_reader)
    current_gene = ''
    temp_record_list = []
    judge = 0
    feature_list = []
    for record in vcf_reader:
        if current_gene == '':
            current_gene = record.INFO['Gene.refGene'][0]
        if current_gene == record.INFO['Gene.refGene'][0]:
            temp_record_list.append(record)
            feature_list.append(parse_feather_of_case4(record))
        else:
            if len(set(feature_list)) == 2:
                for i in temp_record_list:
                    vcf_writer4.write_record(i)
            temp_record_list = []
            feature_list = []
            current_gene = record.INFO['Gene.refGene'][0]
            temp_record_list.append(record)
            feature_list.append(parse_feather_of_case4(record))
    if len(set(feature_list)) == 2:
        for i in temp_record_list:
            vcf_writer4.write_record(i)
