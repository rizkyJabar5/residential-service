import { Col, Row, message } from 'antd';
import React from "react";
import { Button, Card, Form, Input } from 'antd';
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneSupplier, updateSupplier, createSupplier } from "redux/features/suppliers"

export const DETAILCUSTOMER = () => {

  const location = useLocation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customers)

  const getData = useCallback(async (id) => {
    try {
      await dispatch(fetchOneSupplier(id)).unwrap().then(data => {
        form.setFieldsValue(data.list[0]);
      })
        .catch(err => {
          message.error(err?.message || `Product data failed to load`);
        })
    } catch (error) {
      message.error(error?.message || 'Failed to data')
    }
  }, [dispatch])

  const onFinish = async (values) => {
    if (location.isAddNew) {
       dispatch(createSupplier({
        "supplierName": values.supplierName
      })).unwrap().then(doc=>{
        console.log(doc)
        message.info("Supplier Created!")
      }).catch(err=>{
        message.error(err.message)
      })
    } else {
      dispatch(updateSupplier({
        "supplierName": values.supplierName
      })).unwrap().then(doc=>{
        console.log(doc)
        message.info("Supplier Created!")
      }).catch(err=>{
        message.error(err.message)
      })
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (location.id) {
      getData(location.id)
    }
  }, [])

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Detail Supplier</h2>
          <p>Update data ini</p>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <h2>{customer?.selected?.question}</h2>
            <Form
              name="basic"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item name="supplierName" label="Nama">
                <Input placeholder="Nama" />
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

export default DETAILCUSTOMER