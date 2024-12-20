<template>
    <div>
      <h1>Electron + Python Integration</h1>
      <input v-model="message" placeholder="Nachricht an Python" />
      <button @click="sendMessage">Senden</button>
      <p>Antwort von Python: {{ response }}</p>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        message: '',
        response: '',
      };
    },
    methods: {
      sendMessage() {
        window.electronAPI.sendToPython(`TEXT_INPUT:${this.message}`);
      },
    },
    mounted() {
      window.electronAPI.onFromPython((data) => {
        this.response = data;
      });
    },
  };
  </script>
  