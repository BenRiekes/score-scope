
//Firebase:
import { getAuth } from "firebase/auth"
import {query, where, getDocs, collection, getFirestore } from "firebase/firestore";

//Fetch calls: --------------------------------------------------------------

export const usernameExist = async(username) => {

    const db = getFirestore();
    const q = query(collection(db, 'users'), where('username', '==', username)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs) return true; 

    return false; 
}

export const emailExist = async(email) => {

    const db = getFirestore();
    const q = query(collection(db, 'users'), where('username', '==', email)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs) return true; 

    return false; 
}
       

//Switch case validation: -----------------------------------------------

export const checkEmail = (email) => { 
 
    switch (true) {
        case email === '' :
            return ({error: true, message: 'Required field'}); 

        case emailExist(email) :
            return ({error: true, message: 'Email already in use'}); 
        
        default:
            return ({error: false, message: ''});   
    }  
}

// --------------------------------------------------------------

export const checkUsername = (username) => {

    const regex = /^[a-zA-Z0-9._]+$/;
    
    switch (true) {
        case username === '' :
            return ({error: true, message: 'Required Field'}); 
            
        case username.length < 3 :
            return ({error: true, message: 'Usernames must be > 3 characters'});

        case regex.test(username) === false :
            return ({error: true, message: 'Usernames must consist of only letters, numbers, periods, and underscores'}); 

        case usernameExist(username) :
            return ({error: true, message: 'Username already exist'}); 

        default: 
            return ({error: false, message: ''}); 

    }
}

// --------------------------------------------------------------

export const checkPassword = (password) => {

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!^&#])[a-zA-Z0-9!^&#]*$/;

    switch (true) {

        case password === '' :
            return ({error: true, message: 'Required Field'})

        case password.length < 7 :
            return ({error: true, message: 'Password must be at least 7 characters long'});

        case regex.test(password) === false :
            return ({
                error: true, 
                message: 'Must consist of numbers, one uppercase, one lowercase, and one special character (^ & # !)'
            }); 

        default : 
            return ({error: false, message: ''}); 
    }
}

//--------------------------------------------------------------

export const checkSetPassword = (setPassword, password) => {

    switch (true) {

        case setPassword === '' :
            return ({error: true, message: 'Required field'}); 

        case setPassword !== password :
            return ({error: true, message: 'passwords do not match'});
        
        default :
            return ({error: false, message: ''}); 
    }
}

//--------------------------------------------------------------

export const checkAge = (age) => {

    const regexAge = /^(1[8-9]|[2-9]\d|100)$/;
    const regexInput = /^\d+$/;

    switch (true) {

        case age === undefined :
            return ({error: true, message: 'Required field'}); 

        case regexInput.test(age) === false :
            return ({error: true, message: 'Numbers only'});

        case regexAge.test(age) === false :
            return ({error: true, message: 'Must be between 18 and 100 to create an account'});

        default :
            return ({error: false, message: ''}); 
    }
}

//--------------------------------------------------------------

export const checkGender = (gender) => {

    const genderIsValid = () => {

        const validGenders = ['Male', 'Female', 'Other']; 

        for (let i = 0; i < validGenders.length; i++) {

            if (validGenders[i] === gender && gender != '') {
                return true; 
            }  
        }
        return false; 
    }

    switch (true) {

        case gender === '' :
            return ({error: true, message: 'Required Field'});
            
        case genderIsValid() === false :
            return ({error: true, message: 'Invalid gender selection'}); 

        default :
            return ({error: false, message: ''}); 
  
    }
}

//--------------------------------------------------------------

export const checkGenderBox = (genderBox, val) => {

    let selectedGender; 
    let newBox = { ...genderBox }  

    const getTrueKeys = () => {

        let trueKeys = []; 
        const keys = ['Male', 'Female', 'Other']; 
        
        for (let i = 0; i < keys.length; i++) {

            if (newBox[keys[i]] === true) {
                trueKeys.push(keys[i]); 
            }
        }

        return trueKeys; 
    }

    const trueKeys = getTrueKeys();

    switch (true) {

        case !trueKeys :  //All boxes unchecked
            newBox[val] = true; 
            selectedGender = val;  

            break; 
        case trueKeys && trueKeys[0] !== val : //One box to another
            newBox[val] = true;
            newBox[trueKeys[0]] = false; 
            selectedGender = val; 
            
            break; 
        case trueKeys && trueKeys[0] === val : //Uncheck Box
            newBox[val] = false; 
            selectedGender = ''; 

        default :
            break; 
    }
 
    return {
        genderBox: newBox,
        selectedGender: selectedGender,
        invalid: checkGender(val), 
    }
}

//--------------------------------------------------------------

export const checkAllErrors = (formObject) => {

    let errorObject = ({
        email: checkEmail(formObject.email),
        username: checkUsername(formObject.username),
        password: checkPassword(formObject.password),
        setPassword: checkSetPassword(formObject.setPassword), 
        age: checkAge(formObject.age),
        gender: checkGender(formObject.gender)
    })

    
    for (let key in errorObject) {

        if (errorObject[key].error == true) {
            return {passedCheck: false, invalid: errorObject}; 
        }
    }

    return {passedCheck: true, invalid: errorObject}; 
}


//--------------------------------------------------------------

export const checkSpecific = (field, val) => {

    switch (field) {
        case 'email' :
            return checkEmail(val); 
        case 'username' :
            return checkUsername(val); 
        case 'password' :
            return checkPassword(val); 
        case 'setPassword' :
            return checkSetPassword(val); 
        case 'age' :
            return checkAge(val);
        case'gender' :
            checkGender(val)
        default :
            return; 
    }
}

//--------------------------------------------------------------

