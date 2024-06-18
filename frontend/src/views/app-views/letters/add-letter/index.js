import React from 'react'
import {withRouter} from "react-router-dom";
import FormLetter from "../form-letter";

const AddLetter = () => {
	return (
		<FormLetter type="ADD"/>
	)
}

export default withRouter(AddLetter)