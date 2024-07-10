import { Button, Card, Col, Row, Table, message, Tag } from 'antd';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllUser } from 'redux/features/user';
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import MenuActionTable from '../components/MenuActionTable'
import { strings } from "../../../res";
import Utils from "../../../utils";

export const USERS = () => {
	const history = useHistory()
	const dispatch = useDispatch();
	const {
		list,
		selectedRows,
		filter: { q: searchTerm },
		isLoading,
	} = useSelector(state => state.accounts)

	const getData = useCallback(async () => {
		console.log(isLoading)
		await dispatch(fetchAllUser({
			"page": 0,
			"limitContent": 50,
		})).unwrap()
	}, [ dispatch, list ])

	useEffect(() => {
		getData()
	}, [])

	const formatDate = (elm) => Utils.convertDateTimeToLocal(elm)

	const tableColumns = [
		{
			title: 'E-Mail',
			dataIndex: 'email',
			key: 'email',
			render: (_, elm) => {
				return (
					elm.email
						? elm.email
						: <span>
              <Tag color="red" key="email">
                -
              </Tag>
            </span>
				);
			},
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Dibuat Pada',
			dataIndex: 'createdTime',
			key: 'createdTime',
			render: (_, elm) => formatDate(elm.createdTime),
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
			render: (_, elm) => formatDate(elm.updatedTime),
		},
		{
			title: 'Diubah Oleh',
			dataIndex: 'updatedBy',
			key: 'updatedBy',
		},
		{
			title: 'Status Registrasi',
			key: 'statusRegistered',
			render: (_, elm) => {
				const tagsStatus = {
					"Belum Mendaftar": "red",
					"Verifikasi": "orange",
					"Terdaftar": "green",
					"-": "red",
				}

				let statusRegistered = ''
				if(elm.userInfo) {
					if(elm.userInfo.statusRegistered === "NOT_REGISTERED") {
						statusRegistered = "Belum Mendaftar"
					} else if(elm.userInfo.statusRegistered === "VERIFIED"){
						statusRegistered = "Verifikasi"
					}else if(elm.userInfo.statusRegistered === "REGISTERED") {
						statusRegistered = "Terdaftar"
					}
				} else {
					statusRegistered = "-"
				}

				return (
					<span>
              <Tag color={ tagsStatus[statusRegistered] } key={ statusRegistered }>
                { statusRegistered.toUpperCase() }
              </Tag>
            </span>
				);
			},
		},
		{
			title: 'Peran',
			dataIndex: 'role',
			key: 'role',
			render: (_, elm) => {
				return (
					<span>
              <Tag color="blue" key="role">
                { elm.role }
              </Tag>
            </span>
				);
			},
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={ MenuActionTable(
						elm,
						elm.role === 'Warga'
							? strings.navigation.path.users.edit_citizen
							: strings.navigation.path.users.edit_staff,
						selectedRows,
						true) }
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
							pagination={ {
								pageSize: 10,
							} }
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={ 24 }>
				<Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 }>
					<Button type="primary" style={ { width: "100%" } } onClick={ () => {
						history.push({
							pathname: `${ strings.navigation.path.users.add_staff }`,
							isAddNew: true,
						})
					} }>Tambah Akun Staff</Button>
				</Col>
				<Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 }>
					<Button style={ { width: "100%" } } onClick={ () => {
						history.push({
							pathname: `${ strings.navigation.path.users.add_citizen }`,
							isAddNew: true,
						})
					} }>Tambah Akun Warga</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(USERS);
