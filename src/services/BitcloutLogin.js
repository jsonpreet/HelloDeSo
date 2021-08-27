import React from 'react';
import PropTypes from "prop-types";

function initLogin(accessLevel) {
  return new Promise(function (resolve, reject) {
    var init = false;
    var pm_id = ''
    var source = null;
    var user = null;
    var pendingRequests = [];
    var identityWindow = null;
    function login() {
      identityWindow = window.open('https://identity.bitclout.com/log-in?accessLevelRequest='+accessLevel, null, 'toolbar=no, width=800, height=1000, top=0, left=0');
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

    function handleLogin(payload) {
      user = payload['users'][payload.publicKeyAdded]
      user['publicKey'] = payload.publicKeyAdded;
      if (identityWindow) {
        identityWindow.close();
        identityWindow = null;
        resolve(user)
      }
    }

    function respond(e, t, n) {
      e.postMessage({
        id: t,
        service: "identity"
      }, "*")
    }

    window.addEventListener('message', message => {
      const { data: { id: id, method: method, service: service, payload: payload } } = message;
      if (service !== "identity"){ return };

      if (method === 'initialize') {
        handleInit(message);
      } else if (method === 'login') {
        handleLogin(payload);
      }
    });

    login();
  });
}

const BitcloutLogin = (props) => {
  const {accessLevel, onSuccess, onFailure, customization,
    customIcon,
    customText,
    CustomComponent, ...other} = props
  const Component = CustomComponent;
  var customClassName = '';
  if (customization) {
    customClassName =  customization.className;
  }
	const handleLogin = () => {
		initLogin(accessLevel).then(e=>{
			onSuccess(e);
		}).catch(e=>{
      onFailure(e);
    });
	}
	return (
      <div>
        <button type="button" rel="noreferrer" className="bg-black hover:bg-indigo-600 transition ease text-white py-2 rounded-lg uppercase px-4" onClick={handleLogin}>
          {customText || "Sign in with Bitclout"}
        </button>
      </div>
  );
}

BitcloutLogin.propTypes = {
  accessLevel: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  customization: PropTypes.object,
  icon: PropTypes.element,
}
export default BitcloutLogin