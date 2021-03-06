import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomSelect from "components/CustomInput/CustomSelect.jsx";
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Add from "@material-ui/icons/Add";
import Checkbox from '@material-ui/core/Checkbox';
import {connect} from 'react-redux';
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import tableStyle from "assets/jss/material-dashboard-pro-react/components/tableStyle.jsx";
import generalStyle from "assets/jss/material-dashboard-pro-react/generalStyle.jsx";
import DatePicker from 'react-datepicker';
import * as prActions from '../../actions/purchaserequisition';
import * as genericActions from 'actions/generic.js';
import * as Uom from "../../utility/Uom";
import moment from 'moment';
import Notification from 'views/Notifications/Index.jsx'
 
import 'react-datepicker/dist/react-datepicker.css';

const styles = theme => ({
  ...tableStyle,
  ...regularFormsStyle,

  td:{
    border: 'none',
    margin: '0 10px',
    padding: '4px',
    fontWeight: '700',
    fontSize: '15px',
  },

 
   removeDivPadding:{ maxWidth: "12%"}
});
 

const categories = [
  {value: '0', label:'Select',},
  {value: '1',label: 'Category 1',},
  {value: '2',label: 'Category 2',},
  {value: '3',label: 'Category 3',}
];

const shipvia = [
  {slug: 'digital', name:'Digital (Download)'},
  {slug: 'vendor', name:'Vendor Delivery'},
  {slug: 'dhl', name:'DHL'},
]

/* const shipvia = [
  {slug: 'lagos', name:'Lagos Office'},
  {slug: 'portharcourt', name:'Port-Harcourt Office'}
] */

class PurchaseRequisition extends React.Component {
  state = {
    simpleSelect: "",
    type: '',
    expenseheaders:[],
    rowArray:[1,2],
    data:{
      type:'',
      requestedby: '',
      eid: "",
      department: "",
      chargeto: "",
      dateneeded: "",
      status: 1,
      shipvia: "",
      isextrabudget: false,
    },
    lineItems:[],
    startDate : moment(),
    departments: [],
  };

	handleChange = event => {
    let data = this.state.data;
    data[[event.target.id]] = event.target.value; 
    this.setState({ 
      data : data,
    });
	};
  

  handleDatePicker = date =>{
    let data = this.state.data;
    data["dateneeded"] = date.format("MM/DD/YYYY")
    this.setState({startDate: date});
    this.setState({data: data});
    this.toggleCalendar();
  }

  toggleCalendar = e=> {
    e && e.preventDefault()
    this.setState({isOpen: !this.state.isOpen})
  }  

	increaseRow = event=>{
		let rowArray = this.state.rowArray;
		rowArray.push(Date.now());
		this.setState({rowArray:rowArray})
	}

	removeRow = i =>event =>{
		let rowArray = this.state.rowArray;
		rowArray.splice(i,1);
		this.setState({rowArray:rowArray})
  }

  handleLineItemChange= i=>event =>{
    let lineItems = this.state.lineItems;
    let lineItemsKey;
    if(lineItems[i]){
      lineItemsKey = lineItems[i];
    }else{
      lineItemsKey = {};
    } 
    lineItemsKey[[event.target.name]] = event.target.value;
    lineItems[i] = lineItemsKey;
    this.setState({
      lineItems : lineItems
    });
  }

  handleSelectItem = event =>{
    let data = this.state.data;
    data[[event.target.name]] = event.target.value;
    if(event.target.name == "department"){
      this.state.departments.map((v,i)=>{
        if(event.target.value == v._id){
          data['chargeto'] =  v.code;
          data['departmentslug'] = v.slug; 
          return;
        }
      });
    }
    this.setState({ 
      data : data,
    });
  }

  handleSimple = event => {
    let data = this.state.data;
    data['type'] = event.target.value 
    this.setState({ data : data});
  };

  handleSubmitForm = e=>{
    let data = this.state.data;
    data.lineitems = this.state.lineItems;
    data.status = "01";
    prActions.submitRequisition(this.props.user.token, data, (isOk)=>{
      if(isOk){
        this.setState({message:"Purchase requisition has been submitted.", error:false });
      } 
      else this.setState({message:"Error processing request.", error:true });
    }) 
  }

  handleSaveForm = e=>{
    let data = this.state.data;
    data.lineitems = this.state.lineItems;
    data.status = "00";
    prActions.saveRequisition(this.props.user.token, data, (isOk)=>{
      if(isOk) this.setState({data: {}});
      else alert("Couldn't submit an error occur");
    })
  }

  componentDidMount(){
    let data = this.state.data;
    data.requestor = this.props.user._id;
    data.requestedby = this.props.user.firstname +" "+ this.props.user.lastname
    data.eid = this.props.user.eid ;

    this.setState({ data : data});
    genericActions.fetchAll("departments", this.props.user.token, (items)=>{
      this.setState({departments : items});
    });
    genericActions.fetchAll("expenseheader", this.props.user.token, (items)=>{
      this.setState({expenseheaders : items});
    });
  }



