from fastapi import FastAPI

app = FastAPI()

@app.get("/main")
def read_root():
    return {"message": "Hello, FastAPI!"}