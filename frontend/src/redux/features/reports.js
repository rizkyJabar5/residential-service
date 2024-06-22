import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'
import { apiRequest } from 'redux/utils/api';
import {message} from "antd";

export const getReports = async (params) =>
	apiRequest({
		path: `${URLS.REPORTS}`,
		method: "GET",
		params
	});

export const addNewReport = async (data) =>
	apiRequest({
		path: `${URLS.REPORTS}`,
		method: "POST",
		data
	})


export const fetchAllReports = createAsyncThunk(
	'Report/fetchAllReports',
	async (params, { rejectWithValue }) => {
		return await getReports(params)
			.then((res) => {
				message.success(res.data.message)
				return res.data;
			})
			.catch((error) => {
				return rejectWithValue(error)
			});
	}
)

export const createReport = createAsyncThunk(
	'Report/createReport',
	async (data, { rejectWithValue }) => {
		return await addNewReport(data)
			.then((res) => {
				return res.data
			})
			.catch(err => {
				return rejectWithValue(err.response.data)
			})
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
	error: {},
	hasData: false,
	listReports: [],
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
			.addCase(fetchAllReports.pending, startLoadingQuery)
			.addCase(fetchAllReports.fulfilled, (state, action) => {
				state.listReports = action.payload.data.content
				state.hasData = true
				state.error = null
				state.isLoading = false
			})
			.addCase(fetchAllReports.rejected, (state, action) => {
				state.hasData = false
				state.error = action.payload
				state.isLoading = false
			})

		builder
			.addCase(createReport.pending, startLoadingQuery)
			.addCase(createReport.rejected, (state, action) => {
				if(action.payload.code === '500') {
					message.error('Terjadi kesalahan pada server')
				}
				state.error = action.payload;
				state.message = action.payload.message
				state.isLoading = false
			})
			.addCase(createReport.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
				state.message = action.payload.message
			})
	}
});


export const { setSelectedRows, setAppliedSearchText } = ReportSlice.actions;

export default ReportSlice.reducer;