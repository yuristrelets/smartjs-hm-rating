import { RatingDataFetcher } from './transports/data-fetcher';
import { RatingDataReceiver } from './transports/data-receiver';
import { RATING_DATA_LOADED, RATING_DATA_UPDATED } from './actions/types';
import actionWorker from './actions/worker';

export class RatingComponent {
  constructor({ element, appState, options }) {
    this.element = element;
    this.options = options;
    this.updates = [];

    this.appState = appState;
    this.appState.register(actionWorker);
    this.appState.subscribe(this.render.bind(this));

    this.dataFetcher  = null;
    this.dataReciever = null;

    this.initialize();
    this.render();
  }

  initialize() {
    this.initializeTransport();
    this.connectReciever();
    this.fetchData();
  }

  initializeTransport() {
    this.dataFetcher = new RatingDataFetcher({
      url: this.options.loadUrl
    });

    this.dataReciever = new RatingDataReceiver({
      url: this.options.updateUrl,
      onNotify: this.dataUpdatedAction.bind(this)
    });
  }

  connectReciever() {
    this.dataReciever.connect();
  }

  fetchData() {
    this.dataFetcher.fetch().then(this.dataLoadedAction.bind(this));
  }

  //

  dataLoadedAction(data) {
    this.appState.dispatch({
      type: RATING_DATA_LOADED,
      payload: {
        ...data,
        updates: this.updates
      }
    });

    this.updates = [];
  }

  dataUpdatedAction(data) {
    if (data && data.hasOwnProperty('updates')) {
      const { rating } = this.appState.getState();

      if (rating.loading) {
        return this.updates.push(data);
      }

      this.appState.dispatch({
        type: RATING_DATA_UPDATED,
        payload: data
      });
    }
  }

  //

  render() {
    const { rating } = this.appState.getState();
    let html = null;

    if (rating.loading) {
      html = `<div>Loading...</div>`;
    } else {
      let itemsHtml = rating.records.map((record) => {
        return `<li>${record.name} (${record.points} points)</li>`;
      });

      html = `<ol>${itemsHtml.join('')}</ol>`;
    }

    this.element.innerHTML = html;
  }
}
