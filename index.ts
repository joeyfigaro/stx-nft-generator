import { parseArgs } from 'util';
import prand from 'pure-rand';
import { mkdir } from 'node:fs/promises';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    count: {
      type: 'string',
    },
    seed: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});

const count = parseInt(values.count || '10');

let currentIteration = 0;

try {
  await mkdir('avatars/micah', { recursive: true });
} catch (error) {
  console.error('failed to create avatars directory', error);
  process.exit(1);
}

while (currentIteration < count) {
  const seed = `${Date.now() ^ (Math.random() * 0x100000000)}`;
  const rng = prand.xoroshiro128plus(parseInt(values.seed || seed));
  const state = rng.getState ? rng.getState() : [seed, seed];
  const joinedSeed = state.join('');

  const avatar = createAvatar(micah, {
    seed: joinedSeed,
    // scale: 90,
    facialHair: undefined,
    flip: true,
    translateY: 5,
    eyebrows: ['eyelashesDown', 'up', 'down', 'eyelashesUp'],
    eyes: ['eyesShadow', 'smilingShadow'],
    mouth: ['smile', 'frown', 'laughing'],
    glassesColor: ['#000000', '#0a0a0a', '#0b0b0b'],

    // randomizeIds: true,
    earringsProbability: 20,
    hair: ['turban', 'dougFunny', 'dannyPhantom', 'full', 'pixie', 'turban'],
  });

  const svg = avatar.toString();
  const json = avatar.toJson();

  await Bun.write(`avatars/micah/${currentIteration}.svg`, svg);
  await Bun.write(
    `avatars/micah/${currentIteration}.json`,
    JSON.stringify(json.extra),
  );

  currentIteration++;
}
