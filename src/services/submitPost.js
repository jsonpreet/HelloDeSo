
import axios from 'axios';

function initPost(transactionHex) {
  return new Promise(function (resolve, reject) {
    function login() {
      identityWindow = window.open('https://identity.bitclout.com/approve?tx='+transactionHex, null, 'toolbar=no, width=800, height=1000, top=0, left=0');
    }

    function handleInit(e) {
      if (!init) {
        init = true;
        for (const e of pendingRequests) {
          e.source.postMessage(e, "*");
        }
        pendingRequests = []
        pm_id = e.data.id
        source = e.source
      }
      respond(e.source, e.data.id, {})
    }

    function respond(e, t, n) {
      e.postMessage({
        id: t,
        service: "identity"
      }, "*")
    }

    function signCallback(data){
        if (identityWindow) {
            identityWindow.close();
            identityWindow = null;
            resolve(data.signedTransactionHex)
        }
    }

    window.addEventListener('message', message => {
      const { data: { id: id, method: method, service: service, payload: payload } } = message;
      if (service !== "identity"){ return };

      if (method === 'initialize') {
        handleInit(message);
      } else if (method === 'login') {
        signCallback(payload);
      }
    });

    var init = false;
    var pm_id = ''
    var source = null;
    var user = null;
    var pendingRequests = [];
    var identityWindow = null;
    login();
  });
}

const signPost = async (e) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    await axios.post(`https://bitclout.com/api/v0/submit-transaction`,{
        TransactionHex: e
    }, {
        headers: headers
    } ).then((response) => {
        console.log(response);
        window.location.reload();
    });
}

export const submitPost = (transactionHex) => {
	initPost(transactionHex).then(e=>{
        console.log(e);
        signPost(e);
    }).catch(e=>{
        console.log(e);
    });
}