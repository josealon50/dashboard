import axios from '../../axios-dashboard';
import * as actionTypes from './actionTypes';

export const shipmentGetStart = () => {
    return  {
        type: actionTypes.SHIPMENT_GET_START
    };
};

export const shipmentGetSuccess = () => {
    return {
        type: actionTypes.SHIPMENT_GET_SUCCESS,
    };
};

export const shipmentGetFail = ( error ) => {
    return {
        type: actionTypes.SHIPMENT_GET_FAIL,
        error: true,
        error_msg: error.error_msg
    };
};

