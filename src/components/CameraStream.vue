<template>
    <div>
      <h2>Kamera-Stream</h2>
      <img :src="imageSrc" alt="Kamera Stream" style="width: 640px; max-width: 100%;" />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        imageSrc: '',
      };
    },
    mounted() {
      window.electronAPI.onCameraFrame((imageData) => {
        this.imageSrc = `data:image/jpeg;base64,${imageData}`;
      });
    },
  };
  </script>
  
  <style scoped>
  img {
    border: 2px solid #00F0FF;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
  }
  </style>
  
  
  
  
  
  
  