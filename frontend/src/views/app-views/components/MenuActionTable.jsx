import React from 'react'
import { Menu } from "antd";
import Flex from "../../../components/shared-components/Flex";
import { EyeOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@material-ui/icons";
import { strings } from "../../../res";
import { useHistory } from "react-router-dom";

const MenuActionTable = (row, path,  selectedRows, hasDeleted) => {
	const history = useHistory()

	const viewDetails = row => {
		history.push(`${ path }/${ row.id }`)
	}

	return (
		<Menu>
			<Menu.Item onClick={ () => viewDetails(row) }>
				<Flex alignItems="center">
					<EyeOutlined/>
					<span className="ml-2">Detail</span>
				</Flex>
			</Menu.Item>
			{
				hasDeleted &&
        <Menu.Item onClick={ () => {} }>
          <Flex alignItems="center">
            <DeleteOutlined/>
            <span className="ml-2">Delete</span>
          </Flex>
        </Menu.Item>
			}
		</Menu>
	);
}

export default MenuActionTable;