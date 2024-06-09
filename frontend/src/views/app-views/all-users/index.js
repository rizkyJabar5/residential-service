import { Button, Card, Col, Row, Table, message } from 'antd';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllUser } from 'redux/features/user';

export const PASIEN = () => {
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
	} = useSelector(state => state.user)

	const getData = useCallback(async () => {
		try {
			await dispatch(fetchAllUser()).unwrap()
			console.log(list)
		} catch (error) {
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [dispatch])

	useEffect(() => {
		getData()
	}, [])

	const tableColumns = [
		{
			title: 'User ID',
			dataIndex: 'userId',
			key: 'userId',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Username',
			dataIndex: 'username',
			key: 'username',
		},
		{
			title: 'Full Name',
			dataIndex: 'fullName',
			key: 'fullName',
		},
		{
			title: () => <div className="text-center">Join Date</div>,
			key: 'status',
			render: (_, record) => (
				<div className="text-center">
					{
						new Date(record.joinDate).toDateString()
					}
				</div>
			),
		},
		{
			title: () => <div className="text-center">Authority</div>,
			key: 'status',
			render: (_, record) => (
				<div className="text-center">
					{
						record.authorities.map((item, index) => {
							return <div key={index}> {item.authority}</div>
						})
					}
				</div>
			),
		},
	];

	return (
		<>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<h2>Daftar Pengguna</h2>
					<p>Daftar semua data yang tersedia.</p>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Card title="Daftar Semua Pengguna" >
						<Table
							className="no-border-last"
							columns={tableColumns}
							dataSource={list}
							rowKey='userId'
							pagination={false}
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Button type="primary" style={{ width: "100%" }} onClick={() => {
						history.push({
							pathname: '/app/detail-user',
							isAddNew: true
						})
					}}>Tambah Pengguna</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(PASIEN);
