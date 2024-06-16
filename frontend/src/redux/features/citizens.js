import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { message } from 'antd';
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api';

const url_citizens = URLS.CITIZENS

export const getCitizens = async (params) =>
	apiRequest({
		path: `${ url_citizens }`,
		method: "GET",
		params,
	});

export const addCitizensFamilies = async (data) =>
	apiRequest({
		path: `${ url_citizens }/families`,
		method: "POST",
		data,
	});

export const getOneCitizens = async (id) =>
	apiRequest({
		path: `${ url_citizens }/${ id }`,
		method: "GET",
	});

export const updateOneCitizen = async (data) =>
	apiRequest({
		path: `${ url_citizens }`,
		method: "PUT",
		data,
	});

export const addOneCitizen = async (data) =>
	apiRequest({
		path: `${ url_citizens }`,
		method: "POST",
		data,
	});

export const fetchAllCitizens = createAsyncThunk(
	'Citizen/fetchAllCitizen',
	async (params, { rejectWithValue }) => {
        return await getCitizens(params)
            .then((res) => {
				message.success(res.data.message)
                return res.data.data;
            })
            .catch((err) => {
                return rejectWithValue(err)
            });
	},
)

export const fetchOneCitizen = createAsyncThunk(
	'Citizen/fetchOneCitizen',
	async (id, { rejectWithValue }) => {
		return await getOneCitizens(id)
			.then((res) => {
				return res.data.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	},
)

export const updateCitizen = createAsyncThunk(
	'Citizen/updateCitizen',
	async (data, { rejectWithValue }) => {
		return await updateOneCitizen(data)
			.then((res) => {
				return res.data.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	},
)

export const addCitizenFamilies = createAsyncThunk(
	'Citizen/addCitizenFamilies',
	async (id, { rejectWithValue }) => {
		return await addCitizensFamilies(id)
			.then((res) => {
				const data = res.data
				message.success(data.message)
				return data
			})
			.catch((err) => {
				console.error(`ASUUU ERROR: ${err.message}`)
				return rejectWithValue(err)
			})
	},
)

export const addCitizen = createAsyncThunk(
	'Citizen/addCitizen',
	async (data, { rejectWithValue }) => {
		return await addOneCitizen(data)
			.then((res) => {
				const data = res.data
				message.success(data.message)
				return data
			})
			.catch((err) => {
				console.log(`ERR${err.response.data}`)
				return rejectWithValue(err)
			})
	},
)

const initialState = {
	loading: {
		query: false,
		mutation: false,
	},
	filter: {
		q: '',
	},
	list: [],
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
const startLoadingData = loadingReducer('data', true)
const stopLoadingData = loadingReducer('data', true)

export const CitizenSlice = createSlice({
	name: 'Citizen',
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
			.addCase(fetchAllCitizens.pending, startLoadingQuery)
			.addCase(fetchAllCitizens.fulfilled, (state, action) => {
				state.list = action.payload.content
				state.message = action.payload.message
				state.loading.query = false
			})
			.addCase(fetchAllCitizens.rejected, stopLoadingQuery)

		builder
			.addCase(fetchOneCitizen.pending, startLoadingQuery)
			.addCase(fetchOneCitizen.rejected, stopLoadingQuery)
			.addCase(fetchOneCitizen.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = action.payload.message
			})
		builder
			.addCase(addCitizen.pending, startLoadingQuery)
			.addCase(addCitizen.rejected, (state, action) => {
				state.loading.query = false
        state.selected = action.payload
        state.message = action.payload.response.data.message
			})
			.addCase(addCitizen.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = action.payload
			})
		builder
			.addCase(updateCitizen.pending, startLoadingQuery)
			.addCase(updateCitizen.rejected, stopLoadingQuery)
			.addCase(updateCitizen.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = action.payload.message
			})

		builder
			.addCase(addCitizenFamilies.pending, startLoadingMutation)
			.addCase(addCitizenFamilies.fulfilled, stopLoadingMutation)
			.addCase(addCitizenFamilies.rejected, stopLoadingMutation)
	},
});


export const { setSelectedRows, setAppliedSearchText } = CitizenSlice.actions;

export default CitizenSlice.reducer;