  render() {
    const { classes, tableHeaderColor } = this.props;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 
    console.log(Uom);
    today = mm + '/' + dd + '/' + yyyy;
  	const tableData = this.state.rowArray.map((prop, key)=> {

      let value;
      if(this.state.lineItems[key]){
        value = this.state.lineItems[key];
      }
      else{
        value = {};
      }
      return (
        <TableRow key={key}> 
          <TableCell component="th" style={{border: "none", padding: "0", width: "20px", textAlign: "center"}}>               
            {key+1}
          </TableCell>
          <TableCell style={generalStyle.removeBorder}>
              <CustomSelect labelText="Select" id="category" name="category" required
                     onChange={this.handleLineItemChange(key)}
                     value={value.category}
                    formControlProps={{
                      style: {width:"130px",padding:"0", margin:"0"}              
                    }} 
                    inputProps={{margin:"normal" 
                   }}
                   style={{marginTop: "-3px",   borderBottomWidth:" 1px"
                  }}
                    >
                        {this.state.expenseheaders.map(option => (
                          <MenuItem key={option._id} value={option._id} >
                            {option.name}
                          </MenuItem>
                        ))}
              </CustomSelect>
          </TableCell>
          <TableCell className={classes.td}>
                <CustomInput id="itemdescription" 
                required 
                    formControlProps={{  
                      style: {width:"300px", padding:"0", margin:"0"}
                      }} 
                    inputProps={{ name:"itemdescription", onChange: this.handleLineItemChange(key), value:value.itemdescription }}
                    />
          </TableCell>
          <TableCell className={classes.td}>
                <CustomInput  id="quantity" type="number" required formControlProps={{  
                      style: {width:"100px", padding:"0", margin:"0"}              
                    }}  inputProps={{name:"quantity", onChange: this.handleLineItemChange(key),value:value.quantity}}
                    />
          </TableCell>
          <TableCell className={classes.td}>
                  <CustomSelect labelText="Unit of Measure" id="uom" name="uom" required
                     onChange={this.handleLineItemChange(key)}
                     value={value.uom}
                    formControlProps={{
                      style: {width:"130px",padding:"0", margin:"0"}              
                    }} 
                    inputProps={{
                      margin:"normal", id:"uom", name:"uom"
                   }}
                   style={{marginTop: "-3px",   borderBottomWidth:" 1px"
                  }}
                    >
                        {Uom.List.map(option => (
                          <MenuItem key={option.slug} value={option.slug} >
                            {option.name}
                          </MenuItem>
                        ))}
              </CustomSelect>
                  
          </TableCell>      
        </TableRow>
        )}
    );


    return (
	<div>
	<Grid container>
    <Notification error={this.state.error} message={this.state.message} />
    <GridItem xs={12} sm={12} md={12}>
      <form className={classes.container} noValidate autoComplete="off">
	        <Card>
          <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Purchase Requisition</h4>
              </CardHeader>
              <CardBody>
              <Grid container>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <p style={generalStyle.text2}>Type of Requisition:</p>
                </GridItem>	
                <GridItem xs={12} sm={12} md={4}>
                    <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel
                            htmlFor="simple-select"
                            className={classes.selectLabel}
                          >
                            Choose Requisition
                          </InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            classes={{
                              select: classes.select
                            }}
                            value={this.state.data.type}
                            onChange={this.handleSimple}
                            inputProps={{
                              name: "simpleSelect",
                              id: "type"
                            }}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem
                              }}
                            >
                              Choose Requisition Type
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="Service"
                            >
                              Service
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="Product"
                            >
                             Product
                            </MenuItem>                                                      
                          </Select>
                        </FormControl>
                  </GridItem>	
                  <GridItem xs={12} sm={12} md={4}/>
                  <GridItem xs={12} sm={12} md={4}style={generalStyle.text2}>
                      Requisition No: 
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                  <CustomInput labelText="Required By" id="requestedby"
                  formControlProps={{
                      fullWidth: true
                        }}
                    inputProps={{ 
                      disabled: true,
                      value:"Required: "+ this.props.user.firstname +" "+ this.props.user.lastname                 
                        }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}> 
                      <CustomInput labelText="Employee ID" id="eid"
                        formControlProps={{
                          fullWidth: true
                        }} inputProps={{
                          disabled: true, value: "Employee ID: " +this.props.user.eid                
                        }}
                      />
                  </GridItem>   
                  <GridItem xs={12} sm={12} md={4}>
                      <CustomInput required formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                          disabled: true,
                          value:today                 
                        }}
                      />
                  </GridItem>                   
                  <GridItem xs={12} sm={4} md={4}>
                      <CustomSelect labelText="Select" id="department" name="department" required
                            onChange={(e)=>this.handleSelectItem(e)}
                            formControlProps={{
                              style: {width:"130px",padding:"0", margin:"0"}              
                            }} 
                            value={this.state.data.department}
                            inputProps={{margin:"normal" }}
                          style={{marginTop: "-3px",   borderBottomWidth:" 1px"
                          }}
                            >
                                {this.state.departments.map(option => (
                                  <MenuItem key={option._id} value={option._id} >
                                    {option.name}
                                  </MenuItem>
                                ))}
                      </CustomSelect>
                  </GridItem>
                  <GridItem xs={12} sm={4} md={4}>
                      <CustomInput labelText="Charge To" id="chargeto" required formControlProps={{
                        fullWidth: true, }} inputProps={{
                            value: this.state.data.chargeto,
                            disabled: true
                        }}
                      />
                  </GridItem>   
                  <GridItem xs={12} sm={4} md={4}>
                  <CustomInput labelText="Date Needed" required formControlProps={{
                        fullWidth: true, }} 
                        onFocus={this.toggleCalendar}
                        inputProps={{
                            value: this.state.startDate.format("MM/DD/YYYY"),
                            onFocus: this.toggleCalendar
                        }}
                      />
                      {
                          this.state.isOpen && (
                              <DatePicker
                                  selected={this.state.startDate}
                                  onChange={this.handleDatePicker}
                                  showYearDropdown
                                  dateFormatCalendar="MMMM"
                                  scrollableYearDropdown
                                  yearDropdownItemNumber={15}
                                  withPortal
                                  inline />
                          )
                      }
                  </GridItem>              
                  	{/* <GridItem xs={12} sm={8} md={8}>
                      <CustomInput labelText="Purpose Of Use" id="purpose" required formControlProps={{
                      fullWidth: true
                        }}
                        multiline={true} rows={3}
                    inputProps={{                      
                        }}
                      />
                  </GridItem>  */}          
            
                  <GridItem xs={12} sm={4} md={4}>
                      <CustomSelect labelText="Ship Via" name="shipvia" required
                            onChange={(e)=>this.handleSelectItem(e)}
                            formControlProps={{
                              style: {width:"130px",padding:"0", margin:"0"}              
                            }} 
                            value={this.state.data.shipvia}
                            inputProps={{margin:"normal",  id:"shipvia" }}
                          style={{marginTop: "-3px",   borderBottomWidth:" 1px"
                          }}
                            >
                                {shipvia.map(option => (
                                  <MenuItem key={option.slug} value={option.slug} >
                                    {option.name}
                                  </MenuItem>
                                ))}
                      </CustomSelect>
                  </GridItem> 
                  <GridItem xs={12} sm={4} md={4}>
                      <CustomInput labelText="Status" id="status" required formControlProps={{
                        fullWidth: true
                        }} inputProps={{  
                          value:"Pending Submission",
                          disabled:true                  
                        }}
                      />
                  </GridItem> 
              </Grid>
                  <br />  
                  <div style={generalStyle.aboveTable}>
                  <div style={generalStyle.aboveTableIcon}><span></span>
                  <span><Checkbox value="true" id="isextrabudget" name="isextrabudget" onChange={this.handleChange}/>Extra Budgetary</span>
                  </div>
                  

                  </div>
                  <div className={classes.tableResponsive} style ={{ overflowX: "scroll"}}>
                  <Table className={classes.table} > 
                    <TableHead  className={classes[tableHeaderColor + "TableHeader"]} style={{marginTop:"10px", color:"blue", borderBottomColor:"#333",borderBottomStyle:"solid", borderBottomWidth:"1px"}}>
                      <TableRow>
                        <TableCell className={classes.tableCell + " " + classes.tableHeadCell+" "+classes.td} style={{color: "blue", width:"55px"}}>#</TableCell>
                        <TableCell className={classes.tableCell + " " + classes.tableHeadCell+" "+classes.td} style={{color: "blue"}}>Category</TableCell>
                        <TableCell className={classes.tableCell + " " + classes.tableHeadCell+" "+classes.td} style={{color: "blue"}}>Item Description</TableCell>
                        <TableCell className={classes.tableCell + " " + classes.tableHeadCell+" "+classes.td} style={{color: "blue", width: "70px"}}>Quantity</TableCell>
                        <TableCell className={classes.tableCell + " " + classes.tableHeadCell+" "+classes.td} style={{color: "blue"}}>UOM</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData}
                    </TableBody>
                  </Table> 
                </div>
                <div style={generalStyle.mt3}>
               <span>Add New Line</span> 
			          <Button
                  justIcon
                  round
                  color="twitter"
                  className={classes.marginRight}
                  onClick={this.increaseRow}
                >
                  <Add className={classes.icons} />
                </Button>
                </div>
              </CardBody>
              <CardFooter>
              <Grid container>
                <GridItem xs={12} sm={6} md={2} additionalclass={classes.removeDivPadding} >
                  <Button color="primary" onClick={this.handleSaveForm}>Save</Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <Button color="yellowgreen"  onClick={this.handleSubmitForm}>Submit</Button>
                </GridItem>
              </Grid>
            </CardFooter>
	  		</Card>
      </form>
	</GridItem>
</Grid>
</div>
    );
  }
}

PurchaseRequisition.defaultProps = {
  tableHeaderColor: "gray"
};

PurchaseRequisition.propTypes = {
  classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return {
    user: state.auth.user,
    loading: state.loader.loading,
    loader : state.loader
  };
}

export default connect(mapStateToProps, null)(withStyles(styles)(PurchaseRequisition));

