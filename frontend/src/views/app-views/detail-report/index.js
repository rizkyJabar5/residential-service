import { Col, Row, message } from 'antd';
import React from "react";
import { Button, Card, Form, Input } from 'antd';
import { useEffect,useCallback } from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales, updateReport } from "redux/features/reports"

export const DETAILPRODUCT = () => {

  const location = useLocation()
  const dispatch = useDispatch();
  const ticket = useSelector(state => state.ticket)

  const getData = useCallback(async (id) => {
      try {
          await dispatch(fetchSales(id)).unwrap()
      } catch (error) {
          message.error(error?.message || 'Failed to fetch data')
      }
  }, [dispatch])

  const onFinish = async (values) => {
    dispatch(updateReport({
      id:ticket.selected._id,
      answer:values.jawaban
    })).unwrap()
    message.info("Answer Updated!")
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    // getData(location.id)
  }, [])

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Detail Produk</h2>
          <p>Update data ini</p>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <h2>{ticket?.selected?.question}</h2>
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Nama"
              name="nama"
            >
              <Input></Input>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                Submit
              </Button>
            </Form.Item>
          </Form>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default DETAILPRODUCT