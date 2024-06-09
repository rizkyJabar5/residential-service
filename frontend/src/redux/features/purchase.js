import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api';
import request from 'redux/utils/request'

export const getPurchase = async (params) =>
	apiRequest({
		path: `/purchase`,
		method: "GET",
		params
	});

export const getPurchases = async (params) =>
	apiRequest({
		path: `/purchase`,
		method: "GET",
		params
	});

export const addPurchase = async (data) =>
	apiRequest({
		path: `/purchase/add-purchase`,
		method: "POST",
		data
	});

export const fetchAllPurchase = createAsyncThunk(
	'Expense/fetchAllExpense',
	async (params, { rejectWithValue }) => {
		return await getPurchase(params)
			.then((res) => {
				return res.data.data.content
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const fetchOnePurchase = createAsyncThunk(
	'Purchase/fetchOnePurchase',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('get', `${URLS.PURCHASE}/${id}`)
			return response.data
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const updatePurchase = createAsyncThunk(
	'Purchase/updatePurchase',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('patch', `${URLS.PURCHASE}/${credentials.id}`, credentials)
			return response.data
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

export const deletePurchase = createAsyncThunk(
	'Purchase/deletePurchase',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${URLS.PURCHASE}/${id}`)
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
	message: "",
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

export const PurchaseSlice = createSlice({
	name: 'Purchase',
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
			.addCase(fetchAllPurchase.pending, startLoadingQuery)
			.addCase(fetchAllPurchase.fulfilled, (state, action) => {
				state.list = action.payload
				state.loading.query = false
			})
			.addCase(fetchAllPurchase.rejected, stopLoadingQuery)

		builder
			.addCase(fetchOnePurchase.pending, startLoadingQuery)
			.addCase(fetchOnePurchase.rejected, stopLoadingQuery)
			.addCase(fetchOnePurchase.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})
		builder
			.addCase(updatePurchase.pending, startLoadingQuery)
			.addCase(updatePurchase.rejected, stopLoadingQuery)
			.addCase(updatePurchase.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})

		builder
			.addCase(deletePurchase.pending, startLoadingMutation)
			.addCase(deletePurchase.fulfilled, stopLoadingMutation)
			.addCase(deletePurchase.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = PurchaseSlice.actions;

export default PurchaseSlice.reducer;