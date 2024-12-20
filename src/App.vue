<template>
  <div id="app">
    <header>
      <h1>Alloy Ada System</h1>
      <h2>Electron + Vue + Python Integration</h2>
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
      window.electron.switchStream(type);
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #333;
  margin: 0;
  padding: 0;
}

header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}

main {
  padding: 20px;
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
  border: 2px solid #282c34;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.controls button.active {
  background: #282c34;
  color: white;
}

.controls button:hover {
  background: #282c34;
  color: white;
}

footer {
  background-color: #f1f1f1;
  padding: 10px;
  font-size: 0.9em;
  color: #555;
}
</style>
