import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api';
import { message } from "antd";

const getNews = async (params) =>
	apiRequest({
		path: `${ URLS.NEWS }`,
		method: "GET",
		params,
	});

const getNewsById = async (id) =>
	apiRequest({
		path: `${ URLS.NEWS }/${ id }`,
		method: "GET",
	});

const addNews = async (data) =>
	apiRequest({
		path: `${ URLS.NEWS }`,
		method: "POST",
		data,
	});

export const fetchAllNews = createAsyncThunk(
	'News/fetchAllNews',
	async (params, { rejectWithValue }) => {
		return await getNews(params)
			.then((res) => {
				return res.data
			})
			.catch((err) => {
				return rejectWithValue(err.response.data)
			})
	},
)

export const fetchOneNews = createAsyncThunk(
	'News/fetchOneNews',
	async (id, { rejectWithValue }) => {
		return await getNewsById(id)
			.then((res) => {
				return res.data
			})
			.catch(err => {
				return rejectWithValue(err.response.data)
			})
	},
)

export const createNews = createAsyncThunk(
	'News/createNews',
	async (data, { rejectWithValue }) => {
		return await addNews(data)
			.then((res) => {
				return res
			})
			.catch(err => {
				return rejectWithValue(err.response.data)
			})
	},
)

const initialState = {
	isLoading: false,
	hasData: false,
	error: {},
	filter: {
		q: '',
	},
	newsData: [],
	message: "",
	selected: {},
	selectedRows: [],
}

const loadingReducer = (status) => (state) => {
	state.isLoading = status
}

const startLoading = loadingReducer(true)

export const NewsSlice = createSlice({
	name: 'News',
	initialState,
	reducers: {
		setAppliedSearchText: (state, action) => {
			state.filter.q = action.payload
		},
		setSelectedRows: (state, action) => {
			state.selectedRows = action.payload
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchAllNews.pending, startLoading)
			.addCase(fetchAllNews.fulfilled, (state, action) => {
				state.newsData = action.payload.data.content
				state.hasData = true
				state.error = null
				state.message = action.payload.message
				state.isLoading = false
				message.success(state.message)
			})
			.addCase(fetchAllNews.rejected, (state, action) => {
				state.hasData = false
				state.error = action.payload
				state.message = action.payload.message
				state.isLoading = false
			})

		builder
			.addCase(createNews.pending, startLoading)
			.addCase(createNews.rejected, (state, action) => {
				if(action.payload.code === '500') {
					message.error('Terjadi kesalahan pada server')
				}
				state.error = action.payload;
				state.message = action.payload.message
				state.isLoading = false
			})
			.addCase(createNews.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload.data
				state.message = action.payload.message
				console.log(state.message)
			})

		builder
			.addCase(fetchOneNews.pending, startLoading)
			.addCase(fetchOneNews.rejected, (state, action) => {
				if(action.payload.code === '500') {
					message.error('Terjadi kesalahan pada server')
				}
				state.error = action.payload;
				state.message = action.payload.message
				state.isLoading = false
			})
			.addCase(fetchOneNews.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload.data
				state.message = action.payload.message
			})
	},
});


export const { setSelectedRows, setAppliedSearchText } = NewsSlice.actions;

export default NewsSlice.reducer;