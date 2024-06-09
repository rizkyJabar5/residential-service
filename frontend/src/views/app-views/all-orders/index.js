import { Button, Card, Col, Row, Table, message, Tag, Input } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllOrder, deleteOrder } from 'redux/features/orders';
import Modal from 'react-modal';

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'IDR',
	maximumSignificantDigits: 3
});

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

export const ORDERS = () => {
	const [modalIsOpen, setIsOpen] = React.useState(false)
	const [amountCredit, setAmountCredit] = useState(0)
	const [selectedPaymentId, setSelectedPaymentId] = useState(0)
	const history = useHistory()
	const dispatch = useDispatch();
	const {
		list,
	} = useSelector(state => state.orders)

	const bayar = async (event) => {
		event.preventDefault()
		const dataBayar = {
			"orderId": selectedPaymentId,
			"paymentAmount": amountCredit
		}

		const config = {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
				'Access-Control-Allow-Origin': "*",
				'Access-Control-Allow-Methods': "*"
			}
		}

		await axios.post("https://journal-florist-staging.herokuapp.com/api/v1/payments", dataBayar, config).then(doc => {
			message.success(doc.data.message)
			getData();
			setIsOpen(false)
		}).catch(err => {
			console.log(err)
			setIsOpen(false)
			message.info(err.response.data.message)
		})
	}

	const changeAmount = (event) => {
		setAmountCredit(event.target.value)
	}

	// const deleteData = useCallback(async (id) => {
	// 	try {
	// 		await dispatch(deleteOrder(id)).unwrap()
	// 	} catch (error) {
	// 		console.log(error)
	// 		message.error(error?.message || 'Failed to delete data')
	// 	}
	// }, [dispatch])

	const params = {
		page: 1,
		limit: 30
	}

	const getData = useCallback(async () => {
		try {
			await dispatch(fetchAllOrder(params)).unwrap()
		} catch (error) {
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [dispatch])

	useEffect(() => {
		getData()
	}, [])

	const tableColumns = [
		{
			title: 'Tanggal',
			dataIndex: 'deliveryDate',
			render: (_, record) => (
				<div className="text-center">
					{record.deliveryDate ? record.deliveryDate : moment().format("DD-MM-YYYY")}
				</div>
			),
		},
		{
			title: 'Pengirim',
			dataIndex: 'customerName',
			sorter: (a, b) => a.customerName.length - b.customerName.length,
			render: (_, record) => (
				<div className="text-left">
					{record.customerName !== "NaN" ? record.customerName : "Anonim"}
				</div>
			),
		},
		{
			title: 'Penerima',
			dataIndex: 'recipientName',
			key: 'recipientName',
			render: (_, record) => (
				<div className="text-left">
					{record.recipientName !== "NaN" ? record.recipientName : "Anonim"}
				</div>
			),
		},
		{
			title: 'Kode Pengiriman',
			dataIndex: 'orderId',
			key: 'orderId',
		},
		{
			title: 'Status',
			dataIndex: 'orderStatus',
			key: 'orderStatus',
			render: tag => {
				const enums = {
					"Pending": "orange",
					"Taken": "blue",
					"Sent": "green",
					"Canceled": "red"
				}

				if (enums) {
					return (
						<span>
							<Tag color={enums[tag]} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						</span>
					)
				}
			}
		},
		{
			title: 'Status',
			dataIndex: 'paymentStatus',
			key: 'paymentStatus',
			filters: [
				{
					text: 'Not Yet Paid',
					value: 'NOT_YET_PAID',
				},
				{
					text: 'Down Payment',
					value: 'DOWN_PAYMENT',
				},
				{
					text: 'Paid Off',
					value: 'PAID_OFF',
				},
				{
					text: 'Credit',
					value: 'CREDIT',
				},
			],
			onFilter: (value, record) => record.paymentStatus.startsWith(value),
			render: tag => {
				const enums = {
					"NOT_YET_PAID": "red",
					"DOWN_PAYMENT": "orange",
					"PAID_OFF": "green",
					"CREDIT":"blue"
				}

				if (enums) {
					return (
						<span>
							<Tag color={enums[tag]} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						</span>
					)
				}
			}
		},
		{
			title: 'Under Payment',
			dataIndex: 'underPayment',
			key: 'underPayment',
			sorter: (a, b) => a.underPayment - b.underPayment,
			render: (_, record) => (
				<div className="text-left">
					{formatter.format(record.underPayment)}
				</div>
			),
		},
		{
			title: () => <div className="text-center">Pelunasan</div>,
			key: 'pelunasan',
			render: (_, record) => (
				<div className="text-center">
					<a type="primary" style={{ width: "70%" }} onClick={() => {
						setSelectedPaymentId(record.orderId)
						setIsOpen(true)
					}} >Lunasi</a>
				</div>
			),
		},
		{
			title: () => <div className="text-center">Surat Jalan</div>,
			key: 'status',
			render: (_, record) => (
				<div className="text-center">
					<a type="primary" style={{ width: "70%" }} onClick={() => {
						history.push({
							pathname: '/app/invoice',
							id: record.orderId,
						})
					}} >Cetak</a>
				</div>
			),
		}
	];

	return (
		<>
			<Modal
				isOpen={modalIsOpen}
				style={customStyles}
				contentLabel="Tambah Produk"
			>
				<h2 >Pembayaran</h2>
				<form  name="basic" onSubmit={bayar}>
					<Input name="amountCredit" style={{ width: "100%" }} onChange={changeAmount} placeholder="Jumlah" />
					<Input type='submit' style={{ width: "100%", color: "white", marginTop: "15px", backgroundColor: "green" }} value="Lunasi" ></Input>
				</form>
			</Modal>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<h2>Daftar Pesanan</h2>
					<p>Daftar semua data yang tersedia.</p>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Card title="Daftar Semua Pesanan" >
						<Table
							className="no-border-last"
							columns={tableColumns}
							dataSource={list}
							rowKey='id'
							pagination={{
								pageSize: 10
							}}
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Button type="primary" style={{ width: "100%" }} onClick={() => {
						history.push({
							pathname: '/app/detail-order',
							isAddNew: true
						})
					}}>Tambah Pesanan</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(ORDERS);
