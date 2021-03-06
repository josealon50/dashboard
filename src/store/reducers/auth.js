import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
        access_token: null,
        refresh_token: null,
        error: null,
        error_msg: '',
        loading: false
};

const authStart = ( state, action ) => {
    return updateObject( state, { error: null, error_msg: '', loading: true } );
};

const authSuccess = (state, action) => {
    return updateObject( state, { 
        access_token: action.token,
        userId: action.userId,
        error: null,
        error_msg: '',
        loading: false
     } );
};

const authFail = (state, action) => {
    return updateObject( state, {
        error: true,
        error_msg : action.error_msg,
        loading: false
    });
};

const authFailHandle = (state, action) => {
    return updateObject( state, {
        error: false,
        error_msg : null,
        loading: false
    });
};

const authLogout = (state, action) => {
    return updateObject(state, { access_token: null });
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
