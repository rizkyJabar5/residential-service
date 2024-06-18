import { Button, Card, Col, Row, Table, message, Tag, Input, ConfigProvider, Tooltip, Popover, Menu } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllLetter, downloadLetter, updateLetter } from 'redux/features/letters';
import Flex from "../../../components/shared-components/Flex";
import {
	PlusCircleOutlined,
	SearchOutlined,
	CloseCircleTwoTone,
	InfoCircleFilled,
	EyeOutlined,
} from "@ant-design/icons";
import { strings } from "../../../res";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import MenuActionTable from "../components/MenuActionTable";
import { CheckCircleOutline, CheckCircleTwoTone, DeleteOutlined, SyncOutlined } from "@material-ui/icons";

export const Letters = () => {
	const [ modalIsOpen, setIsOpen ] = React.useState(false)
	const [ amountCredit, setAmountCredit ] = useState(0)
	const [ selectedPaymentId, setSelectedPaymentId ] = useState(0)
	const history = useHistory()
	const dispatch = useDispatch();
	const {
		lettersData,
		isLoading,
		selectedRows,
		filter: { q: searchTerm },
		message: msgResponse,
		hasData,
	} = useSelector(state => state.letters)

	const getData = useCallback(async () => {
		const params = {
			page: 0,
			limit: 30,
		}

		try {
			await dispatch(fetchAllLetter(params)).unwrap()
		} catch (error) {
			message.error(error?.message || 'Data gagal dimuat')
		}
	}, [ dispatch ])

	useEffect(() => {
		getData()
	}, [])

	const approvedLetter = async (id) => {
		try {
			await dispatch(updateLetter({
				"letterId": id,
				"status": 7,
			})).unwrap()
		} catch (error) {
			console.log(error)
			message.error(error?.message || 'Failed to delete data')
		}
	}

	const download = async (id) => {
		try {
			await dispatch(downloadLetter(id)).unwrap()
		} catch (error) {
			console.log(error)
			message.error(error?.message || 'Failed to delete data')
		}
	}

	const tableColumns = [
		{
			width: '15%',
			title: 'Tanggal Pengajuan',
			dataIndex: 'createdTime',
			render: (_, record) => (
				<div className="text-center">
					{ record.createdTime ? record.createdTime : moment().format("DD-MMM-YYYY") }
				</div>
			),
		},
		{
			title: 'Nama',
			dataIndex: 'fullName',
			sorter: (a, b) => a.customerName.length - b.customerName.length,
			render: (_, record) => (
				<div className="text-left">
					{ record.fullName !== "NaN" ? record.fullName : "Anonim" }
				</div>
			),
		},
		{
			title: 'Nomor Surat',
			dataIndex: 'letterId',
			key: 'letterId',
			render: (_, record) => (
				<div className="text-left">
					{ record.letterId !== "NaN" ? record.letterId : "Anonim" }
				</div>
			),
		},
		{
			title: 'Jenis Permohonan',
			dataIndex: 'type',
			key: 'type',
		},
		{
			title: 'Status Pengajuan',
			dataIndex: 'status',
			key: 'status',
			render: (_, record) => {
				const enums = {
					"Pengajuan Ditolak": "red",
					"Menunggu Review Sekretaris RT": "orange",
					"Sedang direview Sekretaris RT": "orange",
					"Sedang direview oleh Sekretaris RT": "orange",
					"Pengajuan Disetujui RT": "blue",
					"Sedang direview oleh Sekretaris RW": "orange",
					"Sedang direview oleh RW": "blue",
					"Pengajuan Telah Disetujui": "green",
				}
				return (
					<span>
							<Tag color={ enums[record.status] } key={ record.status }>
								{ record.status }
							</Tag>
						</span>
				)
			},
		},
		// {
		// 	title: () => <div className="text-center">Pelunasan</div>,
		// 	key: 'pelunasan',
		// 	render: (_, record) => (
		// 		<div className="text-center">
		// 			<a type="primary" style={{ width: "70%" }} onClick={() => {
		// 				setSelectedPaymentId(record.orderId)
		// 				setIsOpen(true)
		// 			}} >Lunasi</a>
		// 		</div>
		// 	),
		// },
		{
			title: '',
			colSpan: 2,
			key: 'status',
			render: (_, record) => {
				const approved = record.status === 'Pengajuan Telah Disetujui';
				const content = (
					<span className="text-center" style={ { color: 'rgba(52,49,49,0.76)' } }>
						<p>Pengajuan belum bisa di download</p>
						<p>Karena belum disetujui</p>
					</span>
				)
				return (
					<div className="text-info">
						<Flex className="py-2" mobileFlex={ false } justifyContent="between" alignItems="center">
						<Popover trigger="click" placement="top" content={ !approved ? content : 'Unduh Pengajuan' }>
								<InfoCircleFilled/>
							</Popover>
							<Button
								disabled={ !approved }
								type="link"
								onClick={ async () => download(record.id) }>
								Unduh
							</Button>
						</Flex>
					</div>
				)
			},
		},
		{
			colSpan: 0,
			dataIndex: 'actions',
			render: (_, elm) => {
				const role = 'ADMIN'; // TODO: WILL be replace from local storage
				const approved = elm.status === 'Pengajuan Telah Disetujui';
				return (
					<div className="text-right">
						<EllipsisDropdown menu={ () => {
							return <Menu>
								<Menu.Item onClick={ () => {
								} }>
									<Flex alignItems="center">
										<EyeOutlined/>
										<span className="ml-2">Review</span>
									</Flex>
								</Menu.Item>
								{
									approved
										? null
										: role === 'ADMIN' &&
										<Menu.Item onClick={ () => approvedLetter(elm.id) }>
											<Flex alignItems="center">
												{ isLoading
													? <SyncOutlined spin/>
													: <CheckCircleOutline style={ { fontSize: '16px', color: '#00cc29' } }/>
												}
												<span className="ml-2">Setujui</span>
											</Flex>
										</Menu.Item>
								}
							</Menu>
						} }
						/>
					</div>
				);
			},
		},
	];

	const onCLickAdd = () => {
		history.push({ pathname: strings.navigation.path.letters.add, isAddNew: true })
	}

	const customizeRenderEmpty = () => (
		<div style={ { marginTop: 20, textAlign: 'center' } }>
			<CloseCircleTwoTone twoToneColor="red" style={ { fontSize: 30 } }/>
			<p style={ { marginTop: 20 } }>{ msgResponse }</p>
		</div>
	);

	return (
		<>
			<Row gutter={ 24 }>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<Card title="Daftar Semua Pengajuan">
						<Flex alignItems="center" justifyContent="between" mobileFlex={ false }>
							<Flex className="mb-1" mobileFlex={ false }>
								<div className="mr-md-3 mb-4">
									<Input
										placeholder="Search"
										prefix={ <SearchOutlined/> }
										// onChange={ e => onSearch(e) }
									/>
								</div>
							</Flex>
							<div>
								<Button
									onClick={ onCLickAdd }
									type="primary"
									icon={ <PlusCircleOutlined/> }
									block>
									Tambah
								</Button>
							</div>
						</Flex>
						<ConfigProvider renderEmpty={ customizeRenderEmpty }>
							<Table
								loading={ isLoading }
								className="no-border-last"
								columns={ tableColumns }
								dataSource={ hasData ? lettersData : [] }
								rowKey="id"
								pagination={ {
									pageSize: 10,
								} }
							/>
						</ConfigProvider>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default withRouter(Letters);
