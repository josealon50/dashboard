import axios from '../../axios-dashboard';
import * as actionTypes from './actionTypes';

export const orderStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const orderFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: true,
        error_msg: error
    };
};

