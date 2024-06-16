import { Col, Row, message } from 'antd';
import React from "react";
import { Button, Card, Form, Input, Checkbox } from 'antd';
import { useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from 'redux/features/user';
import Utils from "../../../../utils";

export const DetailUser = ({ type = Utils.ACTION_TYPE.ADD, param }) => {
	const history = useHistory();
	const location = useLocation()
	const dispatch = useDispatch();
	const ticket = useSelector(state => state.ticket)

	const options = [ 'Superadmin', 'Owner', 'Cashier', 'User', 'Administration' ]

	// const getData = useCallback(async (id) => {
	//   try {
	//     await dispatch(fetchOneSupplier(id)).unwrap()
	//   } catch (error) {
	//     message.error(error?.message || 'Failed to fetch data')
	//   }
	// }, [dispatch])

	const onFinish = async (values) => {
		const formData = new FormData()
		formData.append('fullName', values.fullName)
		formData.append('username', values.username)
		formData.append('password', values.password)
		formData.append('email', values.email)
		formData.append('rolesName', values.rolesName)
		addUser(formData)
		history.push('/app/users')
		message.info("User Added!")
	};
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	useEffect(() => {
		// getData(location.id)
	}, [])

	return (
		<>
			<Row gutter={ 24 }>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<h2>Detail Pengguna</h2>
					<p>Update data ini</p>
				</Col>
			</Row>
			<Row>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<Card>
						<h2>{ ticket?.selected?.question }</h2>
						<Form
							name="basic"
							onFinish={ onFinish }
							onFinishFailed={ onFinishFailed }
							autoComplete="off"
						>
							<Form.Item
								label="Nama"
								name="fullName"
							>
								<Input></Input>
							</Form.Item>
							<Form.Item
								label="Username"
								name="username"
							>
								<Input></Input>
							</Form.Item>
							<Form.Item
								label="Password"
								name="password"
							>
								<Input type="password"></Input>
							</Form.Item>
							<Form.Item
								label="email"
								name="email"
							>
								<Input type="email"></Input>
							</Form.Item>
							<Form.Item
								label="Roles"
								name="rolesName"
							>
								<Checkbox.Group options={ options } defaultValue={ [ 'Owner' ] }/>
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" style={ { width: "100%" } }>
									Submit
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default DetailUser