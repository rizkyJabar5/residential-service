import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'
import requestOne from 'redux/utils/requestOne'
import { apiRequest } from 'redux/utils/api';

export const getLetters = async ( params ) =>
	apiRequest( {
		path: `${ URLS.LETTERS }`,
		method: "GET",
		params,
	} );

export const getLetterById = async ( id ) =>
	apiRequest( {
		path: `${ URLS.LETTERS }/${ id }`,
		method: "GET",
	} );

export const addLetter = async ( data ) =>
	apiRequest( {
		path: `${ URLS.LETTERS }`,
		method: "POST",
		data,
	} );

export const editLetter = async ( data ) =>
	apiRequest( {
		path: `${ URLS.LETTERS }`,
		method: "PUT",
		data,
	} );

export const getLetterStatus = async ( params ) =>
	apiRequest( {
		path: `${ URLS.LETTERS }/status`,
		method: "GET",
		params,
	} );

export const getLetterByNik = async ( nik ) =>
	apiRequest( {
		path: `${ URLS.LETTERS }/letter/${ nik }`,
		method: "GET",
	} );
export const getDownloadLetterById = async ( id ) =>
	apiRequest( {
		path: `${ URLS.LETTERS }/download/${ id }`,
		method: "GET",
	} );

export const fetchAllLetter = createAsyncThunk(
	'Letter/fetchAllLetter',
	async ( params, { rejectWithValue } ) => {
		return await getLetters( params )
			.then( ( res ) => {
				return res.data.data
			} )
			.catch( ( err ) => {
				return rejectWithValue( err )
			} )
	},
)

export const fetchOneLetter = createAsyncThunk(
	'Letter/fetchOneLetter',
	async ( id, { rejectWithValue } ) => {
		return await getLetterById( id )
			.then( ( res ) => {
				return res
			} )
			.catch( error => {
				return rejectWithValue( error )
			} )
	},
)

export const createLetter = createAsyncThunk(
	'Letter/createLetter',
	async ( data, { rejectWithValue } ) => {
		return await addLetter( data )
			.then( ( res ) => {
				return res
			} )
			.catch( error => {
				return rejectWithValue( error )
			} )
	},
)

export const updateLetter = createAsyncThunk(
	'Letter/updateLetter',
	async ( data, { rejectWithValue } ) => {
		return await editLetter( data )
			.then( ( res ) => {
				return res
			} )
			.catch( error => {
				return rejectWithValue( error )
			} )
	},
)

export const statusLetter = createAsyncThunk(
	'Letter/statusLetter',
	async ( params, { rejectWithValue } ) => {
		return await getLetterStatus( params )
			.then( ( res ) => {
				return res
			} )
			.catch( error => {
				return rejectWithValue( error )
			} )
	},
)


export const fetchLetterNik = createAsyncThunk(
	'Letter/letterNik',
	async ( nik, { rejectWithValue } ) => {
		return await getLetterByNik( nik )
			.then( ( res ) => {
				return res
			} )
			.catch( error => {
				return rejectWithValue( error )
			} )
	},
)

export const downloadLetter = createAsyncThunk(
	'Letter/downloadLetter',
	async ( id, { rejectWithValue } ) => {
		return await getDownloadLetterById( id )
			.then( ( res ) => {
				return res
			} )
			.catch( error => {
				return rejectWithValue( error )
			} )
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

const loadingReducer = ( fieldName, status ) => ( state ) => {
	state.loading[fieldName] = status
}

const startLoadingQuery = loadingReducer( 'query', true )
const stopLoadingQuery = loadingReducer( 'query', false )
const startLoadingMutation = loadingReducer( 'mutation', true )
const stopLoadingMutation = loadingReducer( 'mutation', false )

export const LetterSlice = createSlice( {
	name: 'Letter',
	initialState,
	reducers: {
		setAppliedSearchText: ( state, action ) => {
			state.filter.q = action.payload
		},
		setSelectedRows: ( state, action ) => {
			state.selectedRows = action.payload
		},
	},
	extraReducers: builder => {
		builder
			.addCase( fetchAllLetter.pending, startLoadingQuery )
			.addCase( fetchAllLetter.fulfilled, ( state, action ) => {
				state.list = action.payload.content
				state.loading.query = false
			} )
			.addCase( fetchAllLetter.rejected, stopLoadingQuery )

		builder
			.addCase( fetchOneLetter.pending, startLoadingQuery )
			.addCase( fetchOneLetter.rejected, stopLoadingQuery )
			.addCase( fetchOneLetter.fulfilled, ( state, action ) => {
				state.loading.query = false
				state.selected = action.payload
			} )
		builder
			.addCase( updateLetter.pending, startLoadingQuery )
			.addCase( updateLetter.rejected, stopLoadingQuery )
			.addCase( updateLetter.fulfilled, ( state, action ) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			} )
		builder
			.addCase( createLetter.pending, startLoadingQuery )
			.addCase( createLetter.rejected, stopLoadingQuery )
			.addCase( createLetter.fulfilled, ( state, action ) => {
				state.loading.query = false
				state.selected = action.payload
				state.message = "Success"
			} )
		builder
			.addCase( statusLetter.pending, startLoadingMutation )
			.addCase( statusLetter.fulfilled, stopLoadingMutation )
			.addCase( statusLetter.rejected, stopLoadingMutation )
		builder
			.addCase( fetchLetterNik.pending, startLoadingMutation )
			.addCase( fetchLetterNik.fulfilled, stopLoadingMutation )
			.addCase( fetchLetterNik.rejected, stopLoadingMutation )
		builder
			.addCase( downloadLetter.pending, startLoadingMutation )
			.addCase( downloadLetter.fulfilled, stopLoadingMutation )
			.addCase( downloadLetter.rejected, stopLoadingMutation )
	},
} );


export const { setSelectedRows, setAppliedSearchText } = LetterSlice.actions;

export default LetterSlice.reducer;