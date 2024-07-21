import {Col, Row, message, Select, DatePicker} from 'antd';
import React, {useState} from "react";
import {Button, Card, Form, Input} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useEffect, useCallback} from 'react';
import {useHistory} from 'react-router-dom/cjs/react-router-dom.min';
import {useDispatch, useSelector} from 'react-redux';
import {createLetter, fetchOneLetter} from "../../../../redux/features/letters";
import {
    familyStatus,
    gender, marriageStatus, religions, typeLetter,
    valueOfGender,
    valueOfMarriageStatus,
    valueOfReligion,
    valueOfTypeLetter,
} from "../../components/enums";
import Utils from "../../../../utils";
import {strings} from "../../../../res";
import {rules} from "../../../../res/rules";
import Flex from "../../../../components/shared-components/Flex";
import {PageHeaderAlt} from "../../../../components/layout-components/PageHeaderAlt";

const edit = Utils.ACTION_TYPE.EDIT

const formItemLayout = {
    wrapperCol: {
        xs: {span: 24, offset: 0},
    },
}
export const FormLetter = ({type = Utils.ACTION_TYPE.ADD, param}) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [role, setRole] = useState(null)
    const [statusAccount, setStatusAccount] = useState(null)

    const {
        selected: letter,
        isLoading,
        message: msgResponse,
    } = useSelector(state => state.letters)

    const getData = useCallback(async (id) => {
        try {
            await dispatch(fetchOneLetter(id)).unwrap()
                .then(data => {
                    console.log(letter)
                    form.setFieldsValue(data);
                })
                .catch(err => {
                    message.error(err?.message || `Product data failed to load`);
                })
        } catch (error) {
            message.error(error?.message || 'Failed to data')
        }
    }, [dispatch, letter, form])

    const onFinish = async (values) => {
        const request = {
            fullName: values.fullName,
            pob: values.pob,
            dob: Utils.formatDateToLocal(values.dob),
            gender: type === edit ? valueOfGender(values.gender) : values.gender,
            nationality: values.nationality,
            religion: type === edit ? valueOfReligion(values.religion) : values.religion,
            nik: values.nik,
            marriageStatus: type === edit ? valueOfMarriageStatus(values.marriageStatus) : values.marriageStatus,
            jobType: values.jobType,
            address: values.address,
            types: type === edit ? valueOfTypeLetter(values.types) : values.types,
        };
        console.log(request)

        await dispatch(createLetter(request)).unwrap()
            .then(async () => {
                history.push(strings.navigation.path.letters.list);
                message.success("Berhasil manambahkan data")
            })
            .catch((err) => {
                message.error(err.message)
            })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole)

        const statusAccountUser = localStorage.getItem('status');
        setStatusAccount(statusAccountUser)

        if (param) {
            getData(param)
        }
    }, [])

    const title = type === edit
        ? 'Detail Informasi Surat Pengajuan'
        : 'Surat Pengajuan Baru'

    const onCancel = (e) => {
        history.push(strings.navigation.path.letters.list)
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
                    <Card title={letter?.letterId}>
                        <Form
                            labelCol={{xs: {span: 8}}}
                            wrapperCol={{sm: 12}}
                            name="basic"
                            form={form}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off">
                            {role === 'ADMIN' && (
                                <>
                                    <Form.Item
                                        name="fullName"
                                        label="Nama"
                                        rules={rules.citizen.field.fullName}>
                                        <Input placeholder="Nama Lengkap"/>
                                    </Form.Item>
                                    <Form.Item
                                        rules={rules.citizen.field.placeOfBirth}
                                        name="pob"
                                        label="Tempat Lahir">
                                        <Input placeholder="Tempat kelahiran"/>
                                    </Form.Item>
                                    <Form.Item
                                        name="dob"
                                        label="Tanggal Lahir"
                                        rules={rules.citizen.field.dateOfBirth}
                                    >
                                        <DatePicker placeholder="Pilih Tanggal" format="DD/MM/YYYY"/>
                                    </Form.Item>
                                    <Form.Item
                                        name="gender"
                                        label="Jenis Kelamin"
                                        rules={rules.citizen.field.gender}
                                    >
                                        <Select
                                            style={{width: "40%"}}
                                            options={gender}
                                            placeholder="Jenis Kelamin"
                                            // onChange={ onChangeGender }
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        rules={rules.citizen.field.nationality}
                                        name="nationality"
                                        label="Kewarganegaraan">
                                        <Input placeholder="Kewarganegaraan"/>
                                    </Form.Item>
                                    <Form.Item
                                        rules={rules.citizen.field.religion}
                                        name="religion"
                                        label="Agama">
                                        <Select
                                            options={religions}
                                            style={{width: "40%"}}
                                            placeholder="Pilih Salah Satu"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="nik"
                                        label="NIK"
                                        rules={rules.citizen.field.nik}>
                                        <Input placeholder="Nomor Induk Kependudukan"/>
                                    </Form.Item>
                                    <Form.Item
                                        name="familyStatus"
                                        label="Status Keluarga"
                                        rules={rules.citizen.field.familyStatus}
                                    >
                                        <Select
                                            // value={ selectedFamilyStatus }
                                            options={familyStatus}
                                            placeholder="Pilih salah satu"
                                            // onChange={ onChangeFamilyStatus }
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="marriageStatus"
                                        label="Status Perkawinan"
                                        rules={rules.citizen.field.marriageStatus}
                                    >
                                        <Select
                                            // value={ selectedMarriageStatus }
                                            options={marriageStatus}
                                            placeholder="Status pernikahan"
                                            // onChange={ onChangeMarriageStatus }
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="jobType"
                                        rules={rules.citizen.field.jobType}
                                        label="Pekerjaan"
                                    >
                                        <Input style={{width: "80%"}} placeholder="Pekerjaan"/>
                                    </Form.Item>
                                    <Form.Item
                                        rules={rules.citizen.field.address}
                                        name="address"
                                        label="Alamat">
                                        <Input placeholder="Alamat"/>
                                    </Form.Item>
                                    <Form.Item
                                        rules={rules.citizen.field.letterType}
                                        name="type"
                                        label="Jenis Pengajuan">
                                        <Select options={typeLetter} placeholder="Pilih salah satu"/>
                                    </Form.Item>
                                </>
                            )}

                            {role === 'CITIZEN' && (
                                <>
                                    <Form.Item
                                        rules={rules.citizen.field.nationality}
                                        name="nationality"
                                        label="Kewarganegaraan">
                                        <Input placeholder="Kewarganegaraan"/>
                                    </Form.Item>
                                    <Form.Item
                                        rules={rules.citizen.field.letterType}
                                        name="types"
                                        label="Jenis Pengajuan">
	                                    <Select
		                                    options={typeLetter}
		                                    mode="multiple"
		                                    placeholder="Pilih jenis pengajuan (Bisa lebih dari 1)"/>
                                    </Form.Item>
                                </>

                            )}

                            <Form.Item {...formItemLayout}>
                                <Button
                                    icon={<PlusOutlined/>}
                                    type="primary"
                                    htmlType="submit"
                                    style={{width: "100%"}}
                                    loading={isLoading}
                                >
                                    {type === edit ? 'Simpan' : 'Buat Pengajuan'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default FormLetter