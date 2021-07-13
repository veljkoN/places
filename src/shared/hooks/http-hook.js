import { useState, useCallback, useRef, useEffect } from 'react'
export const useHttpClient = () => {
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState()

    const activeHttpRequests = useRef([])

    const sendRequest = useCallback( async (url, method='GET',body = null, headers={}) => { //da se ne bi rerederovala ova funkijca moram da je vrapujem sa useCallbacd
        setIsLoading(true)
        const htttpAbortCtrl = new AbortController()
        activeHttpRequests.current.push(htttpAbortCtrl)
        try {
            const response = await fetch(url,{
                method:method,   //moze i samo method (E6)
                body:body,
                headers:headers,
                signal:htttpAbortCtrl.signal  //abort controller sam referencirao na ovaj request
            })
            const responseData = await response.json()

            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl!==htttpAbortCtrl)

            if(!response.ok){  //ako je ovo tacno, imam 400 ili 500 gresku
                throw new Error(responseData.message)
            }
            setIsLoading(false)
            return responseData
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
            throw err
        }
        
    },[])
     //brisanje greske
     const clearError = () => {
        setError(null)
    }
    useEffect(()=>{
        return ()=>{
            activeHttpRequests.current.forEach(abortCrl=>abortCrl.abort)
        }
    },[])
    return { isLoading,error,sendRequest, clearError}
}