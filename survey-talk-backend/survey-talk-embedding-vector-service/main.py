from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List
import os
from SurveyTalkEmbeddingVector_v1 import app as SurveyTalkEmbeddingVector_v1_app

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"


app = FastAPI()
app.mount("/v1", SurveyTalkEmbeddingVector_v1_app)