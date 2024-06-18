import React, { useEffect, useState } from 'react';
import {
	Button, Card,
	Col, DatePicker,
	Form,
	Input,
	Row, Select,
} from "antd";
import {
	bloodType,
	familyStatus,
	gender,
	latestEducation,
	religions,
	marriageStatus,
	valueOfReligion,
	valueOfFamilyStatus,
	valueOfBloodType,
	valueOfGender,
	valueOfMarriageStatus,
	valueOfLatestEducation,
} from "../../components/enums";
import { rules } from "../../../../res/rules";
import { PageHeaderAlt } from "../../../../components/layout-components/PageHeaderAlt";
import Flex from "../../../../components/shared-components/Flex";
import PropTypes from "prop-types";

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
};

const ADD = 'ADD'

const FormCitizen = ({
	                     form, onFinish, onFinishFailed, title, submitLoading, type, onCancel, header, selected,
                     }) => {
	const [ selectedGender, setSelectedGender ] = useState(valueOfGender(selected.gender))
	const [ selectedReligion, setSelectedReligion ] = useState(valueOfReligion(selected.religion))
	const [ selectedLatestEducation, setSelectedLatestEducation ] = useState(valueOfLatestEducation(selected.latestEducation))
	const [ selectedFamilyStatus, setSelectedFamilyStatus ] = useState(valueOfFamilyStatus(selected.familyStatus))
	const [ selectedBloodType, setSelectedBloodType ] = useState(valueOfBloodType(selected.bloodType))
	const [ selectedMarriageStatus, setSelectedMarriageStatus ] = useState(valueOfMarriageStatus(selected.marriageStatus))

	const onChangeGender = (e) => setSelectedGender(e)
	const onChangeReligion = (e) => setSelectedReligion(e)
	const onChangeEducation = (e) => setSelectedLatestEducation(e)
	const onChangeFamilyStatus = (e) => setSelectedFamilyStatus(e)
	const onChangeBloodType = (e) => setSelectedBloodType(e)
	const onChangeMarriageStatus = (e) => setSelectedMarriageStatus(e)

	useEffect(() => {
	}, []);

	return (
		<Form
			form={ form }
			name="advanced_search"
			className="ant-advanced-search-form"
			onFinish={ onFinish }
			onFinishFailed={ onFinishFailed }
			initialValues={ {
				latestEducation: "",
				familyStatus: "",
				bloodType: "",
				marriageStatus: "",
				gender: "",
				religion: "",
			} }
			autoComplete="off"
			scrollToFirstError
		>
			<PageHeaderAlt className="bg-white border-bottom">
				<div className="container">
					<Flex className="py-2" mobileFlex={ false } justifyContent="between" alignItems="center">
						<h2 className="mb-3">{ header } </h2>
						<div className="mb-3">
							<Button className="mr-2" onClick={ onCancel }>Batal</Button>
							<Button type="primary" htmlType="submit" loading={ submitLoading }>
								{ type === ADD ? 'Tambah Warga' : `Simpan` }
							</Button>
						</div>
					</Flex>
				</div>
			</PageHeaderAlt>
			<Card title={ title }>
				<Row gutter={ 8 }>
					<Col span={ 12 }>
						<Form.Item
							name="kkId"
							label="No. KK"
							rules={ rules.citizen.field.kkId }>
							<Input placeholder="Nomor Kartu Keluarga"/>
						</Form.Item>
					</Col>
					<Col span={ 12 }>
						<Form.Item
							name="nik"
							label="NIK"
							rules={ rules.citizen.field.nik }>
							<Input placeholder="Nomor Induk Kependudukan"/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name="fullName"
					label="Nama Lengkap"
					rules={ rules.citizen.field.fullName }>
					<Input/>
				</Form.Item>

				<Form.Item
					name="gender"
					label="Jenis Kelamin"
					rules={ rules.citizen.field.gender }
				>
					<Select
						value={ selectedGender }
						options={ gender }
						placeholder="Jenis Kelamin"
						onChange={ onChangeGender }
					/>
				</Form.Item>

				<Row gutter={ 8 }>
					<Col span={ 12 }>
						<Form.Item
							name="pob"
							label="Tempat Lahir"
							rules={ rules.citizen.field.placeOfBirth }
						>
							<Input/>
						</Form.Item>
					</Col>
					<Col span={ 12 }>
						<Form.Item
							name="dob"
							label="Tanggal Lahir"
							rules={ rules.citizen.field.dateOfBirth }
						>
							<DatePicker placeholder="Pilih Tanggal" format="DD/MM/YYYY"/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={ 8 }>
					<Col span={ 8 }>
						<Form.Item
							name="religion"
							label="Agama"
							rules={ rules.citizen.field.religion }
						>
							<Select
								value={ selectedReligion }
								options={ religions }
								placeholder="Masukkan Agama"
								onChange={ onChangeReligion }/>
						</Form.Item>
					</Col>
					<Col span={ 4 }></Col>
					<Col span={ 12 }>
						<Form.Item
							name="latestEducation"
							label="Pendidikan Terakhir"
							rules={ rules.citizen.field.latestEducation }
						>
							<Select
								value={ selectedLatestEducation }
								options={ latestEducation }
								placeholder="Pendidikan Terakhir"
								onChange={ onChangeEducation }/>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					style={ { width: "30%" } }
					name="bloodType"
					label="Golongan Darah"
					rules={ rules.citizen.field.bloodType }
				>
					<Select
						value={ selectedBloodType }
						options={ bloodType }
						placeholder="Golongan Darah"
						onChange={ onChangeBloodType }/>
				</Form.Item>
			</Card>
			<Card>
				<Row gutter={ 8 }>
					<Col span={ 12 }>
						<Form.Item
							name="familyStatus"
							label="Status Keluarga"
							rules={ rules.citizen.field.familyStatus }
						>
							<Select
								value={ selectedFamilyStatus }
								options={ familyStatus }
								placeholder="Status keluarga"
								onChange={ onChangeFamilyStatus }/>
						</Form.Item>
					</Col>
					<Col span={ 12 }>
						<Form.Item
							name="marriageStatus"
							label="Status Perkawinan"
							rules={ rules.citizen.field.marriageStatus }
						>
							<Select
								value={ selectedMarriageStatus }
								options={ marriageStatus }
								placeholder="Status pernikahan"
								onChange={ onChangeMarriageStatus }
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					style={ { width: "80%" } }
					name="jobType"
					label="Pekerjaan"
					rules={ rules.citizen.field.jobType }
				>
					<Input/>
				</Form.Item>

				<Form.Item
					name="address"
					label="Alamat Rumah"
					rules={ rules.citizen.field.address }
				>
					<Input/>
				</Form.Item>
			</Card>
		</Form>
	);
}

FormCitizen.propTypes = {
	children: PropTypes.node,
	onFinish: PropTypes.any.isRequired,
	onFinishFailed: PropTypes.any,
};

export { FormCitizen }