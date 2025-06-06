import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from './Room';
import SpotifyStatsPage from './SpotifyStatsPage'; // ✅ Make sure this file exists
import { Link } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }

  renderHomePage() {
    return (
      <div className="centered-page scaled-ui">
        <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <Typography className="title-text">
              House Party
            </Typography>
          </Grid>

          <Grid item xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/join" component={Link}>
                Join a Room
              </Button>
              <Button color="secondary" to="/create" component={Link}>
                Create a Room
              </Button>
              <Button color="success" to="/stats" component={Link}>
                View Stats
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </div>
    );
  }

  clearRoomCode() {
    this.setState({
      roomCode: null,
    });
  }

  render() {
    return (
      <div className="centered-page scaled-ui">
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                return this.state.roomCode ? (
                  <Redirect to={`/room/${this.state.roomCode}`} />
                ) : (
                  this.renderHomePage()
                );
              }}
            />
            <Route path="/join" component={RoomJoinPage} />
            <Route path="/create" component={CreateRoomPage} />
            <Route path="/stats" component={SpotifyStatsPage} />
            <Route
              path="/room/:roomCode"
              render={(props) => {
                return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
              }}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
