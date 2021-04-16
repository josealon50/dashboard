import * as actionTypes from './actionTypes';

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
        type: actionTypes.AUTH_FAIL,
        error: true,
        error_msg: error
    };
};

export const orderGetFailHandle = () => {
    console.log(actionTypes.ORDER_GET_FAIL_HANDLE);
    return {
        type: actionTypes.ORDER_GET_FAIL_HANDLE,
        error: false,
        error_msg: ''
    };
    
};

