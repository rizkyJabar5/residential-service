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

export const fetchAllReports = createAsyncThunk(
	'Report/fetchAllReports',
	async (params, { rejectWithValue }) => {
		return await getReports(params)
			.then((res) => {
				console.log("ini data : ", res.data.data.content)
				message.success(res.data.message)
				return res.data;
			})
			.catch((error) => {
				return rejectWithValue(error)
			});
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


		// builder
		// 	.addCase(updateReport.pending, startLoadingQuery)
		// 	.addCase(updateReport.rejected, stopLoadingQuery)
		// 	.addCase(updateReport.fulfilled, (state, action) => {
		// 		state.loading.query = false
		// 		state.selected = action.payload
		// 		state.message = "Success"
		// 	})
		//
		// builder
		// 	.addCase(deleteReport.pending, startLoadingMutation)
		// 	.addCase(deleteReport.fulfilled, stopLoadingMutation)
		// 	.addCase(deleteReport.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = ReportSlice.actions;

export default ReportSlice.reducer;