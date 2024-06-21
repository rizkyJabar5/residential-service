import { Button, Card, Col, Row, Table, message, Input, Space } from 'antd';
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllProduct, deleteProduct } from 'redux/features/products';
import {fetchAllReports} from "../../../redux/features/reports";

export const PRODUCTS = (props) => {
	const history = useHistory()
	const dispatch = useDispatch();
	const {
		listReports,
		hasData,
		filter: { q: searchTerm },
		loading: {
			query: loadingQuery,
			mutation: loadingMutation
		}
	} = useSelector(state => state.reports)

	const params = {
		page: 0,
		limit: 30
	}

	const getData = useCallback(async () => {

		try {
			await dispatch(fetchAllReports(params)).unwrap()
		} catch (error) {
			console.log(error)
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [dispatch])

	useEffect(() => {
		getData()
	}, [])

	const tableColumns = [
		{
			title: 'Gambar',
			dataIndex: 'imageUrl',
			key: 'imageUrl',
		},
		{
			title: 'Nama',
			dataIndex: 'name',
			key: 'name',
    		width: '40%',
		},
		{
			title: 'Lokasi',
			dataIndex: 'location',
			key: 'location',
		},
		{
			title: 'Jenis Fasilitas',
			dataIndex: 'typeFacility',
			key: 'typeFacility',
		},
	];

	return (
		<>
			<Row gutter={24}>
				{props.noTitle ? (
					<div></div>
				) : (
					(
					<Col xs={24} sm={24} md={24} lg={24}>
						<h2>Daftar Laporan</h2>
						<Row gutter={24}>
							<Col xs={12} sm={12} md={12} lg={12}>
								<p>Daftar semua data laporan</p>
							</Col>
						</Row>
					</Col>
					)
				)}
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Card title="Daftar Semua Laporan" >
						<Table
							className="no-border-last"
							columns={tableColumns}
							dataSource={hasData ? listReports : []}
							rowKey='id'
							pagination={{
								pageSize:10
							  }}
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
				<Button type="primary" style={{width:"100%"}} onClick={()=>{
						history.push({
							pathname: '/app/detail-product',
							isAddNew:true
						})
					}}>Tambah Produk</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(PRODUCTS);
