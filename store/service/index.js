import { combineReducers } from 'redux';
import serviceState from './state';

const serviceReducer = combineReducers({ serviceState });

export default serviceReducer;
