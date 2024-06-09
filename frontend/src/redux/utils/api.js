import axios from "axios";

export const apiRequest = async ({
    url,
    method,
    timeout,
    headers,
    data,
    params,
    path,
    apiVersion = "v1",
}) => {
    const baseUrl = url
        ? `${url}/${apiVersion}`
        : `https://journal-florist-staging.herokuapp.com/api/${apiVersion}`;
    const defaultParams = {};
    const mergedParams = { ...defaultParams, ...params };
    let token = localStorage.getItem('token');

    const config = {
        method,
        url: baseUrl + path,
        params: mergedParams,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
            Authorization: token ? 'Bearer ' + token : "",
        },
    };

    if (headers) {
        config.headers = { ...config.headers, ...headers };
    }

    if (data) {
        config.data = data;
    }

    if (timeout) {
        config.timeout = timeout;
    }

    return axios(config)
        .then((res) => res)
        .catch((err) => {
            console.info("[ERROR] Api Request: ", err);
            throw err;
        });
};