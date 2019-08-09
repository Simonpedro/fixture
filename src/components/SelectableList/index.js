import React, {useState} from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core';

const SelectableList = ({items, getDisplayValue, onElementClicked}) => {
    const [selectedIndexes, setSelectedIndexes] = useState([])
    const handleClick = i => {
        console.log('Clicked', i)
        const item = items[i]
        const newSelected = selectedIndexes.includes(i)? selectedIndexes.filter(n => n !== i): [...selectedIndexes, i]
        setSelectedIndexes(newSelected)
        onElementClicked(i, item, newSelected)
    }
    const isSelected = i => selectedIndexes.includes(i)
    return (
        <List variant="div">
            {items.map((item, i) =>
                <ListItem button onClick={event => handleClick(i)} key={i} selected={isSelected(i)}>
                    <ListItemText primary={getDisplayValue(item)} />
                </ListItem>
            )}
        </List>
    );
}

export default SelectableList;