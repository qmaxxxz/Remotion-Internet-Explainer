
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const timing = JSON.parse(
  fs.readFileSync('src/timing.json', 'utf8')
);

const totalFrames =
  timing.scenes.reduce(
    (sum, scene) => sum + scene.seconds,
    0
  ) * timing.fps;

const chunkFrames = 60 * timing.fps;

fs.mkdirSync('out', {recursive: true});

const chunks = [];

for (
  let start = 0, n = 1;
  start < totalFrames;
  start += chunkFrames, n++
) {
  const end = Math.min(
    start + chunkFrames,
    totalFrames
  ) - 1;

  const name = `chunk-${String(n).padStart(2, '0')}.mp4`;

  chunks.push(name);

  if (
    fs.existsSync(`out/${name}`) &&
    fs.statSync(`out/${name}`).size > 0
  ) {
    console.log(`Skip ${name}: already exists`);
    continue;
  }

  console.log(
    `Rendering ${name}: frames ${start}-${end}`
  );

  const result = spawnSync(
    'npx',
    [
      'remotion',
      'render',
      'src/index.ts',
      'Main',
      `out/${name}`,
      `--frames=${start}-${end}`,
      '--concurrency=1'
    ],
    {stdio: 'inherit'}
  );

  if (result.status !== 0) {
    console.error(`Failed: ${name}`);
    process.exit(result.status ?? 1);
  }
}

fs.writeFileSync(
  'out/list.txt',
  chunks.map(name => `file '${name}'`).join('\n') + '\n'
);

if (process.argv.includes('--merge')) {
  const result = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', 'out/list.txt',
      '-c', 'copy',
      'out/final.mp4'
    ],
    {stdio: 'inherit'}
  );

  process.exit(result.status ?? 1);
}

console.log(
  'Chunks complete. Run npm run render:merge to combine them.'
);
