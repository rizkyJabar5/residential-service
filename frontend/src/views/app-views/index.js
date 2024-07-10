import React, { Suspense } from "react";
import { Switch, Redirect } from "react-router-dom";
import PrivateRoute from 'components/PrivateRoute'
import { strings } from "res";
import Loading from 'components/shared-components/Loading';

// Pages
import DASHBOARD from "./dashboard"
import Letters from "./letters"
import Citizens from "./citizens"
import SETTINGS from "./settings"
import USERS from "./users"

import DETAILPRODUCT from "./detail-product"
import INVOICE from "./invoice"
import AddCitizen from "./citizens/add-citizen";
import EditCitizen from "./citizens/edit-citizen";
import { AddAccountCitizen, AddAccountStaff } from "./users/add-user";
import { EditAccountCitizen, EditAccountStaff } from "./users/edit-user";
import AddLetter from "./letters/add-letter";
import Reports from "./reports";
import AddReport from "./reports/add-report";
import Finance from "./finance";
import AddFinance from "./finance/add-finance";
import News from "./news";
import AddNews from "./news/add-news";
import EditNews from "./news/edit-news";

export const AppViews = ({ match }) => {

	return (
		<Suspense fallback={ <Loading cover="content"/> }>
			<Switch>
				<PrivateRoute path={ `${ strings.navigation.path.dashboard }` } component={ DASHBOARD }/>

				{/*CITIZEN*/ }
				<PrivateRoute exact path={ `${ strings.navigation.path.citizen.list }` } component={ Citizens }/>
				<PrivateRoute path={ `${ strings.navigation.path.citizen.add }` } component={ AddCitizen }/>
				<PrivateRoute path={ `${ strings.navigation.path.citizen.list }/:id` } component={ EditCitizen }/>

				<PrivateRoute exact path={ `${ strings.navigation.path.letters.list }` } component={ Letters }/>
				<PrivateRoute path={ `${ strings.navigation.path.letters.add }` } component={ AddLetter }/>
				<PrivateRoute path={ `${ strings.navigation.path.letters.edit }/:id` } component={ Letters }/>
				<PrivateRoute path={ `${ strings.navigation.path.letters.delete }` } component={ Letters }/>

				{/* Reports */}
				<PrivateRoute exact path={ `${ strings.navigation.path.reports.list }` } component={ Reports }/>
				<PrivateRoute path={ `${ strings.navigation.path.reports.add }` } component={ AddReport }/>

				{/* News*/}
				<PrivateRoute path={ `${ strings.navigation.path.news.list }` } component={ News }/>
				<PrivateRoute path={ `${ strings.navigation.path.news.add }` } component={ AddNews }/>
				<PrivateRoute path={ `${ strings.navigation.path.news.edit }/:id` } component={ EditNews }/>

				{/* Finance */}
				<PrivateRoute exact path={ `${ strings.navigation.path.finances.list }` } component={ Finance }/>
				<PrivateRoute path={ `${ strings.navigation.path.finances.add }` } component={ AddFinance }/>

				<PrivateRoute path={ `${ strings.navigation.path.settings }` } component={ SETTINGS }/>

				{/* USERS */ }
				<PrivateRoute exact path={ `${ strings.navigation.path.users.list }` } component={ USERS }/>
				<PrivateRoute path={ `${ strings.navigation.path.users.add_staff }` } component={ AddAccountStaff }/>
				<PrivateRoute path={ `${ strings.navigation.path.users.add_citizen }` } component={ AddAccountCitizen }/>
				<PrivateRoute path={ `${ strings.navigation.path.users.edit_staff }/:id` } component={ EditAccountStaff }/>
				<PrivateRoute path={ `${ strings.navigation.path.users.edit_citizen }/:id` } component={ EditAccountCitizen }/>

				<PrivateRoute path={ `${ strings.navigation.path.detail_products }` } component={ DETAILPRODUCT }/>

				{/* INVOICE */ }
				<PrivateRoute path={ `${ strings.navigation.path.invoice }` } component={ INVOICE }/>

				<Redirect from={ `${ match.url }` } to={ `${ strings.navigation.path.dashboard }` }/>
			</Switch>
		</Suspense>
	)
}

export default AppViews;
