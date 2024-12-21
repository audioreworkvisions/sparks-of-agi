<template>
  <div>
    <h2>Screen Sharing</h2>
    <div v-if="!isSharing">
      <button @click="startScreenShare">Share Screen</button>
    </div>
    <div v-else>
      <button @click="stopScreenShare">Stop Sharing</button>
      <img :src="screenSrc" alt="Screen Share" style="width: 640px; max-width: 100%;" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScreenShare',
  data() {
    return {
      isSharing: false,
      screenSrc: '',
    };
  },
  methods: {
    async startScreenShare() {
      try {
        await window.electronAPI.startScreenShare();
        this.isSharing = true;
      } catch (error) {
        console.error('Failed to start screen sharing:', error);
        this.isSharing = false;
      }
    },
    stopScreenShare() {
      try {
        window.electronAPI.stopScreenShare();
      } finally {
        this.isSharing = false;
        this.screenSrc = '';
      }
    },
  },
  mounted() {
    window.electronAPI.onScreenFrame((imageData) => {
      this.screenSrc = `data:image/jpeg;base64,${imageData}`;
    });
  },
  beforeUnmount() {
    if (this.isSharing) {
      this.stopScreenShare();
    }
  },
};
</script>

<style scoped>
.screen-share-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}

img {
  border: 2px solid #00F0FF;
  border-radius: 8px;
  margin-top: 1rem;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}
</style>
