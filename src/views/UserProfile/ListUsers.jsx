import React from "react";
import ReactTable from "react-table";
import 'react-table/react-table.css'
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import GridContainer from "components/Grid/GridContainer.jsx";
// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import Table from "../../components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Approve from "@material-ui/icons/ThumbUp";
import View from "@material-ui/icons/Pageview";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import * as userAction from "../../actions/user";
import { Redirect } from 'react-router';
import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";

import {connect} from 'react-redux';

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};
class ListUsers extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      redirectTo:false,
      users: []
    };
  }
 
componentDidMount(){
   userAction.findAllStaff(this.props, (json)=>{
    this.setState({users:json});
  });
}

render(){
    console.log(this.state.users);
    const { classes } = this.props;
        return (
        <div>
            <Card>
                <CardHeader color="primary">
                   <h4 className={classes.cardTitleWhite}>Users</h4>
                </CardHeader>
                <CardBody>
                  <div style={{float: 'right', marginBottom:"50px"}}>
                  <Button color="twitter">Add New User</Button>
                  </div>
                  <table>
        <TableHead>
          <tr>
            <th>Email</th>
            <th>EID</th>
            <th>Dethartment</th>
            <th>Role</th>
          </tr>
        </TableHead>
        <TableBody>
          {this.state.users.map(function(data, key){ 
            return (
              <tr>              
                <td>{data.email}</td>
                <td>{data.eid}</td>
                <td>{data.department}</td>
                <td>{data.role}</td>
              </tr>
            );
          })}
        </TableBody>
      </table>
                </CardBody>
            </Card>
        </div>
        );       
    }
}

ListUsers.propTypes = {
  userAction:PropTypes.object,
  data: PropTypes.object
}

ListUsers.defaultProps = {
  data: {"dataRows":{}}
}

function mapStateToProps(state) {
  return {
    loader: state.loader,
    user: state.auth.user,
  };
}

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ListUsers));
