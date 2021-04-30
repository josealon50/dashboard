import axios from '../../axios-dashboard';
import * as actionTypes from './actionTypes';

export const alertGetStart = () => {
    return  {
        type: actionTypes.ALERT_GET_START
    };
};

export const alertGetSuccess = () => {
    return {
        type: actionTypes.ALERT_GET_SUCCESS,
    };
};

export const alertGetFail = ( error ) => {
    return {
        type: actionTypes.ALERT_GET_FAIL,
        error: true,
        error_msg: error.error_msg
    };
};

