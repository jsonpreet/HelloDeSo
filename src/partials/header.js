import React, { Component } from 'react';
import axios from 'axios';
import logo from '../logo.svg';
import BitcloutLogin from '../services/BitcloutLogin.js'

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

class Header extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            user: [],
            isLoading: false,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if(localStorage.getItem('user')) {
            if(this._isMounted){
                this.getUser();
            }
        }
    }

    getUser = async () => {
        try {
          this.setState({ isLoading: true });
          await axios.post(`https://bitclout.com/api/v0/get-single-profile`,{
            PublicKeyBase58Check: this.props.user.publicKey,
            Username: "",
        }, {
            headers: headers
          } ).then((response) => {
            this.setState({
                user: response.data,
                isLoading: false
            });
          });
        } catch (error) {
          console.log(error);
        } finally {
          this.setState({ isLoading: false });
        }
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    responseClout = (response) => {
        if(this._isMounted){
            if(!localStorage.getItem('user')) {
                localStorage.setItem('user', JSON.stringify(response, null, 2));
                window.location.reload();
            }
        }
    }

    logout = () => {
        if(localStorage.getItem('user')) {
            localStorage.removeItem('user');
        }
        window.location.reload();
    }

    render() {
        const accessLevel = 2;
        const JWT = false;
        const {isLoggedIn} = this.props;

        return (
            <>
                <header className="App-header bg-white top-0 lg:fixed py-3 z-50 w-full px-3 border-b border-solid border-gray-200 mb-5">
                    <div className="container mx-auto max-w-7xl">
                        <div className="lg:flex justify-between items-center">
                            <div className="siteLogo">
                                <a href="/"><img src={logo} width="200" className="App-logo" alt="BitClout Logo" /></a>
                            </div>
                            <div className="siteSearch hidden lg:block">
                                
                            </div>
                            <div className="siteBtn hidden lg:block">
                                {!isLoggedIn ? 
                                <BitcloutLogin accessLevel={accessLevel} onSuccess={this.responseClout} onFailure={this.responseClout} JWT={JWT} />
                                : <div className="logout"><button onClick={this.logout} className="bg-black hover:bg-indigo-600 transition ease text-white py-2 rounded-lg uppercase px-4">Log Out</button></div>
                                }
                            </div>
                        </div>
                    </div>
                </header>
            </>
        )
    }
}

export default Header
