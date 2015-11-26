import '../styles/app.less';

import { RatingComponent } from './components/rating';
import { AppState } from './state';
import config from './config';

const appState = new AppState();

new RatingComponent({
  appState,
  element: document.getElementById('rating'),
  options: config.rating
});
