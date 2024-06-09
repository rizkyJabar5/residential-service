import { Col, Row, message } from 'antd';
import React from "react";
import { Button, Card, Form, Input } from 'antd';
import { useEffect, useCallback } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnePurchase, updatePurchase, addPurchase } from "redux/features/purchase"

export const DETAILPURCHASE = () => {

  const location = useLocation()
  const dispatch = useDispatch();
  const ticket = useSelector(state => state.ticket)

  const getData = useCallback(async (id) => {
    try {
      await dispatch(fetchOnePurchase(id)).unwrap()
    } catch (error) {
      message.error(error?.message || 'Failed to fetch data')
    }
  }, [dispatch])

  const onFinish = async (values) => {
    await addPurchase(values).then((res) => {
      return message.success("Pembelian Ditambahkan!")
    })
      .catch((err) => {
        return message.error(err.message)
      })
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
                label="Supplier ID"
                name="supplierId"
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                label="Product Name"
                name="productName"
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="quantity"
              >
                <Input></Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
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

export default DETAILPURCHASE