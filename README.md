# QuickeySDK - React Native
A Login Management System for Application

## Getting Started
```
npm i quickey-react-native-sdk
```

## How to use
```
import { GoogleLogin, FacebookLogin, LinkedInLogin, SmsOTPLogin } from 'quickey-react-native-sdk'

```
### Get Social Login Data

Use it normally like react native button component with specified props
```
  const handleLogin = (data) => {
    /** 
     * example data output
     * 
     * {
            email: 'your social login email',
            provider: 'googleLogin',
        } 
     * 
        do your logic here
     */  
    }

    <GoogleLogin apiKey={"YOUR API KEY"} onSignIn={handleLogin} />
```

Or if using facebook login, you must attach facebokk App Id
```
<FacebookLogin facebookAppId={"YOUR FACEBOOK APP ID"} apiKey={"YOUR API KEY"} onSignIn={handleLogin} />

```

### Get OTP Login Data

Use it normally like react button component with specified props
```
  const handleLogin = (data) => {
    /** 
     * example data output
     * 
     * {
            appId: 'your appId',
            phone: 'your phone login number',
            otp: 'your otp login code',
            expires: 'your otp login code expiring time'
        } 
     * 
        do your logic here
     */  
    }

    <SmsOTPLogin apiKey={"YOUR API KEY"} phone={"YOUR PHONE NUMBER"} onSignIn={handleLogin} />
```#   q u i c k e y - r e a c t - n a t i v e - s d k  
 