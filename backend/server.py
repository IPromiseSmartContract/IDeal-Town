from flask import Flask, request
from flask_cors import CORS
import requests
import json
import random

app = Flask(__name__)
CORS(app)

@app.route('/createEvent', methods=['POST'])
def event():
    url = "https://api.poap.tech/events"
    randomNum = random.randint(10,100)
    files = {"image": ("poap.png", open("poap.png", "rb"), "image/png")}
    payload = {
        "virtual_event": "false",
        "event_template_id": "1",
        "private_event": "false",
        "name": f"testing{randomNum}",
        "description": "example",
        "city": "Taipei",
        "country": "Taiwan",
        "start_date": "04-22-2023",
        "end_date": "04-22-2023",
        "expiry_date": "04-22-2023",
        "secret_code": "123456",
        "event_url": "https://poap.xyz",
        "email": "test@example.com"
    }
    headers = {
        "accept": "application/json",
        "x-api-key": "sOaInLMdtvp0fPwhFYM3Fc0sufK5FRN3ABk1zcpbcZfRY5ti9tok1okmCvO6G9tMnh7AdAaFVpJ3otAEaXLGb7MWwV3LV21SawfDW5fFIKovHurocjvN0FGKEoi9uHEH"
    }
    response = requests.post(url, data=payload, files=files, headers=headers)
    return response.json()

@app.route('/getqrHash', methods=['POST'])
def getqrHash():
    url = "https://api.poap.tech/event/123705/qr-codes"

    payload = {"secret_code": "123456"}
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "token": "",
        "x-api-key": "sOaInLMdtvp0fPwhFYM3Fc0sufK5FRN3ABk1zcpbcZfRY5ti9tok1okmCvO6G9tMnh7AdAaFVpJ3otAEaXLGb7MWwV3LV21SawfDW5fFIKovHurocjvN0FGKEoi9uHEH"
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.json()

@app.route('/mintPOAP', methods=['POST'])
def mintPOAP():
    url = "https://api.poap.tech/actions/claim-qr"
    data = json.loads(request.data)
    payload = {
        "sendEmail": False,
        "address": data['address'],
        "qr_hash": data['qr_hash'],
        "secret": "123456"
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "token": "",
        "x-api-key": "sOaInLMdtvp0fPwhFYM3Fc0sufK5FRN3ABk1zcpbcZfRY5ti9tok1okmCvO6G9tMnh7AdAaFVpJ3otAEaXLGb7MWwV3LV21SawfDW5fFIKovHurocjvN0FGKEoi9uHEH"
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

if __name__ == '__main__':
    app.run(debug=True)
