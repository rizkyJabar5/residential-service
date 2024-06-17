import React, { Suspense } from "react";
import { Switch, Redirect } from "react-router-dom";
import PrivateRoute from 'components/PrivateRoute'
import { strings } from "res";
import Loading from 'components/shared-components/Loading';

// Pages
import DASHBOARD from "./dashboard"
import PRODUCTS from "./all-products"
import Letters from "./letters/all-letters"
import CUSTOMERS from "./all-customers"
import SUPPLIERS from "./all-suppliers"
import PURCHASE from "./all-purchase"
import Citizens from "./citizens"
import SETTINGS from "./settings"
import USERS from "./users"

import DETAILREPORT from "./detail-report"
import DETAILSUPPLIER from "./detail-supplier"
import DETAILORDER from "./letters/detail-order/DetailLetter"
import DETAILPRODUCT from "./detail-product"
import DETAILCUSTOMER from "./detail-customer"
import INVOICE from "./invoice"
import DETAILPURCHASE from "./detail-purchase";
import AddCitizen from "./citizens/add-citizen";
import EditCitizen from "./citizens/edit-citizen";
import { AddAccountCitizen, AddAccountStaff } from "./users/add-user";
import { EditAccountCitizen, EditAccountStaff } from "./users/edit-user";

export const AppViews = ({ match }) => {

	return (
		<Suspense fallback={ <Loading cover="content"/> }>
			<Switch>
				{/* <PrivateRoute path={`${match.url}`} component={DASHBOARD} /> */ }
				<PrivateRoute path={ `${ strings.navigation.path.dashboard }` } component={ DASHBOARD }/>

				{/*CITIZEN*/ }
				<PrivateRoute exact path={ `${ strings.navigation.path.citizen.list }` } component={ Citizens }/>
				<PrivateRoute path={ `${ strings.navigation.path.citizen.add }` } component={ AddCitizen }/>
				<PrivateRoute path={ `${ strings.navigation.path.citizen.list }/:id` } component={ EditCitizen }/>

				<PrivateRoute path={ `${ strings.navigation.path.letter }` } component={ Letters }/>

				{/* <PrivateRoute path={`${strings.navigation.path.categories}`} component={CATEGORIES} /> */ }
				{/* <PrivateRoute path={`${strings.navigation.path.expenses}`} component={EXPENSES} /> */ }
				<PrivateRoute path={ `${ strings.navigation.path.reports }` } component={ PRODUCTS }/>
				<PrivateRoute path={ `${ strings.navigation.path.news }` } component={ CUSTOMERS }/>
				<PrivateRoute path={ `${ strings.navigation.path.finance }` } component={ PURCHASE }/>
				<PrivateRoute path={ `${ strings.navigation.path.suppliers }` } component={ SUPPLIERS }/>
				<PrivateRoute path={ `${ strings.navigation.path.settings }` } component={ SETTINGS }/>

				{/* USERS */ }
				<PrivateRoute exact path={ `${ strings.navigation.path.users.list }` } component={ USERS }/>
				<PrivateRoute path={ `${ strings.navigation.path.users.add_staff }` } component={ AddAccountStaff }/>
				<PrivateRoute path={ `${ strings.navigation.path.users.add_citizen }` } component={ AddAccountCitizen }/>
				<PrivateRoute path={ `${ strings.navigation.path.users.edit_staff }/:id` } component={ EditAccountStaff }/>
				<PrivateRoute path={ `${ strings.navigation.path.users.edit_citizen }/:id` } component={ EditAccountCitizen }/>

				{/* DETAIL */ }
				<PrivateRoute path={ `${ strings.navigation.path.detail_reports }` } component={ DETAILREPORT }/>
				<PrivateRoute path={ `${ strings.navigation.path.detail_suppliers }` } component={ DETAILSUPPLIER }/>
				<PrivateRoute path={ `${ strings.navigation.path.detail_orders }` } component={ DETAILORDER }/>
				<PrivateRoute path={ `${ strings.navigation.path.detail_products }` } component={ DETAILPRODUCT }/>
				<PrivateRoute path={ `${ strings.navigation.path.detail_customers }` } component={ DETAILCUSTOMER }/>
				<PrivateRoute path={ `${ strings.navigation.path.detail_purchase }` } component={ DETAILPURCHASE }/>

				{/* INVOICE */ }
				<PrivateRoute path={ `${ strings.navigation.path.invoice }` } component={ INVOICE }/>

				<Redirect from={ `${ match.url }` } to={ `${ strings.navigation.path.dashboard }` }/>
			</Switch>
		</Suspense>
	)
}

export default AppViews;
