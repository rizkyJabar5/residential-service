import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'
import { apiRequest } from 'redux/utils/api';
import { message } from 'antd';


export const getProduct = async (params) =>
	apiRequest({
		path: `/products`,
		method: "GET",
		params
	});

export const fetchAllProduct = createAsyncThunk(
	'Product/fetchAllProduct',
	async (params, { rejectWithValue }) => {
		return await getProduct(params)
			.then((res) => {
				return res.data.data.content
			})
			.catch((err) => {
				return rejectWithValue(err)
			})
	}
)

export const fetchOneProduct = createAsyncThunk(
	'Product/fetchOneProduct',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('get', `${URLS.PRODUCT}/${id}`)
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const searchProduct = createAsyncThunk(
	'Product/searchProduct',
	async (q, { rejectWithValue }) => {
		try {
			const response = await request('get', `${URLS.PRODUCT}/product?name=${q}`)
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const updateProduct = createAsyncThunk(
	'Product/updateProduct',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('put', `${URLS.PRODUCT}/${credentials.id}`, credentials)
			return response
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

export const createProduct = createAsyncThunk(
	'Product/createProduct',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await request('post', `${URLS.PRODUCT}/add-product`, credentials)
			return response
		} catch (error) {
			console.log(error)
			return rejectWithValue(error)
		}
	}
)

export const deleteProduct = createAsyncThunk(
	'Product/deleteProduct',
	async (id, { rejectWithValue }) => {
		try {
			const response = await request('delete', `${URLS.PRODUCT}/delete?id=${id}`)
			console.log(response)
			message.success(response.message)
			return response
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

export const ProductSlice = createSlice({
	name: 'Product',
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
			.addCase(fetchAllProduct.pending, startLoadingQuery)
			.addCase(fetchAllProduct.fulfilled, (state, action) => {
				state.list = action.payload
				state.loading.query = false
			})
			.addCase(fetchAllProduct.rejected, stopLoadingQuery)

		builder
			.addCase(fetchOneProduct.pending, startLoadingQuery)
			.addCase(fetchOneProduct.rejected, stopLoadingQuery)
			.addCase(fetchOneProduct.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})
		builder
			.addCase(searchProduct.pending, startLoadingQuery)
			.addCase(searchProduct.rejected, stopLoadingQuery)
			.addCase(searchProduct.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
			})
		builder
			.addCase(updateProduct.pending, startLoadingQuery)
			.addCase(updateProduct.rejected, stopLoadingQuery)
			.addCase(updateProduct.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})
		builder
			.addCase(createProduct.pending, startLoadingQuery)
			.addCase(createProduct.rejected, stopLoadingQuery)
			.addCase(createProduct.fulfilled, (state, action) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			})

		builder
			.addCase(deleteProduct.pending, startLoadingMutation)
			.addCase(deleteProduct.fulfilled, stopLoadingMutation)
			.addCase(deleteProduct.rejected, stopLoadingMutation)
	}
});


export const { setSelectedRows, setAppliedSearchText } = ProductSlice.actions;

export default ProductSlice.reducer;