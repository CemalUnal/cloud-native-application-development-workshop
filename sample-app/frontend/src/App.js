import React, { Component } from 'react';
import './App.css';
import CustomerList from './Customer/CustomerList';
import logo from './logo.svg'

class App extends Component {
  render() {
    return (

      // <Switch>
      //   <Route path='/' component={CustomerList}/>
      //   <Route path='/create-customer' component={CreateCustomer}/>
      //   {/* <Route path='/delete-customer' component={Contact}>asd</Route> */}
      // </Switch>

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <CustomerList/>
        {/* <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
      </div>
    );
  }
}

export default App;
