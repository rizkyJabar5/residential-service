import { Col, Row, message } from 'antd';
import React, { useState } from "react";
import { Button, Card, Form, Input, Select } from 'antd';
import { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneProduct } from "redux/features/products"
import { fetchAllCitizens } from "redux/features/citizens"
import axios from 'axios';
const { Option } = Select;

export const DETAILPRODUCT = () => {
  const history = useHistory()
  const location = useLocation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [allCategories, setAllCategories] = useState([])
  const [file, setFile] = useState()
  const [selectedCategory, setSelectedCategory] = useState({})
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }
  const product = useSelector(state => state.products)

  const getData = useCallback(async (id) => {
    try {
      await dispatch(fetchOneProduct(id)).unwrap().then(data => {
        form.setFieldsValue(product.list[0]);
      })
        .catch(err => {
          message.error(err?.message || `Product data failed to load`);
        })
    } catch (error) {
      message.error(error?.message || 'Failed to data')
    }
  }, [ dispatch, form, product.list ])

  const getCategories = useCallback(async () => {
    try {
      await dispatch(fetchAllCitizens()).unwrap().then(doc => {
        setAllCategories(doc)
      })
    } catch (error) {
      message.error(error?.message || 'Failed to fetch data')
    }
  }, [dispatch])

  const handleChangeCategory = (value) => {
    setSelectedCategory(value)
  };

  const onFinish = (event) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': "*"
      }
    }
    let formData = new FormData();
    if (location.isAddNew) {
      formData.append('productName', inputs.productName);
      formData.append('categoryKey', selectedCategory);
      formData.append('description', inputs.description);
      formData.append('costPrice', inputs.costPrice);
      formData.append('price', inputs.price);
      formData.append('image', file);
      axios.post("https://journal-florist-staging.herokuapp.com/api/v1/products/add-product", formData, config)
        .then(response => {
          message.success(response.data.message);
          history.push("/app/products")
        })
        .catch(error => {
          message.error(error.message)
          console.log(error);
        });
    } else {
      message.info("Coming Soon!")
    }
    event.preventDefault()
    
  };

  useEffect(() => {
    getCategories()
    if (location.id) {
      getData(location.id)
    }
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
            <h2>{product?.selected?.question}</h2>
            <form
              name="basic"
              onSubmit={onFinish}
            >
              <Form.Item name="categoryKey">
                <Select
                  mode="single"
                  style={{
                    width: '100%',
                    color: "#FFFFFF"
                  }}
                  name="categoryKey"
                  placeholder="Select Category"
                  onChange={handleChangeCategory}
                  optionLabelProp="label"
                >
                  {allCategories?.map(doc => {
                    return (
                      <Option value={`${doc.categoryId}`} label={`${doc.nameCategory}`} style={{
                        width: '100%',
                        background: "#FFF"
                      }}>
                        <div className="demo-option-label-item">
                          {`${doc.nameCategory}`}
                        </div>
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="productName">
                <Input name="productName" onChange={handleChange} placeholder="Nama Produk" />
              </Form.Item>
              <Form.Item name="costPrice">
                <Input name="costPrice" onChange={handleChange} placeholder="Cost Price" />
              </Form.Item>
              <Form.Item name="price">
                <Input name="price" onChange={handleChange} placeholder="Price" />
              </Form.Item>
              <Form.Item name="description">
                <Input name="description" onChange={handleChange} placeholder="Deskripsi" />
              </Form.Item>

              <Form.Item name="image">
                {/* <Upload >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload> */}
                <input  name="image" type="file" onChange={(e)=>{
                  setFile(e.target.files[0])
                }} ></input>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  Submit
                </Button>
              </Form.Item>
            </form>
          </Card>
        </Col>
        {/* <Col xs={6} sm={6} md={6} lg={6}>
          <Card>
            <img style={{width:"100%"}} src={product.list[0]?.picture}></img>
            <br></br>
            <br></br>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  Upload Image
                </Button>
          </Card>
        </Col> */}
      </Row>
    </>
  )
}

export default DETAILPRODUCT