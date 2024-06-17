import React from 'react'
import { withRouter } from "react-router-dom";
import Utils from "../../../../utils";
import { FormCitizen } from "../detail-user";

const AddCitizen = () => {
	return (
		<FormCitizen type={ Utils.ACTION_TYPE.ADD }/>
	)
}

export const AddAccountCitizen = withRouter(AddCitizen);
