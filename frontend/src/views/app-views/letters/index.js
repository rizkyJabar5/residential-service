import {Button, Card, Col, Row, Table, message, Tag, Input, ConfigProvider, Modal, Popover, Menu} from 'antd';
import moment from 'moment';
import React, {useEffect, useState, useCallback} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, withRouter} from 'react-router-dom';
import {fetchAllLetter, downloadLetter, updateLetter} from 'redux/features/letters';
import Flex from "../../../components/shared-components/Flex";
import {
    PlusCircleOutlined,
    SearchOutlined,
    CloseCircleTwoTone,
    InfoCircleFilled,
    EyeOutlined,
} from "@ant-design/icons";
import {strings} from "../../../res";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import {CheckCircleOutline, SyncOutlined} from "@material-ui/icons";
import {debounce} from "lodash";

const DescriptionItem = ({title, content}) => (
    <div
        style={{
            fontSize: 14,
            lineHeight: '22px',
            marginBottom: 7,
            color: 'rgba(0,0,0,0.65)',
        }}
    >
        <p
            style={{
                marginRight: 8,
                display: 'inline-block',
                color: 'rgba(0,0,0,0.85)',
            }}
        >
            {title}:
        </p>
        {content}
    </div>
);


const ContentReview = ({
                           fullName,
                           pob,
                           dob,
                           jobType,
                           gender,
                           nationality,
                           religion,
                           nik,
                           marriageStatus,
                           address,
                           type,
                       }) => {

    return (
        <>
            <p
                style={{fontWeight: 'bold', fontSize: 14, marginBottom: 24}}
            >
                {type}
            </p>
            <Row>
                <Col span={24}>
                    <DescriptionItem title="Nama Lengkap" content={fullName}/>
                </Col>
                <Col span={12}>
                    <DescriptionItem
                        title="NIK"
                        content={nik}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Tempat Lahir" content={pob}/>
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Tanggal Lahir" content={dob}/>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Jenis Kelamin" content={gender}/>
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Agama" content={religion}/>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Kewarganegaraan" content={nationality}/>
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Status Perkawinan" content={marriageStatus}/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <DescriptionItem title="Alamat" content={address}/>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Pekerjaan" content={jobType}/>
                </Col>
            </Row>
        </>
    );
}

