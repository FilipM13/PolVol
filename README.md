# PolVol
## To launch:
Terminal 1 (backend):
```bash
cd backend/src
python -m pip install -r requirements.txt
python -m uvicorn api:app
```
Terminal 2 (frontend):
```bash
cd frontend
npm install
npm run build
serve -s dist
```
Will be dockerized later.