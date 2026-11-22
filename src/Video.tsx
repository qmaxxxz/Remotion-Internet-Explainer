import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';

import timing from './timing.json';

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  let elapsed = 0;
  let scene = timing.scenes[0];
  let sceneStart = 0;

  for (const item of timing.scenes) {
    const length = item.seconds * fps;

    if (frame < elapsed + length) {
      scene = item;
      sceneStart = elapsed;
      break;
    }

    elapsed += length;
  }

  const localFrame = frame - sceneStart;
  const sceneFrames = scene.seconds * fps;

  const opacity = interpolate(
    localFrame,
    [0, 18, sceneFrames - 18, sceneFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  const scale = interpolate(
    localFrame,
    [0, sceneFrames],
    [0.96, 1.04]
  );

  const totalFrames =
    timing.scenes.reduce(
      (sum, item) => sum + item.seconds,
      0
    ) * fps;

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(135deg, #071426 0%, #102f50 55%, #071426 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #4fc3f7 0, transparent 28%), radial-gradient(circle at 80% 70%, #7c4dff 0, transparent 30%)'
        }}
      />

      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
          padding: 100,
          zIndex: 1
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            color: '#7dd3fc',
            marginBottom: 35
          }}
        >
          THE INTERNET EXPLAINED
        </div>

        <div
          style={{
            fontSize: 82,
            fontWeight: 800,
            lineHeight: 1.12,
            maxWidth: 1500
          }}
        >
          {scene.title}
        </div>

        <div
          style={{
            fontSize: 25,
            color: '#cbd5e1',
            marginTop: 45
          }}
        >
          How the World Connects
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: 100,
          right: 100,
          height: 5,
          background: 'rgba(255,255,255,.2)',
          zIndex: 2
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(frame / totalFrames) * 100}%`,
            background: '#38bdf8'
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
          
