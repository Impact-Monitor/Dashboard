import './../login/loginStyle.css';
import GraphicSide from '../../assets/images/login/graphicSide.svg'
import SocailLinks from '../../assets/images/login/socailLinks.png'
import topImg from '../../assets/images/login/frame453.png'
import React, { useState } from 'react';
import '../../stylesheet.css';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send login request to server
    console.log('Email:', email);
    console.log('Password:', password);

    if (rememberMe) {
      // Save login information to local storage
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);
    } else {
      // Remove login information from local storage
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPassword');
    }

    // Simulate login attempt
    if (email === 'admin@im.com' && password === 'admin') {
      // Redirect to the protected page
      navigate('/dashboard');
    } else {
      alert('Invalid login credentials');
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };
    return (
        <div className="IM-login-form">
            {/* <div className="div"> */}
                {/* <GraphicSide/> */}
                <img className="graphic-side" alt="Graphic side" src={GraphicSide} />
                <div className="overlap">
                    <img className="frame" alt="Frame" src={topImg} />

                    <div className="form">
                      <form onSubmit={handleSubmit}>
                        <div className="div-2">
                            <div className="div-3">
                                <div className="logo">
                                    <div className="div-3">
                                        <div className="group">
                                            <div className="rectangle" />
                                            <div className="rectangle-2" />
                                        </div>
                                        <div className="group-2">
                                            <div className="rectangle-3" />
                                            <div className="rectangle-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="square">Impact Monitor</div>
                        </div>
                        <div className="div-4">
                            <div className="div-4">
                                <div className="div-4">
                                    <div className="text-wrapper">Sign In</div>
                                    <p className="p">Sign in to stay connected.</p>
                                </div>
                                <div className="frame-2">
                                    <div className="frame-3">
                                        <div className="frame-4">
                                            <div className="text-wrapper-2">Email</div>
                                            <input className="div-5" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                                        </div>
                                        <div className="frame-4">
                                            <div className="text-wrapper-2">Password</div>
                                            <input className="div-5" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                                        </div>
                                        <div className="frame-5">
                                            <div className="div-2">
                                                {/* <img className="img" alt="Frame" src="frame-248.svg" /> */}
                                                <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
                                                <div className="text-wrapper-2">Remember me?</div>
                                            </div>
                                            <div className="text-wrapper-4">Forgot Password</div>
                                        </div>
                                    </div>
                                    <button className="div-wrapper text-wrapper-3" type="submit">Login</button>
                                </div>
                            </div>
                            <div className="div-4">
                                <p className="username-or-email">or sign in with other accounts?</p>
                                <img className="socail-links" alt="Socail links" src={SocailLinks} />
                                <p className="don-t-have-an">
                                    <span className="span">Don’t have an account? </span>
                                    <span className="text-wrapper-4">Click here to sign up.</span>
                                </p>
                            </div>
                        </div>
                      </form>
                    </div>
                </div>
            {/* </div> */}
        </div>
    );
};

export default LoginForm;
