from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List
import os
from fastapi.middleware.cors import CORSMiddleware
from SurveyTalkEmbeddingVector_v1 import app as SurveyTalkEmbeddingVector_v1_app

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc cụ thể ["https://embedding-vector-api.abc.vn"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/v1", SurveyTalkEmbeddingVector_v1_app)