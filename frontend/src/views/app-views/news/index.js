import {Button, Card, Col, Row, Table, message, Tag, Input, ConfigProvider, Modal, Popover, Menu} from 'antd';
import React, {useEffect, useState, useCallback} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, withRouter} from 'react-router-dom';
import Flex from "../../../components/shared-components/Flex";
import {
    PlusCircleOutlined,
    SearchOutlined,
    CloseCircleTwoTone,
} from "@ant-design/icons";
import {strings} from "../../../res";
import {fetchAllNews} from "../../../redux/features/news";
import Utils from "../../../utils";
import {debounce} from "lodash";

const DescriptionItem = ({title, content}) => (
    <div
        style={{
            fontSize: 14,
            lineHeight: '22px',
            marginBottom: 7,
            color: 'rgba(0,0,0,0.65)',
            fontWeight: 'bold',
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

const NewsTitle = ({title, publishedAt, publishedBy}) => {
    const Description = ({label, content}) => (<div
        style={{
            fontSize: 10,
            lineHeight: '22px',
            marginTop: -5,
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
            {label}:
        </p>
        {content}
    </div>);

    const datetime = Utils.convertDateTimeToLocal(publishedAt);
    return (
        <div>
            <p style={{
                fontSize: 16,
                lineHeight: '22px',
                color: 'rgba(0,0,0,0.65)',
            }}>
                {title}
            </p>
            <Description label="Disebarkan pada" content={datetime}/>
            <Description label="Disebarkan oleh" content={publishedBy}/>
        </div>
    );
}

const ContentReview = ({event, location, eventDate, startTime, endTime}) => {
    return (
        <>
            <Row>
                <Col span={24}>
                    <DescriptionItem title="Acara" content={event}/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <DescriptionItem title="Lokasi" content={location}/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <DescriptionItem title="Tanggal" content={eventDate}/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <DescriptionItem title="Pukul" content={`${startTime} WIB - ${endTime} WIB`}/>
                </Col>
            </Row>
        </>
    );
}

export const News = () => {
    const [visible, setVisible] = useState(false)
    const [news, setNews] = useState({})
    const history = useHistory()
    const dispatch = useDispatch();
    const {
        newsData,
        isLoading,
        message: msgResponse,
        hasData,
    } = useSelector(state => state.news)
    const user = JSON.parse(localStorage.getItem('user'))
    const [originalList, setOriginalList] = useState([])
    const [list, setList] = useState([])

    const getData = useCallback(async () => {
        const params = {
            page: 0,
            limit: 30,
        }

        try {
            const response = await dispatch(fetchAllNews(params)).unwrap()
            const data = Array.isArray(response.data.content) ? response.data.content : []
            console.log("ini data ",response)
            setOriginalList(data)
            setList(data)
        } catch (error) {
            message.error(error?.message || 'Data gagal dimuat')
        }
    }, [dispatch])

    useEffect(() => {
        getData()
    }, [getData])

    const tableColumns = [
        {
            title: 'Diterbitkan',
            dataIndex: 'publishedAt',
            render: (_, record) => (
                <div className="text-center">
                    {Utils.convertDateTimeToLocal(record.publishedAt)}
                </div>
            ),
        },
        {
            title: 'Judul Berita',
            dataIndex:
                'title',
            sorter:
                (a, b) => a.title.length - b.title.length,
            render:
                (_, record) => (
                    <div className="text-left">
                        {record.title !== "NaN" ? record.title : "Anonim"}
                    </div>
                ),
        }
        ,
        {
            title: 'Ditambahkan Oleh',
            dataIndex:
                'publishedBy',
            key:
                'publishedBy',
            render:
                (_, record) => (
                    <div className="text-left">
                        {record.publishedBy !== "NaN" ? record.publishedBy : "Anonim"}
                    </div>
                ),
        }
        ,
        {
            title: 'Aksi',
            key:
                'actions',
            dataIndex:
                'actions',
            render:
                (_, elm) => {
                    return (
                        <div className="text-right">
                            <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
                                <Button
                                    type="primary"
                                    onClick={async () => showModal(elm)}>
                                    Lihat Berita
                                </Button>
                            </Flex>
                            {/*<EllipsisDropdown menu={ () =>*/}
                            {/*	<Menu>*/}
                            {/*		<Menu.Item onClick={ () => showModal(elm) }>*/}
                            {/*			<Flex alignItems="center">*/}
                            {/*				<EyeOutlined/>*/}
                            {/*				<span className="ml-2">Review</span>*/}
                            {/*			</Flex>*/}
                            {/*		</Menu.Item>*/}
                            {/*	</Menu>*/}
                            {/*}/>*/}
                        </div>
                    );
                },
        }
        ,
    ];

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
                (item.title && item.title.toLowerCase().includes(lowercasedValue))
            );
            setList(filteredData);
        }
    }, 300), [originalList]);

    const handleSearch = e => {
        const value = e.currentTarget.value.trim().toLowerCase();
        onSearch(value);
    };

    const onCLickAdd = (e) => {
        e.preventDefault()
        history.push({pathname: strings.navigation.path.news.add, isAddNew: true})
        // setVisible(true)
    }

    const customizeRenderEmpty = () => (
        <div style={{marginTop: 20, textAlign: 'center'}}>
            <CloseCircleTwoTone twoToneColor="red" style={{fontSize: 30}}/>
            <p style={{marginTop: 20}}>{msgResponse}</p>
        </div>
    );

    const showModal = async (record) => {
        setNews(record);
        setVisible(true);
    };

    const handleOk = async (record) => {
        if (user.role === 'CITIZEN') {
            setVisible(false)
        } else {
            history.push(`${strings.navigation.path.news.edit}/${record.id}`)
        }
    };

    const handleCancel = () => {
        setNews({})
        setVisible(false)
    };

    return (
        <>
            <Modal
                centered
                closable={false}
                title={<NewsTitle title={news.title} publishedAt={news.publishedAt} publishedBy={news.publishedBy}/>}
                visible={visible}
                maskClosable={false}
                footer={[
                    <Button key="back" type="text" danger onClick={handleCancel}>
                        Tutup
                    </Button>,
                    <Button key="submit" type="primary"
                            loading={isLoading}
                            onClick={() => handleOk(news)}
                            style={user.role === 'CITIZEN' ? {backgroundColor: 'green'} : {backgroundColor: 'blue'}}>
                        {user.role === 'CITIZEN' ? 'Datang' : 'Ubah Berita'}
                    </Button>,
                ]}
            >
                <ContentReview
                    endTime={news.endTime}
                    startTime={news.startTime}
                    location={news.location}
                    event={news.event}
                    eventDate={news.eventDate}
                    publishedAt={news.publishedAt}
                    publishedBy={news.publishedBy}
                    content={news.content}
                />
            </Modal>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Card title="Daftar Semua Berita">
                        <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                            <Flex className="mb-1" mobileFlex={false}>
                                <div className="mr-md-3 mb-4">
                                    <Input
                                        placeholder="Judul Berita"
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
                                    Tambah Berita
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
    );
}

export default withRouter(News);
