import React, { Component, useState } from 'react'
import { PrinterOutlined } from '@ant-design/icons';
import { Card, Table, Button, message } from 'antd';
import NumberFormat from 'react-number-format';
// import { fetchOneOrder } from "redux/features/letters"
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
	
const { Column } = Table;

export const INVOICE = () => {

	const dispatch = useDispatch()
	const location = useLocation()

	function total() {
		let total = 0;
		items.forEach((elm) => {
			total += elm.totalPricePerProduct * elm.quantity;
		})
		return total
	}

	let year = new Date().getFullYear()
	let month = new Date().getMonth()

	const fetchOneOrder = (id) =>{}

	const getData = useCallback(async (id) => {
		try {
			await dispatch(fetchOneOrder(id)).unwrap().then(data => {
				const dataSurat = data.data
				setOrder({
					id: dataSurat.id,
					orderId: dataSurat.orderId,
					deliveryDate: dataSurat.deliveryDate,
					deliveryTime: dataSurat.deliveryTime,
					customerName: dataSurat.customerName,
					deliveryAddress: dataSurat.deliveryAddress,
				})
				setItems(dataSurat.detailOfOrderProducts)
			})
				.catch(err => {
					message.error(err?.message || `Product data failed to load`);
				})
		} catch (error) {
			message.error(error?.message || 'Failed to data')
		}
	}, [dispatch])

	const [order, setOrder] = useState({
		deliveryDate: "12-12-2022",
		deliveryTime: "13.00",
		customerName: "Bambang",
		deliveryAddress: "Keputih",
	})

	const [items, setItems] = useState([])

	useEffect(() => {
		if (location.id) {
			getData(location.id)
		}
	}, [])

	return (
		<div className="container">
			<Card>
				<div className="d-md-flex justify-content-md-between">
					<div>
						<img style={{ width: "150px" }} src="/img/logo-colored.png" alt="" />
						<address>
							<h1 style={{ textAlign: "center" }}>Sekar Sari Florist</h1>
							<p>

								<span>Pasar Bunga Kayoon Stand C-28</span><br />
								<span>Jalan Kayoon Nomor 16</span><br />
								<span>Phone: 031-548-1745</span><br />
								<span>0857746097509</span>
							</p>
						</address>
					</div>
					<div className="mt-3 text-right">
						<h2 className="mb-1 font-weight-semibold">No Surat. Inv/Qs-{year}.{month + 1}.{order.id}</h2>
						<p>{order.deliveryDate}</p>
						<address>
							<p>
								<span className="font-weight-semibold text-dark font-size-md">{order.customerName}</span><br />
								<span>{order.deliveryAddress}</span><br />
							</p>
						</address>
					</div>
				</div>
				<div className="mt-4">
					<Table dataSource={items} pagination={false} className="mb-5">
						<Column title="ID" dataIndex="productId" key="productId" />
						<Column title="Nama" dataIndex="productName" key="productName" />
						<Column title="Quantity" dataIndex="quantity" key="quantity" />
						<Column title="Price"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round(text.totalPricePerProduct * 100) / 100).toFixed(2)}
									prefix={'IDR'}
									thousandSeparator={true}
								/>
							)}
							key="totalPricePerProduct"
						/>
						<Column
							title="Total"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round((text.totalPricePerProduct * text.quantity) * 100) / 100).toFixed(2)}
									prefix={'IDR'}
									thousandSeparator={true}
								/>
							)}
							key="total"
						/>
					</Table>
					<div className="d-flex justify-content-end">
						<div className="text-right ">
							<div className="border-bottom">
								<p className="mb-2">
									<span>Sub - Total amount: </span>
									<NumberFormat
										displayType={'text'}
										value={(Math.round((total()) * 100) / 100).toFixed(2)}
										prefix={'IDR'}
										thousandSeparator={true}
									/>
								</p>
								<p>vat (10%) : {Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'IDR',
									maximumSignificantDigits: 3
								}).format((Math.round(((total() / 100) * 10) * 100) / 100).toFixed(2))}</p>
							</div>
							<h2 className="font-weight-semibold mt-3">
								<span className="mr-1">Grand Total: </span>
								<NumberFormat
									displayType={'text'}
									value={((Math.round((total()) * 100) / 100) - (total() / 100) * 10).toFixed(2)}
									prefix={'IDR'}
									thousandSeparator={true}
								/>
							</h2>
						</div>
					</div>
					<p className="mt-5">
						<small>
							In exceptional circumstances, Financial Services can provide an urgent manually processed special cheque.
							Note, however, that urgent special cheques should be requested only on an emergency basis as manually
							produced cheques involve duplication of effort and considerable staff resources. Requests need to be
							supported by a letter explaining the circumstances to justify the special cheque payment
						</small>
					</p>
				</div>
				<hr className="d-print-none" />
				<div className="text-right d-print-none">
					<Button type="primary" onClick={() => window.print()}>
						<PrinterOutlined type="printer" />
						<span className="ml-1">Print</span>
					</Button>
				</div>
			</Card>
		</div>
	);
}

export default INVOICE