import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api'
import request from 'redux/utils/request'
import { message } from "antd";

const url = URLS.USER
const url_register = URLS.REGISTER
const url_citizen_register = URLS.CITIZEN_REGISTER

const getUsers = async (params) =>
	apiRequest({
		path: `${ url }`,
		method: 'GET',
		params,
	});

const registerUser = async (data) =>
	apiRequest({
		path: `${ url_register }`,
		method: "POST",
		data,
	});

const registerCitizen = async (data) =>
	apiRequest({
		path: `${ url_citizen_register }`,
		method: "POST",
		data,
	});

export const fetchAllUser = createAsyncThunk(
	'Users/fetchAllUser',
	async (params, { rejectWithValue }) => {
		const res = await getUsers(params)
		return res.data.data
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

export const addNewStaff = createAsyncThunk(
	'User/addNewStaff',
	async (data, { rejectWithValue }) => {
		try {
			const res = await registerUser(data)
			return res.data
		} catch (error) {
			return rejectWithValue(error.response.data)
		}
	},
)

export const addNewCitizen = createAsyncThunk(
	'User/addNewCitizen',
	async (data, { rejectWithValue }) => {
		try {
			const res = await registerCitizen(data)
			return res.data
		} catch (error) {
			return rejectWithValue(error.response.data)
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
	isLoading: false,
	error: null,
	filter: {
		q: '',
	},
	message: '',
	list: [],
	selected: {},
	selectedRows: [],
}

const loadingReducer = (status) => (state) => {
	state.isLoading = status
}

const startLoading = loadingReducer(true)
const stopLoading = loadingReducer(false)

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
			.addCase(fetchAllUser.pending, startLoading)
			.addCase(fetchAllUser.fulfilled, (state, action) => {
				if(action.payload?.content) {
					state.list = action.payload.content;
				} else {
					message.warn('Gagal mendapatkan data user');
				}
				state.isLoading = false
				state.message = action.payload.message
			})
			.addCase(fetchAllUser.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
				message.error('Gagal mendapatkan data user:', action.error.message); // Use Ant Design message for error notification
			})

		builder
			.addCase(fetchOneUser.pending, startLoading)
			.addCase(fetchOneUser.rejected, stopLoading)
			.addCase(fetchOneUser.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
			})
		builder
			.addCase(addNewStaff.pending, startLoading)
			.addCase(addNewStaff.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
				state.message = action.payload.message
				message.error(state.message);
			})
			.addCase(addNewStaff.fulfilled, (state, action) => {
				state.isLoading = false
				state.error = null
				state.message = action.payload.message
				state.selected = action.payload.data;
				message.success(state.message)
			})
		builder
			.addCase(addNewCitizen.pending, startLoading)
			.addCase(addNewCitizen.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
				state.message = action.payload.message
				message.error(state.message);
			})
			.addCase(addNewCitizen.fulfilled, (state, action) => {
				state.isLoading = false
				state.error = null
				state.message = action.payload.message
				state.selected = action.payload.data;
				message.success(state.message)
			})
		builder
			.addCase(deleteUser.pending, startLoading)
			.addCase(deleteUser.fulfilled, stopLoading)
			.addCase(deleteUser.rejected, stopLoading)
	},
});


export const { setSelectedRows, setAppliedSearchText } = UserSlice.actions;

export default UserSlice.reducer;