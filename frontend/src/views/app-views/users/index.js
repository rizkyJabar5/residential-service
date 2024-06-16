import { Button, Card, Col, Row, Table, message } from 'antd';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllUser } from 'redux/features/user';
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import MenuActionTable from '../components/MenuActionTable'
import { strings } from "../../../res";

export const USERS = () => {
	const history = useHistory()
	const dispatch = useDispatch();
	const {
		list,
		selectedRows,
		filter: { q: searchTerm },
		loading: {
			query: loadingQuery,
			mutation: loadingMutation,
		},
	} = useSelector(state => state.accounts)

	const getData = useCallback(async () => {
		console.log(list)
		await dispatch(fetchAllUser({
			"page": 0,
			"limitContent": 50,
		})).unwrap()
	}, [ dispatch, list ])

	useEffect(() => {
		getData()
	}, [])

	const tableColumns = [
		{
			title: 'E-Mail',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Nama Lengkap',
			dataIndex: 'fullName',
			key: 'fullName',
		},
		{
			title: 'Dibuat Pada',
			dataIndex: 'createdTime',
			key: 'createdTime',
		},
		{
			title: 'Dibuat Oleh',
			dataIndex: 'createdBy',
			key: 'createBy',
		},
		{
			title: 'Diubah Pada',
			dataIndex: 'updatedTime',
			key: 'updatedTime',
		},
		{
			title: 'Diubah Oleh',
			dataIndex: 'updatedBy',
			key: 'updatedBy',
		},
		{
			title: 'Status Registrasi',
			dataIndex: 'userInfo.statusRegistered',
			key: 'statusRegistration',
		},
		{
			title: 'Peran',
			dataIndex: 'role',
			key: 'role',
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={ MenuActionTable(
						elm,
						strings.navigation.path.users.edit,
						selectedRows) }
					/>
				</div>
			),
		},
	];

	return (
		<>
			<Row gutter={ 24 }>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<h2>Daftar Pengguna</h2>
					<p>Daftar semua data yang tersedia.</p>
				</Col>
			</Row>
			<Row gutter={ 24 }>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<Card title="Daftar Semua Pengguna">
						<Table
							className="no-border-last"
							columns={ tableColumns }
							dataSource={ list }
							rowKey="id"
							pagination={ false }
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={ 24 }>
				<Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 }>
					<Button type="primary" style={ { width: "100%" } } onClick={ () => {
						history.push({
							pathname: '/app/detail-user',
							isAddNew: true,
						})
					} }>Tambah Akun Staff</Button>
				</Col>
				<Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 }>
					<Button style={ { width: "100%" } } onClick={ () => {
						history.push({
							pathname: '/app/detail-user',
							isAddNew: true,
						})
					} }>Tambah Akun Warga</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(USERS);
