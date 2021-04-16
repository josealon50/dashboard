import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    error : '',
    error_msg : '', 
    authRedirectPath: '/'
};

export const orderGetStart = () => {
    return {
        type: actionTypes.ORDER_GET_START
    };
};

export const orderGetSucess = () => {
    return {
        type: actionTypes.ORDER_GET_SUCCESS
    };
};

export const orderGetFail = (error) => {
    return {
        type: actionTypes.ORDER_GET_FAIL,
        error: true,
        error_msg: error
    };
};

export const orderFailHandle = () => {
    return {
        type: actionTypes.ORDER_GET_FAIL_HANDLE,
        error: false,
        error_msg: ''
    };
        
}
const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ORDER_GET_START: return orderGetStart(state, action);
        case actionTypes.ORDER_GET_SUCCESS: return orderGetSuccess(state, action);
        case actionTypes.ORDER_GET_FAIL: return orderGetFail(state, action);
        case actionTypes.ORDER_GET_FAIL_HANDLE: return orderGetFailHandle(state, action);
        default:
            return state;
        }
};

export default reducer;
