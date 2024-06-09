import { Button, Card, Col, Row, Table, message } from 'antd';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllCustomer, deleteCustomer } from 'redux/features/customers';

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'IDR',
	maximumSignificantDigits: 3
});

export const CUSTOMERS = () => {
	const history = useHistory()
	const dispatch = useDispatch();
	const {
		list,
		selectedRows,
		filter: { q: searchTerm },
		loading: {
			query: loadingQuery,
			mutation: loadingMutation
		}
	} = useSelector(state => state.customers)

	const deleteData = useCallback(async (id) => {
		try {
			await dispatch(deleteCustomer(id)).unwrap()
			getData()
		} catch (error) {
			// console.log(error)
			message.error(error?.message || 'Failed to delete data')
		}
	}, [dispatch])

	const getData = useCallback(async () => {
		try {
			await dispatch(fetchAllCustomer()).unwrap()
			// console.log(list)
		} catch (error) {
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [dispatch])

	useEffect(() => {
		getData()
	}, [])

	const tableColumns = [
		{
			title: 'ID Pelanggan',
			dataIndex: 'customerId',
			key: 'customerId',
		},
		{
			title: 'Nama',
			dataIndex: 'customerName',
			key: 'customerName',
			sorter: (a, b) => a.customerName.length - b.customerName.length,
		},
		{
			title: 'Perusahaan',
			dataIndex: 'companyName',
			key: 'companyName',
			sorter: (a, b) => a.companyName.length - b.companyName.length,
		},
		{
			title: 'No HP',
			dataIndex: 'phoneNumber',
			key: 'phoneNumber',
		},
		{
			title: 'Hutang',
			dataIndex: 'customerDebt',
			key: 'customerDebt',
			sorter: (a, b) => a.customerDebt - b.customerDebt,
			render: (_, record) => (
				<div className="text-left">
					{formatter.format(record.customerDebt)}
				</div>
			),
		},
		{
			title: () => <div className="text-center">Delete</div>,
			key: 'status',
			render: (_, record) => (
				<div className="text-center">
					<a style={{ width: "70%", color: 'red' }} onClick={() => {
						deleteData(record.customerId)
					}} >Delete</a>
				</div>
			),
		},
	];

	return (
		<>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<h2>Daftar Pelanggan</h2>
					<p>Daftar semua data yang tersedia.</p>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Card title="Daftar Semua Pelanggan" >
						<Table
							className="no-border-last"
							columns={tableColumns}
							dataSource={list}
							rowKey='id'
							pagination={{
								pageSize:8
							  }}
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
				<Button type="primary" style={{width:"100%"}} onClick={()=>{
						history.push({
							pathname: '/app/detail-customer',
							isAddNew:true
						})
					}}>Tambah Konsumen</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(CUSTOMERS);
