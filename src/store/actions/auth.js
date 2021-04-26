import axios from '../../axios-dashboard';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (access_token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: access_token
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
        type: actionTypes.AUTH_LOGOUT,
        path: '/'
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
                const expirationDate = new Date(new Date().getTime() + 60 * 1000);
                localStorage.setItem('access_token', response.data.data.access);
                localStorage.setItem('refresh_token', response.data.data.refresh);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(response.data.data.access));
                dispatch(checkAuthTimeout(600));
                dispatch(setAuthRedirectPath('/me'));
            })
            .catch(function (error) {
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
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            dispatch(logout());
        } 
        else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } 
            else {
                dispatch(authSuccess(access_token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            }   
        }
    };
};
