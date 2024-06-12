import { configureStore } from '@reduxjs/toolkit'
import themeReducer from 'redux/features/theme'
import authReducer from 'redux/features/auth'
import productsReducer from 'redux/features/products'
import supplierReducer from 'redux/features/suppliers'
import expenseReducer from 'redux/features/expenses'
import reportReducer from 'redux/features/reports'
import customerReducer from 'redux/features/customers'
import orderReducer from 'redux/features/orders'
import citizensReducer from 'redux/features/citizens'
import purchaseReducer from 'redux/features/purchase'
import userReducer from 'redux/features/user'

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    products:productsReducer,
    orders:orderReducer,
    customers:customerReducer,
    purchases:purchaseReducer,
    reports:reportReducer,
    suppliers:supplierReducer,
    expenses:expenseReducer,
    citizens:citizensReducer,
    user:userReducer,
  }
});

export default store;

