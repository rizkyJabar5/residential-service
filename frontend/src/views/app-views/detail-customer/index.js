import { Col, Row, message } from 'antd';
import React from "react";
import { Button, Card, Form, Input } from 'antd';
import { useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneCustomer, createCustomer } from "redux/features/customers"

export const DETAILCUSTOMER = () => {
  const history = useHistory();
  const location = useLocation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customers)

  const getData = useCallback(async (id) => {
    try {
      await dispatch(fetchOneCustomer(id)).unwrap().then(data => {
        console.log(customer)
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
    // if (location.isAddNew) {
    //   dispatch(updateCustomer({
    //     id: customer.selected._id,
    //     answer: values.jawaban
    //   })).unwrap()
    //   message.success(values.data.message)
    // } else {
      dispatch(createCustomer({
        "customerName": values.customerName,
        "customerPhone": values.customerPhone,
        "companyName": values.companyName,
        "address": {
          "street": values.street,
          "city": values.city,
          // "province": values.province,
          // "country": values.country,
          "zip": values.zip
        }
      })).unwrap().then(doc=>{
        // message.success(doc.message)
        history.push('/app/customers')
      }).catch(err=>{
        console.log(err)
        message.error(err.error || err.data.message);
      })
    // }
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
          <h2>Detail Pelanggan</h2>
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
              <Form.Item name="customerName" label="Nama">
                <Input placeholder="Nama" />
              </Form.Item>
              <Form.Item name="customerPhone" label="No HP">
                <Input placeholder="No HP" />
              </Form.Item>
              <Form.Item name="companyName" label="Perusahaan">
                <Input placeholder="Perusahaan" />
              </Form.Item>
              <Form.Item name="street" label="Jalan">
                <Input placeholder="Jalan" />
              </Form.Item>
              <Form.Item name="city" label="Kota">
                <Input placeholder="Kota" />
              </Form.Item>
              {/* <Form.Item name="province" label="Provinsi">
                <Input placeholder="Provinsi" />
              </Form.Item>
              <Form.Item name="country" label="Negara">
                <Input placeholder="Negara" />
              </Form.Item> */}
              <Form.Item name="zip" label="Kode Pos">
                <Input placeholder="Kode Pos" />
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