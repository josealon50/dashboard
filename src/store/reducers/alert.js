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

export default reducer;
