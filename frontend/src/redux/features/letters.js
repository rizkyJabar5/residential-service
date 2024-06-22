import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api';
import { message } from "antd";

const getLetters = async (params) =>
	apiRequest({
		path: `${ URLS.LETTERS }`,
		method: "GET",
		params,
	});

const getLetterById = async (id) =>
	apiRequest({
		path: `${ URLS.LETTERS }/${ id }`,
		method: "GET",
	});

const addLetter = async (data) =>
	apiRequest({
		path: `${ URLS.LETTERS }`,
		method: "POST",
		data,
	});

const editLetter = async (data) =>
	apiRequest({
		path: `${ URLS.LETTERS }`,
		method: "PUT",
		data,
	});

const getLetterStatus = async (params) =>
	apiRequest({
		path: `${ URLS.LETTERS }/status`,
		method: "GET",
		params,
	});

const getLetterByNik = async (nik) =>
	apiRequest({
		path: `${ URLS.LETTERS }/letter/${ nik }`,
		method: "GET",
	});

const getDownloadLetterById = async (id) =>
	apiRequest({
		path: `${ URLS.LETTERS }/download/${ id }`,
		method: "GET",
	});

export const fetchAllLetter = createAsyncThunk(
	'Letter/fetchAllLetter',
	async (params, { rejectWithValue }) => {
		return await getLetters(params)
			.then((res) => {
				return res.data
			})
			.catch((err) => {
				return rejectWithValue(err.response.data)
			})
	},
)

export const fetchOneLetter = createAsyncThunk(
	'Letter/fetchOneLetter',
	async (id, { rejectWithValue }) => {
		return await getLetterById(id)
			.then((res) => {
				return res
			})
			.catch(err => {
				return rejectWithValue(err.response.data)
			})
	},
)

export const createLetter = createAsyncThunk(
	'Letter/createLetter',
	async (data, { rejectWithValue }) => {
		return await addLetter(data)
			.then((res) => {
				return res.data
			})
			.catch(err => {
				return rejectWithValue(err.response.data)
			})
	},
)

export const updateLetter = createAsyncThunk(
	'Letter/updateLetter',
	async (data, { rejectWithValue }) => {
		return await editLetter(data)
			.then((res) => {
				return res.data
			})
			.catch(err => {
				return rejectWithValue(err.response.data)
			})
	},
)

export const statusLetter = createAsyncThunk(
	'Letter/statusLetter',
	async (params, { rejectWithValue }) => {
		return await getLetterStatus(params)
			.then((res) => {
				return res.data
			})
			.catch(err => {
				return rejectWithValue(err.response.data)
			})
	},
)


export const fetchLetterNik = createAsyncThunk(
	'Letter/letterNik',
	async (nik, { rejectWithValue }) => {
		return await getLetterByNik(nik)
			.then((res) => {
				return res.data
			})
			.catch(err => {
				return rejectWithValue(err.response.data)
			})
	},
)

export const downloadLetter = createAsyncThunk(
	'Letter/downloadLetter',
	async (id, { rejectWithValue }) => {
		return await getDownloadLetterById(id)
			.then((res) => {
				return res
			})
			.catch(error => {
				return rejectWithValue(error)
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

export const LetterSlice = createSlice({
	name: 'Letter',
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
			.addCase(fetchAllLetter.pending, startLoading)
			.addCase(fetchAllLetter.fulfilled, (state, action) => {
				state.lettersData = action.payload.data.content
				state.hasData = true
				state.error = null
				state.message = action.payload.message
				state.isLoading = false
				message.success(state.message)
			})
			.addCase(fetchAllLetter.rejected, (state, action) => {
				state.hasData = false
				state.error = action.payload
				state.message = action.payload.message
				state.isLoading = false
			})

		builder
			.addCase(fetchOneLetter.pending, startLoading)
			.addCase(fetchOneLetter.rejected, (state, action) => {
				state.error = action.payload
				state.message = action.payload.message
				state.isLoading = false
			})
			.addCase(fetchOneLetter.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
				state.error = null
				state.message = action.payload.message
			})
		builder
			.addCase(updateLetter.pending, startLoading)
			.addCase(updateLetter.rejected, (state, action) => {
				state.error = action.payload
				state.message = action.payload.message
				state.isLoading = false
			})
			.addCase(updateLetter.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
				state.message = "Anda telah menyetujui pengajuan!"
				state.error = null
				console.log(state.message)
			})
		builder
			.addCase(createLetter.pending, startLoading)
			.addCase(createLetter.rejected, (state, action) => {
				if(action.payload.code === '500') {
					message.error('Terjadi kesalahan pada server')
				}
				state.error = action.payload;
				state.message = action.payload.message
				state.isLoading = false
			})
			.addCase(createLetter.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
				state.message = action.payload.message
			})
		builder
			.addCase(statusLetter.pending, startLoading)
			.addCase(statusLetter.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
				state.message = action.payload.message
				state.error = null
			})
			.addCase(statusLetter.rejected, (state, action) => {
				state.error = action.payload
				state.message = action.payload.message
				state.isLoading = false
			})
		builder
			.addCase(fetchLetterNik.pending, startLoading)
			.addCase(fetchLetterNik.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
				state.message = action.payload.message
				state.error = null
			})
			.addCase(fetchLetterNik.rejected, (state, action) => {
				state.error = action.payload
				state.message = action.payload.message
				state.isLoading = false
			})
		builder
			.addCase(downloadLetter.pending, startLoading)
			.addCase(downloadLetter.fulfilled, (state, action) => {
				state.isLoading = false
				state.selected = action.payload
				state.message = action.payload.message
				state.error = null
			})
			.addCase(downloadLetter.rejected, (state, action) => {
				state.error = action.payload
				state.message = action.payload.message
				state.isLoading = false
			})
	},
});


export const { setSelectedRows, setAppliedSearchText } = LetterSlice.actions;

export default LetterSlice.reducer;