// The Flower Department (flower.exe).
// `symbolism` is general flower lore. `story` is ours, and matters more.
import type { Flower } from './types';

export const flowers: Flower[] = [
  {
    id: 'white-lily',
    name: 'White Lily',
    latin: 'Lilium candidum',
    symbolism: 'Traditionally: purity, renewal, a fresh start.',
    story: 'Specimen No. 1. Identified on 18 June, when Reva was described as one. Pink inwards, specifically.',
    messages: ['m-1806-0', 'm-1806-a', 'm-1806-b', 'm-1806-c', 'm-1806-d'],
    date: '18.06.2026',
    art: 'white-lily',
    handmadePhoto: 'BQ-HD3',
  },
  {
    id: 'petrol-pump',
    name: 'The Petrol-Pump Flower',
    latin: 'species unknown · pink',
    symbolism: 'No reference books cover this one.',
    story: 'Picked by Reva, for Ruru, at a petrol pump. There were others; the pink one was the one. It reminded her of him. She told the story on 28 July; the day she picked it isn’t recorded.',
    messages: ['m-2807-remember', 'm-2807-gas', 'm-2807-flower', 'm-2807-pump', 'm-2807-pink'],
    date: 'told 28.07.2026',
    art: 'wildflower',
  },
  {
    id: 'tiger-lily',
    name: 'Tiger Lily',
    latin: 'Lilium lancifolium',
    symbolism: 'Traditionally: confidence, boldness, a little pride.',
    story: 'Nominated on 19 September. A peculiar pick, admittedly: not the prettiest flower on Google, but different, which was the point. The nominee did not love the flower. She did get the meaning.',
    messages: ['m-1909-tiger', 'm-1909-oneday', 'm-1909-notexpect', 'm-1909-meaning', 'm-1909-par', 'm-1909-notfav'],
    date: '19.09.2026',
    art: 'tiger-lily',
  },
  {
    id: 'poppy',
    name: 'Poppy',
    latin: 'Papaver',
    symbolism: 'Traditionally: imagination, remembrance, sleep and dreams.',
    story: 'Reva’s own pick, submitted a minute after she said she didn’t like the tiger lily. Followed by one of the great plot twists of the year. Two days later, pipe-cleaner poppies started appearing in Ruru’s videos.',
    messages: ['m-1909-poppy', 'm-1909-yuhi', 'm-1909-notabout', 'm-1909-me', 'm-1909-notexactly'],
    date: '19.09.2026',
    art: 'poppy',
    handmadePhoto: 'BQ-F0921',
  },
  {
    id: 'handmade',
    name: 'The Handmade One',
    latin: 'Chenille stems, by hand',
    symbolism: 'No traditional meaning. Took about two weeks.',
    story: 'Pipe-cleaner lilies, pink-and-white with pink inwards, and red poppies, which appear from 21 September. Made by Ruru between 12 and 23 September 2026 (dated by his video files). Not real cut flowers, which is rather the point.',
    date: '12–23.09.2026',
    photo: 'BQ-HD2',
    timeline: ['BQ-F0912', 'BQ-F0914a', 'BQ-F0914b', 'BQ-P01', 'BQ-F0919', 'BQ-F0921', 'BQ-F0922', 'BQ-F0923'],
    art: 'handmade',
  },
  {
    id: 'white-memoir',
    name: 'White Memoir',
    latin: 'Rosa, white',
    symbolism: 'Traditionally: new beginnings, and remembering.',
    story: 'The white-rose and white-flower bouquet, made for the 21st. A separate thing from the handmade one.',
    photoPlaceholder: 'Add a photo of the White Memoir bouquet in scripts/asset-sources.json, then set `photo` here.',
    art: 'white-memoir',
  },
];

/** Stems available in the bouquet studio. */
export const stems = [
  { id: 'white-lily', label: 'White lily' },
  { id: 'tiger-lily', label: 'Tiger lily' },
  { id: 'poppy', label: 'Poppy' },
  { id: 'white-rose', label: 'White rose' },
  { id: 'babys-breath', label: 'Baby’s breath' },
  { id: 'leaf', label: 'Eucalyptus' },
] as const;

export type StemId = (typeof stems)[number]['id'];

export const bouquetCopy = {
  done: 'Looks like you have a talent for this too.',
  surprise: 'Filed under: things the Flower Department will be keeping.',
};
