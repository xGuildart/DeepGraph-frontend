import axios from 'axios';
// import JSEncrypt from 'jsencrypt';
// import CryptoJS from 'cryptojs';

export function getToken() {

    var baseURL = process.env.REACT_APP_BASE_URL;

    var bodyFormData = new FormData();

    bodyFormData.append('username', '*user*');
    bodyFormData.append('password', '*password*');
    bodyFormData.append('client_secret', "*secret*");

    return axios({
        method: "post",
        url: baseURL + '/tokens',
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    })
        .then((response) => {
            // console.log("token: " + response);
            return response.data;
        }, (error) => {
            console.log(error);
        });
}

export function updateUser(username) {
    var baseURL = process.env.REACT_APP_BASE_URL;
    return getToken().then((token) => {
        return axios({
            method: "patch",
            url: baseURL + '/users/' + username,
            headers: {
                'Authorization': `Bearer ${token.access_token}`
            },
        })
            .then((response) => {
                // console.log("token: " + response);
                return response.data;
            }, (error) => {
                console.log(error);
            });
    }, (error) => { console.log(error); return error; });
}

export function registerUser(username, email, password) {

    var baseURL = process.env.REACT_APP_BASE_URL;

    return getToken().then((token) => {
        if (password) {
            return axios.post('/user', { "username": username, "password": password, "email": email }, {
                baseURL: baseURL,
                headers: {
                    'Authorization': `Bearer ${token.access_token}`
                },
            })
                .then((response) => {
                    // console.log(response);
                    return response
                }, (error) => {
                    console.log(error);
                    return error;
                });
        }
    }, (error) => console.log(error)
    )

}

export function checkUser(identifier, password) {
    var baseURL = process.env.REACT_APP_BASE_URL;

    return getToken().then((token) => {
        return axios({
            method: "post",
            url: baseURL + '/checkUser',
            data: { "identifier": identifier, "password": password },
            headers: {
                'Authorization': `Bearer ${token.access_token}`
            },
        })
            .then((response) => {
                // console.log(response);
                return response
            }, (error) => {
                console.log(error);
                return error;
            });
    }, (error) => { console.log(error) });
}

export function getGenZ() {
    var baseURL = process.env.REACT_APP_BASE_URL;

    return getToken().then((token) => {
        return axios({
            method: "get",
            url: baseURL + '/genz',
            params: { offset: 0, limit: 28800 },
            headers: {
                'Authorization': `Bearer ${token.access_token}`
            },
        })
            .then((response) => {
                // console.log(response);
                return response
            }, (error) => {
                console.log(error);
                return error;
            });
    }, (error) => { console.log(error) });
}

export function getYoungPeople() {
    var baseURL = process.env.REACT_APP_BASE_URL;

    return getToken().then((token) => {
        return axios({
            method: "get",
            url: baseURL + '/young',
            params: { offset: 0, limit: 150 },
            headers: {
                'Authorization': `Bearer ${token.access_token}`
            },
        })
            .then((response) => {
                //console.log(response);
                return response
            }, (error) => {
                console.log(error);
                return error;
            });
    }, (error) => { console.log(error) });
}

