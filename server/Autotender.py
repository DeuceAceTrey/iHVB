import undetected_chromedriver.v2 as webdriver  
from time import sleep
import pandas as pd
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from pymongo import MongoClient
from dateutil import parser
import logging
import os

# username = os.getenv('USERNAME')
# password = os.getenv('PASSWORD')
# keywords = os.getenv('KEYWORDS').split(',')
adv_list = []
date = ''
keywords = ''
log = logging.getLogger(__name__)
logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"), format='%(message)s')
def saveToDB(data):
    myclient = MongoClient("mongodb://localhost:27017/")
    userdb = myclient["iHVB"]
    collection = userdb["tenders"]
    if(len(data) > 0):
        collection.insert_many(data)
    myclient.close()
    for row in data:
        del row['_id']

def updateData(data):
    myclient = MongoClient("mongodb://localhost:27017/")
    userdb = myclient["iHVB"]
    collection = userdb["tenders"]
    log.info("limita" + data['Data limita'])
    collection.find_one_and_update({'Numar ADV':data['Numar ADV'],'Nume institutie':data['Nume institutie'],'Titlu':data['Titlu'],'Data limita':data['Data limita']},{ "$set": { "Processed": data['Processed'],"Upload" : data['Upload'] } })
    return 'success'

def getData(date,keywords):
    log.info('connecting')
    myclient = MongoClient("mongodb://localhost:27017/")
    userdb = myclient["iHVB"]
    collection = userdb["tenders"]
    log.info(date)
    #log.info(parser.parse(date))
    log.info(keywords)
    #log.info('keywords = ' + keywords)
    if(date != '' or keywords[0] != ''):
        if(keywords[0] == ''):
            query = {'data licitației' : {"$gte" : parser.parse(date)}}
        elif(date == ''):
            query = {'cuvânt cheie' : {'$in': keywords}}
            log.info(query)
        else:
            query = {'data licitației' : {"$gte" : parser.parse(date)},'cuvânt cheie' : {"$in": keywords}}
        log.info(query)
        result = collection.find(query,{'_id':False})
    else:
        result = collection.find({},{'_id' : False})
    tender_list = []
    latest_date = parser.parse('1000-01-01 00:00:00')
    print(latest_date.date())
    latest_date = latest_date
    latest_adv = ''
    for doc in result:
        tender_list.append(doc)
        log.info(doc)
        tender_date = doc['data licitației']
        log.info(tender_date)
        if(latest_date.date() < tender_date.date()):
            latest_date = tender_date
            latest_adv = doc['Numar ADV']
            latest_url = doc['URL']

    return {'data' : tender_list,'last_adv' : latest_adv , 'latest_date' : latest_date,'latest_url' : latest_url}

        

def process(driver,tender_data,keywords):
    global adv_list
    driver.get(tender_data['url'])
    sleep(3)
    content = driver.find_element('xpath','//*[@id="main-container"]/div').text
    i = 0
    for keyword in keywords:
        if(keyword == '' and i > 1):
            continue
        if(keyword.lower() in content.lower()):
            try:
                adv_no = driver.find_element('xpath',"//li[contains(., 'Numar anunt')]").find_element(By.TAG_NAME,'b').text
            except:
                adv_no = ''
            try:
                name_institution = driver.find_element('xpath','//*[@id="main-container"]/div/div[2]/div[2]/div[1]/div/div[2]/div[1]/div[1]/div/ul/li[1]/b').text
            except:
                try:
                    name_institution = driver.find_element('xpath','//*[@id="main-container"]/div/div/div[2]/div[1]/div/div[2]/div[1]/div[1]/div/ul/li[1]/b').text
                except:
                    name_institution = ''
            try:
                email = driver.find_element('xpath',"//*[contains(text(), 'Email')]").find_element(By.TAG_NAME,'b').text
            except:
                email = ''
            try:
                date_limit = driver.find_element('xpath',"//li[contains(., 'Data limita')]").find_element(By.TAG_NAME,'b').text
            except:
                date_limit = ''
            # try:
            #     data_url = driver.find_element('xpath',"//*[contains(text(), 'Pagina de internet')]").find_element(By.TAG_NAME,'b').text
            # except:
            #     data_url = ''
            title = driver.find_element('xpath','//*[@id="a-zone"]/div/i/b').text
            if(not adv_no in adv_list):
                adv_list.append(adv_no)
                return {'Numar ADV' : adv_no , 'Nume institutie' : name_institution , 'Titlu' : title ,'Data limita' : date_limit, 'Email' : email, 'URL' : tender_data['url'],'data licitației' : tender_data['date'] , 'cuvânt cheie' : keyword,'Upload' : 0, 'Processed' : 0}
        i += 1

