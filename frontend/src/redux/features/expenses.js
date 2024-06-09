import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'
import { apiRequest } from 'redux/utils/api';

export const getExpenses = async (params) =>
	apiRequest({
		path: `/expenses`,
		method: "GET",
		params
	});

export const addExpense = async (data) =>
	apiRequest({
		path: `/expenses/add-expense`,
		method: "POST",
		data
	});

export const fetchAllExpense = createAsyncThunk(
	'Expense/fetchAllExpense',
	async (params, { rejectWithValue }) => {
		return await getExpenses(params)
			.then((res) => {
				return res.data.data.content
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const fetchOneExpense = createAsyncThunk(
	'Expense/fetchOneExpense',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('get', `${URLS.EXPENSE}/${id}`)
			return response.data
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)


export const createExpense = createAsyncThunk(
	'Expense/createExpense',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('post', `${URLS.EXPENSE}`, credentials)
			return response.data
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

export const updateExpense = createAsyncThunk(
	'Expense/updateExpense',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('patch', `${URLS.EXPENSE}/${credentials.id}`, credentials)
			return response.data
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

export const deleteExpense = createAsyncThunk(
	'Expense/deleteExpense',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${URLS.EXPENSE}/${id}`)
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

export const ExpenseSlice = createSlice({
	name: 'Expense',
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
			.addCase(fetchAllExpense.pending, startLoadingQuery)
			.addCase(fetchAllExpense.fulfilled, (state, action) => {
				state.list = action.payload
				state.loading.query = false
			})
			.addCase(fetchAllExpense.rejected, stopLoadingQuery)

		builder
			.addCase(fetchOneExpense.pending, startLoadingQuery)
			.addCase(fetchOneExpense.rejected, stopLoadingQuery)
			.addCase(fetchOneExpense.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})
		builder
			.addCase(updateExpense.pending, startLoadingQuery)
			.addCase(updateExpense.rejected, stopLoadingQuery)
			.addCase(updateExpense.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})
		builder
			.addCase(createExpense.pending, startLoadingQuery)
			.addCase(createExpense.rejected, stopLoadingQuery)
			.addCase(createExpense.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})
		builder
			.addCase(deleteExpense.pending, startLoadingMutation)
			.addCase(deleteExpense.fulfilled, stopLoadingMutation)
			.addCase(deleteExpense.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = ExpenseSlice.actions;

export default ExpenseSlice.reducer;