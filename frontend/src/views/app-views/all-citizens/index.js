import { Button, Card, Col, Row, Table, message, Input, Select, Menu } from 'antd';
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllCitizens, } from 'redux/features/citizens';
import Flex from "../../../components/shared-components/Flex";
import { SearchOutlined, PlusCircleOutlined, EyeOutlined } from "@ant-design/icons";
import utils from "../../../utils";
import { strings } from "../../../res";
import EllipsisDropdown from "../../../components/shared-components/EllipsisDropdown";
import { DeleteOutlined } from "@material-ui/icons";

const { Option } = Select

export const Citizens = (props) => {
	const history = useHistory()
	const dispatch = useDispatch();
	const {
		list,
		selectedRows,
		filter: { q: searchTerm },
		loading: {
			query: loadingQuery,
			mutation: loadingMutation
		}
	} = useSelector(state => state.citizens)
	// const [list, setList] = useState(ProductListData)


	const getData = useCallback(async () => {
		try {
			await dispatch(fetchAllCitizens()).unwrap()
			// console.log(list)
		} catch (error) {
			console.log(error)
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [ dispatch ])

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
		getData()
	}, [])

	const addCitizen = () => {
		history.push(`${ strings.navigation.path.detail_citizen }`)
	}

	const viewDetails = row => {
		history.push(`${strings.navigation.path.detail_citizen}/${row.id}`)
	}

	const dropdownMenu = row => (
		<Menu>
			<Menu.Item onClick={() => viewDetails(row)}>
				<Flex alignItems="center">
					<EyeOutlined />
					<span className="ml-2">Detail</span>
				</Flex>
			</Menu.Item>
			<Menu.Item onClick={() => {
				// deleteRow(row)
			}}>
				<Flex alignItems="center">
					<DeleteOutlined />
					<span className="ml-2">{selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Delete'}</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);

	const tableColumns = [

		{
			title: 'No. KK',
			dataIndex: 'kkId',
			key: 'kkId',
		},
		{
			title: 'NIK',
			dataIndex: 'nik',
			key: 'nik',
		},
		{
			title: 'Nama Lengkap',
			dataIndex: 'fullName',
			key: 'fullName',
			sorter: (a, b) => a.nameCategory.length - b.nameCategory.length,
		},
		{
			title: 'Alamat',
			dataIndex: 'homeAddress',
			key: 'homeAddress',
		},
		{
			title: 'No. Telp.',
			dataIndex: 'phoneNumber',
			key: 'phoneNumber',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm)}/>
				</div>
			)
		}
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

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value ? list : []
		const data = utils.wildCardSearch(searchArray, value)
		// setList(data)
		// setSelectedRowKeys([])
	}

	return (
		<>
			<Row gutter={ 24 }>
				{ props.noTitle ? (
					<div></div>
				) : (
					(<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
						<h2>Daftar Warga</h2>
					</Col>)
				) }
			</Row>
			<Row gutter={ 24 }>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<Card size="small" title="Daftar semua data warga">
						<Flex alignItems="center" justifyContent="between" mobileFlex={ false }>
							<Flex className="mb-1" mobileFlex={ false }>
								<div className="mr-md-3 mb-4">
									<Input placeholder="Search" prefix={ <SearchOutlined/> } onChange={ e => onSearch(e) }/>
								</div>
							</Flex>
							<div>
								<Button onClick={ addCitizen } type="primary" icon={ <PlusCircleOutlined/> } block>Tambah </Button>
							</div>
						</Flex>
						<Table
							className="no-border-last"
							columns={ tableColumns }
							dataSource={ list }
							rowKey='categoryId'
							pagination={ {
								pageSize: 8
							} }
						/>
					</Card>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(Citizens);
