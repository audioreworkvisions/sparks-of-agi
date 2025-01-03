import React from 'react';
import { ThemeProvider } from '@fluentui/react';
import { appTheme } from './theme';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <div>Initial React App</div>
    </ThemeProvider>
  );
}

export default App;
