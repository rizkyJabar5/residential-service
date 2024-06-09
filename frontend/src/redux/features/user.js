import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api'
import request from 'redux/utils/request'

export const addUser = async (data) =>
	apiRequest({
		path: `/users/add-user`,
		method: "POST",
		data
	});

export const fetchAllUser = createAsyncThunk(
	'User/fetchAllUser',
	async (_, { rejectWithValue }) => {
		try {
			const response = await request('get', URLS.USER)
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const fetchOneUser = createAsyncThunk(
	'User/fetchOneUser',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('get', `${URLS.USER}/${id}`)
			return response.data
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const deleteUser = createAsyncThunk(
	'User/deleteUser',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${URLS.USER}/${id}`)
			return response.data
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

const initialState = {
	loading: {
		query: false,
		mutation: false
	},
	filter: {
		q: ''
	},
	list: [],
	selected: {},
	selectedRows: []
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
		}
	},
	extraReducers: builder => {
		builder
			.addCase(fetchAllUser.pending, startLoadingQuery)
			.addCase(fetchAllUser.fulfilled, (state, action) => {
				state.list = action.payload
				state.loading.query = false
			})
			.addCase(fetchAllUser.rejected, stopLoadingQuery)

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
	}
});


export const { setSelectedRows, setAppliedSearchText } = UserSlice.actions;

export default UserSlice.reducer;