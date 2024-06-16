import axios from "axios";
import { strings } from "res";

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
        : `${strings.api.host}/${apiVersion}`;
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
            "Access-Control-Allow-Methods": "*",
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
        .then(function(res){
            return res
        })
        .catch((err) => {
            console.info(`[ERROR ${err.response}] Api Request: ${err}`);
            throw err;
        });
};