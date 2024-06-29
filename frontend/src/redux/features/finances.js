import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api';
import {message} from "antd";

export const getFinances = async (params) =>
	apiRequest({
		path: `${URLS.FINANCES}`,
		method: "GET",
		params
	});

export const addNewFinance = async (data) =>
	apiRequest({
		path: `${URLS.FINANCES}`,
		method: "POST",
		data
	})


export const fetchAllFinances = createAsyncThunk(
	'Finances/fetchAllFinances',
	async (params, { rejectWithValue }) => {
		return await getFinances(params)
			.then((res) => {
				message.success(res.data.message)
				return res.data;
			})
			.catch((error) => {
				return rejectWithValue(error)
			});
	}
)

export const createFinance = createAsyncThunk(
	'Finances/addNewFinance',
	async (data, { rejectWithValue }) => {
		return await addNewFinance(data)
			.then((res) => {
				return res.data
			})
			.catch(err => {
				return rejectWithValue(err.response.data)
			})
	}
)

const initialState = {
	loading: {
		query: false,
		mutation: false
	},
	error: {},
	hasData: false,
	listFinances: [],
	filter: {
		q: ''
	},
	message: "",
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

export const FinanceSlice = createSlice({
	name: 'Finances',
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
			.addCase(fetchAllFinances.pending, startLoadingQuery)
			.addCase(fetchAllFinances.fulfilled, (state, action) => {
				state.listFinances = action.payload.data.content
				state.hasData = true
				state.error = null
				state.isLoading = false
			})
			.addCase(fetchAllFinances.rejected, (state, action) => {
				state.hasData = false
				state.error = action.payload
				state.isLoading = false
			})

		builder
			.addCase(createFinance.pending, startLoadingQuery)
			.addCase(createFinance.rejected, (state, action) => {
				if(action.payload.code === '500') {
					message.error('Terjadi kesalahan pada server')
				}
				state.error = action.payload;
				state.message = action.payload.message
				state.isLoading = false
			})
			.addCase(createFinance.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
				state.message = action.payload.message
			})
	}
});


export const { setSelectedRows, setAppliedSearchText } = FinanceSlice.actions;

export default FinanceSlice.reducer;