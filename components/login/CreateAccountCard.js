import { useState } from 'react';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import TextField from '@mui/material/TextField';
import '../../styles/signin.scss';
import {InputAdornment, FormControl, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogContentText} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { set } from '@/redux/profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

export default function CreateAccountCard({setComponentDisplayed, setAlert}) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [detailsNotEntered, setDetailsNotEntered] = useState(true);
    const [passwordInvalid, setPasswordInvalid] = useState({invalid: false, message: ""});
    const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState({invalid: false, message: ""});
    const matchesPasswordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/;
    const noAtSymbol = /^[^@]*$/;

    function goBack() {
        if(codeSent) {
            setCodeSent(false);
        }else{
            setComponentDisplayed("signIn");
        }
    }

    function setNewPasswordSafely(value) {
        
        if(matchesPasswordPolicy.test(value)) {
            setPasswordInvalid({invalid: false, message: ""});
            setNewPassword(value);
        }else{
            setPasswordInvalid({invalid: true, message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"});
            setNewPassword(value);
        }
    }

    function setConfirmPasswordSafely(value) {
        if(value == newPassword) {
            setConfirmPasswordInvalid({invalid: false, message: ""});
            setConfirmPassword(value);
        }else{
            setConfirmPasswordInvalid({invalid: true, message: "Passwords must match"});
            setConfirmPassword(value);
        }
    }

    async function verifyCode() {
        if(confirmationCode == "") {
            document.querySelector('#verifCodeInput').reportValidity();
        }else{
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: username,
                confirmationCode: code,
            });

            if(isSignUpComplete) {
                Alert.alert("Signed up, please login")
                setAlert({open: true, title: "Signed Up", message: "You have successfully signed up. Please login."});
                setComponentDisplayed("signIn");
            }
        }
    }

    async function createAccount() {
        if(email == "" || newPassword == "" || confirmPassword == "") {
            if(email == "" || noAtSymbol.test(email)) {
                document.querySelector('#emailInput').reportValidity();
            }
            
            if(newPassword == "") {
                document.querySelector('#passwordInput').reportValidity();
            }
            
            if(confirmPassword == "") {
                document.querySelector('#verifCodeInput').reportValidity();
            } 
        }else if(matchesPasswordPolicy.test(newPassword) || newPassword != confirmPassword) {
            setAlert({open: true, title: "Error", message: "Please ensure your password meets the password policy requirements and that the passwords match"});
        }else{
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: username,
                password: password,
                options: {
                userAttributes: {
                    email: email,
                },
                }
            });

            if(isSignUpComplete) {
                setAlert({open: true, title: "Signed Up", message: "You have successfully signed up. Please login."});
                setComponentDisplayed("signIn");
            }

            if(nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
                setDetailsNotEntered(false);
            }
        }
    }

    return (
        <div className="signInCard">
            <h1>Create Account 
                <IconButton onClick={() => goBack()}>
                    <ArrowLeftIcon sx={{ color: 'black', fontSize: 30 }}></ArrowLeftIcon>
                </IconButton>
            </h1>
            <Stack spacing={1}>
            {detailsNotEntered ? ( <>
                
                <TextField 
                    sx={{backgroundColor: 'white'}} 
                    required={true} 
                    value={email}
                    id="emailInput" 
                    onChange={(e) => setEmail(e.target.value)} 
                    label="Email" 
                    variant="standard" 
                />
                <TextField 
                    sx={{backgroundColor: 'white'}} 
                    required={true} 
                    value={username}
                    id="usernameInput" 
                    onChange={(e) => setUsername(e.target.value)} 
                    label="Username" 
                    variant="standard" 
                />
                <FormControl sx={{ m: 1, backgroundColor: 'white' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        required={true}
                        id="passwordInput"
                        type={passwordHidden ? 'password' : 'text'}
                        value={newPassword}
                        onChange={(e) => setNewPasswordSafely(e.target.value)}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label={
                                passwordHidden ? 'display the password' : 'hide the password'
                            }
                            onClick={() => setPasswordHidden(!passwordHidden)}
                            >
                            {passwordHidden ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>
                {passwordInvalid.invalid && <p className="passwordErrorMessage">{passwordInvalid.message}</p>}
                <FormControl sx={{ m: 1, backgroundColor: 'white' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password" onClick={sendCode}>Confirm Password</InputLabel>
                    <Input
                        required={true}
                        id="confirmPasswordInput"
                        type={confirmPasswordHidden ? 'password' : 'text'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPasswordSafely(e.target.value)}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label={
                                confirmPasswordHidden ? 'display the password' : 'hide the password' 
                            }
                            onClick={() => setConfirmPasswordHidden(!confirmPasswordHidden)}
                            >
                            {confirmPasswordHidden ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>
                {confirmPasswordInvalid.invalid && <p>{confirmPasswordInvalid.message}</p>}
                <Button sx={{borderRadius: '10px', color: 'white'}} variant="contained" onClick={createAccount}>Create Account</Button>
            </>) : (<>
                <TextField 
                    sx={{backgroundColor: 'white'}} 
                    required={true} 
                    value={confirmationCode}
                    id="verifCodeInput" 
                    onChange={(e) => setConfirmationCode(e.target.value)} 
                    label="Confirmation Code" 
                    variant="standard" 
                />
                <Button sx={{borderRadius: '10px', color: 'white'}} variant="contained" onClick={verifyCode}>Send Code</Button>
            </>)
            }
            </Stack>
            </div>
    )
}