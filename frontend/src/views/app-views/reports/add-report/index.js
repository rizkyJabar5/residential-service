import React from 'react'
import {withRouter} from "react-router-dom";
import FormReport from "../form-report";

const AddReport = () => {
	return (
		<FormReport type="ADD"/>
	)
}

export default withRouter(AddReport)