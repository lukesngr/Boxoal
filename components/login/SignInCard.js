import TextField from '@mui/material/TextField';
import React from 'react';
import '../../styles/signin.scss';
export function SignInCard() {
    return (
        <div id="signInCard">
            <h1>Sign In</h1>
            <TextField label="Standard" variant="standard" />
        </div>
    )
}