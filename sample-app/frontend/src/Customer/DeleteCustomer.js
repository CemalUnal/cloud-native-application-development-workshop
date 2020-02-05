import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DeleteCustomer extends Component {

    constructor(props) {
        super(props);
        this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this)
        this.handleDeleteAction = this.handleDeleteAction.bind(this)

        this.state = {
            deleteDialogOpen: true
        };
    }

    handleDeleteAction = (customerId) => {
        fetch(`${window.env.REACT_APP_BACKEND_URI}/delete/${customerId}`, {
            method: 'DELETE',
        })
        .then((res) => {
            this.setState({
                deleteDialogOpen: false
            });
        })
        .catch((err) => {
            console.error('Fetch delete ERROR:', err);
            this.setState({
                deleteDialogOpen: false
            });
        });

        window.location.reload();
    };

    handleDeleteDialogClose = () => {
        this.setState({
            deleteDialogOpen: false
        });
        window.location.reload();
    };

    render() {
        const { customerId } = this.props
        return (

            <Dialog
                open={this.state.deleteDialogOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleCustomerSaveDialogClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {`Delete Customer ${customerId} ?`}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => this.handleDeleteAction(customerId)} color="primary">
                        Delete
                    </Button>
                    <Button onClick={this.handleDeleteDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default DeleteCustomer;