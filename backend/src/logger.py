import logging as l

logger = l.getLogger("polvol")
logger.setLevel(l.DEBUG)
# formatter
formatter = l.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# console
# ch = l.StreamHandler()
# ch.setLevel(l.DEBUG)
# ch.setFormatter(formatter)
# logger.addHandler(ch)

# file
fh = l.FileHandler("polvol.log")
fh.setLevel(l.DEBUG)
fh.setFormatter(formatter)
logger.addHandler(fh)
