import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import CustomerForm from './CustomerForm';
import DeleteCustomer from './DeleteCustomer';

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 10,
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
  });

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class CustomerList extends Component {

    constructor(props) {
        super(props);
        this.handleCustomerSaveDialogOpen = this.handleCustomerSaveDialogOpen.bind(this)
        this.handleCustomerSaveDialogClose = this.handleCustomerSaveDialogClose.bind(this)
        this.handleCustomerDeleteDialogOpen = this.handleCustomerDeleteDialogOpen.bind(this)

        this.state = {
            customers: [],
            saveDialogOpen: false,
            deleteDialogOpen: false,
            customerId: ""
        };
    }

    componentDidMount() {
        fetch(`${window.env.REACT_APP_BACKEND_URI}/customers`)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error("Bad response from server.");
                }
                return response.json();
            }).then((customers) => {
                this.setState({
                    customers: customers
                })
            })
    }

    handleCustomerSaveDialogOpen() {
        this.setState({
            saveDialogOpen: true
        });
    };

    handleCustomerSaveDialogClose = () => {
        this.setState({
            saveDialogOpen: false
        });
        window.location.reload();
    };

    handleCustomerDeleteDialogOpen(customerId) {
        this.setState({
            deleteDialogOpen: true,
            customerId: customerId
        });
    };

    render() {
        // if(this.state.customers.length === 0) {
        //     return false;
        // }

        const { classes } = this.props;
        const { customers } = this.state;

        return (

            <div>
                <Button variant="outlined" color="primary"
                        onClick={this.handleCustomerSaveDialogOpen}
                        style={{marginTop:30}}>
                    Create Customer
                </Button>

                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {(customers !== undefined && customers !== null) ? customers.map(customer => {
                            return (
                            <TableRow key={customer.id}>
                                <TableCell component="th" scope="row">
                                {customer.id}
                                </TableCell>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="secondary"
                                            onClick={ () => this.handleCustomerDeleteDialogOpen(customer.id) }>
                                        Delete Customer
                                    </Button>
                                </TableCell>
                            </TableRow>
                            );
                        }) : null}
                        </TableBody>
                    </Table>

                    {this.state.deleteDialogOpen && <DeleteCustomer customerId={this.state.customerId}/>}

                    <Dialog
                        open={this.state.saveDialogOpen}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={this.handleCustomerSaveDialogClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            {"Save new customer"}
                        </DialogTitle>
                        <DialogContent>
                            <CustomerForm onSubmit={this.handleCustomerSaveDialogClose} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCustomerSaveDialogClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Paper>
            </div>
        );
    }
}

CustomerList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomerList);
