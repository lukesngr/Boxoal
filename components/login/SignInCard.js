import TextField from '@mui/material/TextField';
import { useState } from 'react';
import '../../styles/signin.scss';
import {InputAdornment, FormControl, IconButton, Stack} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { signIn } from 'aws-amplify/auth';

export function SignInCard() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function login() {
        try {
            const result = await signIn({username, password});
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id="signInCard">
            <h1>Sign In</h1>
            <Stack spacing={1}>
                <TextField sx={{backgroundColor: 'white'}} value={username} onChange={(e) => setUsername(e.target.value)} label="Standard" variant="standard" />
                <FormControl sx={{ m: 1, backgroundColor: 'white' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                
                <Button sx={{borderRadius: '10px', color: 'white'}} variant="contained" onClick={login}>Sign In</Button>
                <div className='alternateActions'>
                    <button className='forgetPasswordButton'>Forget Password</button>
                    <button className='createAccountText'>Create Account</button>
                </div>
            </Stack>
        </div>
    )
}