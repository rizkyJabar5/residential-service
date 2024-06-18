import React from 'react'
import { useParams, withRouter } from "react-router-dom";
import Utils from "../../../../utils";
import { FormCitizen } from "../detail-user";

const UpdateCitizen = () => {
	const { id } = useParams()
	return (
		<FormCitizen type={ Utils.ACTION_TYPE.EDIT } param={ id }/>
	)
};

export const EditAccountCitizen = withRouter(UpdateCitizen)