import React, {useEffect, useState} from 'react';
import {
    Button, Card,
    Col, DatePicker,
    Form,
    Input, Modal,
    Row, Select,
} from "antd";
import {
    bloodType,
    familyStatus,
    gender,
    latestEducation,
    religions,
    marriageStatus,
    valueOfReligion,
    valueOfFamilyStatus,
    valueOfBloodType,
    valueOfGender,
    valueOfMarriageStatus,
    valueOfLatestEducation,
} from "../../components/enums";
import {rules} from "../../../../res/rules";
import {PageHeaderAlt} from "../../../../components/layout-components/PageHeaderAlt";
import Flex from "../../../../components/shared-components/Flex";
import PropTypes from "prop-types";
import {useLocation} from "react-router-dom";

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};


const ADD = 'ADD'

const FormCitizen = ({
                         form, onFinish, onFinishFailed, title, submitLoading, type, onCancel, header, selected,
                     }) => {
    const [selectedGender, setSelectedGender] = useState(valueOfGender(selected.gender))
    const [selectedReligion, setSelectedReligion] = useState(valueOfReligion(selected.religion))
    const [selectedLatestEducation, setSelectedLatestEducation] = useState(valueOfLatestEducation(selected.latestEducation))
    const [selectedFamilyStatus, setSelectedFamilyStatus] = useState(valueOfFamilyStatus(selected.familyStatus))
    const [selectedBloodType, setSelectedBloodType] = useState(valueOfBloodType(selected.bloodType))
    const [selectedMarriageStatus, setSelectedMarriageStatus] = useState(valueOfMarriageStatus(selected.marriageStatus))

    const onChangeGender = (e) => setSelectedGender(e)
    const onChangeReligion = (e) => setSelectedReligion(e)
    const onChangeEducation = (e) => setSelectedLatestEducation(e)
    const onChangeFamilyStatus = (e) => setSelectedFamilyStatus(e)
    const onChangeBloodType = (e) => setSelectedBloodType(e)
    const onChangeMarriageStatus = (e) => setSelectedMarriageStatus(e)

    const location = useLocation();
    const [notification, setNotification] = useState(null);
    const [role, setRole] = useState(null)
    const [statusAccount, setStatusAccount] = useState(null)

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole)

        const statusAccountUser = localStorage.getItem('status');
        setStatusAccount(statusAccountUser)

        if (location.state && location.state.message) {
            setNotification(location.state.message);
        }
    }, [location.state]);

    const handleOk = () => {
        setNotification(null);
    };

    return (

        <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
                latestEducation: null,
                familyStatus: null,
                bloodType: null,
                marriageStatus: null,
                gender: null,
                religion: null,
            }}
            autoComplete="off"
            scrollToFirstError
        >

            <PageHeaderAlt className="bg-white border-bottom">
                <div className="container">
                    <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
                        <h2 className="mb-3">{header} </h2>
                        <div className="mb-3">
                            {statusAccount !== 'VERIFIED' && (
                                <Button className="mr-2" onClick={onCancel}>Batal</Button>
                            )}
                            <Button type="primary" htmlType="submit" loading={submitLoading}>
                                {type === ADD ? 'Tambah' : `Simpan`}
                            </Button>
                        </div>
                    </Flex>
                </div>
            </PageHeaderAlt>
            <Card title={title}>
                <Row gutter={8}>
                    {((role === 'CITIZEN' && statusAccount === 'VERIFIED') || role === 'ADMIN') && (
                        <Col span={12}>
                            <Form.Item
                                name="kkId"
                                label="No. KK"
                                rules={rules.citizen.field.kkId}>
                                <Input placeholder="Masukkan Nomor Kartu Keluarga anda"/>
                            </Form.Item>
                        </Col>
                    )}

                    <Col span={12}>
                        <Form.Item
                            name="nik"
                            label="NIK"
                            rules={rules.citizen.field.nik}>
                            <Input placeholder="Masukkan Nomor Induk Kependudukan anda"/>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="fullName"
                    label="Nama Lengkap"
                    rules={rules.citizen.field.fullName}>
                    <Input placeholder="Masukkan Nama Lengkap Anda"/>
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Jenis Kelamin"
                    rules={rules.citizen.field.gender}
                >
                    <Select
                        value={selectedGender}
                        options={gender}
                        placeholder="Jenis Kelamin"
                        onChange={onChangeGender}
                    />
                </Form.Item>

                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="pob"
                            label="Tempat Lahir"
                            rules={rules.citizen.field.placeOfBirth}
                        >
                            <Input placeholder="Masukkan tempat lahir anda"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="dob"
                            label="Tanggal Lahir"
                            rules={rules.citizen.field.dateOfBirth}
                        >
                            <DatePicker placeholder="Pilih Tanggal" format="DD/MM/YYYY"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="religion"
                            label="Agama"
                            rules={rules.citizen.field.religion}
                        >
                            <Select
                                value={selectedReligion}
                                options={religions}
                                placeholder="Masukkan Agama"
                                onChange={onChangeReligion}/>
                        </Form.Item>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={12}>
                        <Form.Item
                            name="latestEducation"
                            label="Pendidikan Terakhir"
                            rules={rules.citizen.field.latestEducation}
                        >
                            <Select
                                value={selectedLatestEducation}
                                options={latestEducation}
                                placeholder="Pendidikan Terakhir"
                                onChange={onChangeEducation}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    style={{width: "30%"}}
                    name="bloodType"
                    label="Golongan Darah"
                    rules={rules.citizen.field.bloodType}
                >
                    <Select
                        value={selectedBloodType}
                        options={bloodType}
                        placeholder="Golongan Darah"
                        onChange={onChangeBloodType}/>
                </Form.Item>
            </Card>
            <Card>
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="familyStatus"
                            label="Status Keluarga"
                            rules={rules.citizen.field.familyStatus}
                        >
                            <Select
                                value={selectedFamilyStatus}
                                options={familyStatus}
                                placeholder="Status keluarga"
                                onChange={onChangeFamilyStatus}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="marriageStatus"
                            label="Status Perkawinan"
                            rules={rules.citizen.field.marriageStatus}
                        >
                            <Select
                                value={selectedMarriageStatus}
                                options={marriageStatus}
                                placeholder="Status pernikahan"
                                onChange={onChangeMarriageStatus}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    style={{width: "80%"}}
                    name="jobType"
                    label="Pekerjaan"
                    rules={rules.citizen.field.jobType}
                >
                    <Input placeholder="Masukkan pekerjaan anda"/>
                </Form.Item>

                {((role === 'CITIZEN' && statusAccount === 'VERIFIED') || role === 'ADMIN') && (
                    <Form.Item
                        name="address"
                        label="Alamat Rumah"
                        rules={rules.citizen.field.address}
                    >
                        <Input placeholder="Masukkan alamat rumah anda"/>
                    </Form.Item>
                )}
            </Card>

            <Modal
                title="Notification"
                visible={notification !== null}
                onOk={handleOk}
                onCancel={handleOk}
                footer={[
                    <Button key="submit" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <p>{notification}</p>
            </Modal>
        </Form>
    );
}

FormCitizen.propTypes = {
    children: PropTypes.node,
    onFinish: PropTypes.any.isRequired,
    onFinishFailed: PropTypes.any,
};

export {FormCitizen}