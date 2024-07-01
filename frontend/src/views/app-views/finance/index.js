import {
    Button,
    Card,
    Col,
    Row,
    Table,
    message,
    Input,
    Space,
    ConfigProvider,
    Form,
    Modal,
    Upload,
    Tag,
    Menu
} from 'antd';
import React, {useEffect, useState, useCallback, useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, withRouter} from 'react-router-dom';
import Flex from "../../../components/shared-components/Flex";
import {CloseCircleTwoTone, EyeOutlined, PlusCircleOutlined, SearchOutlined, UploadOutlined} from "@ant-design/icons";
import {createFinance, fetchAllFinances} from "../../../redux/features/finances";
import {rules} from "../../../res/rules";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";

export const FINANCES = (props) => {
    const history = useHistory()
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [selectedFinance, setSelectedFinance] = useState(null);
    const [modalType, setModalType] = useState(null);
    const {
        listFinances,
        hasData,
        filter: {q: searchTerm},
        loading: {
            query: loadingQuery,
            mutation: loadingMutation
        },
        message: msgResponse,
    } = useSelector(state => state.finances)

    const params = {
        page: 0,
        limit: 10
    }

    const getData = useCallback(async () => {

        try {
            await dispatch(fetchAllFinances(params)).unwrap()
        } catch (error) {
            console.log(error)
            message.error(error?.message || 'Failed to fetch data')
        }
    }, [dispatch])

    useEffect(() => {
        getData()
    }, [])

    const tableColumns = [
        {
            title: 'Gambar',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl) => (
                <img
                    src={imageUrl}
                    alt="Gambar"
                    style={{width: '100px', height: 'auto'}}
                />
            ),
        },
        {
            title: 'Tanggal Pembayaran',
            dataIndex: 'tglPembayaran',
            key: 'tglPembayaran',
        },
        {
            title: 'Nama',
            dataIndex: ['citizen', 'fullName'],
            key: 'fullname',
        },
        {
            title: 'Alamat',
            dataIndex: ['citizen', 'homeAddress'],
            key: 'homeAddress',
        },
        {
            title: 'Email',
            dataIndex: ['appUserDto', 'email'],
            key: 'email'
        },
        {
            title: 'No.Telp',
            dataIndex: ['appUserDto', 'userInfo', 'phoneNumber'],
            key: 'phoneNumber',
        },
        {
            title: 'Actions',
            colSpan: 0,
            key: 'actions',
            render: (_, elm) => {
                return (
                    <div className="text-right">
                        <EllipsisDropdown menu={() => (
                            <Menu>
                                <Menu.Item onClick={() => showModal('review', elm)}>
                                    <Flex alignItems="center">
                                        <EyeOutlined/>
                                        <span className="ml-2">Review</span>
                                    </Flex>
                                </Menu.Item>
                            </Menu>
                        )}/>
                    </div>
                );
            }
        }
    ];

    const customizeRenderEmpty = () => (
        <div style={{marginTop: 20, textAlign: 'center'}}>
            <CloseCircleTwoTone twoToneColor="red" style={{fontSize: 30}}/>
            <p style={{marginTop: 20}}>{msgResponse}</p>
        </div>
    );

    const showModal = (type, finance) => {
        setModalType(type);
        setSelectedFinance(finance);
        setIsModalVisible(true);
    };


    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setSelectedFinance(null);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        const imageFile = values.imageUrl[0]?.originFileObj;

        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await dispatch(createFinance(formData)).unwrap();
            message.success("Sukses menambah data");
            setIsModalVisible(false);
            form.resetFields();
            await dispatch(fetchAllFinances(params)).unwrap();
        } catch (error) {
            console.error('Error creating finance:', error);
            message.error('Gagal .. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }

    };

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Card title="Daftar Laporan Keuangan">
                        <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                            <Flex className="mb-1" mobileFlex={false}>
                                <div className="mr-md-3 mb-4">
                                    <Input
                                        placeholder="Search"
                                        prefix={<SearchOutlined/>}
                                        // onChange={ e => onSearch(e) }
                                    />
                                </div>
                            </Flex>
                            <div>
                                <Button
                                    onClick={() => showModal('add')}
                                    icon={<PlusCircleOutlined/>}
                                    block
                                    type="primary"
                                >
                                    Tambah
                                </Button>
                            </div>
                        </Flex>
                        <ConfigProvider renderEmpty={customizeRenderEmpty}>
                            <Table
                                className="no-border-last"
                                columns={tableColumns}
                                dataSource={hasData ? listFinances : []}
                                rowKey='id'
                                pagination={{
                                    pageSize: 10
                                }}
                            />
                        </ConfigProvider>
                    </Card>
                </Col>
            </Row>
            <Modal
                title={modalType === 'add' ? 'Tambah Data' : 'Review Data'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Batal
                    </Button>,
                    modalType === 'add' && (
                        <Button key='submit' type="primary" form="financeForm" htmlType="submit" loading={loading}>
                            Simpan
                        </Button>
                    )
                ]}
            >
                {modalType === 'review' && selectedFinance && (
                    <div>
                        <p><strong>Gambar:</strong></p>
                        <img src={selectedFinance.imageUrl} alt="Gambar" style={{ maxWidth: '100%' }} />

                        <p><strong>Tanggal Pembayaran:</strong> {selectedFinance.tglPembayaran}</p>
                        <p><strong>Nama:</strong> {selectedFinance.citizen.fullName}</p>
                        <p><strong>Alamat:</strong> {selectedFinance.citizen.homeAddress}</p>
                        <p><strong>Email:</strong> {selectedFinance.appUserDto.email}</p>
                        <p><strong>No.Telp:</strong> {selectedFinance.appUserDto.userInfo.phoneNumber}</p>
                    </div>
                )}

                {modalType === 'add' && (
                    <Form
                        id="financeForm"
                        layout="vertical"
                        autoComplete="off"
                        form={form}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="imageUrl"
                            label="Gambar"
                            rules={[{required: true, message: rules.finance.field.imageUrl}]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload name="image" listType="picture" beforeUpload={() => false}>
                                <Button icon={<UploadOutlined/>}>Pilih Gambar</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                )}
            </Modal>

        </>
    )
}


    export default withRouter(FINANCES);
