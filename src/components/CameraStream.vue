<template>
    <div>
      <h2>Kamera-Stream</h2>
      <img :src="imageSrc" alt="Kamera Stream" style="width: 100%; max-width: 800px;" />
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
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  </style>
  