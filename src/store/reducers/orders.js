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

export const orderGetSuccess = () => {
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


//Order Status
export const orderGetOrderStatusStart = () => {
    return {
        type: actionTypes.ORDER_GET_STATUS_START
    };
};
export const orderGetOrderStatusSuccess = () => {
    return {
        type: actionTypes.ORDER_GET_STATUS_SUCESS
    };
};

export const orderGetOrderStatusFail = (error) => {
    return {
        type: actionTypes.ORDER_GET_STATUS_FAIL,
        error: true,
        error_msg: error
    };
};


//Order Components
export const orderGetComponentStart = () => {
    return {
        type: actionTypes.ORDER_GET_COMPONENTS_START
    };
};
export const orderGetComponentSucess = () => {
    return {
        type: actionTypes.ORDER_GET_COMPONENTS_SUCCESS
    };
};

export const orderGetComponentFail = (error) => {
    return {
        type: actionTypes.ORDER_GET_COMPONENTS_FAIL,
        error: true,
        error_msg: error
    };
};

//Order Pagination
export const orderGetPaginationStart = () => {
    return {
        type: actionTypes.ORDER_GET_PAGINATION_START
    };
};
export const orderGetPaginationSuccess = () => {
    return {
        type: actionTypes.ORDER_GET_PAGINATION_SUCCESS
    };
};

export const orderGetPaginationFail = (error) => {
    return {
        type: actionTypes.ORDER_GET_PAGINATION_FAIL,
        error: true,
        error_msg: error
    };
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ORDER_GET_START: return orderGetStart(state, action);
        case actionTypes.ORDER_GET_SUCCESS: return orderGetSuccess(state, action);
        case actionTypes.ORDER_GET_FAIL: return orderGetFail(state, action);
        case actionTypes.ORDER_GET_STATUS_START: return orderGetOrderStatusStart( state, action );
        case actionTypes.ORDER_GET_STATUS_SUCESS: return orderGetOrderStatusSuccess( state, action );
        case actionTypes.ORDER_GET_STATUS_FAIL: return orderGetOrderStatusFail( state, action );
        case actionTypes.ORDER_GET_COMPONENTS_START: return orderGetComponentStart( state, action );
        case actionTypes.ORDER_GET_COMPONENTS_SUCCESS: return orderGetComponentSucess( state, action );
        case actionTypes.ORDER_GET_COMPONENTS_FAIL: return orderGetComponentFail( state, action );
        case actionTypes.ORDER_GET_PAGINATION_START: return orderGetPaginationStart( state, action );
        case actionTypes.ORDER_GET_PAGINATION_SUCCESS: return orderGetPaginationSuccess( state, action );
        case actionTypes.ORDER_GET_PAGINATION_FAIL: return orderGetPaginationFail( state, action );
        default:
            return state;
        }
};

export default reducer;
