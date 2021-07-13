import React, { useState, useContext } from 'react'
import Card from '../../shared/components/UIElements/Card'
import  Input  from '../../shared/components/FormElements/Input'
import  Button  from '../../shared/components/FormElements/Button'
import { useForm } from '../../shared/hooks/form-hook'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { AuthContext } from '../../shared/context/auth-context'

import './Auth.css'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'


const Auth = () => {
    const auth = useContext(AuthContext)
    //console.log(auth)
    const [ isLoginMode, setIsLoginMode ] = useState(true)
    /*const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError] = useState()*/
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [ formState, inputHandler, setFormData] = useForm({
        email:{
            value:'',
            isValid:false
        },
        password:{
            value:'',
            isValid:false
        }
    },false)

    const swithcModeHandler = () => {
        if(!isLoginMode){
            setFormData({
                ...formState.inputs,
                name:undefined,
                image:undefined 
            },formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
        else {
            setFormData({
                ...formState.inputs,
                name:{
                    value:'',
                    isValid:false
                },
                image:{
                    value:null,
                    isValid:false
                }
            },false)
        }
        setIsLoginMode(prevMode=> !prevMode)
    }

    const authSubmitHandler = async event => {
        event.preventDefault()
        console.log(formState.inputs)
        if(isLoginMode){    //login mode
            try {
                const responseData = await sendRequest(
                    'https://place-app-mern.herokuapp.com/api/users/login',
                    'POST',
                    JSON.stringify({
                        email:formState.inputs.email.value,
                        password:formState.inputs.password.value
                    }),
                    {
                        'Content-type':'application/json'   //ovde kazem da je tip podataka koji primam json
                    }
                )
                
                auth.login(responseData.userId, responseData.token)
            } catch (err) {
                
            }
        }
        else {                                                    //ako sam u signup mode onda ovo ide u else i mogu da se ulogujem
            try {
                const formData =  new FormData()
                formData.append('email', formState.inputs.email.value)
                formData.append('name', formState.inputs.name.value)
                formData.append('password', formState.inputs.password.value)
                formData.append('image', formState.inputs.image.value)  //image, jer sam u backendu stavio da se stavka koju stavljam zove 'image'
                const responseData = await sendRequest(
                    'https://place-app-mern.herokuapp.com/api/users/signup',
                    'POST',
                    formData  //ovde ide formData jer moram da posaljem sliku, pa ne moze da bude JSON; takodje formData sam setuje header i onda njega ispod ne moram da pisem :)
                )
                
                auth.login(responseData.userId, responseData.token)

            } 
            catch (err) {
                
            }
            
        }
    }
   
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className='authentication'>
                {isLoading && <LoadingSpinner asOverlay/>}  {/*asOverlay znaci da je uvek true*/}
                <h2>Login Required</h2>
                <hr/>
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && <Input 
                        element='input' 
                        id='name' 
                        type='text' 
                        label='Your Name' 
                        validators={[VALIDATOR_REQUIRE()]} 
                        errorText='Please enter a name'
                        onInput={inputHandler}
                    />}

                    <Input 
                        id='email' 
                        element='input' 
                        type='email'
                        label='E-mail'
                        validators={[VALIDATOR_EMAIL()]}
                        errorText='Please enter a valid email address.'
                        onInput={inputHandler}
                    />
                    {!isLoginMode && <ImageUpload center id='image' onInput={inputHandler} error='Please provide image' />}
                    <Input 
                        id='password' 
                        element='input' 
                        type='password'
                        label='Password'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText='Please enter a valid password, at least 6 characters.'
                        onInput={inputHandler}
                    />
                    <Button 
                        type='submit' disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN':'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={swithcModeHandler} >SWITCH TO {isLoginMode? 'SIGNUP':'LOGIN'}</Button>
            </Card>
        </React.Fragment>
    )
}

export default Auth
