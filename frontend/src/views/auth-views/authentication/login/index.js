import React from 'react'
import LoginForm from '../../components/LoginForm'
import { Card, Row, Col, Button, Divider } from "antd";
import { strings } from 'res';
import Loading from "components/shared-components/Loading"
import { connect, useSelector } from "react-redux";
import {
	showLoading,
	showAuthMessage,
	hideAuthMessage,
	authenticated,
} from 'redux/features/auth';
import { getAuthBackgroundStyle } from 'utils';

const Login = props => {
	const { authBackground, companyLogo } = useSelector(state => state.theme)
	const { loading } = props

	const onRegister = () => {
		props.history.push(strings.navigation.register)
	}

	if(loading) {
		return (<div className="container" style={ { marginTop: "25%" } }>
			<Loading style={ { marginTop: "50%" } }></Loading>
		</div>)
	} else {
		return (
			<div className="h-100" style={ getAuthBackgroundStyle(authBackground) }>
				<div className="container d-flex flex-column justify-content-center h-100">
					<Row justify="center">
						<Col xs={ 20 } sm={ 20 } md={ 20 } lg={ 7 }>
							<Card>
								<div className="my-4">
									<div className="text-center">
										<img width="250" height="600" style={ { maxHeight: 200, padding: "5px" } } src={ companyLogo }
										     alt=""></img>
									</div>
									<Row justify="center">
										<Col xs={ 24 } sm={ 24 } md={ 20 } lg={ 20 }>
											<LoginForm { ...props } otherSignIn={ null } redirect={ strings.navigation.main }/>
										</Col>
									</Row>
									<Divider>
										<span className="text-muted font-size-base font-weight-normal">Sudah melakukan pendaftaran?</span>
									</Divider>
									<Row justify="center">
										<Button onClick={ onRegister } type="primary" danger>Validasi</Button>
									</Row>
									<br/>
									<p className="text-center" style={ { marginTop: "10px" } }>Dapatkan Akses Dengan Menghubungi Admin di
										<span style={ { color: "blue" } }> 08274323243</span></p>
								</div>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		)
	}

}

const mapStateToProps = ({ auth }) => {
	const { loading, message, showMessage, token, redirect } = auth;
	return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
	showAuthMessage,
	showLoading,
	hideAuthMessage,
	authenticated,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)