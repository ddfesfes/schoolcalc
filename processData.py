import json

first = {}
second = {}

libPath = './src/lib/typesData/'

currentUniv = ''

with open('data.txt', encoding='UTF8') as file:
    lines = [line.rstrip() for line in file]
    for i in range(len(lines)):
        if i == 0:
            currentUniv = lines[i]
            first[currentUniv] = {}
            second[currentUniv] = {}
        if lines[i] == '':
            pass
        elif '-' in lines[i]:
            items = lines[i].split('-')
            departName = items[0]
            types = items[1].split(',')

            first[currentUniv][departName] = types[0]
            second[currentUniv][departName] = types[1]
        else:
            currentUniv = lines[i]
            first[currentUniv] = {}
            second[currentUniv] = {}

with open(libPath + 'subject.json', 'w', encoding='UTF-8-sig') as file:
    file.write(json.dumps(first, ensure_ascii=False, indent=4))

with open(libPath + 'total.json', 'w', encoding='UTF-8-sig') as file:
    file.write(json.dumps(second, ensure_ascii=False))

'''
{
    "대학교명": {
        "학과명": 1.1
    }
}
'''