// import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
// import React from "react";
// import { Menu } from "antd";
// import Flex from "../../../../components/shared-components/Flex";
// import { EyeOutlined } from "@ant-design/icons";
// import { DeleteOutlined } from "@material-ui/icons";
// import { strings } from "../../../../res";
//
// const CitizenTableColumn = ( { children, selectedRows, viewDetails }) => {
//
//
// 	return [
// 		{
// 			title: () => <div className="text-center">No. Identitas</div>,
// 			children: [
// 				{
// 					title: 'No. KK',
// 					dataIndex: 'kkId',
// 					key: 'kkId',
// 					width: 100,
// 				},
// 				{
// 					title: 'NIK',
// 					dataIndex: 'nik',
// 					key: 'nik',
// 					width: 100,
// 				},
// 			],
// 		},
// 		{
// 			title: 'Nama Lengkap',
// 			dataIndex: 'fullName',
// 			key: 'fullName',
// 			sorter: ( a, b ) => a.nameCategory.length - b.nameCategory.length,
// 		},
// 		{
// 			title: 'Alamat',
// 			dataIndex: 'homeAddress',
// 			key: 'homeAddress',
// 		},
// 		{
// 			title: 'No. Telp.',
// 			dataIndex: 'phoneNumber',
// 			key: 'phoneNumber',
// 		},
// 		{
// 			title: 'Status',
// 			dataIndex: 'status',
// 			key: 'status',
// 		},
// 		{
// 			title: '',
// 			dataIndex: 'actions',
// 			render: ( _, elm ) => (
// 				<div className="text-right">
// 					<EllipsisDropdown menu={ dropdownMenu(elm) }/>
// 				</div>
// 			),
// 		},
// 		// {
// 		// 	title: () => <div className="text-center">Delete</div>,
// 		// 	key: 'status',
// 		// 	render: (_, record) => (
// 		// 		<div className="text-center">
// 		// 			<a style={{ width: "70%", color: 'red' }} onClick={() => {
// 		// 				deleteData(record.categoryId)
// 		// 			}} >Delete</a>
// 		// 		</div>
// 		// 	),
// 		// },
// 	];
// }
//
// export default CitizenTableColumn;