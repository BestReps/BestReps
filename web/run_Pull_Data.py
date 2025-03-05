import time
import subprocess

while True:
    subprocess.run(["python", "Pull_data.py"])
    time.sleep(300)  # Wait for 5 minutes
