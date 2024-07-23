import React from 'react'
import DetailHouse from "../detail-house";
import {withRouter} from "react-router-dom";

const AddHouse = () => {
	return (
		<DetailHouse type="ADD"/>
	)
}

export default withRouter(AddHouse)