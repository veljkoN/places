import  { useCallback, useEffect, useState } from 'react';

let logOutTimer;
export const useAuth = () => {
  const[ token, setToken] = useState(false)
  const [ tokenExpirationDate, setTokenExpirationDate ] = useState()
  const[ userId, setUserId] = useState(false)
  
  

  const login = useCallback((uid, token, expirationDate)=>{
    setToken(token)
    setUserId(uid)
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000*60*60)  //1000 milisekundi * 60 sekundi * 60 minuta; sve zajedno = trenutno vreme + 1 sat (sve to u milisekundama)
    setTokenExpirationDate(tokenExpirationDate)   //tokenExpirationDate nije isto kao ono gore sto ima useState
    localStorage.setItem(
      'userData',
      JSON.stringify({ userId: uid, token: token, expiration:tokenExpirationDate.toISOString() })
    );
  },[])
  const logout = useCallback(()=>{
    setToken(null)
    setTokenExpirationDate(null)
    setUserId(null)
    localStorage.removeItem('userData')
  },[]) 

  useEffect(()=>{
    if(token && tokenExpirationDate){
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logOutTimer = setTimeout(logout,remainingTime)
    }
    else{
      clearTimeout(logOutTimer)
    }
  },[token, logout, tokenExpirationDate])

  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if(
      storedData && 
      storedData.token && 
      new Date(storedData.expiration) > new Date()
      ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  },[login])
  return { token, login, logout, userId}
}