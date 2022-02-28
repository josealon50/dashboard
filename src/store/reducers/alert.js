import { updateObject } from '../../shared/utility';
import * as actionTypes from './actionTypes';

export const alertGetStart = ( state ) => {
    return updateObject( state, {
        type: actionTypes.ALERT_GET_START
    });
};

export const alertGetSuccess = ( state ) => {
    return updateObject( state,  {
        type: actionTypes.ALERT_GET_SUCCESS,
    });
};

export const alertGetFail = ( state, error) => {
    return updateObject( state, {
        type: actionTypes.ALERT_GET_FAIL,
        error: true,
        error_msg: error.error_msg
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_FAIL_HANDLE: return authFailHandle(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        default:
            return state;
        }
};

export default reducer;
