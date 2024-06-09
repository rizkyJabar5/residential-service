import { Col, Row, message, TimePicker } from 'antd';
import React, { useState } from "react";
import { Table, Card, Form, Input, Button, Select, DatePicker } from 'antd';

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchOneOrder, updateOrder, createOrder } from "redux/features/orders"
import { fetchAllCustomer } from "redux/features/customers"
import { fetchAllProduct } from "redux/features/products"
import Modal from 'react-modal';
import axios from 'axios';
import moment from 'moment';

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

export const DETAILPRODUCT = () => {

  const history = useHistory()
  const location = useLocation();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(0);
  const [allCustomers, setAllCustomers] = useState([])
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [selectedProduct, setSelectedProduct] = useState({})
  const [penerima, setPenerima] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState([])
	const [orderStatus, setOrderStatus] = useState("")
  const [allProducts, setAllProducts] = useState([])

  const handleOrderStatus = (value)=>{
    setOrderStatus(value)
  }

  function onChangeDate(value) {
    console.log(moment(value).format('DD-MM-YYYY'))

    setDate(moment(value).format('DD-MM-YYYY'))  }

  function onChangeTime(value) {
    setTime(value)
  }

  function onOk(value) {
    console.log(moment(value).format('HH:mm'))
    setTime(moment(value).format('HH:mm'))
  }

  const handleChangeCustomer = (value) => {
    setSelectedCustomer(value)
  };

  function showModal() {
    setIsOpen(true);
  }

  const tambahProduct = (event) => {
    setSelectedProducts([...selectedProducts, {
      ...selectedProduct,
      quantity: quantity
    }])
    setIsOpen(false)
    event.preventDefault();
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  const handleChangeQuantity = (event) => {
    setQuantity(event.target.value)
  }

  const handleChangeProduct = async (value) => {
    const selected = allProducts.find(product => product.productId === value) || {}
    setSelectedProduct({
      ...selected,
      quantity: quantity
    })
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const product = useSelector(state => state.products)

  const getData = useCallback(async (id) => {
    try {
      await dispatch(fetchOneOrder(id)).unwrap().then(data => {
        form.setFieldsValue(product.list[0]);
      })
        .catch(err => {
          message.error(err?.message || `Product data failed to load`);
        })

    } catch (error) {
      message.error(error?.message || 'Failed to data')
    }
  }, [dispatch])

  const getCustomers = useCallback(async () => {
    try {
      await dispatch(fetchAllCustomer()).unwrap().then(doc => {
        setAllCustomers(doc)
      })
    } catch (error) {
      message.error(error?.message || 'Failed to fetch data')
    }
  }, [dispatch])

  const getProducts = useCallback(async () => {
    try {
      await dispatch(fetchAllProduct()).unwrap().then(doc => {
        setAllProducts(doc)
      })
    } catch (error) {
      message.error(error?.message || 'Failed to fetch data')
    }
  }, [dispatch])

  const onFinish = async (values) => {
    console.log({
      selectedCustomer,
      selectedProducts
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const createOrder = async () => {

    const config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': "*"
      }
    }

    await axios.post("https://journal-florist-staging.herokuapp.com/api/v1/orders/add-order", {
      "customerId": selectedCustomer,
      "detailProduct": selectedProducts,
      "paymentAmount": penerima.paymentAmount,
      "orderStatus": orderStatus,
      "recipientName": penerima.namaPenerima,
      "address": {
        "street": penerima.alamatPenerima,
        "city": penerima.city,
        // "province": penerima.province,
        // "country": penerima.country,
        "zip": penerima.zip
      },
      "dateDelivery": date,
      "timeDelivery": time
    }, config)
    .then(doc => {
      message.success(doc.data.message)
      history.push("/app/orders")
    }).catch(err => {
      const resp = err.response.data;
      
      if(resp.status === 400) {
        message.error(resp.message || "Masukkan data dengan benar");
        return;
      } else if(resp.status === 500) {
        message.error(resp.message || "Sorry, maybe server Error!");
        return;
      }
      message.error(resp.message)
    })

  }

  const changePenerima = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setPenerima({
      ...penerima,
      [name]: value
    });
  }

  useEffect(() => {
    getCustomers()
    getProducts()
    if (location.id) {
      getData(location.id)
    }
  }, [])

  const tableColumns = [
    {
      title: 'ID Produk',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Nama',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Tambah Produk"
      >
        <h2 >Halo Tambahkan Produk</h2>
        <form onSubmit={tambahProduct}>
          <Select
            mode="single"
            style={{
              width: '100%',
              color: "#FFFFFF",
              backgroundImage: "#FFFFFF"
            }}
            name="barang"
            placeholder="Select Product"
            onChange={handleChangeProduct}
            optionLabelProp="label"
          >
            {allProducts?.map(doc => {
              return (
                <Option value={doc.productId} label={doc.productName}>
                  <div className="demo-option-label-item">
                    {doc.productName}
                  </div>
                </Option>
              )
            })}
          </Select>
          <br />
          <br />
          <Input name="quantity" rules={rules} style={{ width: "100%" }} onChange={handleChangeQuantity} placeholder="Jumlah" />
          <Input type='submit' style={{ width: "100%", color: "white", marginTop: "15px", backgroundColor: "#777777" }} value="Tambah Produk" ></Input>
        </form>
        <Button style={{backgroundColor:"red",color:"white",border:"red",width:"100%"}} onClick={()=>{setIsOpen(false)}} >Cancel</Button>
      </Modal>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Detail Orders</h2>
          <p>Update data ini</p>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <h2>Info Pengirim</h2>
            <p>Pilih pengirim sesuai dengan customer kamu</p>
            <Form
              name="basic"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item name="namaPengirim">
                <Select
                  mode="single"
                  placeholder="Pilih Customer"
                  onChange={handleChangeCustomer}
                  optionLabelProp="label"
                >
                  {allCustomers?.map(doc => {
                    return (
                      <Option value={doc.customerId} label={doc.customerName + " | " + doc.companyName} style={{
                        width: '100%',
                        background: "#FFF"
                      }}>
                        <div className="demo-option-label-item">
                          {doc.customerName} | {doc.companyName}
                        </div>
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card title="Pilih Produk - Produk" >
            <Table
              className="no-border-last"
              columns={tableColumns}
              dataSource={selectedProducts}
              rowKey='productId'
              pagination={{
                pageSize: 10
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Button type="primary" onClick={showModal} style={{ width: "100%", marginTop: "10px" }}>
          Tambah Produk
        </Button>
      </Row>
      <Row style={{ marginBottom: "20px" }}>
        <Button type="primary" onClick={() => {
          setSelectedProducts([])
        }} style={{ width: "100%", color: "white", background: "red", marginTop: "10px", borderColor: "red" }}>
          Reset Produk
        </Button>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <h2>Info Penerima</h2>
            <p>Masukkan data penerima paket kamu</p>
            <Form
              name="basic"
              form={form}
              onFinishFailed={onFinishFailed}
              autoComplete="on"
            >
              <Form.Item name="orderStatus">
                {/* <Input onChange={changePenerima} name="orderStatus" style={{ width: "100%" }} placeholder="SENT, PENDING, TAKEN" /> */}
                <Select
                  mode="single"
                  style={{
                    width: '100%',
                    color: "#FFFFFF",
                    backgroundImage: "#FFFFFF",
                    marginTop: "7px"
                  }}
                  name="orderStatus"
                  placeholder="Order Status"
                  onChange={handleOrderStatus}
                  optionLabelProp="label"
                >
                  <Option value={'SENT'} label={'SENT'}>SENT</Option>
                  {/* <Option value={'PENDING'} label={'PENDING'}>PENDING</Option> */}
                  <Option value={'TAKEN'} label={'TAKEN'}>TAKEN</Option>
                </Select>
              </Form.Item>
              <Form.Item name="namaPenerima">
                <Input rules={rules} onChange={changePenerima} name="namaPenerima" style={{ width: "100%" }} placeholder="Nama" />
              </Form.Item>
              {/* <Form.Item name="noHpPenerima">
                <Input onChange={changePenerima} name="noHpPenerima" style={{ width: "100%" }} placeholder="No HP" />
              </Form.Item> */}
              <Form.Item name="alamatPenerima">
                <Input rules={rules} onChange={changePenerima} name="alamatPenerima" style={{ width: "100%" }} placeholder="Alamat" />
              </Form.Item>
              <Form.Item name="city">
                <Input rules={rules} onChange={changePenerima} name="city" style={{ width: "100%" }} placeholder="Kota" />
              </Form.Item>
              {/* <Form.Item name="province">
                <Input rules={rules} onChange={changePenerima} name="province" style={{ width: "100%" }} placeholder="Provinsi" />
              </Form.Item>
              <Form.Item name="country">
                <Input rules={rules} onChange={changePenerima} name="country" style={{ width: "100%" }} placeholder="Negara" />
              </Form.Item> */}
              <Form.Item name="zip">
                <Input rules={rules} onChange={changePenerima} name="zip" style={{ width: "100%" }} placeholder="Kode Pos" />
              </Form.Item>
              <Form.Item name="tanggal">
                <div>
                  <DatePicker style={{ width: "100%" }} placeholder="Select Date" format={'DD-MM-YYYY'} onChange={onChangeDate} />
                  <br />
                </div>
              </Form.Item>
              <Form.Item name="jam">
                <div>
                  <TimePicker style={{ width: "100%" }} placeholder="Select Time" format={'HH:mm'} onChange={onChangeTime} onOk={onOk} />
                  <br />
                </div>
              </Form.Item>
              <h3>Info Pembayaran</h3>
               <p>Masukkan jumlah pembayaran</p>
              <Form.Item name="Biaya">
                <Input onChange={changePenerima} name="paymentAmount" style={{ width: "100%" }} placeholder="Biaya (IDR)" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: "10px" }}>
        <Button type="primary" onClick={createOrder} style={{ width: "100%" }}>
          Membuat Order
        </Button>
      </Row>
    </>
  )
}

export default DETAILPRODUCT