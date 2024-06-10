import { Button, Card, Col, Row, Table, message } from 'antd';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllCategory, deleteCategory } from 'redux/features/category';


export const CATEGORIES = (props) => {
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
	} = useSelector(state => state.categories)

	const getData = useCallback(async () => {
		try {
			await dispatch(fetchAllCategory()).unwrap()
			// console.log(list)
		} catch (error) {
			console.log(error)
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [dispatch])

	const deleteData = useCallback(async (id) => {
		try {
			await dispatch(deleteCategory(id)).unwrap()
			getData()
		} catch (error) {
			console.log(error)
			message.error(error?.message || 'Failed to delete data')
		}
	}, [dispatch])

	useEffect(() => {
		getData()
	}, [])

	const tableColumns = [

		{
			title: 'KK Id',
			dataIndex: 'categoryId',
			key: 'categoryId',
		},
		{
			title: 'Nama Lengkap',
			dataIndex: 'nameCategory',
			key: 'nameCategory',
			sorter: (a, b) => a.nameCategory.length - b.nameCategory.length,
		},
		{
			title: 'NIK',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Jenis Kelamin',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Tempat Lahir',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Tanggal Lahir',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Agama',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Pendidikan Terakhir',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Status Keluarga',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Jenis Pekerjaan',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Golongan Darah',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Status',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Alamat',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Nomer Keluarga',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: () => <div className="text-center">Detail</div>,
			key: 'status',
			render: (_, record) => (
				<div className="text-center">
					<a style={{ width: "70%", color: 'blue' }} onClick={() => {
						history.push({
							pathname: '/app/detail-categories',
							id: record.categoryId,
						})
					}} >Detail</a>
				</div>
			),
		},
		{
			title: () => <div className="text-center">Delete</div>,
			key: 'status',
			render: (_, record) => (
				<div className="text-center">
					<a style={{ width: "70%", color: 'red' }} onClick={() => {
						deleteData(record.categoryId)
					}} >Delete</a>
				</div>
			),
		},
	];

	return (
		<>
			<Row gutter={24}>
				{props.noTitle ? (
					<div></div>
				) : (
					(<Col xs={24} sm={24} md={24} lg={24}>
						<h2>Daftar Warga</h2>
						<p>Daftar semua data warga</p>
					</Col>)
				)}
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Card title="Daftar Semua warga" >
						<Table
							className="no-border-last"
							columns={tableColumns}
							dataSource={list}
							rowKey='categoryId'
							pagination={{
								pageSize: 8
							}}
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Button type="primary" style={{ width: "100%" }} onClick={() => {
						history.push({
							pathname: '/app/detail-categories',
						})
					}}>Tambah Category</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(CATEGORIES);
