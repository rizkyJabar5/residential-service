import { Col, Row, message } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import PRODUCTS from '../all-products';
import { fetchSumStore, fetchSumLedger } from 'redux/features/reports';


const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'IDR',
  maximumSignificantDigits:3
});


export const DefaultDashboard = () => {

  const dispatch = useDispatch();
  const {
    store,
    ledger,
    selectedRows,
    filter: { q: searchTerm },
    loading: {
      query: loadingQuery,
      mutation: loadingMutation
    }
  } = useSelector(state => state.reports)

  const getData = useCallback(async () => {
    try {
      await dispatch(fetchSumStore()).unwrap()
      await dispatch(fetchSumLedger()).unwrap()
    } catch (error) {
      message.error(error?.message || 'Failed to fetch data')
    }
  }, [dispatch])

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Dashboard</h2>
          <p>Summary analisa data aplikasi kali ini</p>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                style={{ textAlign: "center" }}
                title={'Total Products'}
                value={store.totalProducts}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>

              <StatisticWidget
                style={{ textAlign: "center" }}
                title={'Gross Sales Today'}
                value={formatter.format(store.grossSalesToday)}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>

              <StatisticWidget
                style={{ textAlign: "center" }}
                title={'Total Customers'}
                value={store.totalCustomers}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <StatisticWidget
											style={{ textAlign: "center" }}
											title={'Account Receiveable'}
											value={formatter.format(ledger.accountReceivable)}
										/>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}><StatisticWidget
              style={{ textAlign: "center" }}
              title={'Total Expense'}
              value={formatter.format(ledger.totalExpense)}
            />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                style={{ textAlign: "center" }}
                title={'Total Revenue'}
                value={formatter.format(ledger.totalRevenue)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <PRODUCTS noTitle={true} ></PRODUCTS>
    </>
  )
}


export default withRouter(DefaultDashboard);
