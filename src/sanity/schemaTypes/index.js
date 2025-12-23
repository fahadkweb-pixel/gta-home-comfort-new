import { reviewType } from './review';
import { tileType } from './tile';
import { homepageType } from './homepage';
import { servicePage } from './servicePage'; // <--- NEW IMPORT

export const schema = {
  types: [
    reviewType,
    tileType,
    homepageType,
    servicePage, // <--- ADDED HERE
  ],
};
