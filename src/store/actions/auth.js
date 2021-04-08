import axios from '../../axios-dashboard';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: true,
        error_msg: error
    };
};

export const authFailHandle = () => {
    return {
        type: actionTypes.AUTH_FAIL_HANDLE,
        error: false,
        error_msg: ''
    };
        
}
export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('refresh_token');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const auth = (username, password) => {
    return dispatch => {
        dispatch(authStart());

        var data = new FormData();
        data.append('username', username);
        data.append('password', password);

        var config = {
              method: 'post',
              url: '/token/',
              data : data
        };
        axios(config)
            .then(function (response) {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('access_token', response.data.data.access);
                localStorage.setItem('refresh_token', response.data.data.refresh);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(function (error) {
                console.log("BEFORE ERROR MSG PRINT");
                console.log(error);
                dispatch(authFail(error.response.data.errors[0].detail));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } 
        else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } 
            else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            }   
        }
    };
};
