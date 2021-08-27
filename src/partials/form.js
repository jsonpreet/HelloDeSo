import React, { Component } from 'react';
import axios from 'axios';
import {submitPost} from '../services/submitPost';
import '../App.css';

var identityWindow = null;
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            response: '',
            body: "",
            TransactionHex: "",
        }
    }

    handleInputChanged(event) {
        this.setState({
            body: event.target.value
        });
    }
    
    handleButtonClicked = async () => {
        const body = this.state.body;
        try {
            this.setState({ isLoading: true });
            await axios.post(`https://bitclout.com/api/v0/submit-post`,{
                UpdaterPublicKeyBase58Check: this.props.publicKey,
                PostHashHexToModify: "",
                ParentStakeID: "",
                Title: "",
                BodyObj: {"Body": body, "ImageURLs": []},
                RecloutedPostHashHex: "",
                PostExtraData: {},
                Sub: "",
                IsHidden: false,
                MinFeeRateNanosPerKB: 1000
          }, {
                headers: headers
            } ).then((response) => {
                if(response.data.TransactionHex){
                    submitPost(response.data.TransactionHex);
                }
            });
          } catch (error) {
            console.log(error);
          } finally {
            this.setState({ isLoading: false });
          }
    }

    render() { 
        const {isLoggedIn} = this.props;
        const image = (this.props.publicKey) ? `https://bitclout.com/api/v0/get-single-profile-picture/${this.props.publicKey}` : 'https://bitclout.com/assets/img/default_profile_pic.png';
        return ( 
            <>
                <div className='postContainer flex border border-solid border-gray-300 rounded-md shadow-sm '>
                    <div className="">
                        <img className="rounded-lg m-3 w-12 h-12" src={image}/>
                    </div>
                    <div className="flex-auto relative">
                        <textarea value={this.state.searchQuery} onChange={this.handleInputChanged.bind(this)} rows="4" maxLength="560" className="block text-xl appearance-none resize-none w-full mb-5 py-5 focus:outline-none" placeholder="Roads? Where we're going we don't need roads"></textarea>
                        {isLoggedIn ?
                        <button type="button" rel="noreferrer" onClick={this.handleButtonClicked.bind(this)} className="absolute bottom-3 right-3 bg-black hover:bg-indigo-600 transition ease text-white py-2 rounded-lg uppercase px-4">Post</button> : null }
                    </div>
                </div>
            </>
         );
    }
}
 
export default Form;