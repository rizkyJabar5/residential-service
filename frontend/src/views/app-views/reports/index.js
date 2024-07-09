import {Button, Card, Col, Row, Table, message, Input, Space, ConfigProvider} from 'antd';
import React, {useEffect, useState, useCallback, useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, withRouter} from 'react-router-dom';
import {fetchAllReports} from "../../../redux/features/reports";
import Flex from "../../../components/shared-components/Flex";
import {CloseCircleTwoTone, PlusCircleOutlined, SearchOutlined} from "@ant-design/icons";
import {strings} from "../../../res";
import {debounce} from "lodash";

export const REPORTS = (props) => {
    const history = useHistory()
    const dispatch = useDispatch();
    const [originalList, setOriginalList] = useState([])
    const [list, setList] = useState([])
    const [role, setRole] = useState(null)

    const {
        listReports,
        hasData,
        filter: {q: searchTerm},
        loading: {
            query: loadingQuery,
            mutation: loadingMutation
        },
        message: msgResponse,
    } = useSelector(state => state.reports)

    const params = {
        page: 0,
        limit: 30
    }

    const getData = useCallback(async () => {

        try {
            const response = await dispatch(fetchAllReports(params)).unwrap()
            const data = Array.isArray(response.data.content) ? response.data.content : []
            console.log("ini log : ", data)
            setOriginalList(data)
            setList(data)

        } catch (error) {
            console.log(error)
            message.error(error?.message || 'Failed to fetch data')
        }
    }, [dispatch])

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole)

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
                (item.name && item.name.toLowerCase().includes(lowercasedValue)) ||
                (item.typeFacility && item.typeFacility.toLowerCase().includes(lowercasedValue))
            );
            setList(filteredData);
        }
    }, 300), [originalList]);

    const handleSearch = e => {
        const value = e.currentTarget.value.trim().toLowerCase();
        onSearch(value);
    };

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
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
        },
        {
            title: 'Lokasi',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Jenis Fasilitas',
            dataIndex: 'typeFacility',
            key: 'typeFacility',
        },
    ];

    const customizeRenderEmpty = () => (
        <div style={{marginTop: 20, textAlign: 'center'}}>
            <CloseCircleTwoTone twoToneColor="red" style={{fontSize: 30}}/>
            <p style={{marginTop: 20}}>{msgResponse}</p>
        </div>
    );

    const onCLickAdd = () => {
        history.push({pathname: strings.navigation.path.reports.add, isAddNew: true})
    }

    return (
        <>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Card title="Daftar Laporan Kerusakan">
                        <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                            <Flex className="mb-1" mobileFlex={false}>
                                <div className="mr-md-3 mb-4">
                                    <Input
                                        placeholder="Nama/Jenis Fasilitas"
                                        prefix={<SearchOutlined/>}
                                        onChange={handleSearch}/>
                                </div>
                            </Flex>
                            <div>
                                {role === 'ADMIN' || role === 'CITIZEN' && (
                                    <Button
                                        onClick={onCLickAdd}
                                        type="primary"
                                        icon={<PlusCircleOutlined/>}
                                        block>
                                        Tambah
                                    </Button>
                                )}
                            </div>
                        </Flex>
                        <ConfigProvider renderEmpty={customizeRenderEmpty}>
                            <Table
                                className="no-border-last"
                                columns={tableColumns}
                                dataSource={list}
                                rowKey='id'
                                pagination={{
                                    pageSize: 10
                                }}
                            />
                        </ConfigProvider>
                    </Card>
                </Col>
            </Row>
        </>
    )
}


export default withRouter(REPORTS);
