let muiFormControlStyle = { backgroundColor: 'white',
    '& .MuiInput-underline:before': {
        borderBottomColor: 'black'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomColor: 'black'
    },
    '& .MuiInputLabel-root': {
        color: 'black'
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'black'
    }};

let muiInputStyle = { backgroundColor: 'white',
    '& .MuiInput-underline:before': {
        borderBottomColor: 'black'
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'black'
    }
};
export {muiFormControlStyle, muiInputStyle};