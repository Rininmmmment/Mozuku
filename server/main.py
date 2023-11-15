from fastapi import FastAPI, HTTPException, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import base64  # base64 モジュールのインポート

app = FastAPI()

class ImageData(BaseModel):
    image: str

@app.post("/face-detection")
async def detect_face(image_data: ImageData):
    # 画像データをバイナリ形式に変換
    image_base64 = image_data.image
    image_data_binary = image_base64.split(',')[1].encode('utf-8')

    # OpenCVで画像を読み込む
    nparr = np.fromstring(base64.b64decode(image_data_binary), np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 顔認識
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    if len(faces) > 0:
        result = 'Yes'
    else:
        result = 'No'

    return {"result": result}

@app.post("/check-voice")
async def check_nod(text: str = Form(default=None)):
    if text is None:
        return {"response": "no-text"}
    elif "もずく" in text:
        return {"response": "mozuku"}
    else:
        return {"response": "nothing"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)