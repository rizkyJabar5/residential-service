import React from 'react'
import DetailCitizen from "../detail-citizen";
import {useParams, withRouter} from "react-router-dom";

const UpdateCitizen = () => {
    const { id } = useParams()
    return (
        <DetailCitizen type="EDIT" param={id}/>
    )
};

export default withRouter(UpdateCitizen)