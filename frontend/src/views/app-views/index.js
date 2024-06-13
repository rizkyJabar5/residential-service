import React, { Suspense } from "react";
import { Switch, Redirect } from "react-router-dom";
import PrivateRoute from 'components/PrivateRoute'
import { strings } from "res";
import Loading from 'components/shared-components/Loading';

// Pages
import DASHBOARD from "./dashboard"
import PRODUCTS from "./all-products"
import Letters from "./all-letters"
import CUSTOMERS from "./all-customers"
import SUPPLIERS from "./all-suppliers"
import PURCHASE from "./all-purchase"
import Citizens from "./citizens"
import SETTINGS from "./settings"
import USERS from "./all-users"

import DETAILREPORT from "./detail-report"
import DETAILSUPPLIER from "./detail-supplier"
import DETAILORDER from "./detail-order/DetailLetter"
import DETAILPRODUCT from "./detail-product"
import DETAILCUSTOMER from "./detail-customer"
import DETAILUSER from "./detail-user"
import INVOICE from "./invoice"
import DetailCitizen from "./citizens/DetailCitizen";
import DETAILPURCHASE from "./detail-purchase";

export const AppViews = ({ match }) => {

  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Switch>
        {/* <PrivateRoute path={`${match.url}`} component={DASHBOARD} /> */}
        <PrivateRoute path={`${strings.navigation.path.dashboard}`} component={DASHBOARD} />
        <PrivateRoute path={`${strings.navigation.path.citizen}`} component={Citizens} />
        <PrivateRoute path={`${strings.navigation.path.letter}`} component={Letters} />
        {/* <PrivateRoute path={`${strings.navigation.path.categories}`} component={CATEGORIES} /> */}
        {/* <PrivateRoute path={`${strings.navigation.path.expenses}`} component={EXPENSES} /> */}
        <PrivateRoute path={`${strings.navigation.path.reports}`} component={PRODUCTS} />
        <PrivateRoute path={`${strings.navigation.path.news}`} component={CUSTOMERS} />
        <PrivateRoute path={`${strings.navigation.path.finance}`} component={PURCHASE} />
        <PrivateRoute path={`${strings.navigation.path.suppliers}`} component={SUPPLIERS} />
        <PrivateRoute path={`${strings.navigation.path.users}`} component={USERS} />
        <PrivateRoute path={`${strings.navigation.path.settings}`} component={SETTINGS} />

        {/* DETAIL */}
        <PrivateRoute path={`${strings.navigation.path.detail_reports}`} component={DETAILREPORT} />
        <PrivateRoute path={`${strings.navigation.path.detail_suppliers}`} component={DETAILSUPPLIER} />
        <PrivateRoute path={`${strings.navigation.path.detail_orders}`} component={DETAILORDER} />
        <PrivateRoute path={`${strings.navigation.path.detail_products}`} component={DETAILPRODUCT} />
        <PrivateRoute path={`${strings.navigation.path.detail_customers}`} component={DETAILCUSTOMER} />
        <PrivateRoute path={`${strings.navigation.path.detail_users}`} component={DETAILUSER} />
        <PrivateRoute path={`${strings.navigation.path.detail_citizen}`} component={DetailCitizen} />
        <PrivateRoute path={`${strings.navigation.path.detail_purchase}`} component={DETAILPURCHASE} />

        {/* INVOICE */}
        <PrivateRoute path={`${strings.navigation.path.invoice}`} component={INVOICE} />

        <Redirect from={`${match.url}`} to={`${strings.navigation.path.dashboard}`} />
      </Switch>
    </Suspense>
  )
}

export default AppViews;
