import React from 'react'
import { useParams, withRouter } from "react-router-dom";
import Utils from "../../../../utils";
import { FormStaff } from "../detail-user";

const UpdateStaff = () => {
	const { id } = useParams()
	return (
		<FormStaff type={ Utils.ACTION_TYPE.EDIT } param={ id }/>
	)
};

export const EditAccountStaff = withRouter(UpdateStaff)