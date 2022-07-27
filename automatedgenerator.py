from visual_generator import *

country_dict = {
    'FR': 'spa_1mhhrMQQbt9zY51oi2qFSjQy2iT', #ALL WORKING
    'DE': 'spa_1iHD1LvtO0x7mqjNt8nw7vShGvM', #ALL WORKING
    'US': 'spa_1iHD3ZONReYPmaG2KhLj59N7w6w', #ALL WORKING
    'JP': 'spa_1iGnM1zxbHc0CHMhYDRFPyVu5Fm', #ALL WORKING. Profile Search&Edit source and its links (including CPC and CPC microservice) added manually. Should they be?
    'CA': 'spa_1dzaUlbs2hsgIKmTgpE2eKFUfeM', #ALL WORKING
    'TW': 'spa_1l8yiAdE3YNKKKcEsUaVkx5ZysW', #TESTED, WORKING
    'TR': 'spa_1oLN379NIruTGAy9OvqyXFSqNXG', #TESTED, WORKING
    'NL': 'spa_1oyoYQpIlSNBtmI5RW1BhMgS3vd', #TESTED, WORKING
    'IL': 'spa_1l8yGUl3weaMIt7fgLWK5kQ5H4g', #TESTED, WORKING
    'HK': 'spa_1l8ygt1UNwZqBMNQfbXSRSRG7HD', #TESTED, WORKING
    'GB': 'spa_1k9HonRCrJr8fBJXtjQQJ3UPINF', #TESTED, WORKING
    'BE': 'spa_1oyoRDUt7IVM7DuOnxClApnIIoM' #TESTED, WORKING
}

for country in country_dict:
    print(country)
    with open('country_code.csv', 'w') as filetowrite:
        filetowrite.write(country)

    ran = False
    while not ran:
        try:
            run('pampersrewards', country_dict[country])
        except TypeError:
            print('execution for ' + country + ' failed - Trying again')
            continue
        ran = True

    #add GQL functions here so that buildDiagram can run