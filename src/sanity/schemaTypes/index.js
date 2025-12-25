import { reviewType } from './review';
import { tileType } from './tile';
import { homepageType } from './homepage';
import { servicePage } from './servicePage';
import { aboutPage } from './aboutPage';
import { contactPage } from './contactPage';
import { settings } from './settings';
import lead from './lead'; // <--- ADD THIS LINE

export const schema = {
  types: [
    reviewType,
    tileType,
    homepageType,
    servicePage,
    aboutPage,
    contactPage,
    lead, // <--- Now this will work
    settings,
  ],
};
