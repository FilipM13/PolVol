FROM python:3.12.11-alpine
EXPOSE 8000
COPY ./src ./src
COPY ./requirements.txt ./requirements.txt
RUN python -m pip install -r ./requirements.txt
RUN mkdir -p /data/db
RUN mkdir -p /data/logs
CMD ["python", "-m", "src"]