import React, { useState } from 'react';
import {
	AutoComplete,
	Button,
	Cascader,
	Checkbox,
	Col, DatePicker,
	Form,
	Input, InputNumber,
	Row,
	Select,
} from "antd";

const { Option } = Select;
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

export const FormCitizen = ( props ) => {
	const [ form ] = Form.useForm();
	const [ value, setValue ] = useState( '' );

	const maxLength = 20
	const onFinish = async ( values ) => {
		console.log( 'Received values of form: ', values );

	};

	const handleChange = ( value ) => {
		if (!/[0-9]/.test(value.key)) {
			value.preventDefault();
		}
	}
	return (
		<Form
			form={ form }
			name="register"
			onFinish={ onFinish }
			initialValues={ {
				latestEducation: "SD",
				familyStatus: "HEAD_OF_FAMILY",
				bloodType: "NONE",
				marriageStatus: "UNMARRIED",
			} }
			scrollToFirstError>
			<Form.Item
				name="kkId"
				label="No. KK"
				rules={ [
					{
						required: true,
						message: 'Masukkan Nomor KK terlebih dahulu!',
					},
					{
						max: 20,
						message: 'Nomor KK terlalu panjang!',
					},
				] }
			>
				<Input/>
			</Form.Item>

			<Form.Item
				name="fullName"
				label="Nama Lengkap"
				rules={ [
					{
						required: true,
						message: 'Masukkan nama lengkap Anda!',
					},
				] }
			>
				<Input/>
			</Form.Item>

			<Form.Item
				name="nik"
				label="NIK"
				rules={ [
					{
						required: true,
						message: 'Masukkan Nomor Induk Kependudukan terlebih dahulu!',
					},
					{
						max: maxLength,
						message: `Nomor Induk Kependudukan maksimal ${ maxLength } karakter!`,
					},
				] }
			>
				<Input style={ { width: '50%' } }
				       placeholder="Nomor Induk Kependudukan"
				       value={ value }
				       onChange={ handleChange }/>
			</Form.Item>

			<Form.Item
				name="gender"
				label="Jenis Kelamin"
				rules={ [
					{
						required: true,
						message: 'Masukkan Jenis Kelamin',
					},
				] }
			>
				<Select>
					<Option value="MALE">Laki-laki</Option>
					<Option value="FEMALE">Wanita</Option>
				</Select>
			</Form.Item>

			<Form.Item
				name="placeOfBirth"
				label="Tempat Lahir"
				rules={ [
					{ required: true, message: 'Masukkan Tempat Lahir' },
				] }
			>
				<Input/>
			</Form.Item>

			<Form.Item
				name="dateOfBirth"
				label="Tanggal Lahir"
				rules={ [
					{ type: 'date', required: true, message: 'Masukkan Tanggal Lahir' },
				] }
			>
				<DatePicker format="DD/MM/YYYY"/>
			</Form.Item>

			<Form.Item
				name="religion"
				label="Agama"
				rules={ [
					{
						required: true,
						message: 'Masukkan Agama Anda!',
					},
				] }
			>
				<Select>
					<Option value="ISLAM">Islam</Option>
					<Option value="Katolik">Katolik</Option>
					<Option value="PROTESTAN">Protestan</Option>
					<Option value="HINDU">Hindu</Option>
					<Option value="BUDHA">Budha</Option>
				</Select>
			</Form.Item>

			<Form.Item
				name="latestEducation"
				label="Pendidikan Terakhir"
				rules={ [
					{
						required: true,
					},
				] }
			>
				<Select defaultValue="SD">
					<Option value="SD">SD</Option>
					<Option value="SMP">SMP</Option>
					<Option value="SMA">SMA</Option>
					<Option value="D1">Diploma 1</Option>
					<Option value="D2">Diploma 2</Option>
					<Option value="D3">Diploma 3</Option>
					<Option value="S1">S1</Option>
					<Option value="S2">S2</Option>
					<Option value="S3">S3</Option>
				</Select>
			</Form.Item>

			<Form.Item
				name="familyStatus"
				label="Status Keluarga"
				rules={ [
					{
						required: true,
					},
				] }
			>
				<Select defaultValue="HEAD_OF_FAMILY">
					<Option value="HEAD_OF_FAMILY">Kepala Keluarga</Option>
					<Option value="HUSBAND">Suami</Option>
					<Option value="WIFE">Istri</Option>
					<Option value="CHILDREN">Anak</Option>
					<Option value="SON_IN_LAW">Menantu</Option>
					<Option value="GRANDCHILDREN">Cucu</Option>
					<Option value="PARENTS">Orang Tua</Option>
					<Option value="IN_LAWS">Mertua</Option>
					<Option value="OTHER_FAMILIES">Keluarga lain</Option>
					<Option value="MAID">Pembantu</Option>
					<Option value="OTHERS">Lainnya</Option>
				</Select>
			</Form.Item>

			<Form.Item
				name="jobType"
				label="Pekerjaan"
				rules={ [ { required: true, message: 'Masukkan pekerjaan Anda!' } ] }
			>
				<Input/>
			</Form.Item>

			<Form.Item
				name="bloodType"
				label="Golongan Darah"
				rules={ [
					{
						required: true,
					},
				] }
			>
				<Select defaultValue="NONE">
					<Option value="NONE">-</Option>
					<Option value="A">A</Option>
					<Option value="B">B</Option>
					<Option value="AB">AB</Option>
					<Option value="O">O</Option>
				</Select>
			</Form.Item>

			<Form.Item
				name="marriageStatus"
				label="Status Perkawinan"
				rules={ [
					{
						required: true,
					},
				] }
			>
				<Select defaultValue="UNMARRIED">
					<Option value="UNMARRIED">Belum Kawin</Option>
					<Option value="MARRIAGE">Kawin</Option>
				</Select>
			</Form.Item>

			<Form.Item
				name="block"
				label="Blok"
				rules={ [
					{
						required: true,
					},
				] }
			>
				<Input/>
			</Form.Item>

			<Form.Item
				name="homeId"
				label="Nomor Rumah"
				rules={ [
					{
						required: true,
						message: 'Masukkan Nomor Rumah!',
					},
				] }
			>
				<InputNumber size="small" min="0"/>
			</Form.Item>

			{/*<Form.Item label="Captcha" extra="We must make sure that your are a human.">*/}
			{/*	<Row gutter={ 8 }>*/}
			{/*		<Col span={ 12 }>*/}
			{/*			<Form.Item*/}
			{/*				name="captcha"*/}
			{/*				noStyle*/}
			{/*				rules={ [ { required: true, message: 'Please input the captcha you got!' } ] }*/}
			{/*			>*/}
			{/*				<Input/>*/}
			{/*			</Form.Item>*/}
			{/*		</Col>*/}
			{/*		<Col span={ 12 }>*/}
			{/*			<Button>Get captcha</Button>*/}
			{/*		</Col>*/}
			{/*	</Row>*/}
			{/*</Form.Item>*/}

			{/*<Form.Item name="agreement" valuePropName="checked" { ...tailFormItemLayout }>*/}
			{/*	<Checkbox>*/}
			{/*		I have read the <a href="">agreement</a>*/}
			{/*	</Checkbox>*/}
			{/*</Form.Item>*/}
			{/*<Form.Item { ...tailFormItemLayout }>*/}
			{/*	<Button type="primary" htmlType="submit">*/}
			{/*		Register*/}
			{/*	</Button>*/}
			{/*</Form.Item>*/}
		</Form>
	);
}