export class RatingDataFetcher {
  constructor({ url }) {
    this.url = url;
  }

  fetch() {
    return fetch(this.url).then((response) => response.json());
  }
}
