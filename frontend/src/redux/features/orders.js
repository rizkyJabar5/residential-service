import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'
import requestOne from 'redux/utils/requestOne'
import { apiRequest } from 'redux/utils/api';


export const getOrders = async (params) =>
	apiRequest({
		path: `/orders`,
		method: "GET",
		params
	});

export const fetchAllOrder = createAsyncThunk(
	'Order/fetchAllOrder',
	async (params, { rejectWithValue }) => {
		return await getOrders(params)
			.then((res) => {
				return res.data.data.content
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const fetchOneOrder = createAsyncThunk(
	'Order/fetchOneOrder',
	async (id, { rejectWithValue }) => {
		try {
			const response = await requestOne('get', `${URLS.ORDER}/${id}`)
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const createOrder = createAsyncThunk(
	'Order/createOrder',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('post', URLS.ORDER+"/add-order", credentials)
			return response.data
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

export const updateOrder = createAsyncThunk(
	'Order/updateOrder',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('patch', `${URLS.Order}/${credentials.id}`, credentials)
			return response.data
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

export const deleteOrder = createAsyncThunk(
	'Order/deleteOrder',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${URLS.Order}/${id}`)
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
	message:"",
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

export const OrderSlice = createSlice({
	name: 'Order',
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
			.addCase(fetchAllOrder.pending, startLoadingQuery)
			.addCase(fetchAllOrder.fulfilled, (state, action) => {
				state.list = action.payload
				state.loading.query = false
			})
			.addCase(fetchAllOrder.rejected, stopLoadingQuery)

		builder
			.addCase(fetchOneOrder.pending, startLoadingQuery)
			.addCase(fetchOneOrder.rejected, stopLoadingQuery)
			.addCase(fetchOneOrder.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})
		builder
			.addCase(updateOrder.pending, startLoadingQuery)
			.addCase(updateOrder.rejected, stopLoadingQuery)
			.addCase(updateOrder.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})
		builder
			.addCase(createOrder.pending, startLoadingQuery)
			.addCase(createOrder.rejected, stopLoadingQuery)
			.addCase(createOrder.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})
		builder
			.addCase(deleteOrder.pending, startLoadingMutation)
			.addCase(deleteOrder.fulfilled, stopLoadingMutation)
			.addCase(deleteOrder.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = OrderSlice.actions;

export default OrderSlice.reducer;