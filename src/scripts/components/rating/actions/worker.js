import { RATING_DATA_LOADED, RATING_DATA_UPDATED } from './types';

const sortRecords = (records) => {
  return records.sort((a, b) => b.points - a.points);
};

const isVersionEqual = (fromVersion, toVersion) => {
  return fromVersion === toVersion;
};

const applyUpdates = (records, updates) => {
  if (!updates.length) {
    return records;
  }

  return records.map((record) => {
    var update = updates.find((item) => item.id === record.id);

    if (!update) {
      return record;
    }

    return {
      ...record,
      points: update.points
    };
  });
};

//

const dataLoaded = (state, payload) => {
  let updated = payload.updates.reduce(({ version, records }, update) => {
    if (isVersionEqual(version, update.fromVersion)) {
      return {
        version: update.toVersion,
        records: applyUpdates(records, update)
      };
    }

    return rating;
  }, payload);

  return {
    ...state,
    rating: {
      loading: false,
      version: updated.version,
      records: sortRecords(updated.records)
    }
  };
};

const dataUpdated = (state, payload) => {
  if (!isVersionEqual(state.rating.version, payload.fromVersion)) {
    return state;
  }

  return {
    ...state,
    rating: {
      ...state.rating,
      version: payload.toVersion,
      records: sortRecords(applyUpdates(state.rating.records, payload.updates))
    }
  };
};

//

export default (state, action) => {
  const { payload } = action;

  switch (action.type) {
    case RATING_DATA_LOADED:
      return dataLoaded(state, payload);

    case RATING_DATA_UPDATED:
      return dataUpdated(state, payload);

    default:
      return state;
  }
};
