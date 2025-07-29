import TextField from '@mui/material/TextField';
import { useState } from 'react';
import '../../styles/signin.scss';
import {InputAdornment, FormControl, IconButton, Stack} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { signIn } from 'aws-amplify/auth';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { muiInputStyle } from '@/modules/muiStyles';

export default function SignInCard({setComponentDisplayed}) {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function login(e){
        e.preventDefault();
        if(username !="" && password != ""){
            try {
                await signIn({username, password});
            } catch (error) {
                dispatch({type: 'alert/set', payload: {open: true, title: "Error", message: error.message}});
            }
        }else if(username == ""){
            document.querySelector('#usernameInput').reportValidity();
        }else if(password == ""){
            document.querySelector('#passwordInput').reportValidity();
        }
    }

    return (
    <>
        
        <div className="signInCard">
            <Image src="/icon2.png" className='logo' width={80} height={75} alt="BoxAlc Icon" priority></Image>
            <h1 className='dialogTitle'>Sign In</h1>
            <form onSubmit={login}>
                <Stack spacing={1}>
                    <TextField 
                        sx={{backgroundColor: 'white'}} 
                        required={true} 
                        value={username}
                        id="usernameInput" 
                        onChange={(e) => setUsername(e.target.value)} 
                        label="Username" 
                        variant="standard" />
                    <FormControl sx={{ m: 1, backgroundColor: 'white' }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                            required={true}
                            id="passwordInput"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{'& .MuiInput-input': {fontFamily: 'Kameron',fontSize: 20}}}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label={
                                    showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Button className='loginButton' sx={{backgroundColor: 'black', 
                        color: 'white', 
                        borderRadius: '0px',
                        fontFamily: 'Koulen',
                        fontSize: 16}} variant="contained" type="submit" onClick={login}>Sign In</Button>
                    <div className='alternateActions'>
                        <button className='forgetPasswordButton' onClick={() => setComponentDisplayed('forgotPassword')}>Forgot Password</button>
                        <button className='createAccountButton' onClick={() => setComponentDisplayed('createAccount')}>Create Account</button>
                    </div>
                </Stack>
            </form>
        </div>
    </>)
}