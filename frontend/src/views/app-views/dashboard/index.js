import { Col, Row, message } from 'antd';
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
  maximumSignificantDigits: 3
});


export const DefaultDashboard = () => {

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
      {/*<Row gutter={24}>*/}
      {/*  <Col xs={24} sm={24} md={24} lg={24}>*/}
      {/*    <Row gutter={24}>*/}
      {/*      <Col xs={24} sm={24} md={24} lg={24} xl={8}>*/}
      {/*        <StatisticWidget*/}
      {/*          style={{ textAlign: "center" }}*/}
      {/*          title={'Total Products'}*/}
      {/*          value="200000"*/}
      {/*        />*/}
      {/*      </Col>*/}
      {/*      <Col xs={24} sm={24} md={24} lg={24} xl={8}>*/}

      {/*        <StatisticWidget*/}
      {/*          style={{ textAlign: "center" }}*/}
      {/*          title={'Gross Sales Today'}*/}
      {/*          value={formatter.format(1000000)}*/}
      {/*        />*/}
      {/*      </Col>*/}
      {/*      <Col xs={24} sm={24} md={24} lg={24} xl={8}>*/}

      {/*        <StatisticWidget*/}
      {/*          style={{ textAlign: "center" }}*/}
      {/*          title={'Total Customers'}*/}
      {/*          value={90}*/}
      {/*        />*/}
      {/*      </Col>*/}
      {/*      <Col xs={24} sm={24} md={24} lg={24} xl={8}>*/}
      {/*        <StatisticWidget*/}
      {/*          style={{ textAlign: "center" }}*/}
      {/*          title={'Account Receiveable'}*/}
      {/*          value={formatter.format(900000)}*/}
      {/*        />*/}
      {/*      </Col>*/}
      {/*      <Col xs={24} sm={24} md={24} lg={24} xl={8}><StatisticWidget*/}
      {/*        style={{ textAlign: "center" }}*/}
      {/*        title={'Total Expense'}*/}
      {/*        value={formatter.format(90000)}*/}
      {/*      />*/}
      {/*      </Col>*/}
      {/*      <Col xs={24} sm={24} md={24} lg={24} xl={8}>*/}
      {/*        <StatisticWidget*/}
      {/*          style={{ textAlign: "center" }}*/}
      {/*          title={'Total Revenue'}*/}
      {/*          value={formatter.format(900000)}*/}
      {/*        />*/}
      {/*      </Col>*/}
      {/*    </Row>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
      {/* <PRODUCTS noTitle={true} ></PRODUCTS> */}
    </>
  )
}


export default withRouter(DefaultDashboard);
