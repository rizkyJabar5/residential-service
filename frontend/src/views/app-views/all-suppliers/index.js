import { Button, Card, Col, Row, Table, message } from 'antd';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllSupplier,deleteSupplier } from 'redux/features/suppliers';


const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'IDR',
	maximumSignificantDigits: 3
});

export const SUPPLIERS = () => {
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
	} = useSelector(state => state.suppliers)

	// const deleteData = useCallback(async (id) => {
	// 	try {
	// 		await dispatch(deleteSupplier(id)).unwrap()
	// 	} catch (error) {
	// 		console.log(error)
	// 		message.error(error?.message || 'Failed to delete data')
	// 	}
	// }, [dispatch])

	const getData = useCallback(async () => {
		try {
			await dispatch(fetchAllSupplier()).unwrap()
		} catch (error) {
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [dispatch])

	useEffect(() => {
		getData()
	}, [])

	const tableColumns = [
		{
			title: 'ID Supplier',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Nama',
			dataIndex: 'supplierName',
			key: 'supplierName',
			sorter: (a, b) => a.supplierName.length - b.supplierName.length,
		},
		{
			title: 'Hutang',
			dataIndex: 'totalDebt',
			sorter: (a, b) => a.totalDebt - b.totalDebt,
			// filters: [
			// 	{
			// 		text: 'Lunas',
            //         value: record.totalDebt
			// 	}
			// ],
			render: (_, record) => (
				<div className="text-left">
					{formatter.format(record.totalDebt)}
				</div>
			),
		},
		{
			title: 'Jumlah Bayar Hutang',
			dataIndex: 'amountPayDebt',
			sorter: (a, b) => a.amountPayDebt - b.amountPayDebt,
			render: (_, record) => (
				<div className="text-left">
					{formatter.format(record.amountPayDebt)}
				</div>
			),
		},
		{
			title: 'Tanggal Bayar Hutang',
			dataIndex: 'payDebtDate',
			render: (_, record) => (
				<div className="text-left">
					{record.payDebtDate ? record.payDebtDate: "Belum ada pembayaran"}
				</div>
			),
		},
		// {
		// 	title: () => <div className="text-center">Detail</div>,
		// 	key: 'status',
		// 	render: (_, record) => (
		// 		<div className="text-center">
		// 			<a type="primary" style={{ width: "70%" }} onClick={() => {
		// 				history.push({
		// 					pathname: '/app/detail-history',
		// 					id: record._id,
		// 					isAddNew:false
		// 				})
		// 			}} >Detail</a>
		// 		</div>
		// 	),
		// },
		// {
		// 	title: () => <div className="text-center">Delete</div>,
		// 	key: 'status',
		// 	render: (_, record) => (
		// 		<div className="text-center">
		// 			<a style={{ width: "70%", color: 'red' }} onClick={() => {
		// 				deleteData(record.id)
		// 			}} >Delete</a>
		// 		</div>
		// 	),
		// },
	];

	return (
		<>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<h2>Daftar Supplier</h2>
					<p>Daftar semua data yang tersedia.</p>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Card title="Daftar Semua Supplier" >
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
							pathname: '/app/detail-supplier',
							isAddNew:true
						})
					}}>Tambah Supplier</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(SUPPLIERS);
