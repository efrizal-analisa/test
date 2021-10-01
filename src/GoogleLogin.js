import React,{ useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import { NativeModules } from 'react-native';
const { QuickeyModule } = NativeModules;
import { GoogleSocialButton } from 'react-native-social-buttons'

const GoogleLogin = ({ apiKey, onSignIn, onSignInError }) => {
  const quickeyProvider = "googleLogin";
  const [appId, setAppId] = useState();
  const [socialAppGoogle, setSocialAppGoogle] = useState({});

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
  
  const handleGoogleLogin = async () => {
    const redirectUri = `https://api.getquickey.com/auth/${appId}/callback`;
    await openGoogleDialog(redirectUri);
  }
  
  const buildUrlGoogle = (redirectUri) => {
    const payloadParams =  { clientId: socialAppGoogle.clientId, clientSecret: socialAppGoogle.clientSecret, category:'googleLogin', type:'loginMobileApp' }
    const params = JSON.stringify(payloadParams)

    const scope = "https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email"
    const uriX2 = encodeURIComponent(redirectUri);
    return (`https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&state=${params}&redirect_uri=${uriX2}&client_id=${socialAppGoogle.clientId}`)
  }

  const openGoogleDialog = async (redirectUri) => {
      try {
        const uri = await buildUrlGoogle(redirectUri)
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
    <GoogleSocialButton onPress={handleGoogleLogin}/>
  )
}

GoogleLogin.propTypes = {
  apiKey: PropTypes.string.isRequired,
  onSignIn: PropTypes.func,
  onSignInError: PropTypes.func,
};

export default GoogleLogin;