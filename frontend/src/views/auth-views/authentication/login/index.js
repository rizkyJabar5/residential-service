import React from 'react'
import LoginForm from '../../components/LoginForm'
import { Card, Row, Col } from "antd";
import { strings } from 'res';
import Loading from "components/shared-components/Loading"
import { connect, useSelector } from "react-redux";
import {
	showLoading,
	showAuthMessage,
	hideAuthMessage,
	authenticated
} from 'redux/features/auth';
import { getAuthBackgroundStyle } from 'utils';

const Login = props => {
	const { authBackground, companyLogo } = useSelector(state => state.theme)
	const { loading } = props

	if (loading) {
		return (<div className="container" style={{ marginTop: "25%" }}>
			<Loading style={{ marginTop: "50%" }}></Loading>
		</div>)
	} else {
		return (
			<div className="h-100" style={getAuthBackgroundStyle(authBackground)}>
				<div className="container d-flex flex-column justify-content-center h-100">
					<Row justify="center">
						<Col xs={20} sm={20} md={20} lg={7}>
							<Card>
								<div className="my-4">
									<div className="text-center">
										<img style={{ maxHeight: 90, padding: "5px" }} src={companyLogo} alt=""></img>
									</div>
									<Row justify="center">
										<Col xs={24} sm={24} md={20} lg={20}>
											<LoginForm {...props} otherSignIn={null} redirect={strings.navigation.main} />
										</Col>
									</Row>
									<p className="text-center" style={{ marginTop: "5px" }}>Dapatkan Akses Dengan Menghubungi Admin di <span style={{color:"blue"}} >082257227265</span></p>
									{/* <p className="text-center" style={{ marginTop: "5px" }}>Tidak dapat link aktivasi?
										<a href={`${strings.navigation.path.resend}`}> Tekan</a><br></br> <a href={strings.navigation.register}>Buat Akun Baru</a>
									</p> */}
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
	authenticated
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)