export const Letters = () => {
    const [visible, setVisible] = useState(false)
    const [letter, setLetter] = useState({})
    const history = useHistory()
    const dispatch = useDispatch();
    const [role, setRole] = useState(null)
    const [statusAccount, setStatusAccount] = useState(null)
    const [originalList, setOriginalList] = useState([])
    const [list, setList] = useState([])

    const {
        lettersData,
        isLoading,
        message: msgResponse,
        hasData,
    } = useSelector(state => state.letters)
    const [disabled, setDisabled] = useState(false)
    const user = JSON.parse(localStorage.getItem('user'))

    const getData = useCallback(async () => {
        const params = {
            page: 0,
            limit: 30,
        }

        try {
            const response = await dispatch(fetchAllLetter(params)).unwrap()
            const data = Array.isArray(response.data.content) ? response.data.content :[];
            console.log("ini : ", data)

            setOriginalList(data)
            setList(data)

        } catch (error) {
            message.error(error?.message || 'Data gagal dimuat')
        }
    }, [dispatch])

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole)

        const statusAccountUser = localStorage.getItem('status');
        setStatusAccount(statusAccountUser)

        getData()
    }, [getData])

    const onSearch = useCallback(debounce((value) => {
        if (!Array.isArray(originalList)) {
            console.error("originalList is not an array");
            return;
        }

        if (value === "") {
            setList(originalList);
        } else {
            const lowercasedValue = value.toLowerCase();
            const filteredData = originalList.filter(item =>
                (item.fullName && item.fullName.toLowerCase().includes(lowercasedValue)) ||
                (item.letterId && item.letterId.toLowerCase().includes(lowercasedValue)) ||
                (item.type && item.type.toLowerCase().includes(lowercasedValue))
            );
            setList(filteredData);
        }
    }, 300), [originalList]);

    const handleSearch = e => {
        const value = e.currentTarget.value.trim().toLowerCase();
        onSearch(value);
    };

    const approvedLetter = async (id) => {
        try {
            await dispatch(updateLetter({
                "letterId": id,
                "status": 7,
            })).unwrap()
            console.log(msgResponse)
            message
                .loading('Mengupdate pengajuan...', 2)
                .then(() => message.success('Anda telah menyetujui pengajuan'))
                .then(() => getData())
        } catch (error) {
            console.log(error)
            message.error(error?.message || 'Failed to delete data')
        }
    }

    const download = async (id) => {
        try {
            await dispatch(downloadLetter(id)).unwrap()
                .then((res) => {
                    const filename = res.headers['content-disposition']
                        .split(';')
                        .find(n => n.includes('filename='))
                        .replace('filename=', '')
                        .trim();
                    return {
                        data: res.data,
                        filename: filename,
                    }
                })
                .then((content) => {
                    const url = URL.createObjectURL(content.data);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = content.filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                })
        } catch (error) {
            console.log(error)
            message.error(error?.message || 'Failed to download data')
        }
    }

    const tableColumns = [
        {
            width: '15%',
            title: 'Tanggal Pengajuan',
            dataIndex: 'createdTime',
            render: (_, record) => (
                <div className="text-center">
                    {record.createdTime ? record.createdTime : moment().format("DD-MMM-YYYY")}
                </div>
            ),
        },
        {
            title: 'Nama',
            dataIndex: 'fullName',
            sorter: (a, b) => a.customerName.length - b.customerName.length,
            render: (_, record) => (
                <div className="text-left">
                    {record.fullName !== "NaN" ? record.fullName : "Anonim"}
                </div>
            ),
        },
        {
            title: 'Nomor Surat',
            dataIndex: 'letterId',
            key: 'letterId',
            render: (_, record) => (
                <div className="text-left">
                    {record.letterId !== "NaN" ? record.letterId : "Anonim"}
                </div>
            ),
        },
        {
            title: 'Jenis Permohonan',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Status Pengajuan',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => {
                const enums = {
                    "Pengajuan Ditolak": "red",
                    "Menunggu Review Sekretaris RT": "orange",
                    "Sedang direview Sekretaris RT": "orange",
                    "Sedang direview oleh RT": "orange",
                    "Pengajuan Disetujui RT": "blue",
                    "Sedang direview oleh Sekretaris RW": "orange",
                    "Sedang direview oleh RW": "blue",
                    "Pengajuan Telah Disetujui": "green",
                }
                return (
                    <span>
						<Tag color={enums[record.status]} key={record.status}>
							{record.status}
						</Tag>
					</span>
                )
            },
        },
        // {
        // 	title: () => <div className="text-center">Pelunasan</div>,
        // 	key: 'pelunasan',
        // 	render: (_, record) => (
        // 		<div className="text-center">
        // 			<a type="primary" style={{ width: "70%" }} onClick={() => {
        // 				setSelectedPaymentId(record.orderId)
        // 				setIsOpen(true)
        // 			}} >Lunasi</a>
        // 		</div>
        // 	),
        // },
        {
            title: '',
            colSpan: 2,
            key: 'status',
            render: (_, record) => {
                const approved = record.status === 'Pengajuan Telah Disetujui';
                const content = (
                    <span className="text-center" style={{color: 'rgba(52,49,49,0.76)'}}>
						<p>Pengajuan belum bisa di download</p>
						<p>Karena belum disetujui</p>
					</span>
                )
                return (
                    <div className="text-info">
                        <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
                            <Popover trigger="click" placement="top" content={!approved ? content : 'Unduh Pengajuan'}>
                                <InfoCircleFilled/>
                            </Popover>
                            <Button
                                disabled={!approved}
                                type="link"
                                onClick={async () => download(record.id)}>
                                Unduh
                            </Button>
                        </Flex>
                    </div>
                )
            },
        },
        {
            colSpan: 0,
            dataIndex: 'actions',
            render: (_, elm) => {
                const approved = elm.status === 'Pengajuan Telah Disetujui';
                return (
                    <div className="text-right">
                        <EllipsisDropdown menu={() =>
                            <Menu>
                                <Menu.Item onClick={() => showModal(elm)}>
                                    <Flex alignItems="center">
                                        <EyeOutlined/>
                                        <span className="ml-2">Review</span>
                                    </Flex>
                                </Menu.Item>
                                {
                                    approved
                                        ? null
                                        : user.role === 'ADMIN' &&
                                        <Menu.Item onClick={() => approvedLetter(elm.id)}>
                                            <Flex alignItems="center">
                                                {isLoading
                                                    ? <SyncOutlined/>
                                                    : <CheckCircleOutline style={{fontSize: '16px', color: '#00cc29'}}/>
                                                }
                                                <span className="ml-2">Setujui</span>
                                            </Flex>
                                        </Menu.Item>
                                }
                            </Menu>
                        }/>
                    </div>
                );
            },
        },
    ];

    const onCLickAdd = () => {
        history.push({pathname: strings.navigation.path.letters.add, isAddNew: true})
    }

    const customizeRenderEmpty = () => (
        <div style={{marginTop: 20, textAlign: 'center'}}>
            <CloseCircleTwoTone twoToneColor="red" style={{fontSize: 30}}/>
            <p style={{marginTop: 20}}>{msgResponse}</p>
        </div>
    );

    const showModal = async (record) => {
        if (user.role === 'SECRETARY_RT') {
            if (record.status === 'Menunggu Review Sekretaris RT') {
                await dispatch(updateLetter({
                    "letterId": record.id,
                    "status": 2,
                })).unwrap()
                getData()
            }
            const isStatusScrectaryRT = record.status !== 'Sedang direview Sekretaris RT'
            console.log(isStatusScrectaryRT)
            setDisabled(isStatusScrectaryRT)
        } else if (user.role === 'RT') {
            const isStatusRT = record.status !== 'Sedang direview oleh RT'
            setDisabled(isStatusRT)
        } else if (user.role === 'SECRETARY_RW') {
            if (record.status === 'Pengajuan Disetujui RT') {
                await dispatch(updateLetter({
                    "letterId": record.id,
                    "status": 5,
                })).unwrap()
                getData()
            }

            const isStatusScrectaryRW = record.status !== 'Sedang direview oleh Sekretaris RW'
            setDisabled(isStatusScrectaryRW)
            if (record.status === 'Pengajuan Disetujui RT') {
                setDisabled(false)
            }
        } else if (user.role === 'RW') {
            const isStatusApproved = record.status === 'Pengajuan Telah Disetujui'
            setDisabled(isStatusApproved)
        } else if (user.role === 'ADMIN') {
            const isStatusApproved = record.status === 'Pengajuan Telah Disetujui'
            setDisabled(isStatusApproved)
        }

        setLetter(record);
        setVisible(true);
    };

    const handleOk = async (record) => {
        let status = 1;

        switch (user.role) {
            case 'SECRETARY_RT':
                status += 2;
                break;
            case 'RT':
                status += 3;
                break;
            case 'SECRETARY_RW':
                status += 5;
                break;
            case 'RW':
                status += 6;
                break;
            case 'ADMIN':
                status += 6;
                break;
            default:
                status -= 1
        }

        await dispatch(updateLetter({
            "letterId": record.id,
            "status": status,
        })).unwrap()
        message
            .loading('Sedang update data...', 2)
            .then(() => {
                message.success('Anda telah menyetujui pengajuan!')
                setVisible(false)
                setLetter({})
            })
            .then(() => getData())
    };

    const handleCancel = () => {
        setLetter({})
        setVisible(false)
    };

    return (
        <>
            <Modal
                centered
                closable={false}
                title={`Review Pengajuan ${letter.letterId}`}
                visible={visible}
                maskClosable={false}
                footer={[
                    <Button key="back" type="default" danger onClick={handleCancel}>
                        Batal
                    </Button>,
                    <Button key="submit" type="primary"
                            loading={isLoading}
                            onClick={() => handleOk(letter)}
                            disabled={disabled}
                            style={disabled ? {
                                backgroundColor: '#6dab5e',
                                color: '#babdb9'
                            } : {backgroundColor: 'green'}}>
                        {disabled ? 'Telah disejutui' : 'Setujui'}
                    </Button>,
                ]}
            >
                <ContentReview
                    fullName={letter.fullName}
                    pob={letter.pob}
                    dob={letter.dob}
                    gender={letter.gender}
                    nationality={letter.nationality}
                    religion={letter.religion}
                    nik={letter.nik}
                    marriageStatus={letter.marriageStatus}
                    jobType={letter.jobType}
                    type={letter.type}
                    address={letter.address}
                />
            </Modal>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Card title="Daftar Semua Pengajuan">
                        <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                            <Flex className="mb-1" mobileFlex={false}>
                                <div className="mr-md-3 mb-4">
                                    <Input
                                        placeholder="Nama/Nomor Surat/Jenis Permohonan"
                                        prefix={<SearchOutlined/>}
                                        onChange={handleSearch}/>
                                </div>
                            </Flex>
                            <div>
                                <Button
                                    onClick={onCLickAdd}
                                    type="primary"
                                    icon={<PlusCircleOutlined/>}
                                    block>
                                    Tambah
                                </Button>
                            </div>
                        </Flex>
                        <ConfigProvider renderEmpty={customizeRenderEmpty}>
                            <Table
                                loading={isLoading}
                                className="no-border-last"
                                columns={tableColumns}
                                dataSource={list}
                                rowKey="id"
                                pagination={{
                                    pageSize: 10,
                                }}
                            />
                        </ConfigProvider>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default withRouter(Letters);
