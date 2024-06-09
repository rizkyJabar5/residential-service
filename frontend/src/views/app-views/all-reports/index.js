import { Col, Row, message } from 'antd';
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { Area, Column } from '@ant-design/plots';
import { fetchSumStore, fetchSumLedger, fetchExpenseSuppliers, fetchSales } from 'redux/features/reports';
import Loading from 'components/shared-components/Loading';
import { each, groupBy } from '@antv/util';

  
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'IDR',
	maximumSignificantDigits: 3
});

export const REPORTS = () => {

	const dispatch = useDispatch();
	const {
		store,
		ledger,
		sales,
        expenseSuppliers,
		loading: {
			query: loadingQuery,
		}
	} = useSelector(state => state.reports)

	console.log(sales)

	const getData = useCallback(async () => {
		try {
			await dispatch(fetchSumStore()).unwrap()
			await dispatch(fetchSumLedger()).unwrap()
			await dispatch(fetchExpenseSuppliers()).unwrap()
			await dispatch(fetchSales()).unwrap()			
		} catch (error) {
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [dispatch])

	useEffect(() => {
		getData()
	}, [getData])
	
	const expenseGraph = {
		xField: 'createdDate',
		yField: 'amount',
		xAxis: {
		  range: [0, 1],
		  tickCount: 30,
		},
		areaStyle: () => {
		  return {
			fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
		  };
		},
		slider: {
			start: 0.1,
			end: 0.9,
		  },
		seriesField: 'supplierName',
		smooth: true,
	  };

	  const salesGraph = {
		xField: 'saleToday',
		yField: 'saleAmount',
		xAxis: {
		  range: [0, 1],
		  tickCount: 30,
		},
		slider: {
			start: 0.1,
			end: 0.4,
		},
		  
		seriesField: 'customerName',
		smooth: true,
		isStack: true,
	  };

	return (
		<>
			{
				!loadingQuery && store && ledger && (
					<>
						<Row gutter={24}>
							<Col xs={24} sm={24} md={24} lg={24}>
								<h2>Summary</h2>
								<p>Daftar semua data yang tersedia.</p>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								<h2>Info Store</h2>
							</Col>
							<Col xs={24} sm={24} md={24} lg={24}>
								
								<Row gutter={16}>
									<Col xs={12} sm={12} md={12} lg={12} xl={12}>
										<StatisticWidget
											style={{ textAlign: "Left" }}
											title={'Total Products'}
											value={store.totalProducts}
										/>
									</Col>
									<Col xs={12} sm={12} md={12} lg={12} xl={12}>
										<StatisticWidget
											style={{ textAlign: "center" }}
											title={'Total Customers'}
											value={store.totalCustomers}
										/>
									</Col>								
								</Row>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col xs={12} sm={12} md={12} lg={12}>
								<StatisticWidget
									style={{ textAlign: "left" }}
									title={'Expense in month'}
									value={<Area data={expenseSuppliers} {...expenseGraph} />}
								/>
									
							</Col>
							<Col xs={12} sm={12} md={12} lg={12}>
								<StatisticWidget
									style={{ textAlign: "left" }}
									title={'Total Sales'}
									value={<Column data={sales} {...salesGraph} />}
								/>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								<h2>Debts & Receivables</h2>
							</Col>
							<Col xs={12} sm={12} md={12} lg={12} xl={12}>
								<StatisticWidget
									style={{ textAlign: "center" }}
									title={'Account Receiveable'}
									value={formatter.format(ledger.accountReceivable)}
								/>
								<StatisticWidget
									style={{ textAlign: "center" }}
									title={'Gross Sales Today'}
									value={formatter.format(store.grossSalesToday)}
								/>
							</Col>
							<Col xs={12} sm={12} md={12} lg={12} xl={12}>
								<StatisticWidget
									style={{ textAlign: "center" }}
									title={'Debt Store'}
									value={formatter.format(ledger.debtStore)}
								/>
								<StatisticWidget
									style={{ textAlign: "center" }}
									title={'Total Gross Sales'}
									value={formatter.format(ledger.totalGrossSales)}
								/>
							</Col>
						</Row>
					</>
				)
			}
			{
				loadingQuery && <Loading />
			}
		</>
	)
}


export default withRouter(REPORTS);
