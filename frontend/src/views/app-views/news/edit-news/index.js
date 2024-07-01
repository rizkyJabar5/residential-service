import React from 'react'
import { useParams, withRouter } from "react-router-dom";
import NewsForm from "../form-news";
import Utils from "../../../../utils";

const EditNews = () => {
	const { id } = useParams()
	return (
		<NewsForm type={ Utils.ACTION_TYPE.EDIT } param={id}/>
	)
}

export default withRouter(EditNews)
