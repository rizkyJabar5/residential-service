import {Button, Card, Col, Row, Table, message, Input, Space, ConfigProvider} from 'antd';
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { fetchAllProduct, deleteProduct } from 'redux/features/products';
import {fetchAllReports} from "../../../redux/features/reports";
import Flex from "../../../components/shared-components/Flex";
import {CloseCircleTwoTone, PlusCircleOutlined, SearchOutlined} from "@ant-design/icons";
import {strings} from "../../../res";

export const REPORTS = (props) => {
	const history = useHistory()
	const dispatch = useDispatch();
	const {
		listReports,
		hasData,
		filter: { q: searchTerm },
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
			await dispatch(fetchAllReports(params)).unwrap()
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
					style={{ width: '100px', height: 'auto' }}
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
		<div style={ { marginTop: 20, textAlign: 'center' } }>
			<CloseCircleTwoTone twoToneColor="red" style={ { fontSize: 30 } }/>
			<p style={ { marginTop: 20 } }>{ msgResponse }</p>
		</div>
	);

	const onCLickAdd = () => {
		history.push({ pathname: strings.navigation.path.reports.add , isAddNew: true })
	}

	return (
		<>
			<Row gutter={ 24 }>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<Card title="Daftar Laporan Kerusakan">
						<Flex alignItems="center" justifyContent="between" mobileFlex={ false }>
							<Flex className="mb-1" mobileFlex={ false }>
								<div className="mr-md-3 mb-4">
									<Input
										placeholder="Search"
										prefix={ <SearchOutlined/> }
										// onChange={ e => onSearch(e) }
									/>
								</div>
							</Flex>
							<div>
								<Button
									onClick={ onCLickAdd }
									type="primary"
									icon={ <PlusCircleOutlined/> }
									block>
									Tambah
								</Button>
							</div>
						</Flex>
						<ConfigProvider renderEmpty={ customizeRenderEmpty }>
							<Table
								className="no-border-last"
								columns={tableColumns}
								dataSource={hasData ? listReports : []}
								rowKey='id'
								pagination={{
									pageSize:10
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
