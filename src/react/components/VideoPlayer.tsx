import React, { useState, useEffect } from 'react';
import { Stack, IStackStyles, useTheme } from '@fluentui/react';

interface IVideoPlayerProps {
  className?: string;
}

export const VideoPlayer: React.FC<IVideoPlayerProps> = ({ className }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const theme = useTheme();

  useEffect(() => {
    // Subscribe to camera frame updates from Electron
    window.electronAPI.onFromPython((imageData: string) => {
      setImageSrc(`data:image/jpeg;base64,${imageData}`);
    });

    // Cleanup subscription on unmount
    return () => {
      window.electronAPI.removeListener('from-python');
    };
  }, []);

  const containerStyles: IStackStyles = {
    root: {
      width: '42%', // Middle of 40-45% range
      aspectRatio: '16/9',
      position: 'relative',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      background: theme.palette.black,
      overflow: 'hidden',
      margin: '0 auto',
      className,
    }
  };

  return (
    <Stack styles={containerStyles}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Camera Stream"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          styles={{
            root: {
              height: '100%',
              color: theme.palette.neutralSecondary,
            }
          }}
        >
          Warte auf Kamera-Stream...
        </Stack>
      )}
    </Stack>
  );
};
