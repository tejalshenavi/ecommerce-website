import { useHistory } from 'react-router-dom';
import { useContext, useRef, useState } from 'react';

import classes from './Login.module.css';
import CartContext from '../../components/store/cart-context';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const authCtx = useContext(CartContext);
    const history = useHistory();

    const switchModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    }

    const formSubmitHandler = async (event) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        authCtx.userIdentifier(enteredEmail);

        let url;
        if (isLogin) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBryE5rCE2NKJk84sHmaoFE0Pq3r8eSAiE';
        } else {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBryE5rCE2NKJk84sHmaoFE0Pq3r8eSAiE';
        }
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    email: enteredEmail,
                    password: enteredPassword,
                    returnSecureToken: true,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error.message || 'Authentication failed');
            }

            const data = await response.json();
            authCtx.login(data.idToken, enteredEmail);
            history.replace('/store');
        } catch (error) {
            alert(error.message);
        }
    }

    const logoutHandler = () => {
        authCtx.logout();
        history.replace('/login');
    }

    return (
        <div>
            <form className={classes['login-card']} onSubmit={formSubmitHandler}>
                <h3>{isLogin ? 'Login' : 'Sign up'}</h3>
                <div className={classes['login-email']}>
                    <label htmlFor="email">E-mail</label><br />
                    <input type="email" ref={emailInputRef} required />
                </div>
                <div className={classes['login-password']}>
                    <label htmlFor="password">Password</label><br />
                    <input type="password" ref={passwordInputRef} required />
                </div>
                <button>{isLogin ? 'Login' : 'Sign up'}</button>
                <div>
                    <p onClick={switchModeHandler} style={{ cursor: 'pointer' }}>
                        {isLogin ? 'Create new account?' : 'Already have an account? Login'}
                    </p>
                </div>
            
            {authCtx.isLoggedIn && (
               // <button onClick={logoutHandler}>Logout</button>
                <button onClick={logoutHandler} className="logout-button">Logout</button>
            )}
        
         </form>
         </div>
    )
}

export default Login;
