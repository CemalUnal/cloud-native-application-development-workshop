import React from 'react';
import fetch from 'isomorphic-fetch';

class CustomerForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event, onSubmit) {
      let newCustomer = {
        name: this.state.value
      }
      event.preventDefault();

      // fetch(`http://${process.env.SPRINGBOOT_DOCKER_SERVICE_HOST}:${process.env.SPRINGBOOT_DOCKER_SERVICE_PORT}/save`, {
      fetch(`${window.env.REACT_APP_BACKEND_URI}/save`, {
        method: 'post',
        body: JSON.stringify(newCustomer),
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
      })
      // .then((res) => JSON.parse(res))
      .then((res) => {
          onSubmit();
      })
      .catch((err) => {
          console.error('ERROR:', err);
          onSubmit();
      });
    }
  
    render() {
      return (
        <form onSubmit={(event) => this.handleSubmit(event, this.props.onSubmit)}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Create" />
        </form>
      );
    }
  }
  
  export default CustomerForm;
  