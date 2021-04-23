import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    error: null,
    error_msg: '',
    loading: false,
    landingRedirectPath: '/',
};

export const setLandingRedirectPath = (path) => {
    return {
        type: actionTypes.SET_LANDING_REDIRECT_PATH,
        path: path
    };
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_LANDING_REDIRECT_PATH: setLandingRedirectPath: return (state, action);
        default:
            return state;
        }
};

export default reducer;
