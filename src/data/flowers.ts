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
    messages: ['m-1806-a', 'm-1806-b', 'm-1806-c', 'm-1806-d'],
    date: '18.06.2026',
    art: 'white-lily',
  },
  {
    id: 'petrol-pump',
    name: 'Unidentified Specimen',
    latin: 'species unknown',
    symbolism: 'No reference books cover this one.',
    story: 'Found at a petrol pump. Never named, never photographed. It reminded her of someone, which is all the catalogue needs to know.',
    messages: ['m-2807-flower', 'm-2807-pump'],
    date: '28.07.2026',
    art: 'wildflower',
  },
  {
    id: 'tiger-lily',
    name: 'Tiger Lily',
    latin: 'Lilium lancifolium',
    symbolism: 'Traditionally: confidence, boldness, a little pride.',
    story: 'Nominated on 19 September. A peculiar pick, admittedly: not the prettiest flower on Google, but different, which was the point. The nominee did not love the flower. She did get the meaning.',
    messages: ['m-1909-tiger', 'm-1909-notfav'],
    date: '19.09.2026',
    art: 'tiger-lily',
  },
  {
    id: 'poppy',
    name: 'Poppy',
    latin: 'Papaver',
    symbolism: 'Traditionally: imagination, remembrance, sleep and dreams.',
    story: 'Reva’s own pick, submitted minutes after the tiger lily. Followed by one of the great plot twists of the year.',
    messages: ['m-1909-poppy', 'm-1909-yuhi', 'm-1909-notabout', 'm-1909-me', 'm-1909-notexactly'],
    date: '19.09.2026',
    art: 'poppy',
  },
  {
    id: 'handmade',
    name: 'The Handmade One',
    latin: 'Chenille stems, by hand',
    symbolism: 'No traditional meaning. Took about two weeks.',
    story: 'Pink-and-white lilies, with pink inwards. Poppies added after 19 September, by request. Made 12–23 September 2026.',
    date: 'Sept 2026',
    photo: 'bouquetHandmade',
    art: 'handmade',
  },
  {
    id: 'white-memoir',
    name: 'White Memoir',
    latin: 'Rosa, white',
    symbolism: 'Traditionally: new beginnings, and remembering.',
    story: 'The white-rose and white-flower bouquet, made for the 21st.',
    date: '15.10.2026',
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
