import './App.css';
import React, { Component } from 'react';
import Home from './components/home';
import Header from './partials/header';

class App extends Component {
  _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if(localStorage.getItem('user')) {
            if(this._isMounted){
                this.setState({
                    isLoggedIn: true,
                })
            }
        } else {
            if(this._isMounted){
                this.setState({
                    isLoggedIn: false,
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
      const {isLoggedIn} = this.state;
      const data = JSON.parse(localStorage.getItem('user'));
      return (
        <>
          <Header user={data} isLoggedIn={isLoggedIn}/>
          <div className="container lg:mt-20 mx-auto max-w-6xl pt-3 mb-10 px-4">
            <div className="wrapper bg-white border border-solid border-gray-200 rounded-lg">
              <div className="content lg:flex">
                <Home user={data} isLoggedIn={isLoggedIn}/>
              </div>
            </div>
        </div>
        </>
    );
    }
}

export default App;