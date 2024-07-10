import React from 'react'
import { withRouter } from "react-router-dom";
import NewsForm from "../form-news";

const AddNews = () => {
	return (
		<NewsForm/>
	)
}

export default withRouter(AddNews)
