import * as actionTypes from './actionTypes';


export const setLandingRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const meStart = () => {
    return {
        type: actionTypes.ME_START
    }; 
};

export const meSuccess = () => {
    return {
        type: actionTypes.ME_SUCCESS
    }; 
};

export const meError = () => {
    return {
        type: actionTypes.ME_ERROR
    }; 
};
