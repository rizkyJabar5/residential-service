import { Col, Row, message } from 'antd';
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import StatisticWidget from "../../../components/shared-components/StatisticWidget";
import { fetchSummaries } from "../../../redux/features/summaries";


export const DefaultDashboard = () => {
	const dispatch = useDispatch();
	const {
		selected: summary,
	} = useSelector(state => state.summaries)

	const getData = useCallback(async () => {
		try {
			await dispatch(fetchSummaries()).unwrap()
		} catch (error) {
			message.error(error?.message || 'Failed to data')
		}
	}, [ dispatch ])
	const user = JSON.parse(localStorage.getItem('user'))

	useEffect(() => {
		getData()
	}, [])

	return (
		<>
			<Row gutter={ 24 }>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<h2>Dashboard</h2>
					<p>Summary analisa data aplikasi kali ini</p>
				</Col>
			</Row>
			<Row gutter={ 24 }>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					{ user.role !== 'CITIZEN' &&
						<Row gutter={ 24 }>
							<Col xs={ 8 } sm={ 8 } md={ 8 } lg={ 8 } xl={ 8 }>
								<StatisticWidget
									style={ { textAlign: "center" } }
									title={ 'Jumlah Pria' }
									value={ `${ summary.male }` }
								/>
							</Col>
							<Col xs={ 8 } sm={ 8 } md={ 8 } lg={ 8 } xl={ 8 }>
								<StatisticWidget
									style={ { textAlign: "center" } }
									title={ 'Jumlah Wanita' }
									value={ `${ summary.female }` }
								/>
							</Col>
							<Col xs={ 8 } sm={ 8 } md={ 8 } lg={ 8 } xl={ 8 }>
								<StatisticWidget
									style={ { textAlign: "center" } }
									title={ 'Jumlah Balita' }
									value={ `${ summary.underAge }` }
								/>
							</Col>
						</Row>
					}
					<Row gutter={ 24 }>
						<Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 12 }>
							<StatisticWidget
								style={ { textAlign: "center" } }
								title={ user.role === 'CITIZEN' ? 'Jumlah Keluarga' :'Jumlah Warga' }
								value={ `${ summary.citizen }` }
							/>
						</Col>
						<Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 12 }>
							<StatisticWidget
								style={ { textAlign: "center" } }
								title={ 'Jumlah Laporan Kerusakan' }
								value={ `${ summary.report }` }
							/>
						</Col>
					</Row>
					<Row gutter={ 24 }>
						<Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 12 }>
							<StatisticWidget
								style={ { textAlign: "center" } }
								title={ 'Berita Yang disebarkan' }
								value={ `${ summary.news }` }
							/>
						</Col>
						<Col xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 12 }>
							<StatisticWidget
								style={ { textAlign: "center" } }
								title={ 'Jumlah Surat Pengajuan' }
								value={ `${ summary.letter }` }
							/>
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	)
}


export default withRouter(DefaultDashboard);
