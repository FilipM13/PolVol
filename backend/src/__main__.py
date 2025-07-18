from .automations import clear_tokens
import schedule
import uvicorn
from .api import app
from multiprocessing import Process, Pool
from time import sleep
from .logger import logger

schedule.every(2).minutes.do(clear_tokens)


def run_schedule():
    logger.info("Launching scheduler.")
    while True:
        schedule.run_pending()
        sleep(5)


api = Process(
    target=uvicorn.run,
    name="Backend Api",
    kwargs={
        "app": app,
        "host": "0.0.0.0",
        "port": 8000
    },
)
s = Process(target=run_schedule, name="Scheduled Jobs")

api.start()
s.start()

api.join()  # wait untill api is killed
s.kill()  # kill scheduler
