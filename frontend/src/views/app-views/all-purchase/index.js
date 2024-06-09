import { Button, Card, Col, Row, Table, message,Input,Select,Form } from 'antd';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import axios from 'axios';
import { fetchAllPurchase } from 'redux/features/purchase';
import { fetchAllSupplier } from 'redux/features/suppliers';
import Modal from 'react-modal';

const { Option } = Select;

const rules = [
	{
	  required: true,
	  message: 'Wajib memasukkan data!',
	},
  ]

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

export const PEMBELIAN = () => {
	
	const [modalIsOpen, setIsOpen] = React.useState(false)
	const [pembelian, setPembelian] = useState({})
	const [selectedSupplier, setSelectedSupplier] = useState("")
	const [suppliers, setSuppliers] = useState([])

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
	
	const dispatch = useDispatch();
	const {
		list
	} = useSelector(state => state.expenses)

	const params = {
		page: 1,
		limit: 30
	}

	const tambahPengeluaran = async (event) => {
		const dataBayar = {
			"supplierId":selectedSupplier,
			"productName": pembelian.productName,
			"price": pembelian.price,
			"quantity": pembelian.quantity
		  }

		const config = {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
				'Access-Control-Allow-Origin': "*",
				'Access-Control-Allow-Methods': "*"
			}
		}

		await axios.post("https://journal-florist-staging.herokuapp.com/api/v1/purchase/add-purchase", dataBayar, config).then(doc => {
			message.success("Pengeluaran Ditambahkan!")
			console.log(doc)
			getData()
			setIsOpen(false)
		}).catch(err => {
			console.log(err)
			setIsOpen(false)
			message.error(err.message)
		})
	}

	const getData = useCallback(async () => {
		try {
			await dispatch(fetchAllPurchase(params)).unwrap()
		} catch (error) {
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [dispatch])

	useEffect(() => {
		getSuppliers()
		getData()
	}, [])

	
	function handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		setPembelian({
			...pembelian,
			[name]: value
		});
	}

	const tableColumns = [
		{
			title: 'Supplier',
			dataIndex: 'supplierName',
			key: 'supplierName',
			render: (_, record) => (
				<>{record.suppliers?.supplierName}</>
			),
		},
		{
			title: 'Product Name',
			dataIndex: 'productName',
			key: 'productName',
			sorter: (a, b) => a.productName.length - b.productName.length,
		},
		{
			title: 'Harga',
			dataIndex: 'price',
			key: 'price',
			sorter: (a, b) => a.price - b.price,
			render: (_, record) => (
				<div className="text-left">
					{formatter.format(record.price)}
				</div>
			),
		},
		{
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
		},
		{
			title: 'Total',
			dataIndex: 'price',
			key: 'total',
			sorter: (a, b) => a.total - b.total,
			render: (_, record) => (
				<div className="text-left">
					{formatter.format(record.total)}
				</div>
			),
		}
	];

	return (
		<>
			<Modal
				isOpen={modalIsOpen}
				style={customStyles}
				contentLabel="Tambah Pengeluaran"
			>
				<h2 >Pembelian</h2>
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
					<Input rules={rules} name="productName" style={{ width: "100%",marginTop:"7px" }} onChange={handleInputChange} placeholder="Nama Produk" />
					<Input rules={rules} name="quantity" style={{ width: "100%",marginTop:"7px"  }} onChange={handleInputChange} placeholder="Jumlah" />
					<Input rules={rules} name="price" style={{ width: "100%",marginTop:"7px"  }} onChange={handleInputChange} placeholder="Harga" />
					<Input rules={rules} type='submit' style={{ width: "100%", color: "white", marginTop: "15px", backgroundColor: "green" }} value="Tambah" ></Input>
				</Form>
				<Button style={{backgroundColor:"red",color:"white",border:"red",width:"100%"}} onClick={()=>{setIsOpen(false)}} >Cancel</Button>
			</Modal>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<h2>Daftar Pembelian</h2>
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
								pageSize: 10
							}}
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Button type="primary" style={{ width: "100%" }} onClick={() => {
						setIsOpen(true)
					}}>Tambah Pembelian</Button>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(PEMBELIAN);
