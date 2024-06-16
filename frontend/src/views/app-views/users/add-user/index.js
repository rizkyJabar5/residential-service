import React from 'react'
import { withRouter } from "react-router-dom";
import DetailUser from "../detail-user";
import Utils from "../../../../utils";

const AddCitizen = () => {
	return (
		<DetailUser type={ Utils.ACTION_TYPE.ADD }/>
	)
}

export default withRouter(AddCitizen)