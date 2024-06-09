import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { message } from 'antd';
import URLS from 'redux/urls'
import { apiRequest } from 'redux/utils/api';
import request from 'redux/utils/request'

export const getCategories = async () =>
	apiRequest({
		path: `/categories`,
		method: "GET",
	});

export const deleteCategories = async (id) =>
	apiRequest({
		path: `/categories/delete`,
		method: "DELETE",
		params: {
			id: id
		}
	});

export const getOneCategories = async (id) =>
	apiRequest({
		path: `/categories/`,
		method: "GET",
		params: {
			categoryId: id
		}
	});

export const updateOneCategories = async (data) =>
	apiRequest({
		path: `/categories/update-category`,
		method: "PUT",
		data
	});

export const addOneCategories = async (data) =>
	apiRequest({
		path: `/categories/add-category`,
		method: "POST",
		data
	});

export const fetchAllCategory = createAsyncThunk(
	'Category/fetchAllCategory',
	async (_, { rejectWithValue }) => {
		return await getCategories()
			.then((res) => {
				return res.data.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const fetchOneCategory = createAsyncThunk(
	'Category/fetchOneCategory',
	async (id, { rejectWithValue }) => {
		return await getOneCategories(id)
			.then((res) => {
				return res.data.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const updateCategory = createAsyncThunk(
	'Category/updateCategory',
	async (data, { rejectWithValue }) => {
		return await updateOneCategories(data)
			.then((res) => {
				return res.data.data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const deleteCategory = createAsyncThunk(
	'Category/deleteCategory',
	async (id, { rejectWithValue }) => {
		return await deleteCategories(id)
			.then((res) => {
				const data =  res.data
				message.success(data.message)
				return data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const addCategory = createAsyncThunk(
	'Category/updateCategory',
	async (data, { rejectWithValue }) => {
		return await addOneCategories(data)
			.then((res) => {
				const data = res.data
				message.success(data.message)
				return data
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
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

export const CategorySlice = createSlice({
	name: 'Category',
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
			.addCase(fetchAllCategory.pending, startLoadingQuery)
			.addCase(fetchAllCategory.fulfilled, (state, action) => {
				state.list = action.payload
				state.loading.query = false
			})
			.addCase(fetchAllCategory.rejected, stopLoadingQuery)

		builder
			.addCase(fetchOneCategory.pending, startLoadingQuery)
			.addCase(fetchOneCategory.rejected, stopLoadingQuery)
			.addCase(fetchOneCategory.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})
		builder
			.addCase(updateCategory.pending, startLoadingQuery)
			.addCase(updateCategory.rejected, stopLoadingQuery)
			.addCase(updateCategory.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})

		builder
			.addCase(deleteCategory.pending, startLoadingMutation)
			.addCase(deleteCategory.fulfilled, stopLoadingMutation)
			.addCase(deleteCategory.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = CategorySlice.actions;

export default CategorySlice.reducer;