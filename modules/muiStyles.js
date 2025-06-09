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
        color: 'black',
    },
    '& .MuiInput-input': {
        fontFamily: 'Kameron',
        fontSize: 20
    }
};

let muiActionButton = {
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Koulen',
    fontSize: 15,
    borderRadius: 0,
    '&:hover': {
        backgroundColor: 'black',
        color: 'white'
    }
}

let muiNonActionButton = {
    color: 'white',
    fontFamily: 'Koulen',
    fontSize: 15,
}

let muiDatePicker = {
    '& .MuiInputBase-input': {
      fontFamily: 'Kameron',
      fontSize: 20
    }}
export {muiFormControlStyle, muiInputStyle, muiActionButton, muiNonActionButton, muiDatePicker};