import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api';

const summaries = URLS.SUMMARIES

export const getSummaries = async (params) =>
	apiRequest({
		path: summaries,
		method: "GET",
		params,
	});

export const fetchSummaries = createAsyncThunk(
	'Summary/fetchSummaries',
	async (params, { rejectWithValue }) => {
		return await getSummaries(params)
			.then((res) => {
				return res.data.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	},
)

const initialState = {
	isLoading: false,
	message: "",
	selected: {},
}

const loadingReducer = (status) => (state) => {
	state.isLoading = status
}

const startLoadingQuery = loadingReducer(true)
const stopLoadingQuery = loadingReducer(false)

export const SummariySlice = createSlice({
	name: 'Summary',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchSummaries.pending, startLoadingQuery)
			.addCase(fetchSummaries.fulfilled, (state, action) => {
				state.selected = action.payload
				state.isLoading = false
			})
			.addCase(fetchSummaries.rejected, stopLoadingQuery)
	},
});

export default SummariySlice.reducer;