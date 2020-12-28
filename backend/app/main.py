from fastapi import FastAPI
import pandas
from fastapi.middleware.cors import CORSMiddleware
import json


app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data = pandas.read_csv('./data/signatures.tsv', sep='\t').rename(columns={'Unnamed: 0': 'Name'})


@app.get('/names/{name}')
async def get_name(name):
    response = data[data.iloc[:, 0] == name]
    if response.empty:
        return json.dumps(None)
    return json.dumps(response.to_dict('list'))


@app.get('/names/')
async def get_names():
    return data.iloc[:, 0].to_json()




