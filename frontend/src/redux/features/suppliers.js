import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllSupplier = createAsyncThunk(
	'Supplier/fetchAllSupplier',
	async (_, { rejectWithValue }) => {
		try {
			const response = await request('get', URLS.SUPPLIER)
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const fetchOneSupplier = createAsyncThunk(
	'Supplier/fetchOneSupplier',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('get', `${URLS.Supplier}/${id}`)
			return response.data
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const updateSupplier = createAsyncThunk(
	'Supplier/updateSupplier',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('patch', `${URLS.Supplier}/${credentials.id}`, credentials)
			return response.data
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)


export const createSupplier = createAsyncThunk(
	'Supplier/createSupplier',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('post', `${URLS.SUPPLIER}/add-supplier`, credentials)
			return response
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

export const deleteSupplier = createAsyncThunk(
	'Supplier/deleteSupplier',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${URLS.SUPPLIER}/${id}`)
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

export const SupplierSlice = createSlice({
	name: 'Supplier',
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
			.addCase(fetchAllSupplier.pending, startLoadingQuery)
			.addCase(fetchAllSupplier.fulfilled, (state, action) => {
				state.list = action.payload
				state.loading.query = false
			})
			.addCase(fetchAllSupplier.rejected, stopLoadingQuery)

		builder
			.addCase(fetchOneSupplier.pending, startLoadingQuery)
			.addCase(fetchOneSupplier.rejected, stopLoadingQuery)
			.addCase(fetchOneSupplier.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})
		builder
			.addCase(updateSupplier.pending, startLoadingQuery)
			.addCase(updateSupplier.rejected, stopLoadingQuery)
			.addCase(updateSupplier.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})
		builder
			.addCase(createSupplier.pending, startLoadingQuery)
			.addCase(createSupplier.rejected, stopLoadingQuery)
			.addCase(createSupplier.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})

		builder
			.addCase(deleteSupplier.pending, startLoadingMutation)
			.addCase(deleteSupplier.fulfilled, stopLoadingMutation)
			.addCase(deleteSupplier.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = SupplierSlice.actions;

export default SupplierSlice.reducer;