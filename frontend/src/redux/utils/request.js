import axios from 'axios'
import {get} from 'lodash';
import {strings} from 'res';

const baseURL = `${strings.api.host}/v1`

export const service = axios.create({
	baseURL,
	responseType: 'json'
})

service.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	config['headers'] = {
		'Authorization': 'Bearer ' + token,
		'Access-Control-Allow-Origin': "*",
		'Access-Control-Allow-Methods': "*",
		'accept': '*/*'
	}
	return config
}, (error) => {
	return Promise.reject(error)
})

service.interceptors.response.use((response) => {
    return response.data.data.accessToken
        ? response.data.data
        : response.data.data.content
}, (error) => {
	return Promise.reject(get(error, 'response.data'))
})

const request = (method, url, data, contentType) => {

	return service.request({
		url,
		method,
		params: method === 'get' ? data : null,
		data: method !== 'get' ? data : null,
		headers: {
			'Content-Type': contentType,
			'Access-Control-Allow-Origin': "*",
			'Access-Control-Allow-Methods': "*",
		}
	})
}

export default request