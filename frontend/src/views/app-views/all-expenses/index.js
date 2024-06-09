import { Button, Card, Col, Row, Table, message, Input, Form, Select } from 'antd';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import axios from 'axios';
import { fetchAllExpense, addExpense } from 'redux/features/expenses';
import { fetchAllSupplier } from 'redux/features/suppliers';
import Modal from 'react-modal';

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

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'IDR',
	maximumSignificantDigits: 3
});

const { Option } = Select;

export const EXPENSES = () => {

	const [modalIsOpen, setIsOpen] = React.useState(false)
	const [pengeluaran, setPengeluaran] = useState({})
	const [suppliers, setSuppliers] = useState([])
	const [selectedSupplier, setSelectedSupplier] = useState("")
	const [selectedPay, setSelectedPay] = useState("")

	const getSuppliers = useCallback(async () => {
		try {
			await dispatch(fetchAllSupplier()).unwrap().then(doc => {
				setSuppliers(doc)
			})
		} catch (error) {
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [])

	const handleSelectedSupplier = (value) => {
		setSelectedSupplier(value)
	}

	const handleSelectedPay = (value) => {
		setSelectedPay(value)
	}

	const dispatch = useDispatch();
	const {
		list
	} = useSelector(state => state.expenses)

	const params = {
		page: 1,
		limit: 30
	}

	const tambahPengeluaran = async (values) => {

		const config = {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
				'Access-Control-Allow-Origin': "*",
				'Access-Control-Allow-Methods': "*",
				"Content-Type": "multipart/form-data"
			}
		}

		let formData = new FormData();
		formData.append('supplierId', selectedSupplier);
		formData.append('additionalInformation', pengeluaran.additionalInformation);
		formData.append('amount', pengeluaran.amount);
		formData.append('pay', selectedPay);

		await axios.post("https://journal-florist-staging.herokuapp.com/api/v1/expenses/add-expense", 
		formData, 
		config)
		.then(doc => {
			message.success(doc.data.message || "Pengeluaran Ditambahkan!")
			getData()
			setIsOpen(false)
		}).catch(err => {
			const e = err.response.data;
			if(e.code === 400 || e.status === 400) {
				message.error(e.message || e.error);
				return;
			} else if(e.code === 500 || e.status === 500) {
				message.error(e.message || e.error || "Internal server error");
				return;
			}
			
		})
	}

	function handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		setPengeluaran({
			...pengeluaran,
			[name]: value
		});
	}

	const getData = useCallback(async () => {
		try {
			await dispatch(fetchAllExpense(params)).unwrap()
		} catch (error) {
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [dispatch])

	useEffect(() => {
		getSuppliers()
		getData()
	}, [])

	const tableColumns = [
		{
			title: 'ID',
			dataIndex: 'expenseId',
			key: 'expenseId',
		},
		{
			title: 'Created Date',
			key: 'createdDate',
			dataIndex: 'createdDate',
		},
		{
			title: 'Created By',
			dataIndex: 'createdBy',
			key: 'createdBy',
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			sorter: (a, b) => a.amount - b.amount,
			render: (_, record) => (
				<div className="text-left">
					{formatter.format(record.amount)}
				</div>
			),
		},
		{
			title: 'Additional Info',
			dataIndex: 'additionalInfo',
			key: 'additionalInfo',
		},
		{
			title: 'Supplier Name',
			dataIndex: 'supplierName',
			key: 'supplierName',
			filters: [
				{
					text: 'Pak Miskan',
					value: 'Pak Miskan',
				},
				{
					text: 'Freesia Florist',
					value: 'Freesia Florist',
				},
				{
					text: 'Pak Umar',
					value: 'Pak Umar',
				},
				{
					text: 'Omni Florist',
					value: 'Omni Florist',
				},
				{
					text: 'WKF Wahana Maxima Flora',
					value: 'WKF Wahana Maxima Flora',
				},
				{
					text: 'Pak Paat',
					value: 'Pak Paat',
				},
				{
					text: 'Mantab',
					value: 'Mantab',
				},
				{
					text: 'Pak Narno',
					value: 'Pak Narno',
				},
			],
			onFilter: (value, record) => record.supplierName.startsWith(value),
		},
		{
			title: 'Pay For',
			dataIndex: 'payFor',
			key: 'payFor',
		}
	];

	return (
		<>
			<Modal
				isOpen={modalIsOpen}
				style={customStyles}
				contentLabel="Tambah Pengeluaran"
			>
				<h2 >Pengeluaran</h2>
				<Form name="basic" onFinish={tambahPengeluaran}>
					<Select
						mode="single"
						style={{
							width: '100%',
							color: "#FFFFFF",
							backgroundImage: "#FFFFFF"
						}}
						name="supplierId"
						placeholder="Select Suppliers"
						onChange={handleSelectedSupplier}
						optionLabelProp="label"
					>
						{suppliers?.map(doc => {
							return (
								<Option value={doc.id} label={doc.supplierName}>
									<div className="demo-option-label-item">
										{doc.supplierName}
									</div>
								</Option>
							)
						})}
					</Select>
					<Input name="additionalInformation" style={{ width: "100%", marginTop: "7px" }} onChange={handleInputChange} placeholder="Keterangan" />
					<Input name="amount" style={{ width: "100%", marginTop: "7px" }} onChange={handleInputChange} placeholder="Jumlah" />
					<Select
						mode="single"
						style={{
							width: '100%',
							color: "#FFFFFF",
							backgroundImage: "#FFFFFF",
							marginTop: "7px"
						}}
						name="pay"
						placeholder="Select Pay Type"
						onChange={handleSelectedPay}
						optionLabelProp="label"
					>
						<Option value={'OPERATIONAL'} label={'OPERATIONAL'}>OPERATIONAL</Option>
						<Option value={'SUPPLIERS'} label={'SUPPLIERS'}>SUPPLIERS</Option>
					</Select>
					<Input type='submit' style={{ width: "100%", color: "white", marginTop: "15px", backgroundColor: "green" }} value="Tambah" ></Input>
				</Form>
				<Button style={{backgroundColor:"red",color:"white",border:"red",width:"100%"}} onClick={()=>{setIsOpen(false)}} >Cancel</Button>
			</Modal>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<h2>Daftar Pengeluaran</h2>
					<p>Daftar semua data yang tersedia.</p>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Card title="Daftar Semua Pengeluaran" >
						<Table
							className="no-border-last"
							columns={tableColumns}
							dataSource={list}
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
					<Button type="primary" style={{ width: "100%" }} onClick={() => {
						setIsOpen(true)
					}}>Tambah Pengeluaran</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(EXPENSES);
