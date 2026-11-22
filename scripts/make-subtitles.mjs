
import fs from 'node:fs';

const timing = JSON.parse(
  fs.readFileSync('src/timing.json', 'utf8')
);

const stamp = (seconds) => {
  const ms = Math.round(seconds * 1000);

  const h = String(
    Math.floor(ms / 3600000)
  ).padStart(2, '0');

  const m = String(
    Math.floor((ms % 3600000) / 60000)
  ).padStart(2, '0');

  const s = String(
    Math.floor((ms % 60000) / 1000)
  ).padStart(2, '0');

  const milli = String(ms % 1000).padStart(3, '0');

  return `${h}:${m}:${s},${milli}`;
};

let cursor = 0;
const lines = [];

timing.scenes.forEach((scene, i) => {
  lines.push(
    String(i + 1),
    `${stamp(cursor)} --> ${stamp(cursor + scene.seconds)}`,
    scene.title,
    ''
  );

  cursor += scene.seconds;
});

fs.mkdirSync('out', {recursive: true});

fs.writeFileSync(
  'out/subtitles.srt',
  lines.join('\n')
);

console.log('Created out/subtitles.srt');
