import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import { NativeModules } from 'react-native';
const { QuickeyModule } = NativeModules;
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { FacebookSocialButton } from 'react-native-social-buttons'

const FacebookLogin = ({ apiKey, onSignIn, onSignInError }) => {
  const quickeyProvider = "facebookLogin";
  const [appId, setAppId] = useState();
  const [socialAppFacebook, setSocialAppFacebook] = useState({});

  useEffect(() => {
    axios.post(`https://api.getquickey.com/auth/apiKey`, {apiKey})
    .then(response => {
      setAppId(response.data.app._id)
    })
  }, [apiKey])

  useEffect(() => {
    axios.get(`https://api.getquickey.com/data/${appId}/${quickeyProvider}`)
    .then(response => {
      setSocialAppGoogle(response.data)
    })
  }, [appId, quickeyProvider])
  
  const handleFacebookLogin = async () => {
    const redirectUri = `https://api.getquickey.com/auth/${appId}/callback`;
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(result);
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              await openFbDialog(data.accessToken.toString(), redirectUri);
            }
          )
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }
  
  const buildUrlFb = (facebookToken, redirectUri) => {
    const payloadParams =  { facebookToken, clientId: socialAppFacebook.clientId, clientSecret: socialAppFacebook.clientSecret, category:'facebookLogin', type:'loginMobileApp' }
    const params = JSON.stringify(payloadParams)

    const uriX2 = encodeURIComponent(redirectUri);
    return (`https://www.facebook.com/v10.0/dialog/oauth?client_id=${socialAppFacebook.clientId}&redirect_uri=${uriX2}&state=${params}`);
  }

  const openFbDialog = async (facebookToken, redirectUri) => {
    try {
      const uri = await buildUrlFb(facebookToken, redirectUri);
      QuickeyModule.showUrl(uri, (error, result) => {
        if (error) {
          throw error
        } else if (result) {
          onSignIn(JSON.parse(result))
          onSignInError(null)
        }
      })
    } catch (error) {
      onSignIn(null)
      onSignInError(error)
    }
  }

  return (
    <FacebookSocialButton onPress={() => {handleFacebookLogin}} />
  )
}

FacebookLogin.propTypes = {
  apiKey: PropTypes.string.isRequired,
  onSignIn: PropTypes.func,
  onSignInError: PropTypes.func
};

export default FacebookLogin;