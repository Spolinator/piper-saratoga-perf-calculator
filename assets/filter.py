import json
  

countries = ['BG', 'BI', 'BK', 'EB', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EK', 'EL', 'EN', 'EP', 'ES', 'ET', 'EV', 'EY', 'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH', 'LI', 'LJ', 'LK', 'LM', 'LN', 'LO', 'LP', 'LQ', 'LR', 'LS', 'LU', 'LW', 'LX', 'LY', 'LZ']
# Opening JSON file
f = open('C:/Users/Vincent/CloudStation/Programmeren/webdev/Pilot/assets/runways.json')
  
# returns JSON object as 
# a dictionary
runways = json.load(f)

f.close()
# Iterating through the json
# list
k = 0

updated_data = []

for i in runways:
    v = 0
    for p in countries:
        if str(runways[k]['airport_ident'])[0:2] == countries[v]:
            print(runways[k]['airport_ident'])
            updated_data.append(runways[k])

        v += 1

    k += 1
  
f = open('C:/Users/Vincent/CloudStation/Programmeren/webdev/Pilot/assets/runways_new.json', 'w')
json.dump(updated_data, f)
f.close()