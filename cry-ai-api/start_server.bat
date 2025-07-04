@echo off
echo Starting Cry AI API Server...

REM Activate the Python environment if needed
REM Uncomment the next line if you have a conda environment
REM call conda activate myenv

cd %~dp0
pip install -r requirements.txt
python app.py
