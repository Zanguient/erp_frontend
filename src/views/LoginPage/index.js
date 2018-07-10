import React from 'react';
import Button from "../../components/CustomButtons/Button.jsx";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import { Link } from 'react-router-dom';


class LoginInfo extends React.Component {
render() {
    return (
      <div>
          <GridItem xs={12} sm={6} md={6}>
	    <form>
		 <Card>
              <CardHeader color="info">
                <center><h1>Login</h1></center>
              </CardHeader>
		      <CardBody>
           <CustomInput labelText="Username" id="username" required formControlProps={{
                    fullWidth: true
                    }}
		    />
           <br/>
              <CustomInput labelText="password"  id="password" required formControlProps={{
                    fullWidth: true
                    }}
		       inputProps={{
		              type:"password"
		            }}
		    />
             <br/><br/>
             <Grid container>
                <GridItem xs={12} sm={12} md={12}>
                      <center><Button color="info">Login</Button></center>
		<br/>
		    <Link to="./Registration">Don't have an account? Create one </Link>
                </GridItem>
              </Grid>
		</CardBody>
		</Card>
		</form>
		</GridItem>

      </div>
    );
  }
}


const style = {
 margin: 15,
};
export default LoginInfo;
