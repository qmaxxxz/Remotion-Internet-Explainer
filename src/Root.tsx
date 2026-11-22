
import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import timing from './timing.json';

const durationInFrames =
  timing.scenes.reduce(
    (sum, scene) => sum + scene.seconds,
    0
  ) * timing.fps;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Video}
      durationInFrames={durationInFrames}
      fps={timing.fps}
      width={timing.width}
      height={timing.height}
    />
  );
};
