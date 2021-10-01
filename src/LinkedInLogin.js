import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import { NativeModules } from 'react-native';
const { QuickeyModule } = NativeModules;
import { LinkedInSocialButton } from 'react-native-social-buttons'

const LinkedInLogin = ({ apiKey, onSignIn, onSignInError }) => {
  const quickeyProvider = "linkedInLogin";
  const [appId, setAppId] = useState();
  const [socialAppLinkedIn, setSocialAppLinkedIn] = useState({});

  useEffect(() => {
    axios.post(`https://api.getquickey.com/auth/apiKey`, {apiKey})
    .then(response => {
      setAppId(response.data.app._id)
    })
  }, [apiKey])

  useEffect(() => {
    axios.get(`https://api.getquickey.com/data/${appId}/${quickeyProvider}`)
    .then(response => {
      setSocialAppLinkedIn(response.data)
    })
  }, [appId, quickeyProvider])
  
  const handleLinkedInLogin = async () => {
    const redirectUri = `https://api.getquickey.com/auth/${appId}/callback`;
    await openLinkedInDialog(redirectUri);
  }
  
  const buildUrlLinkedIn = (redirectUri) => {
    const payloadParams =  { clientId: socialAppGoogle.clientId, clientSecret: socialAppLinkedIn.clientSecret, category:'linkedInLogin', type:'loginMobileApp' }
    const params = JSON.stringify(payloadParams)

    const scope = "r_liteprofile%20r_emailaddress"
    const uriX2 = encodeURIComponent(redirectUri);
    return (`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${socialAppLinkedIn.clientId}&redirect_uri=${uriX2}&state=${params}&scope=${scope}`)
}

  const openLinkedInDialog = async (redirectUri) => {
    try {
        const uri = await buildUrlLinkedIn(redirectUri)
        QuickeyModule.showUrl(uri, (error, result) => {
          if (error) {
            throw error
          } else if (result) {
            onSignIn(JSON.parse(result))
            onSignInError(null)          }
        })
    } catch (error) {
      onSignIn(null)
      onSignInError(error)
    }
  }

  return (
    <LinkedInSocialButton onPress={handleLinkedInLogin}/>
  )
}

LinkedInLogin.propTypes = {
  apiKey: PropTypes.string.isRequired,
  onSignIn: PropTypes.func,
  onSignInError: PropTypes.func,
};

export default LinkedInLogin;