import React from 'react'
import {withRouter} from "react-router-dom";
import FormFinance from "../form-finance";

const AddFinance = () => {
	return (
		<FormFinance type="ADD"/>
	)
}

export default withRouter(AddFinance)