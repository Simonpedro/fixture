import React, { useState, useContext, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { FirebaseContext } from "../Firebase";
import List from "@material-ui/core/List";
import Checkbox from "@material-ui/core/Checkbox";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TeamListItem from "./TeamListItem";
import { Link } from "react-router-dom";
import EmptyFeedbackImage from "../Common/EmptyFeedbackImage";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Team } from "../../types";

const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "50%",
    padding: theme.spacing(2)
  },

  fab: {
    position: "fixed",
    right: "20%",
    bottom: theme.spacing(2)
  }
}));

const TeamView = () => {
  const classes = useStyles();

  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterByLoggedUser, setFilterByLoggedUser] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => {
    firebase.fetchAllTeams().then(allTeams => {
      setTeams(allTeams);
      setLoading(false);
    });
  }, [firebase]);
  const filterteams = (teams: Team[]) => {
    const user = firebase.getCurrentUser();
    const userId = user && user.uid;
    const filteredByUser = filterByLoggedUser
      ? teams.filter(team => team.members.some(member => member.id === userId))
      : teams;
    return searchText
      ? filteredByUser.filter(team => team.name.includes(searchText))
      : filteredByUser;
  };

  const filteredTeams = filterteams(teams);
  return (
    <>
      <Paper className={classes.paper}>
        <TextField
          fullWidth
          placeholder="Search…"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          onChange={event => setSearchText(event.target.value)}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={filterByLoggedUser}
              onChange={event => setFilterByLoggedUser(event.target.checked)}
              color="primary"
            />
          }
          label="My teams"
        />
        {!loading && (
          <>
            {filteredTeams.length > 0 && (
              <List component="div">
                {filteredTeams.map((team, i) => (
                  <TeamListItem team={team} key={i} />
                ))}
              </List>
            )}
            {!filteredTeams.length && (
              <Box textAlign="center" width={1}>
                <EmptyFeedbackImage />
                <Typography variant="subtitle1">No teams found</Typography>
              </Box>
            )}
          </>
        )}

        {loading && (
          <Box textAlign="center" width={1} mt="10vh">
            <CircularProgress />
          </Box>
        )}
      </Paper>
      <Link to="/team/add">
        <Fab color="primary" className={classes.fab}>
          <AddIcon />
        </Fab>
      </Link>
    </>
  );
};

export default TeamView;
