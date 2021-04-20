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
    return {
        type: actionTypes.ORDER_GET_FAIL_HANDLE,
        error: false,
        error_msg: ''
    };
        
}

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

export const orderGetStatusFailHandle = () => {
    return {
        type: actionTypes.ORDER_GET_STATUS_FAIL_HANDLE,
        error: false,
        error_msg: ''
    };
        
}

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

export const orderGetComponentFailHandle = () => {
    return {
        type: actionTypes.ORDER_GET_COMPONENTS_FAIL_HANDLE,
        error: false,
        error_msg: ''
    };
        
}

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

export const orderGetPaginationFailHandle = () => {
    return {
        type: actionTypes.ORDER_GET_PAGINATION_FAIL_HANDLE,
        error: false,
        error_msg: ''
    };
        
}

