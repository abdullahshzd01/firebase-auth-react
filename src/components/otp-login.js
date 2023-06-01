import '../App.css'
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
// import 'firebase/compat/auth';
// import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
// import PhoneInput from 'react-phone-number-input';

const firebaseConfig = {
    apiKey: "AIzaSyAlH2k5WWaEmJLfVaOM7gxVVEintra1Crs",
    authDomain: "react-firebase-1a592.firebaseapp.com",
    projectId: "react-firebase-1a592",
    storageBucket: "react-firebase-1a592.appspot.com",
    messagingSenderId: "94655241841",
    appId: "1:94655241841:web:715dfb86ead6840a7105d0",
    measurementId: "G-EXTXXEPFHW"
};

firebase.initializeApp(firebaseConfig);

const auth = getAuth();
auth.languageCode = 'it';

function setUpRecaptcha(number) {
    const verifier = new RecaptchaVerifier('recaptcha-container', {}, auth);

    verifier.render();
}

const OTPLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOTP] = useState('');
    const [verified, setVerified] = useState(false);
    // const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(firebase.auth());

    useEffect(() => {
        if (verified) {
            alert('OTP Verification successful!');
        }
    }, [verified]);

    const handlePhoneNumberChange = (e) => {
        console.log(" ------------------------------------- ");
        console.log("e: ", e);
        setPhoneNumber(e.target.value);
        console.log("handlePhoneNumberChange: ", phoneNumber);
        console.log(" ------------------------------------- ");
    };

    const handleOTPChange = (e) => {
        setOTP(e.target.value);
    };

    const handleSignIn = async () => {
        const phoneNumberWithCountryCode = `+92${phoneNumber}`; // Modify the country code as needed
        const appVerifier = window.recaptchaVerifier;

        console.log("phone number: ", phoneNumberWithCountryCode);
        // setUpRecaptcha(phoneNumberWithCountryCode);

        try {
            const response = await setUpRecaptcha(phoneNumberWithCountryCode);
            console.log("response: ", response);
        } catch (error) {
            console.error("Error: ", error);
        }

        // firebase
        //     .auth()
        //     .signInWithPhoneNumber(phoneNumberWithCountryCode, appVerifier)
        //     .then((confirmationResult) => {
        //         // OTP sent
        //         window.confirmationResult = confirmationResult;
        //     })
        //     .catch((error) => {
        //         console.log('Error sending OTP:', error);
        //     });

        signInWithPhoneNumber(auth, phoneNumberWithCountryCode, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                // ...

                console.log("OTP sent!");
                console.log("confirmationResult: ", confirmationResult);
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                console.log("OTP send Error: ", error);
                // grecaptcha.reset(window.recaptchaWidgetId);

                // // Or, if you haven't stored the widget ID:
                // window.recaptchaVerifier.render().then(function (widgetId) {
                //     grecaptcha.reset(widgetId);
                // });
            });
    };

    const handleOTPVerification = () => {
        // const credential = firebase.auth.PhoneAuthProvider.credential(window.confirmationResult.verificationId, otp);

        // signInWithEmailAndPassword(credential)
        //     .then((userCredential) => {
        //         // User signed in successfully
        //         const user = userCredential.user;
        //         console.log('Logged in user:', user);
        //     })
        //     .catch((error) => {
        //         console.log('Error signing in:', error);
        //     });

        const code = otp;

        window.confirmationResult.confirm(code).then((result) => {
            // User signed in successfully.
            const user = result.user;

            console.log("OTP verified!");
            console.log(" => ", user);

            setVerified(true);
            // ...
        }).catch((error) => {
            // User couldn't sign in (bad verification code?)
            // ...
            console.log("OTP verification error: ", error);
        });
    };

    return (
        <>
            <div className="otp-login-container">
                <h2>OTP Login</h2>

                <div className="form-group">
                    <label>
                        Phone Number:
                        <input type="text" placeholder='3XXXXXXXXX' value={phoneNumber} onChange={handlePhoneNumberChange} />
                        {/* <PhoneInput defaultCountry='PK' placeholder="Enter your phone number" value={phoneNumber} onChange={handlePhoneNumberChange}/> */}
                    </label>

                    <div className='form-button'>
                        <button className="send-otp-btn" onClick={handleSignIn}>Send OTP</button>
                    </div>
                </div>

                <div id='recaptcha-container' className='form-group' />

                <div className="form-group">
                    <label>
                        OTP:
                        <input type="text" value={otp} onChange={handleOTPChange} />
                    </label>

                    <div className='form-button'>
                        <button className="verify-otp-btn" onClick={handleOTPVerification}>Verify OTP</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OTPLogin;
