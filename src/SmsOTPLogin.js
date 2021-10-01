import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

const SmsOTPLogin = ({ apiKey, phone, onSignIn }) => {
  const quickeyProvider = "smsOTP";
  const [response, setResponse] = useState();
 
  useEffect(() => {
    if (response) {
      onSignIn({
            provider: quickeyProvider,
            response
        })
    }  
  }, [response])

  const handleSmsOTPLogin = () => {
    axios({
        method: 'post',
        url: `https://api.getquickey.com/otp/sendToUserPhone`,
        headers: {
            authorization: apiKey
        },
        data: { phone, provider:quickeyProvider }
    })
    .then(response => {
        setResponse(response.data)
    })
    .catch(error => {
        setResponse(error)
    })
  }

  return (
    <View>
        <TouchableOpacity style={styles.SMSOTPStyle} onPress={() => {handleSmsOTPLogin}}>
        <Image
            style={styles.ImageIconStyle}
        />
        <View style={styles.SeparatorLine} />
        <Text style={styles.TextStyle}> Sign In With SMS OTP </Text>
        </TouchableOpacity>
    </View>
    )
}

SmsOTPLogin.propTypes = {
  apiKey: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  onSignIn: PropTypes.func,
  onSignInError: PropTypes.func
};

const styles = StyleSheet.create({
    SMSOTPStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FF9B00',
      borderWidth: 0.5,
      borderColor: '#fff',
      height: 40,
      width: 220,
      borderRadius: 5,
      margin: 5,
    },
    ImageIconStyle: {
      padding: 10,
      margin: 5,
      height: 25,
      width: 25,
      resizeMode: 'stretch',
    },
    TextStyle: {
      color: '#fff',
      marginBottom: 4,
      marginRight: 20,
    },
    SeparatorLine: {
      backgroundColor: '#fff',
      width: 1,
      height: 40,
    }
});

export default SmsOTPLogin;
