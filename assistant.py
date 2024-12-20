import base64
from threading import Lock, Thread
import time

import cv2
import openai
from cv2 import VideoCapture, imencode
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema.messages import SystemMessage
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import ChatOpenAI
from pyaudio import PyAudio, paInt16
from speech_recognition import Microphone, Recognizer, UnknownValueError
import json
import sys

load_dotenv()


class WebcamStream:
    def __init__(self):
        self.stream = VideoCapture(index=0)
        _, self.frame = self.stream.read()
        self.running = False
        self.lock = Lock()

    def start(self):
        if self.running:
            return self

        self.running = True

        self.thread = Thread(target=self.update, args=())
        self.thread.start()
        return self

    def update(self):
        while self.running:
            _, frame = self.stream.read()

            self.lock.acquire()
            self.frame = frame
            self.lock.release()
            time.sleep(0.033)  # Limit to ~30 fps

    def read(self, encode=False):
        self.lock.acquire()
        frame = self.frame.copy()
        self.lock.release()

        if encode:
            _, buffer = imencode(".jpeg", frame)
            return base64.b64encode(buffer)

        return frame

    def read_as_base64(self):
        self.lock.acquire()
        frame = self.frame.copy()
        self.lock.release()

        _, buffer = imencode(".jpeg", frame)
        return base64.b64encode(buffer).decode("utf-8")

    def stop(self):
        self.running = False
        if self.thread.is_alive():
            self.thread.join()

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.stream.release()

class ScreenStream:
    def __init__(self):
        self.running = False
        self.frame = None
        self.lock = Lock()

    def update_frame(self, frame):
        self.lock.acquire()
        self.frame = frame
        self.lock.release()

    def read_as_base64(self):
        if not self.frame:
            return None
        self.lock.acquire()
        frame = self.frame.copy()
        self.lock.release()
        _, buffer = imencode(".jpeg", frame)
        return base64.b64encode(buffer).decode("utf-8")

class Assistant:
    def __init__(self, model):
        self.chain = self._create_inference_chain(model)
        self.active_stream = 'webcam'  # Default to webcam stream

    def switch_stream(self, stream_type):
        if stream_type not in ['webcam', 'screen']:
            raise ValueError("Stream type must be either 'webcam' or 'screen'")
        self.active_stream = stream_type

    def answer(self, prompt, image):
        if not prompt:
            return

        print("Prompt:", prompt)

        response = self.chain.invoke(
            {"prompt": prompt, "image_base64": image.decode()},
            config={"configurable": {"session_id": "unused"}},
        ).strip()

        print("Response:", response)

        if response:
            self._tts(response)

    def _tts(self, response):
        player = PyAudio().open(format=paInt16, channels=1, rate=24000, output=True)

        with openai.audio.speech.with_streaming_response.create(
            model="tts-1",
            voice="alloy",
            response_format="pcm",
            input=response,
        ) as stream:
            for chunk in stream.iter_bytes(chunk_size=1024):
                player.write(chunk)

    def _create_inference_chain(self, model):
        SYSTEM_PROMPT = """
        You are a witty assistant that will use the chat history and the image 
        provided by the user to answer its questions. Your job is to answer 
        questions.

        Use few words on your answers. Go straight to the point. Do not use any
        emoticons or emojis. 

        Be friendly and helpful. Show some personality.
        """

        prompt_template = ChatPromptTemplate.from_messages(
            [
                SystemMessage(content=SYSTEM_PROMPT),
                MessagesPlaceholder(variable_name="chat_history"),
                (
                    "human",
                    [
                        {"type": "text", "text": "{prompt}"},
                        {
                            "type": "image_url",
                            "image_url": "data:image/jpeg;base64,{image_base64}",
                        },
                    ],
                ),
            ]
        )

        chain = prompt_template | model | StrOutputParser()

        chat_message_history = ChatMessageHistory()
        return RunnableWithMessageHistory(
            chain,
            lambda _: chat_message_history,
            input_messages_key="prompt",
            history_messages_key="chat_history",
        )


webcam_stream = WebcamStream().start()
screen_stream = ScreenStream()  # Initialize screen stream

# model = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest")

# You can use OpenAI's GPT-4o model instead of Gemini Flash
# by uncommenting the following line:
model = ChatOpenAI(model="gpt-4o-mini")

assistant = Assistant(model)

def audio_callback(recognizer, audio):
    try:
        prompt = recognizer.recognize_whisper(audio, model="base", language="english")
        # Capture single frame based on active stream
        if assistant.active_stream == 'webcam':
            frame = webcam_stream.read(encode=True)
        else:
            frame = screen_stream.read_as_base64().encode()
        assistant.answer(prompt, frame)

    except UnknownValueError:
        print("There was an error processing the audio.")

recognizer = Recognizer()
microphone = Microphone()
with microphone as source:
    recognizer.adjust_for_ambient_noise(source)

stop_listening = recognizer.listen_in_background(microphone, audio_callback)

try:
    while True:
        # Wait for input events instead of continuous streaming
        if sys.stdin.isatty():
            command = sys.stdin.readline().strip()
            if command == "STOP_SCREEN_SHARE":
                assistant.switch_stream('webcam')
            elif command.startswith("TEXT_INPUT:"):
                text = command[11:]  # Remove TEXT_INPUT: prefix
                # Capture single frame based on active stream
                if assistant.active_stream == 'webcam':
                    frame = webcam_stream.read(encode=True)
                else:
                    frame = screen_stream.read_as_base64().encode()
                assistant.answer(text, frame)

        # Check for commands from stdin
        if sys.stdin.isatty():  # Only try to read if stdin is available
            command = sys.stdin.readline().strip()
            if command == "STOP_SCREEN_SHARE":
                assistant.switch_stream('webcam')

except KeyboardInterrupt:
    webcam_stream.stop()
    stop_listening(wait_for_stop=False)
