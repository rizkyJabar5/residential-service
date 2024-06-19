import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { LockOutlined, MailOutlined, ProfileOutlined, ContainerOutlined } from '@ant-design/icons';
import { Button, Form, Input, Alert, message } from "antd";
import {
	showAuthMessage,
	showLoading,
	hideAuthMessage,
	authenticated,
	sendValidateCitizen,
} from 'redux/features/auth';
import { motion } from "framer-motion"
import { rules } from '../../../res/rules'
import { strings } from "../../../res";

export const RegisterForm = (props) => {
	const dispatch = useDispatch();
	const { loading, message: msg, showMessage, showAuthMessage } = props
	const [ form ] = Form.useForm();

	const handleValidSubmit = async (values) => {
		try {
			dispatch(showLoading())
			const request = {
				kkId: values.kkId,
				phoneNumber: values.phoneNumber,
				email: values.email,
				password: values.password,
				fullName: values.fullName,
			}
			const response = await dispatch(sendValidateCitizen(request)).unwrap()

			if(response.code === '200') {
				message.success(response.message)
				props.history.push(strings.navigation.login)
			}
		} catch (err) {
			console.log('error:', err)
			dispatch(showAuthMessage(err.message))
		}
	}

	useEffect(() => {

	});

	return (
		<>
			<motion.div
				initial={ { opacity: 0, marginBottom: 0 } }
				animate={ {
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0,
				} }>
				<Alert type="error" showIcon message={ msg }></Alert>
			</motion.div>
			<Form form={ form } layout="vertical" name="register-form" onFinish={ handleValidSubmit }>
				<Form.Item
					name="fullName"
					label="Nama Lengkap"
					rules={ rules.citizen.field.fullName }
					hasFeedback
				>
					<Input prefix={ <ProfileOutlined className="text-primary"/> }/>
				</Form.Item>
				<Form.Item
					name="kkId"
					label="No. KK"
					rules={ rules.citizen.field.kkId }
					hasFeedback>
					<Input prefix={ <ContainerOutlined className="text-primary"/> }/>
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
					hasFeedback
				>
					<Input prefix="+62"/>
				</Form.Item>
				<Form.Item
					name="email"
					label="Email"
					rules={ rules.auth.email }
					hasFeedback
				>
					<Input prefix={ <MailOutlined className="text-primary"/> }/>
				</Form.Item>
				<Form.Item
					name="password"
					label="Password"
					rules={ rules.auth.password }
					hasFeedback
				>
					<Input.Password prefix={ <LockOutlined className="text-primary"/> }/>
				</Form.Item>
				<Form.Item
					name="confirm"
					label="Konfirmasi Password"
					rules={ rules.auth.confirm }
					hasFeedback
				>
					<Input.Password prefix={ <LockOutlined className="text-primary"/> }/>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						style={ { border: "0px" } }
						htmlType="submit"
						block
						loading={ loading }>
						Daftar
					</Button>
				</Form.Item>
			</Form>
		</>
	)
}

const mapStateToProps = ({ auth }) => {
	const { loading, message, showMessage, token, redirect } = auth;
	return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
	showAuthMessage,
	hideAuthMessage,
	showLoading,
	authenticated,
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)