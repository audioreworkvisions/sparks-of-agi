<template>
  <div id="app">
    <header>
      <h1>Alloy Ada System</h1>
      <h2>Electron + Vue + Python Integration</h2>
    </header>
    <main>
      <PromptForm />
      <CameraStream />
    </main>
    <footer>
      <p>&copy; 2024 Audioreworkvisions</p>
    </footer>
  </div>
</template>

<script>
import PromptForm from './components/PromptForm.vue';
import CameraStream from './components/CameraStream.vue';

export default {
  name: 'App',
  components: {
    PromptForm,
    CameraStream,
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

footer {
  background-color: #f1f1f1;
  padding: 10px;
  font-size: 0.9em;
  color: #555;
}
</style>
