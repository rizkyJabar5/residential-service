import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllHistory = createAsyncThunk(
	'history/fetchAllHistory',
	async (_, { rejectWithValue }) => {
		try {
			const response = await request('get', URLS.HISTORY)
			return response.data
		} catch(error) {
			return rejectWithValue(error)
		}
	}
)

export const fetchOneHistory = createAsyncThunk(
	'history/fetchOneHistory',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('get', `${URLS.HISTORY}/${id}`)
			return response.data
		} catch(error) {
			return rejectWithValue(error)
		}
	}
)

export const deleteHistory = createAsyncThunk(
	'history/deleteHistory',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${URLS.HISTORY}/${id}`)
			return response.data
		} catch(error) {
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

export const historySlice = createSlice({
	name: 'history',
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
			.addCase(fetchAllHistory.pending, startLoadingQuery)
			.addCase(fetchAllHistory.fulfilled, (state, action) => {
				state.list = action.payload 
				state.loading.query = false
			})
			.addCase(fetchAllHistory.rejected, stopLoadingQuery)

		builder
			.addCase(fetchOneHistory.pending, startLoadingQuery)
			.addCase(fetchOneHistory.rejected, stopLoadingQuery)
			.addCase(fetchOneHistory.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})

		builder
			.addCase(deleteHistory.pending, startLoadingMutation)
			.addCase(deleteHistory.fulfilled, stopLoadingMutation)
			.addCase(deleteHistory.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = historySlice.actions;

export default historySlice.reducer;