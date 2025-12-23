import { reviewType } from './review';
import { tileType } from './tile';
import { homepageType } from './homepage';
import { servicePage } from './servicePage';
import { aboutPage } from './aboutPage';
import { contactPage } from './contactPage';
import { settings } from './settings'; // <--- 1. Import

export const schema = {
  types: [
    reviewType,
    tileType,
    homepageType,
    servicePage,
    aboutPage,
    contactPage,
    settings, // <--- 2. Add to list
  ],
};
