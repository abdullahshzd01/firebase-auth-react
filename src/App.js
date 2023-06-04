import './App.css';
import React from 'react';
import OTPLogin from './components/otp-login';
import Verified from './components/verified';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom' ;

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route exact path="/" element={<OTPLogin />} />
                    <Route path="/verfied" element={<Verified />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
