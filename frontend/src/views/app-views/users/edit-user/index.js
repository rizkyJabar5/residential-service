import React from 'react'
import { useParams, withRouter } from "react-router-dom";
import DetailUser from "../detail-user";
import Utils from "../../../../utils";

const UpdateCitizen = () => {
	const { id } = useParams()
	return (
		<DetailUser type={ Utils.ACTION_TYPE.EDIT } param={ id }/>
	)
};

export default withRouter(UpdateCitizen)