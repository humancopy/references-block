import { MAX_TITLE_LENGTH } from './Constants';

export const trimString = (string) => {
  string = string.trim();
  return string.length > MAX_TITLE_LENGTH ? `${string.substring(0, MAX_TITLE_LENGTH - 3)}...` : string;
};

export const getConfig = (context, payload) => {
  return {...(payload?.defaultConfig || {}), ...(context.extension.config || {})};
};
