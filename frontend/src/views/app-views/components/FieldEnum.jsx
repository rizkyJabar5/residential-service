import React from 'react'
import { Select } from 'antd'

const { Option } = Select

const FieldEnum = ({ options }) => {
	return options.map(item => (
			<Option key={ item.value } value={ item.value }>
				{ item.label }
			</Option>
		),
	)

}

export default FieldEnum;