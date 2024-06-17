import React from 'react'
import { withRouter } from "react-router-dom";
import FormStaff from "../detail-user/FormStaff";
import Utils from "../../../../utils";

const AddStaff = () => {
	return (
		<FormStaff type={ Utils.ACTION_TYPE.ADD }/>
	)
}

export const AddAccountStaff = withRouter(AddStaff)