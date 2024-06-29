import {Col, Row, message, Select, DatePicker, Upload} from 'antd';
import React, {useState} from "react";
import {Button, Card, Form, Input} from 'antd';
import {useHistory} from 'react-router-dom/cjs/react-router-dom.min';
import {useDispatch, useSelector} from 'react-redux';
import {createLetter, fetchOneLetter} from "../../../../redux/features/letters";
import {typeFacility, valueOfTypeLetter,} from "../../components/enums";
import Utils from "../../../../utils";
import {strings} from "../../../../res";
import {rules} from "../../../../res/rules";
import {PageHeaderAlt} from "../../../../components/layout-components/PageHeaderAlt";
import Flex from "../../../../components/shared-components/Flex";
import {UploadOutlined} from '@ant-design/icons';
import {createFinance} from "../../../../redux/features/finances";

const edit = Utils.ACTION_TYPE.EDIT

export const FormFinance = ({type = Utils.ACTION_TYPE.ADD, param}) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {
        selected: finances,
    } = useSelector(state => state.finances)

    const ADD = 'ADD'

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();

        const imageFile = values.imageUrl[0]?.originFileObj;

        if (imageFile) {
            formData.append('image', imageFile);
        }

        await dispatch(createFinance(formData)).unwrap()
            .then(res => {
                history.push(strings.navigation.path.finances.list);
                message.success("Sukses menambah data");
            })
            .catch(error => {
                console.error('Error creating finance:', error);
                message.error('Gagal membuat laporan. Silakan coba lagi.');
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = (e) => {
        history.push('/app/finances')
    };

    const title = type === edit
        ? 'Edit Data'
        : 'Tambah Data'

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <>
            <Form
                name="advanced_search"
                className="ant-advanced-search-form"
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                encType="multipart/form-data"
            >
                <PageHeaderAlt className="bg-white border-bottom">
                    <div className="container">
                        <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
                            <h2 className="mb-3">{title}</h2>
                            <div className="mb-3">
                                <Button className="mr-2" onClick={onCancel}>Batal</Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {type === Utils.ACTION_TYPE.ADD ? 'Tambah' : 'Simpan'}
                                </Button>
                            </div>
                        </Flex>
                    </div>
                </PageHeaderAlt>
                <Card>
                    <Form.Item
                        name="imageUrl"
                        label="Gambar"
                        rules={rules.finance.field.imageUrl}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload name="image" listType="picture" beforeUpload={() => false}>
                            <Button icon={<UploadOutlined/>}>Pilih Gambar</Button>
                        </Upload>
                    </Form.Item>
                </Card>
            </Form>
        </>
    );
}

export default FormFinance