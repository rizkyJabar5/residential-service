import { message } from 'antd';
import React, { useState } from "react";
import { useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneCitizen, updateCitizen, addCitizen } from 'redux/features/citizens';
import { FormCitizen } from "./FormCitizen";
import moment from "moment";
import { useForm } from "antd/es/form/Form";
import Utils from "../../../../utils";

const ADD = 'ADD'
const EDIT = 'EDIT'

const DetailCitizen = ({ type = ADD, param }) => {
	const history = useHistory();
	const [ form ] = useForm();
	const dispatch = useDispatch();
	const { selected } = useSelector(state => state.citizens)
	const [ submitLoading, setSubmitLoading ] = useState(false)

	const getData = useCallback(async (id) => {
		try {
			await dispatch(fetchOneCitizen(id)).unwrap()
				.then(data => {
					console.log(`DATA:${ data.latestEducation }`)
					form.setFieldsValue({
						kkId: data.kkId,
						fullName: data.fullName,
						nik: data.nik,
						gender: data.gender,
						pob: data.pob,
						dob: moment(data.dob),
						religion: data.religion,
						latestEducation: data.latestEducation,
						familyStatus: data.familyStatus,
						jobType: data.jobType,
						bloodType: data.bloodType,
						marriageStatus: data.marriageStatus,
						address: data.homeAddress,
					});
				})
				.catch(err => {
					message.error(err?.message || `Category data failed to load`);
				});
		} catch (error) {
			message.error(error?.message || 'Failed to data')
		}
	}, [ dispatch, form ])

	const onFinish = async (values) => {
		console.log('Received values of form: ', values);
		const request = {
			id: param,
			kkId: values.kkId,
			fullName: values.fullName,
			nik: values.nik,
			gender: values.gender,
			placeOfBirth: values.pob,
			dateOfBirth: Utils.formatDateToLocal(values.dob),
			religion: values.religion,
			latestEducation: values.latestEducation,
			familyStatus: values.familyStatus,
			jobType: values.jobType,
			bloodType: values.bloodType,
			marriageStatus: values.marriageStatus,
			address: values.address,
		};

		form.validateFields()
			.then(async values => {
				if(type === EDIT) {
					await dispatch(updateCitizen(request)).unwrap()
						.then((res) => {
							setSubmitLoading(true)
							message.success(res.message)
							history.push('/app/citizens')
						})
						.catch((err) => {
							message.error(err.message)
						})
						.finally(() => setSubmitLoading(false))
				} else {
					await dispatch(addCitizen(request)).unwrap()
						.then((res) => {
							setSubmitLoading(true)
							message.success(res.message)
							history.push('/app/citizens')
						})
						.catch((err) => {
							console.log(`ERROR:MESSAGE = ${ err }`)
							message.error(err.message)
						})
						.finally(() => setSubmitLoading(false))
				}
			})
			.catch(info => {
				setSubmitLoading(false)
				console.log('info', info)
				message.error('Lengkapi data dengan benar!');
			});
	}

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	const onCancel = (e) => {
		history.push('/app/citizens')
	};

	useEffect(() => {
		if(param) {
			getData(param)
		} else {
      form.resetFields()
    }
	}, [ getData, param ]);

	const title = type === EDIT
		? 'Detail Informasi Warga'
		: 'Tambah Warga Baru'

	const titleCard = type === EDIT
		? selected?.fullName
		: ''

	return (
		<>
			<div className="container">
				<FormCitizen
					selected={ selected }
					submitLoading={ submitLoading }
					header={ title }
					type={ type }
					onCancel={ onCancel }
					form={ form }
					title={ titleCard }
					onFinish={ onFinish }
					onFinishFailed={ onFinishFailed }
				/>
			</div>
		</>
	)
}

export default DetailCitizen