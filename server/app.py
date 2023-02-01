from flask import *
from flask_cors import CORS
import json
import shutil
from dotenv import load_dotenv
from Autotender import find_tender,getData,updateData
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
#import logging
app = Flask(__name__)
CORS(app)


load_dotenv()
TIME_INTERVAL = os.getenv('TIME_INTERVAL')
BEGIN_AT = os.getenv('BEGIN_AT')
END_AT = os.getenv('END_AT')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
#SPREADSHEET_ID = '1EbFintr23RMAD6-z4a_OsTKkpiL0ISAbAjt2j3YdQKw'
SPREADSHEET_ID = '1iRhKh2KckV4Ycc5qbCqMeC0VEWRs6q2GrTStS3KjkAw'
CREDS_PATH = os.getenv('CREDENTIAL_PATH')
# log = logging.getLogger(__name__)
# logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"), format='%(message)s')
# log.info("Running Website Backend---")
# @app.before_request
# def before_request(response):
#   response.headers.add('Access-Control-Allow-Headers', '*')
#   response.headers.add('Access-Control-Allow-Methods', '*')
#   response.headers.add('Access-Control-Allow-Credentials', 'true')
#   response.headers.add('Access-Control-Allow-Origin', '*')
#   return response
temp_path = ''

@app.route('/data/find' , methods = ['GET','POST'])
def find():
    if request.method == 'POST':
        key_info = json.loads(request.data)
        keywords = key_info['keywords']
        date = key_info['date']
        result = find_tender(date,keywords)
        return jsonify({"success": True , "data" : result}), 201
        
@app.route('/data/getdata' , methods = ['GET','POST'])
def getTableContent():
    if request.method == 'POST':
        key_info = json.loads(request.data)
        date = key_info['date']
        keywords = key_info['keywords']
        keywords = keywords.split(',')
        result = getData(date,keywords)
        return jsonify({"success": True , "data" : result}), 201

@app.route('/data/remove' , methods = ['GET','POST'])
def Remove():
    if request.method == 'POST':
        key_info = json.loads(request.data)
        data = key_info['data']
        updateData(data)
        return jsonify({"success": True , "data" : 'success'}), 201


@app.route('/data/upload' , methods = ['GET','POST'])
def Upload():
    if request.method == 'POST':
        key_info = json.loads(request.data)
        data = key_info['data']
        creds = None
        print(os.path)
        if os.path.exists('D:/token.json'):
            creds = Credentials.from_authorized_user_file('D:/token.json',SCOPES)
        
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'D:/credentials.json',SCOPES)
                creds = flow.run_local_server(port=0)
            # Save the credentials for the next run
            with open('D:/token.json', 'w') as token:
                token.write(creds.to_json())
        try:
            
            service = build('sheets', 'v4', credentials=creds)
            # Retrieve the sheet from the Sheet service.
            values = [[data['Numar ADV'],data['Nume institutie'],data['Titlu'],data['Data limita'],data['Email'],data['URL'],data['data licitației'],data['cuvânt cheie']]]
            body = {
                'values': values
            }
            sheet = service.spreadsheets()
            result = sheet.values().append(spreadsheetId=SPREADSHEET_ID,range='Sheet1',valueInputOption = 'RAW',insertDataOption='INSERT_ROWS',body=body).execute()
            updateData(data)
            # for i in range(1,len(values_input)):
            #     AutoFill(values_input[i])
        except HttpError as err:
            print(err)

        
        return jsonify({"success": True , "data" : result}), 201

