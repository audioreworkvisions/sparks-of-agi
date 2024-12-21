import sys
import json
import base64
import cv2
import numpy as np
from threading import Thread, Lock

class WebcamStream:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        self.lock = Lock()
        self.current_frame = None
        self.is_running = True
        Thread(target=self._capture_frames, daemon=True).start()

    def _capture_frames(self):
        while self.is_running:
            ret, frame = self.cap.read()
            if ret:
                with self.lock:
                    self.current_frame = frame

    def get_current_frame_base64(self):
        with self.lock:
            if self.current_frame is not None:
                _, buffer = cv2.imencode('.jpg', self.current_frame)
                return base64.b64encode(buffer).decode('utf-8')
        return None

    def stop(self):
        self.is_running = False
        self.cap.release()

webcam = WebcamStream()

def handle_input(line):
    if line.startswith('GET_CURRENT_FRAME'):
        frame = webcam.get_current_frame_base64()
        if frame:
            print(f'FRAME:{frame}')
            sys.stdout.flush()
    elif line.startswith('TEXT_INPUT:'):
        # Handle existing text input logic
        text = line[11:]  # Remove 'TEXT_INPUT:' prefix
        response = f"Received: {text}"
        print(response)
        sys.stdout.flush()

try:
    for line in sys.stdin:
        line = line.strip()
        handle_input(line)
finally:
    webcam.stop()
