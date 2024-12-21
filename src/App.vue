<template>
  <div id="app">
    <header>
      <h1>AVA-App</h1>
    </header>
    <main>
      <div class="stream-container">
        <CameraStream v-if="activeStream === 'webcam'" />
        <ScreenShare v-if="activeStream === 'screen'" />
      </div>
      <div class="controls">
        <button @click="setActiveStream('webcam')" :class="{ active: activeStream === 'webcam' }">Use Webcam</button>
        <button @click="setActiveStream('screen')" :class="{ active: activeStream === 'screen' }">Use Screen</button>
      </div>
      <PromptForm />
    </main>
    <footer>
      <p>&copy; 2024 Audioreworkvisions</p>
    </footer>
  </div>
</template>

<script>
import PromptForm from './components/PromptForm.vue';
import CameraStream from './components/CameraStream.vue';
import ScreenShare from './components/ScreenShare.vue';

export default {
  name: 'App',
  components: {
    PromptForm,
    CameraStream,
    ScreenShare,
  },
  data() {
    return {
      activeStream: 'webcam',
    };
  },
  methods: {
    setActiveStream(type) {
      this.activeStream = type;
      window.electronAPI.sendToPython(`SWITCH_STREAM:${type}`);
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #00F0FF;
  margin: 0;
  padding: 0;
  background-color: #1A1A1A;
  min-height: 100vh;
}

header {
  background-color: #1A1A1A;
  padding: 20px;
  color: #00F0FF;
  border-bottom: 2px solid #FF0099;
}

main {
  padding: 20px;
  background-color: #1A1A1A;
}

.stream-container {
  margin-bottom: 20px;
}

.controls {
  margin-bottom: 20px;
}

.controls button {
  margin: 0 10px;
  padding: 8px 16px;
  border: 2px solid #00F0FF;
  border-radius: 4px;
  background: transparent;
  color: #00F0FF;
  cursor: pointer;
  transition: all 0.3s ease;
}

.controls button.active {
  background: #00F0FF;
  color: #1A1A1A;
}

.controls button:hover {
  background: #FF0099;
  border-color: #FF0099;
  color: #1A1A1A;
}

footer {
  background-color: #1A1A1A;
  padding: 10px;
  font-size: 0.9em;
  color: #FF0099;
  border-top: 2px solid #FF0099;
}
</style>
