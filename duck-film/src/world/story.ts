import {SceneDef} from './stage';
import {endScene, roadScene, titleScene} from './scenes-a';
import {kitchenScene, letterScene, orderScene} from './scenes-b';
import {garageScene, hospitalScene, kindnessScene, stairsScene} from './scenes-c';

/** The film in order. The first and last entries are the title and end screens. */
export const buildStory = (): SceneDef[] => [
  titleScene(), roadScene(), letterScene(), orderScene(), kitchenScene(), hospitalScene(1),
  garageScene(), hospitalScene(2), stairsScene(), kindnessScene(), endScene(),
];
