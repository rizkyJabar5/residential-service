import { Col, Row, message, Select } from 'antd';
import React, { useState } from "react";
import { Button, Card, Form, Input, Checkbox } from 'antd';
import { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneUser, addNewStaff } from 'redux/features/user';
import Utils from "../../../../utils";
import { rolesEnum, valueOfRoles } from "../../components/enums";
import { rules } from "../../../../res/rules";
import { strings } from "../../../../res";
import { MailOutlined } from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import { PageHeaderAlt } from "../../../../components/layout-components/PageHeaderAlt";

const formItemLayout = {
	labelCol: {
		xs: { span: 10 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 12 },
		sm: { span: 8 },
	},
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 16,
			offset: 8,
		},
	},
};

export const FormStaff = ({ type = Utils.ACTION_TYPE.ADD, param }) => {
	const history = useHistory();
	const [ form ] = Form.useForm();
	const dispatch = useDispatch();

	const {
		selected,
		isLoading,
		message: msgResponse,
	} = useSelector(state => state.accounts)

	const getData = useCallback(async (id) => {
		try {
			await dispatch(fetchOneUser(id)).unwrap()
		} catch (error) {
			message.error(error?.message || 'Failed to fetch data')
		}
	}, [ dispatch ])

	const onFinish = async (values) => {
		const request = {
			"name": values.fullName,
			"email": values.email,
			"password": values.password,
			"phoneNumber": values.phoneNumber,
			"kkId": values.kkId,
			"role": values.role,
		}
		if(type === Utils.ACTION_TYPE.ADD) {
			await dispatch(addNewStaff(request)).unwrap()
			history.push(`${ strings.navigation.path.users.list }`);
		}
	};
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	useEffect(() => {
		if(param) {
			getData(param)
		}
	}, [])

	const title = type === Utils.ACTION_TYPE.ADD ? 'Tambah Anggota Staff' : 'Detail Informasi Staff'
	const labelSubmit = param ? 'Simpan' : 'Tambah Akun Staff'
	const [ alreadyRegistered, setAlreadyRegistered ] = useState(false);

	const onHandleChangeEmail = (e) => {
		if(msgResponse === 'User telah terdaftar') {
			if(!e.target.value) {
				return;
			}
		}

		setAlreadyRegistered(true);
	};

	const onCancel = (e) => {
		history.push(strings.navigation.path.users.list)
	};

	return (
		<>
			<PageHeaderAlt className="bg-white border-bottom">
				<div className="container">
					<Flex className="py-2" mobileFlex={ false } justifyContent="between" alignItems="center">
						<h2 className="mb-3">{ title } </h2>
						<div className="mb-3">
							<Button type="primary" danger onClick={ onCancel }>Batal</Button>
						</div>
					</Flex>
				</div>
			</PageHeaderAlt>
			<Row>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<Card title={ selected?.selected?.fullName }>
						<Form
							{ ...formItemLayout }
							form={ form }
							name="basic"
							onFinish={ onFinish }
							onFinishFailed={ onFinishFailed }
							autoComplete="off"
						>
							<Form.Item
								label="Nama"
								name="fullName"
								rules={ [
									{
										required: true,
										message: 'Masukkan Nama',
									},
								] }
							>
								<Input/>
							</Form.Item>
							<Form.Item
								name="email"
								label="E-mail"
								rules={ [
									{
										required: true,
										message: 'Masukkan Email',
									},
									{
										type: 'email',
										message: 'Email anda tidak valid',
									},
								] }
							>
								<Input onChange={ onHandleChangeEmail } prefix={ <MailOutlined/> }/>
							</Form.Item>
							<Form.Item
								label="Password"
								name="password"
								rules={ [
									{
										required: true,
										message: 'Masukkan password',
									},
								] }
							>
								<Input.Password/>
							</Form.Item>
							<Form.Item
								label="Nomor Telepon"
								name="phoneNumber"
								rules={ [
									{
										required: true,
										message: 'Masukkan nomor telepon',
									},
								] }
							>
								<Input/>
							</Form.Item>
							<Form.Item
								name="kkId"
								label="Nomor KK"
								rules={ rules.citizen.field.kkId }>
								<Input placeholder="Nomor Kartu Keluarga"/>
							</Form.Item>
							<Form.Item
								label="Role User"
								name="role"
								rules={ [
									{
										required: true,
										message: 'Silahkan pilih salah satu',
									},
								] }
							>
								<Select
									options={ rolesEnum }
									placeholder="Pilih salah satu"/>
							</Form.Item>

							<Form.Item { ...tailFormItemLayout }>
								<Button
									type="primary"
									htmlType="submit"
									style={ { width: '50%' } }
									loading={ isLoading }
								>
									{ isLoading ? 'Menyimpan...' : labelSubmit }
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default FormStaff