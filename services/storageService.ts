import { AppState } from '../types';

const STORAGE_KEY = 'leadership_tracker_v1';

const INITIAL_STATE: AppState = {
  reflections: [],
  triggers: [],
  accomplishments: []
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return INITIAL_STATE;
    return JSON.parse(serialized);
  } catch (e) {
    console.error('Failed to load state', e);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
};