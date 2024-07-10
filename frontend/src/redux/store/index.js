import {configureStore} from '@reduxjs/toolkit'
import themeReducer from 'redux/features/theme'
import authReducer from 'redux/features/auth'
import reportReducer from 'redux/features/reports'
import letterReducer from 'redux/features/letters'
import citizensReducer from 'redux/features/citizens'
import newsReducer from 'redux/features/news'
import userReducer from 'redux/features/user'
import financeReducer from 'redux/features/finances'
import summaryReducer from 'redux/features/summaries'

const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        letters: letterReducer,
        news: newsReducer,
        reports: reportReducer,
        citizens: citizensReducer,
        accounts: userReducer,
        finances: financeReducer,
        summaries: summaryReducer
    }
});

export default store;

