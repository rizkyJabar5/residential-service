import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'
import { apiRequest } from 'redux/utils/api';

export const getStoreSum = async () =>
	apiRequest({
		path: `/summaries/store`,
		method: "GET",
	});

export const getLedgerSum = async () =>
	apiRequest({
		path: `/summaries/ledger`,
		method: "GET",
	});

export const getExpenseSupplier = async () =>
	apiRequest({
		path: `/expenses/suppliers`,
		method: "GET",
	});

export const getSales = async () =>
	apiRequest({
		path: `${URLS.SALES}?page=1&limit=50`,
		method: "GET",
	});

export const fetchSumStore = createAsyncThunk(
	'Report/fetchSumStore',
	async (_, { rejectWithValue }) => {
		return await getStoreSum()
			.then((res) => {
				return res.data.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const fetchSumLedger = createAsyncThunk(
	'Report/fetchSumLedger',
	async (_, { rejectWithValue }) => {
		return await getLedgerSum()
			.then((res) => {
				return res.data.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)


export const fetchExpenseSuppliers = createAsyncThunk(
	'Report/fetchExpenseSuppliers',
	async (_, { rejectWithValue }) => {
		try {
			return await getExpenseSupplier()
			.then((res) => {
				return res.data.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
			
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const fetchSales = createAsyncThunk(
	'Report/fetchOneReport',
	async (id, { rejectWithValue }) => {
		try {
			return await getSales()
			.then((res) => {
				return res.data.data.content
			})
			.catch((err) => {
				return rejectWithValue(err)
			})

		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const updateReport = createAsyncThunk(
	'Report/updateReport',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('patch', `${URLS.Report}/${credentials.id}`, credentials)
			return response.data
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

export const deleteReport = createAsyncThunk(
	'Report/deleteReport',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${URLS.Report}/${id}`)
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
	selectedRows: [],
	store: [],
	ledger: [],
	expenseSuppliers: [],
    sales: []
}

const loadingReducer = (fieldName, status) => (state) => {
	state.loading[fieldName] = status
}

const startLoadingQuery = loadingReducer('query', true)
const stopLoadingQuery = loadingReducer('query', false)
const startLoadingMutation = loadingReducer('mutation', true)
const stopLoadingMutation = loadingReducer('mutation', false)

export const ReportSlice = createSlice({
	name: 'Report',
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
			.addCase(fetchExpenseSuppliers.pending, startLoadingQuery)
			.addCase(fetchExpenseSuppliers.fulfilled, (state, action) => {
				state.expenseSuppliers = action.payload
				state.loading.query = false
			})
			.addCase(fetchExpenseSuppliers.rejected, stopLoadingQuery)

		builder
			.addCase(fetchSumStore.pending, startLoadingQuery)
			.addCase(fetchSumStore.fulfilled, (state, action) => {
				state.store = action.payload
				state.loading.query = false
			})
			.addCase(fetchSumStore.rejected, stopLoadingQuery)

		builder
			.addCase(fetchSumLedger.pending, startLoadingQuery)
			.addCase(fetchSumLedger.fulfilled, (state, action) => {
				state.ledger = action.payload
				state.loading.query = false
			})
			.addCase(fetchSumLedger.rejected, stopLoadingQuery)

		builder
			.addCase(fetchSales.pending, startLoadingQuery)
			.addCase(fetchSales.rejected, stopLoadingQuery)
			.addCase(fetchSales.fulfilled, (state, action) => {
				state.loading.query = false
				state.sales = action.payload
			})
		builder
			.addCase(updateReport.pending, startLoadingQuery)
			.addCase(updateReport.rejected, stopLoadingQuery)
			.addCase(updateReport.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})

		builder
			.addCase(deleteReport.pending, startLoadingMutation)
			.addCase(deleteReport.fulfilled, stopLoadingMutation)
			.addCase(deleteReport.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = ReportSlice.actions;

export default ReportSlice.reducer;