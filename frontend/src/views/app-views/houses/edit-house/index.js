import React from 'react'
import DetailHouse from "../detail-house";
import {useParams, withRouter} from "react-router-dom";

const UpdateHouse = () => {
    const { id } = useParams()
    return (
        <DetailHouse type="EDIT" param={id}/>
    )
};

export default withRouter(UpdateHouse)