import { useState } from 'react';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import TextField from '@mui/material/TextField';
import '../../styles/signin.scss';
import {InputAdornment, FormControl, IconButton, Stack} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

export default function ForgotPasswordCard({setComponentDisplayed}) {
    const dispatch = useDispatch();
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [username, setUsername] = useState("");
    const [passwordInvalid, setPasswordInvalid] = useState({invalid: false, message: ""});
    const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState({invalid: false, message: ""});
    const matchesPasswordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/;

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

    async function sendCode() {
        if(username == "") {
            document.querySelector('#usernameInput').reportValidity();
        }else{
            dispatch({type: 'alert/set', payload: {open: true, title: "Code Sent", message: "Check your email for the code"}});
            try {
                const output = await resetPassword({ username });
                if(output.nextStep.resetPasswordStep == 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
                    setCodeSent(true);
                }else{
                }
            } catch (error) {
                dispatch({type: 'alert/set', payload: {open: true, title: "Error", message: error.message}});
            }
        }
    }

    async function confirmAndSetPassword() {
        if(confirmationCode == "" || newPassword == "" || confirmPassword == "") {
            if(confirmationCode == "") {
                document.querySelector('#verifCodeInput').reportValidity();
            }
            
            if(newPassword == "") {
                document.querySelector('#passwordInput').reportValidity();
            }
            
            if(confirmPassword == "") {
                document.querySelector('#confirmPasswordInput').reportValidity();
            } 
        }else if(!matchesPasswordPolicy.test(newPassword) || newPassword != confirmPassword) {
            dispatch({type: 'alert/set', payload: {open: true, title: "Error", message: "Please ensure your password meets the password policy requirements and that the passwords match"}});
        }else{

            try {
                await confirmResetPassword({ username, confirmationCode, newPassword});
                dispatch({type: 'alert/set', payload: {open: true, title: "Password Reset", message: "Your password has been reset. Please login with your new password."}});
                setComponentDisplayed("signIn");
            }catch(error) {
                dispatch({type: 'alert/set', payload: {open: true, title: "Error", message: error.message}});
            }
        }
        
    }

    return (
        <div className="signInCard">
            <Image src="/icon2.png" className='logo' width={80} height={75} alt="BoxAlc Icon" priority></Image>
            <h1 className='dialogTitle'>Reset Password </h1>
            <Stack spacing={1}>
            {codeSent ? ( <>
                <TextField 
                    sx={{backgroundColor: 'white', '& .MuiInput-input': {fontFamily: 'Kameron',fontSize: 20}}} 
                    required={true} 
                    value={confirmationCode}
                    id="verifCodeInput" 
                    onChange={(e) => setConfirmationCode(e.target.value)} 
                    label="Confirmation Code" 
                    variant="standard" />
                <FormControl sx={{ m: 1, backgroundColor: 'white' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        required={true}
                        id="passwordInput"
                        type={passwordHidden ? 'password' : 'text'}
                        value={newPassword}
                        sx={{'& .MuiInput-input': {fontFamily: 'Kameron',fontSize: 20}}}
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
                    <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
                    <Input
                        required={true}
                        id="confirmPasswordInput"
                        type={confirmPasswordHidden ? 'password' : 'text'}
                        value={confirmPassword}
                        sx={{'& .MuiInput-input': {fontFamily: 'Kameron',fontSize: 20}}}
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
                <Button sx={{backgroundColor: 'black', 
                        color: 'white', 
                        borderRadius: '0px',
                        fontFamily: 'Koulen',
                        fontSize: 16}} variant="contained" onClick={confirmAndSetPassword}>Reset Password</Button>
            </>) : (<>
                <TextField 
                    sx={{backgroundColor: 'white', '& .MuiInput-input': {fontFamily: 'Kameron',fontSize: 20}}} 
                    required={true} 
                    value={username}
                    id="usernameInput" 
                    onChange={(e) => setUsername(e.target.value)} 
                    label="Username" 
                    variant="standard" />
                <Button sx={{backgroundColor: 'black', 
                        color: 'white', 
                        borderRadius: '0px',
                        fontFamily: 'Koulen',
                        fontSize: 16}} variant="contained" onClick={sendCode}>Send Code To SMS/Email</Button>
            </>)
            }
            </Stack>
            <div className='alternateActions'>
                <button className='goBack' onClick={() => goBack()}>Go Back</button>
            </div>
            </div>
    )
}