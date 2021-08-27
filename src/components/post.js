import React, { Component } from 'react';
import {calculateDurationUntilNow} from '../services/helper';
import Linkify from 'linkifyjs/react';
import axios from 'axios';
import hashtag from 'linkifyjs/plugins/hashtag';
import mention from 'linkifyjs/plugins/mention';
import '../App.css';

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: [],
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
            await axios.post(`https://tijn.club/api/v0/get-single-profile`,{
            PublicKeyBase58Check: this.props.post.PosterPublicKeyBase58Check,
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
          this.setState({
            errorMsg: 'Error while loading data. Try again later.'
          });
        } finally {
          this.setState({ isLoading: false });
        }
    };

    render() { 
        
        const uniqueKey = (!this.props.post) ? null : this.props.post.PostHashHex;
        const classes = (this.props.post.RecloutedPostEntryResponse && typeof this.props.post.RecloutedPostEntryResponse != "undefined") ? ' bg-white postReClout mt-6 mb-4 p-4 border border-solid border-gray-300 rounded-xl' : 'border border-solid border-gray-300 rounded-xl  mt-6 mb-4 p-4';

        const { user } = this.state;
        const userName = !(user.Profile) ? 'Unknown' : user.Profile.Username;

        const options = {
            className: 'link',
            formatHref: {
                mention: function (href) {
                    return 'https://bitclout.com/u' + href;
                },
                hashtag: function (href) {
                    return 'https://clouthashtags.com/tag/' + href.replace("#", "");
                },
            }, 
            target: {
                'mention': '_blank',
                'hashtag': '_blank',
                url: '_blank' 
            },
            nl2br: true
          };

        
        const openPost = () => {
            window.open('http://bitclout.com/posts/'+uniqueKey, '_blank');
        }  
        return ( 
            <>
                <div className={`postItem whitespace-normal ${classes}`} key={`${userName}_${uniqueKey}`}>
                    <div className="lg:flex items-start">
                        {!user.Profile ? ( null ) : ( 
                            <div className="hidden lg:block userImage mr-3 lg:w-12">
                            <a className="block w-full rounded" rel="noreferrer" target="_blank" href={`https://bitclout.com/u/${userName}`} style={{ backgroundImage: `url(https://bitclout.com/api/v0/get-single-profile-picture/${user.Profile.PublicKeyBase58Check})` }} >&nbsp;</a>
                            </div> 
                            )
                        }
                        <div className="postInfo whitespace-normal w-full">
                            <div className="userCard lg:flex items-center">
                                {!user.Profile ? ( null ) : ( 
                                    <div className="lg:hidden inline-block userImage mr-3">
                                    <a className="block w-full rounded" rel="noreferrer" target="_blank" href={`https://bitclout.com/u/${userName}`} style={{ backgroundImage: `url(https://bitclout.com/api/v0/get-single-profile-picture/${user.Profile.PublicKeyBase58Check})` }} >&nbsp;</a>
                                    </div> 
                                    )
                                }
                                <div className="userName">
                                    <a className="block w-full text-base font-bold hover:text-blue-500 rounded" target="_blank" rel="noreferrer" href={`https://bitclout.com/u/${userName}`}>
                                        {userName}
                                    </a>
                                </div>
                            </div>
                            {(!this.props.post.Body ? ( null ) : (
                                <div className="w-full block postContent whitespace-normal py-1">
                                <Linkify options={options}>
                                {this.props.post.Body}</Linkify>
                                </div>
                            )
                            )}
                            {(this.props.post.ImageURLs && this.props.post.ImageURLs.length > 0) ? (
                            <div className="postImage pt-5 pb-3">
                                {this.props.post.ImageURLs.map((image, index) => (
                                    <div className="rounded-xl" key={`div_${index}`}>
                                        <img key={`image_${index}`} src={image} className="rounded-xl" alt={this.props.postHashHex} />
                                    </div>
                                    )
                                )}
                            </div>) : (null) }

                            {(this.props.post.RecloutedPostEntryResponse && typeof this.props.post.RecloutedPostEntryResponse != "undefined") ?  ( <Post classes={classes} post={this.props.post.RecloutedPostEntryResponse} userPublicKeyBase58={this.props.post.PosterPublicKeyBase58Check} /> ) : ( null )}
                            
                            <div className="postLikes pt-4 text-gray-600 flex justify-between">
                                <div className="comments">
                                    {(this.props.post.CommentCount > 0) ? (<i className="fa fa-comment text-gray-700"></i>) : ( <i className="fa fa-comment-o"></i> )}
                                    <span className="ml-2">{this.props.post.CommentCount}</span>
                                </div>
                                <div className="likes">
                                    {(this.props.post.LikeCount > 0) ? (<i className="fa fa-heart text-red-500"></i>) : ( <i className="fa fa-heart-o"></i> )}
                                    <span className="ml-2">{this.props.post.LikeCount}</span>
                                </div>
                                <div className="reclouts">
                                    {(this.props.post.RecloutCount > 0) ? (<i className="fa fa-retweet text-green-500"></i>) : ( <i className="fa fa-retweet"></i> )}
                                    <span className="ml-2">{this.props.post.RecloutCount}</span>
                                </div>
                                <div className="diamonds">
                                    {(this.props.post.DiamondCount > 0) ? (<i className="fa fa-diamond text-blue-500"></i>) : ( <i className="fa fa-diamond"></i> )}
                                    <span className="ml-2">{this.props.post.DiamondCount}</span>
                                </div>
                                <div className="timeLink">
                                    <a className="cursor-pointer hover:text-red-500 transition ease " onClick={openPost} target="_blank">
                                        <i className="fa fa-external-link" aria-hidden="true"></i>
                                        <span className="ml-2">{calculateDurationUntilNow(this.props.post.TimestampNanos)}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
         );
    }
}
 
export default Post;