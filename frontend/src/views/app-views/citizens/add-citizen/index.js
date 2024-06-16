import React from 'react'
import DetailCitizen from "../detail-citizen";
import {withRouter} from "react-router-dom";

const AddCitizen = () => {
	return (
		<DetailCitizen type="ADD"/>
	)
}

export default withRouter(AddCitizen)