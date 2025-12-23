import { reviewType } from './review';
import { tileType } from './tile';
import { homepageType } from './homepage';
import { servicePage } from './servicePage';
import { aboutPage } from './aboutPage'; // <--- NEW
import { contactPage } from './contactPage'; // <--- NEW

export const schema = {
  types: [
    reviewType,
    tileType,
    homepageType,
    servicePage,
    aboutPage, // <--- ADDED
    contactPage, // <--- ADDED
  ],
};
