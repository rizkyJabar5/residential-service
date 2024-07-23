import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api';
import { message } from "antd";

const houses = URLS.HOUSES

const getHouses = async (params) =>
	apiRequest({
		path: houses,
		method: "GET",
		params,
	});

const getOneHouses = async (id) =>
	apiRequest({
		path: `${houses}/${id}`,
		method: "GET",
	});

const persistHouses = async (data) =>
	apiRequest({
		path: houses,
		method: "POST",
		data,
	});

export const fetchHouses = createAsyncThunk(
	'House/fetchHouses',
	async (params, { rejectWithValue }) => {
		return await getHouses(params)
			.then((res) => {
				return res.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	},
)

export const fetchOneHouses = createAsyncThunk(
	'House/fetchOneHouses',
	async (id, { rejectWithValue }) => {
		return await getOneHouses(id)
			.then((res) => {
				return res.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	},
)

export const addHouses = createAsyncThunk(
	'House/addHouses',
	async (body, { rejectWithValue }) => {
		return await persistHouses(body)
			.then((res) => {
				return res.data
			})
			.catch((err) => {
				return rejectWithValue(err)
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
	lettersData: [],
	message: "",
	selected: {},
	selectedRows: [],
}

const loadingReducer = (status) => (state) => {
	state.isLoading = status
}

const startLoading = loadingReducer(true)

export const HouseSlice = createSlice({
	name: 'HouseCollection',
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
			.addCase(fetchHouses.pending, startLoading)
			.addCase(fetchHouses.fulfilled, (state, action) => {
				state.lettersData = action.payload.data.content
				state.hasData = true
				state.error = null
				state.message = action.payload.message
				state.isLoading = false
				message.success(state.message)
			})
			.addCase(fetchHouses.rejected, (state, action) => {
				state.hasData = false
				state.error = action.payload
				state.message = action.payload.message
				state.isLoading = false
			})
		builder
			.addCase(fetchOneHouses.pending, startLoading)
			.addCase(fetchOneHouses.fulfilled, (state, action) => {
				state.lettersData = action.payload.data.content
				state.hasData = true
				state.error = null
				state.message = action.payload.message
				state.isLoading = false
				message.success(state.message)
			})
			.addCase(fetchOneHouses.rejected, (state, action) => {
				state.hasData = false
				state.error = action.payload
				state.message = action.payload.message
				state.isLoading = false
			})
		builder
			.addCase(addHouses.pending, startLoading)
			.addCase(addHouses.rejected, (state, action) => {
				if(action.payload.code === '500') {
					message.error('Terjadi kesalahan pada server')
				}
				state.error = action.payload;
				state.message = action.payload.message
				state.isLoading = false

			})
			.addCase(addHouses.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
				state.message = action.payload.message
			})
	},
});

export default HouseSlice.reducer;