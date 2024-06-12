import { Col, Row, message } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PRODUCTS from '../all-products';
import { fetchSumStore, fetchSumLedger } from 'redux/features/reports';


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
  maximumSignificantDigits: 3
});


export const DefaultDashboard = () => {

  const dispatch = useDispatch();
  // const { store, ledger } = useSelector(state => state.reports)

  // const getData = useCallback(async () => {
  //   try {
  //     await dispatch(fetchSumStore()).unwrap()
  //     await dispatch(fetchSumLedger()).unwrap()
  //   } catch (error) {
  //     message.error(error?.message || 'Failed to fetch data')
  //   }
  // }, [dispatch])

  useEffect(() => {
    // getData()
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
                value="200000"
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>

              <StatisticWidget
                style={{ textAlign: "center" }}
                title={'Gross Sales Today'}
                value={formatter.format(1000000)}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>

              <StatisticWidget
                style={{ textAlign: "center" }}
                title={'Total Customers'}
                value={90}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                style={{ textAlign: "center" }}
                title={'Account Receiveable'}
                value={formatter.format(900000)}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}><StatisticWidget
              style={{ textAlign: "center" }}
              title={'Total Expense'}
              value={formatter.format(90000)}
            />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                style={{ textAlign: "center" }}
                title={'Total Revenue'}
                value={formatter.format(900000)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <PRODUCTS noTitle={true} ></PRODUCTS> */}
    </>
  )
}


export default withRouter(DefaultDashboard);
