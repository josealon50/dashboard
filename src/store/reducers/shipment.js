import { updateObject } from '../../shared/utility';
import * as actionTypes from './actionTypes';

export const shipmentGetStart = ( state ) => {
    return updateObject( state, {
        type: actionTypes.SHIPMENT_GET_START
    });
};

export const shipmentGetSuccess = ( state ) => {
    return updateObject( state,  {
        type: actionTypes.SHIPMENT_GET_SUCCESS,
    });
};

export const shipmentGetFail = ( state, error) => {
    return updateObject( state, {
        type: actionTypes.SHIPMENT_GET_FAIL,
        error: true,
        error_msg: error.error_msg
    });
};

export default reducer;
