import React, { Component } from 'react';
import axios from 'axios';
import Loader from '../partials/loader';
import Post from './post';
import '../App.css';

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            errorMsg: '',
            isLoading: false,
        }
    }

    componentDidMount() {
        this.loadPosts();
    }

    loadPosts = async () => {
        try {
          this.setState({ isLoading: true });
            await axios.post(`https://tijn.club/api/v0/get-posts-for-public-key`,{
            PublicKeyBase58Check: this.props.publicKey,
            NumToFetch: 20,
            MediaRequired: false,
            LastPostHashHex: "",
            ReaderPublicKeyBase58Check: "BC1YLhBLE1834FBJbQ9JU23JbPanNYMkUsdpJZrFVqNGsCe7YadYiUg",
            Username: "",
        }, {
            headers: headers
          } ).then((response) => {
            this.setState({
                posts: response.data.Posts,
                isLoading: false
            });
          });
        } catch (error) {
          this.setState({
            errorMsg: 'Error while loading data. Try again later.'
          });
        } finally {
          this.setState({ isLoading: false });
        }
    };

    render() { 
        const {posts, isLoading} = this.state;
        return ( 
            <>
                <div className='posts-list'>
                    {isLoading ? 
                    <Loader/>
                    : null}
                    {posts.length > 0 && posts.map((post, index) => (
                        <div className="post" id={post?.PostHashHex} key={index}>
                            <Post post={post} />
                        </div>
                    ))}
                </div>
            </>
         );
    }
}
 
export default Posts;