import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'
import { apiRequest } from 'redux/utils/api';
import { message } from 'antd';

export const deleteCustomer = createAsyncThunk( 
	'Customer/delete',
	async (params, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${URLS.CUSTOMER}/delete?customerId=${params}`)
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	}
	);


	export const getCustomer = async (params) =>
	apiRequest({
		path: `/customers`,
		method: "GET",
		params
	});

export const fetchAllCustomer = createAsyncThunk(
	'Customer/fetchAllCustomer',
	async (params, { rejectWithValue }) => {
		return await getCustomer(params)
			.then((res) => {
				return res.data.data.content
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const fetchOneCustomer = createAsyncThunk(
	'Customer/fetchOneCustomer',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('get', `${URLS.CUSTOMER}/${id}`)
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

// export const updateCustomer = createAsyncThunk(
// 	'Customer/updateCustomer',
// 	async (credentials, { rejectWithValue }) => {
// 		try {
// 			const response = await request('put', `${URLS.CUSTOMER}/${credentials.id}`, credentials)
// 			return response.data
// 		} catch (error) {
// 			console.log(error)
// 			return rejectWithValue(error)
// 		}
// 	}
// )

export const createCustomer = createAsyncThunk(
	'Customer/createCustomer',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('post', `${URLS.CUSTOMER}/add-customer`, credentials)
			// message(response.message)
			return response
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

// export const deleteCustomer = createAsyncThunk(
// 	'Customer/deleteCustomer',
// 	async (id, { rejectWithValue }) => {
// 		console.log({
// 			customerId:id
// 		})
// 		return await deleteCustomerAPI(id)
// 			.then((res) => {
// 				return res.data.data
// 			})
// 			.catch((err) => {
// 				return rejectWithValue(err.response.data.message)
// 			})
// 	}
// )

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

export const CustomerSlice = createSlice({
	name: 'Customer',
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
			.addCase(fetchAllCustomer.pending, startLoadingQuery)
			.addCase(fetchAllCustomer.fulfilled, (state, action) => {
				state.list = action.payload
				state.loading.query = false
			})
			.addCase(fetchAllCustomer.rejected, stopLoadingQuery)

		builder
			.addCase(fetchOneCustomer.pending, startLoadingQuery)
			.addCase(fetchOneCustomer.rejected, stopLoadingQuery)
			.addCase(fetchOneCustomer.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})
		// builder
		// 	.addCase(updateCustomer.pending, startLoadingQuery)
		// 	.addCase(updateCustomer.rejected, stopLoadingQuery)
		// 	.addCase(updateCustomer.fulfilled, (state, action) => {
		// 		state.loading.query = false
		// 		state.selected = action.payload
		// 		state.message = "Success"
		// 	})

			builder
			.addCase(createCustomer.pending, startLoadingQuery)
			.addCase(createCustomer.rejected, stopLoadingQuery)
			.addCase(createCustomer.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})

		builder
			.addCase(deleteCustomer.pending, startLoadingMutation)
			.addCase(deleteCustomer.fulfilled, stopLoadingMutation)
			.addCase(deleteCustomer.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = CustomerSlice.actions;

export default CustomerSlice.reducer;