def LogIn(driver,username , password):
    print("---Logging In---")
    driver.get('https://www.licitatiipublice.ro/licitatiipublice/module/achizitii/')
    sleep(5)
    #enter login panel
    driver.find_element('xpath','//*[@id="top-navbar"]/ul/li[1]/a').click()
    sleep(4)

    #enter credentials
    driver.find_element('xpath','//*[@id="numecont"]').send_keys(username)
    sleep(1)
    driver.find_element('xpath','//*[@id="parola"]').send_keys(password)
    sleep(1)
    while(True):
        try:
            driver.find_element('xpath','//*[@id="autentificare"]').click()
            break
        except:
            sleep(1)
            continue

    sleep(2)
    print("---Succesfully Logged In---")
    return


def main():
    #log.info('hhh')
    #if(__name__ == '__main__'):
    global date,keywords
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    #driver = webdriver.Chrome(options=chrome_options)
    driver.delete_all_cookies()
    username = '{username}'
    password = '{password}'
    #log.info('Logging')
    LogIn(driver,username,password)
    
    
    global adv_list
    adv_list = []
    #log.info('getting from DB')
    keywords = keywords.split(',')
    db_data = getData('',keywords)
    db_list = db_data['data']
    
    latest_date = db_data['latest_date']
    for tender in db_list:
        adv_list.append(tender['Numar ADV'])
        #log.info(latest_date)
    i = 0
    page = 0
    result = []
    hrefs = []
    stop = False
    print("Searching Results---")
    while(not stop):
        for i in range(0,49):
            while(True):
                try:   
                    tender_element = driver.find_element('xpath','//*[@id="item-' + str(i) + '"]')   
                    tender_date = driver.find_element('xpath','//*[@id="item-' + str(i) + '"]/div[3]/div[1]/div[1]/span[1]').text                 
                except:
                    sleep(2)
                    continue
                break
            
            tender_date = parser.parse(tender_date)
            tender_date = tender_date
            if(tender_date.date() >= latest_date.date()):
                while(True):
                    try:
                        tender_element = driver.find_element('xpath','//*[@id="item-' + str(i) + '"]')
                        tender_url = tender_element.find_element(By.TAG_NAME,'a').get_attribute('href')
                        
                    except:
                        sleep(1)
                        continue
                    break
                hrefs.append({'date' : tender_date , 'url' : tender_url})
                print(tender_url)
            else:
                stop = True
        page += 1   
        i = 0 
    driver.get('https://www.licitatiipublice.ro/licitatiipublice/module/achizitii/#PGN{pg:' + str(page) + '}') 

        
    if(len(hrefs) > 0):
        for href in hrefs:
            print(href)
            tender_data = process(driver,href,keywords)
            if(tender_data != None):
                print(tender_data)
                result.append(tender_data)
                print(tender_data)   
        print("Saving to DB")         
        saveToDB(result)
    print(result)
    print('----------')
    print(db_list)
    result = result + db_list
    return result

def find_tender(n_keywords):
    #log.info('dao find_tender')
    global keywords
    keywords = n_keywords
    result = main()
    return result
