import {Col, Row, message, Select} from 'antd';
import React, {useState} from "react";
import {Button, Card, Form, Input, Checkbox} from 'antd';
import {useEffect, useCallback} from 'react';
import {useHistory} from 'react-router-dom/cjs/react-router-dom.min';
import {useDispatch, useSelector} from 'react-redux';
import {fetchOneUser, addNewStaff, addNewCitizen, updateAccountCitizen} from 'redux/features/user';
import Utils from "../../../../utils";
import {rules} from "../../../../res/rules";
import {strings} from "../../../../res";
import Flex from "../../../../components/shared-components/Flex";
import {PageHeaderAlt} from "../../../../components/layout-components/PageHeaderAlt";
import moment from "moment/moment";

const formItemLayout = {
    labelCol: {
        xs: {span: 10},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 12},
        sm: {span: 8},
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};
const EDIT = 'EDIT'

export const FormCitizen = ({type = Utils.ACTION_TYPE.ADD, param}) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {isLoading} = useSelector(state => state.accounts)
    const getData = useCallback(async (id) => {
        try {
            await dispatch(fetchOneUser(id)).unwrap()
                .then(data => {
                    form.setFieldsValue({
                        kkId: data.kkId,
                        phoneNumber: data.phoneNumber,
                    });
                })
                .catch(err => {
                    message.error(err?.message || `Category data failed to load`);
                });
        } catch (error) {
            message.error(error?.message || 'Failed to fetch data')
        }
    }, [dispatch, form])

    const onFinish = async (values) => {
        const request = {
            id: param,
            phoneNumber: values.phoneNumber,
            kkId: values.kkId,
        }
        if (type === Utils.ACTION_TYPE.ADD) {
            await dispatch(addNewCitizen(request)).unwrap()
            history.push(`${strings.navigation.path.users.list}`);
        }else {
            await dispatch(updateAccountCitizen(request)).unwrap()
            history.push(`${strings.navigation.path.users.list}`);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (param) {
            getData(param)
        } else {
            form.resetFields()
        }
    }, [getData, param])

    const title = type === Utils.ACTION_TYPE.ADD ? 'Tambah Akun Warga' : 'Detail Akun Warga'
    const labelSubmit = param ? 'Simpan' : 'Tambah Akun Warga'

    const onCancel = (e) => {
        history.push(strings.navigation.path.users.list)
    };

    return (
        <>
            <PageHeaderAlt className="bg-white border-bottom">
                <div className="container">
                    <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
                        <h2 className="mb-3">{title} </h2>
                        <div className="mb-3">
                            <Button type="primary" danger onClick={onCancel}>Batal</Button>
                        </div>
                    </Flex>
                </div>
            </PageHeaderAlt>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Card>
                        <Form
                            {...formItemLayout}
                            form={form}
                            name="basic"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Nomor Telepon"
                                name="phoneNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Masukkan nomor telepon',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="kkId"
                                label="Nomor KK"
                                rules={rules.citizen.field.kkId}>
                                <Input placeholder="Nomor Kartu Keluarga"/>
                            </Form.Item>

                            <Form.Item { ...tailFormItemLayout }>
                            	<Button
                            		type="primary"
                            		htmlType="submit"
                            		style={ { width: '50%' } }
                            		loading={ isLoading }
                            	>
                            		{ isLoading ? 'Menyimpan...' : labelSubmit }
                            	</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default FormCitizen