import { Col, Row, message, TimePicker, DatePicker } from 'antd';
import React from "react";
import { Button, Card, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import Utils from "../../../../utils";
import { strings } from "../../../../res";
import { rules } from "../../../../res/rules";
import Flex from "../../../../components/shared-components/Flex";
import { PageHeaderAlt } from "../../../../components/layout-components/PageHeaderAlt";
import { createNews, fetchOneNews } from "../../../../redux/features/news";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";

const edit = Utils.ACTION_TYPE.EDIT

const formItemLayout = {
// wrapperCol:{ sm: 12 } }
	wrapperCol: {
		xs: { span: 12, offset: 0 },
		sm: 24,
	},
}

export const NewsForm = ({ type = Utils.ACTION_TYPE.ADD, param }) => {
	const history = useHistory();
	const [ form ] = Form.useForm();
	const dispatch = useDispatch();
	const {
		selected: news,
		isLoading,
		message: msgResponse,
	} = useSelector(state => state.news)

	const getData = useCallback(async (id) => {
		await dispatch(fetchOneNews(id)).unwrap()
			.then(res => {
				const data = res.data;
				form.setFieldsValue({
					title: data.title,
          content: data.content,
          recipient: data.recipient,
          event: data.event,
          location: data.location,
          eventDate: moment(data.eventDate),
          startTime: moment(data.startTime, "HH:mm"),
          endTime: moment(data.endTime, "HH:mm")
				});
			})
			.catch(err => {
				message.error(err?.message || `Berita gagal dimuat`);
			})
	}, [ dispatch, form ])

	const onFinish = async (values) => {
		console.log(JSON.stringify(values))
		const request = {
			title: values.title,
			content: values.content,
			recipient: values.recipient,
			event: values.event,
			location: values.location,
			eventDate: Utils.formatDateToLocal(values.eventDate),
			startTime: Utils.formatTimeToLocal(values.startTime),
			endTime: Utils.formatTimeToLocal(values.endTime),
		};
		console.log(request)
		await dispatch(createNews(request)).unwrap()

		message.success(msgResponse);
		history.push(strings.navigation.path.news.list);
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	useEffect(() => {
		if(param) {
			getData(param)
		} else {
			form.resetFields()
		}
	}, [])

	const title = type === edit
		? news.title
		: 'Buat Berita'

	const onCancel = () => {
		history.push(strings.navigation.path.news.list)
	};

	const currentDate = new Date();
	const currentTime = new Date().getTime();
	const twohours = new Date(currentTime + 2 * 60 * 60 * 1000);

	const defaultTime = moment(`${ currentDate.getHours() }:${ currentDate.getMinutes() }`, "HH:mm");
	const twoHoursTime = moment(`${ twohours.getHours() }:${ twohours.getMinutes() }`, "HH:mm");
	return (
		<>
			<Row>
				<Col xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 }>
					<Card title={ news?.letterId }>
						<Form
							{ ...formItemLayout }
							initialValues={{
								startTime: defaultTime,
								endTime: twoHoursTime
							}}
							name="basic"
							form={ form }
							onFinish={ onFinish }
							onFinishFailed={ onFinishFailed }>
							<PageHeaderAlt className="bg-white border-bottom">
								<div className="container">
									<Flex className="py-2" mobileFlex={ false } justifyContent="between" alignItems="center">
										<h2 className="mb-3">{ title } </h2>
										<div className="mb-3">
											<Button className="mr-2" type="text" danger onClick={ onCancel }>Batal</Button>
											<Button
												icon={ <PlusOutlined/> }
												type="primary"
												htmlType="submit"
												loading={ isLoading }
											>
												{ type === edit ? 'Simpan' : 'Tambah' }
											</Button>
										</div>
									</Flex>
								</div>
							</PageHeaderAlt>
							<Form.Item
								name="title"
								label="Judul Berita"
								rules={ rules.news.title }>
								<Input placeholder="Isi judul berita"/>
							</Form.Item>
							<Form.Item
								name="recipient"
								label="Penerima"
								// rules={ rules.news.title }
							>
								<Input placeholder="Biarkan kosong"/>
							</Form.Item>
							<Form.Item
								name="event"
								label="Agenda"
								rules={ rules.news.event }>
								<Input placeholder="Agenda acara"/>
							</Form.Item>
							<Form.Item
								name="location"
								label="Lokasi"
								rules={ rules.news.location }>
								<Input placeholder="Lokasi acara"/>
							</Form.Item>
							<Form.Item
								name="eventDate"
								label="Tanggal acara"
								rules={ rules.news.eventDate }>
								<DatePicker placeholder="Tanggal acara" format="DD/MM/YYYY"/>
							</Form.Item>
							<Form.Item
								name="startTime"
								label="Waktu Mulai Acara"
								rules={ rules.news.startTime }>
								<TimePicker defaultValue={ defaultTime } format="HH:mm" placeholder="Waktu mulai acara"/>
							</Form.Item>
							<Form.Item
								name="endTime"
								label="Akhir Acara"
								rules={ rules.news.endTime }>
								<TimePicker defaultValue={ twoHoursTime } format="HH:mm" placeholder="Waktu akhir acara"/>
							</Form.Item>
							<Form.Item
								name="content"
								label="Konten">
								<TextArea rows={ 20 } placeholder="Konten berita"/>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default NewsForm