import { action } from 'typesafe-actions';

export const SET_OUTPUT_BACKGROUND = 'SET_OUTPUT_BACKGROUND';
export const SET_OUTPUT_COLOR = 'SET_OUTPUT_COLOR';

export const setOutputBackground = (color: string) => action(SET_OUTPUT_BACKGROUND, {
  color,
});

export const setOutputColor = (color: string) => action(SET_OUTPUT_COLOR, {
  color,
});