import React from 'react';
import { ThemeProvider, Stack, IStackStyles } from '@fluentui/react';
import { appTheme } from './theme';
import { VideoPlayer } from './components/VideoPlayer';

function App() {
  const containerStyles: IStackStyles = {
    root: {
      height: '100vh',
      padding: '20px',
      backgroundColor: 'var(--background-color)',
    }
  };

  return (
    <ThemeProvider theme={appTheme}>
      <Stack styles={containerStyles} verticalAlign="center">
        <VideoPlayer />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
