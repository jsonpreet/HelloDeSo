import React, { Component } from 'react';
import Form from '../partials/form';
import Posts from './posts';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {isLoggedIn, user} = this.props;
        return (
            <>
                <div className="allPosts w-full p-10">
                    <Form isLoggedIn={isLoggedIn} publicKey={user && user.publicKey}/>
                    {isLoggedIn ?
                        <Posts isLoggedIn={isLoggedIn} publicKey={user && user.publicKey}/>
                    : null
                    }
                </div>
            </>
        );
    }
}

export default Home;