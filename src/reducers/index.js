import { combineReducers } from 'redux';
import geojson from './geojson';
import filter from './filter';

export default combineReducers({
    geojson,
    filter,
})