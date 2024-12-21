<template>
    <div class="prompt-container">
      <div class="input-group">
        <input 
          v-model="message" 
          placeholder="Enter your prompt..." 
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">Send</button>
      </div>
      <p v-if="response" class="response">{{ response }}</p>
      <img v-if="capturedFrame" :src="capturedFrame" class="thumbnail" alt="Captured frame" />
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        message: '',
        response: '',
        capturedFrame: '',
      };
    },
    methods: {
      async captureCurrentFrame() {
        const frame = await window.electronAPI.getCurrentFrame();
        if (frame) {
          this.capturedFrame = `data:image/jpeg;base64,${frame}`;
        }
      },
      async sendMessage() {
        if (!this.message.trim()) return;
        await this.captureCurrentFrame();
        window.electronAPI.sendToPython(`TEXT_INPUT:${this.message}`);
        this.message = '';
      },
    },
    mounted() {
      window.electronAPI.onFromPython((data) => {
        this.response = data;
      });
    },
  };
  </script>
  
  <style scoped>
  .prompt-container {
    position: relative;
    padding: 20px;
    background-color: #1A1A1A;
    border-radius: 8px;
    border: 2px solid #00F0FF;
  }

  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }

  input {
    flex: 1;
    padding: 10px;
    border: 2px solid #00F0FF;
    border-radius: 4px;
    background-color: #1A1A1A;
    color: #00F0FF;
  }

  input::placeholder {
    color: rgba(0, 240, 255, 0.5);
  }

  button {
    padding: 10px 20px;
    background-color: transparent;
    border: 2px solid #00F0FF;
    color: #00F0FF;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button:hover {
    background-color: #FF0099;
    border-color: #FF0099;
    color: #1A1A1A;
  }

  .response {
    color: #00F0FF;
    margin-top: 15px;
  }

  .thumbnail {
    width: 120px;
    height: auto;
    position: absolute;
    bottom: 10px;
    right: 10px;
    border: 2px solid #FF0099;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(255, 0, 153, 0.2);
  }
  </style>
