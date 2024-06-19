import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'
import { apiRequest } from "../utils/api";

const AUTH_TOKEN = 'auth_token'

const sendLogin = async (creds) =>
	apiRequest({
		path: URLS.LOGIN,
		method: 'post',
		data: creds,
	})

const validateCitizen = async (data) =>
	apiRequest({
		path: URLS.VALIDATE_CITIZEN,
		method: 'post',
		data,
	})

const logout = async () =>
	apiRequest({
		path: URLS.LOGOUT,
		method: 'post',
	})

export const login = createAsyncThunk(
	'auth/signIn',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await sendLogin(credentials)
			return response.data
		} catch (err) {
			console.log(err.response.data)
			return rejectWithValue(err.response.data)
		}
	},
)

export const getUserProfile = createAsyncThunk(
	'auth/getUserProfile',
	async (data) => {
		const response = await request('get', `/users/${ data }`)
		return response
	},
)

export const sendValidateCitizen = createAsyncThunk(
	'auth/register',
	async (data, { rejectWithValue }) => {
		try {
			const response = await validateCitizen(data)
			return response.data
		} catch (err) {
			console.log(err.response.data)
			return rejectWithValue(err.response.data)
		}
	},
)

export const sendActivation = createAsyncThunk(
	'auth/sendActivation',
	async (data) => {
		const response = await request('get', `${ URLS.ACTIVATION }/${ data.id }/${ data.email }`)
		return response
	},
)

export const sendLogout = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			const response = await logout()
			return response.data
		} catch (err) {
			console.log(err.response.data)
			return rejectWithValue(err.response.data)
		}
	},
)

export const resetPassword = createAsyncThunk(
	'auth/resetPassword',
	async (email, { rejectWithValue }) => {
		try {
			const response = await request('post', URLS.RESET_PASSWORD, { email })
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	},
)

export const resendActivation = createAsyncThunk(
	'auth/resendActivation',
	async (email, { rejectWithValue }) => {
		try {
			const response = await request('post', URLS.RESEND_ACTIVATION, { email })
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	},
)

const initialState = {
	loading: false,
	message: '',
	showMessage: false,
	redirect: '',
	token: localStorage.getItem(AUTH_TOKEN),
	user: {},
}

const loadingReducer = (status) => (state) => {
	state.loading = status
}

const startLoading = loadingReducer(true)
const stopLoading = loadingReducer(false)

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authenticated: (state, action) => {
			state.loading = false;
			state.redirect = '/';
			state.token = action.payload.data.accessToken;
			state.user = action.payload.data;
		},
		showAuthMessage: (state) => {
			state.showMessage = true;
			state.loading = false;
		},
		hideAuthMessage: (state) => {
			state.message = '';
			state.showMessage = false;
		},
		signOutSuccess: (state) => {
			state.token = null;
			state.redirect = '/';
			state.loading = false;
			state.user = {};
		},
		signUpSuccess: (state, action) => {
			state.loading = false;
			state.token = action.payload;
		},
		showLoading: (state) => {
			state.loading = true;
		},
		signInWithGoogleAuthenticated: (state, action) => {
			state.loading = false;
			state.token = action.payload;
		},
		signInWithFacebookAuthenticated: (state, action) => {
			state.loading = false;
			state.token = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, startLoading)
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload.data.message;
				state.user = action.payload.data;
				state.token = action.payload.data.accessToken;
				state.redirect = '/';
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.message = action.payload.message;
				state.redirect = '/auth';
				state.showMessage = true;
			})
		builder
			.addCase(sendValidateCitizen.pending, startLoading)
			.addCase(sendValidateCitizen.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload.message;
				state.redirect = '/auth';
			})
			.addCase(sendValidateCitizen.rejected, (state, action) => {
				state.loading = false;
				state.message = action.payload.message;
				state.showMessage = true;
			})
		builder
			.addCase(sendActivation.pending, startLoading)
			.addCase(sendActivation.fulfilled, stopLoading)
			.addCase(sendActivation.rejected, stopLoading)
		builder
			.addCase(getUserProfile.pending, startLoading)
			.addCase(getUserProfile.fulfilled, (state, action) => {
				state.user = action.payload
			})
			.addCase(getUserProfile.rejected, stopLoading)
		builder
			.addCase(sendLogout.pending, startLoading)
			.addCase(sendLogout.fulfilled, (state, action) => {
				state.message = action.payload.message
				state.token = null;
				state.redirect = '/';
				state.loading = false;
				state.user = null;
			})
			.addCase(sendLogout.rejected, stopLoading)
		builder
			.addCase(resetPassword.pending, startLoading)
			.addCase(resetPassword.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload.message;
			})
			.addCase(resetPassword.rejected, stopLoading)
		builder
			.addCase(resendActivation.pending, startLoading)
			.addCase(resendActivation.fulfilled, stopLoading)
			.addCase(resendActivation.rejected, stopLoading)
	},
});

export const {
	authenticated,
	showAuthMessage,
	hideAuthMessage,
	signOutSuccess,
	showLoading,
} = authSlice.actions;

export default authSlice.reducer;