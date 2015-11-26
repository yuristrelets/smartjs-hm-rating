export class AppState {
  constructor() {
    this.workers = [];
    this.subscribers = [];
    this.state = {
      rating: {
        version: 0,
        records: [],
        loading: true
      }
    };
  }

  getState() {
    return this.state;
  }

  register(worker) {
    this.workers.push(worker);
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  dispatch(action) {
    this.workers.forEach((worker) => {
      this.state = worker.call(null, this.getState(), action);
    });

    this.subscribers.forEach((subscriber) => {
      subscriber.call(null, this.getState());
    });
  }
}
