import {Button, Card, Col, Row, Table, message as Message, Input, Menu} from 'antd';
import React, {useEffect, useCallback, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, withRouter} from 'react-router-dom';
import {fetchAllCitizens, setSelectedRows} from 'redux/features/citizens';
import Flex from "../../../components/shared-components/Flex";
import {SearchOutlined, PlusCircleOutlined, EyeOutlined} from "@ant-design/icons";
import utils from "../../../utils";
import {strings} from "../../../res";
import citizenTableColumn from "../components/citizen/table";
import {DeleteOutlined} from "@material-ui/icons";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import {debounce} from "lodash";

export const Citizens = (props) => {
    const history = useHistory()
    const dispatch = useDispatch();
    const [role, setRole] = useState(null)
    const [statusAccount, setStatusAccount] = useState(null)
    const [originalList, setOriginalList] = useState([])
    const [list, setList] = useState([])

    const {
        // list,
        selectedRows,
        filter: {q: searchTerm},
        loading: {
            query: loadingQuery,
            mutation: loadingMutation,
        },
    } = useSelector(state => state.citizens)

    const getData = useCallback(async () => {
        try {
            const response = await dispatch(fetchAllCitizens()).unwrap()
            const data = Array.isArray(response.content) ? response.content : [];

            setOriginalList(data)
            setList(data)

        } catch (error) {
            console.log(error)
            Message.error(error?.message || 'Failed to fetch data')
        }
    }, [dispatch])

    // const deleteData = useCallback(async (id) => {
    // 	try {
    // 		await dispatch(deleteCategory(id)).unwrap()
    // 		getData()
    // 	} catch (error) {
    // 		console.log(error)
    // 		message.error(error?.message || 'Failed to delete data')
    // 	}
    // }, [ dispatch ])

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole)

        const statusAccountUser = localStorage.getItem('status');
        setStatusAccount(statusAccountUser)

        getData()

    }, [getData])

    const addCitizen = () => {
        history.push(`${strings.navigation.path.citizen.add}`)
    }

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
                (item.kkId && item.kkId.toLowerCase().includes(lowercasedValue)) ||
                (item.nik && item.nik.toLowerCase().includes(lowercasedValue))
            );
            setList(filteredData);
        }
    }, 300), [originalList]);

    const handleSearch = e => {
        const value = e.currentTarget.value.trim().toLowerCase();
        onSearch(value);
    };

    const viewDetails = row => {
        history.push(`${strings.navigation.path.citizen.list}/${row.id}`)
    }

    const dropdownMenu = row => (
        <Menu>
            <Menu.Item onClick={() => viewDetails(row)}>
                <Flex alignItems="center">
                    <EyeOutlined/>
                    <span className="ml-2">Detail</span>
                </Flex>
            </Menu.Item>
            <Menu.Item onClick={() => {
                // deleteRow(row)
            }}>
                <Flex alignItems="center">
                    <DeleteOutlined/>
                    <span
                        className="ml-2">{selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Delete'}</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    const tableColumn = [
        {
            title: () => <div className="text-center">No. Identitas</div>,
            children: [
                {
                    title: 'No. KK',
                    dataIndex: 'kkId',
                    key: 'kkId',
                    width: 100,
                },
                {
                    title: 'NIK',
                    dataIndex: 'nik',
                    key: 'nik',
                    width: 100,
                },
            ],
        },
        {
            title: 'Nama Lengkap',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.length - b.fullName.length,
        },
        {
            title: 'Alamat',
            dataIndex: 'homeAddress',
            key: 'homeAddress',
        },
        {
            title: 'Status',
            dataIndex: 'familyStatus',
            key: 'familyStatus',
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-right">
                    <EllipsisDropdown menu={dropdownMenu(elm)}/>
                </div>
            ),
        },
        // {
        // 	title: () => <div className="text-center">Delete</div>,
        // 	key: 'status',
        // 	render: (_, record) => (
        // 		<div className="text-center">
        // 			<a style={{ width: "70%", color: 'red' }} onClick={() => {
        // 				deleteData(record.categoryId)
        // 			}} >Delete</a>
        // 		</div>
        // 	),
        // },
    ];

    return (
        <>
            {role === 'ADMIN' && (
                <Row gutter={24}>
                    {props.noTitle ? (
                        <div></div>
                    ) : (
                        (<Col xs={24} sm={24} md={24} lg={24}>
                            <h2>Daftar Warga</h2>
                            <p>Informasi seputar warga</p>
                        </Col>)
                    )}
                </Row>
            )}
            {role === 'CITIZEN' && (
                <Row gutter={24}>
                    {props.noTitle ? (
                        <div></div>
                    ) : (
                        (<Col xs={24} sm={24} md={24} lg={24}>
                            <h2>Daftar Anggota Keluarga</h2>
                            <p>Informasi anggota keluarga</p>
                        </Col>)
                    )}
                </Row>
            )}
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Card>
                        <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                            <Flex className="mb-1" mobileFlex={false}>
                                <div className="mr-md-3 mb-4">
                                    <Input placeholder="Nama Lengkap/No. KK/NIK" prefix={<SearchOutlined/>}
                                           onChange={handleSearch}/>
                                </div>
                            </Flex>
                            <div>
                                {role === 'ADMIN' || role === 'CITIZEN' && (
                                    <Button
                                        onClick={addCitizen}
                                        type="primary"
                                        icon={<PlusCircleOutlined/>}
                                        block>
                                        Tambah
                                    </Button>
                                )}
                            </div>
                        </Flex>
                        <Table
                            className="no-border-last"
                            columns={tableColumn}
                            dataSource={list}
                            rowKey="id"
                            pagination={{
                                pageSize: 8,
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default withRouter(Citizens);
