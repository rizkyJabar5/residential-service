import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api'
import request from 'redux/utils/request'
import { message } from "antd";

const url = URLS.USER

export const getUsers = async (params) =>
	apiRequest({
		path: `${ url }`,
		method: 'GET',
		params,
	});

export const addUser = async (data) =>
	apiRequest({
		path: `/users/add-user`,
		method: "POST",
		data,
	});

export const fetchAllUser = createAsyncThunk(
	'Users/fetchAllUser',
	async (params, { rejectWithValue }) => {
		const res = await getUsers(params)
		console.log(res.data)
		return res.data.data
			// .then((res) => {
			// 	console.log(res.data.data.content)
			// 	return res.data.data;
			// })
			// .catch((err) => {
			// 	return rejectWithValue(err)
			// });
	},
)

export const fetchOneUser = createAsyncThunk(
	'User/fetchOneUser',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('get', `${ URLS.USER }/${ id }`)
			return response.data
		} catch (error) {
			return rejectWithValue(error)
		}
	},
)

export const deleteUser = createAsyncThunk(
	'User/deleteUser',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${ URLS.USER }/${ id }`)
			return response.data
		} catch (error) {
			return rejectWithValue(error)
		}
	},
)

const initialState = {
	loading: {
		query: false,
		mutation: false,
	},
	filter: {
		q: '',
	},
	list: [],
	selected: {},
	selectedRows: [],
}

const loadingReducer = (fieldName, status) => (state) => {
	state.loading[fieldName] = status
}

const startLoadingQuery = loadingReducer('query', true)
const stopLoadingQuery = loadingReducer('query', false)
const startLoadingMutation = loadingReducer('mutation', true)
const stopLoadingMutation = loadingReducer('mutation', false)

export const UserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setAppliedSearchText: (state, action) => {
			state.filter.q = action.payload
		},
		setSelectedRows: (state, action) => {
			state.selectedRows = action.payload
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchAllUser.pending, startLoadingQuery)
			.addCase(fetchAllUser.fulfilled, (state, action) => {
				if(action.payload?.content) {
					state.list = action.payload.content;
				} else {
					// Handle cases where content is missing in the response
					message.warn('Gagal mendapatkan data user');
				}
				state.loading.query = false
				state.message = action.payload
			})
			.addCase(fetchAllUser.rejected, (state, action ) => {
				state.loading.query = false
				message.error('Gagal mendapatkan data user:', action.error.message); // Use Ant Design message for error notification
			})

		builder
			.addCase(fetchOneUser.pending, startLoadingQuery)
			.addCase(fetchOneUser.rejected, stopLoadingQuery)
			.addCase(fetchOneUser.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})

		builder
			.addCase(deleteUser.pending, startLoadingMutation)
			.addCase(deleteUser.fulfilled, stopLoadingMutation)
			.addCase(deleteUser.rejected, stopLoadingMutation)
	},
});


export const { setSelectedRows, setAppliedSearchText } = UserSlice.actions;

export default UserSlice.reducer;