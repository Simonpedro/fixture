import React, { useState, useContext, useEffect } from 'react'
import { Typography, Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { FirebaseContext } from '../Firebase';
import SelectableList from '../SelectableList';

const AddTeam = (props) => {
    const firebase = useContext(FirebaseContext)
    const [users, setUsers] = useState([])
    const [name, setName] = useState("")
    useEffect(() => {
        firebase.fetchAllUsers().then(allUsers => setUsers(allUsers))
    }, [users, firebase])
    const [selectedUserIndexes, setSelectedUserIndexes] = useState([])
    const getDisplayName = user => user.displayName
    const onUserClicked = (_i, _user, allSelectedUserIndexes) => setSelectedUserIndexes(allSelectedUserIndexes)
    const onSubmit = async () => {
        const newTeam = {
            name: name,
            members: selectedUserIndexes.map(i => users[i])
        }
        await firebase.addTeam(newTeam)
        props.history.push("/team")
    }
    const onNameChange = event => setName(event.target.value)
    return (
        <>
            <Typography variant="h5" color="textPrimary">Team</Typography>
            <form onSubmit={onSubmit}>
                <FormControl>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <Input id="name" value={name} onChange={onNameChange} />
                </FormControl>
                <SelectableList
                    items={users}
                    getDisplayValue={getDisplayName}
                    onElementClicked={onUserClicked}
                />
                <Button variant="contained" color="primary" type="submit">Add</Button>
            </form>
        </>
    );
}

export default AddTeam;