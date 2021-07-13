import React, {Suspense} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
//import Users from './user/pages/Users'
//import NewPlaces from './places/pages/NewPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
//import UserPlaces from './places/pages/UserPlaces';
//import UpdatePlace from './places/pages/UpdatePlace';
//import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context'
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = React.lazy(()=>import('./user/pages/Users'))
const NewPlaces = React.lazy(()=>import('./places/pages/NewPlaces'))
const UserPlaces = React.lazy(()=>import('./places/pages/UserPlaces'))
const UpdatePlace = React.lazy(()=>import('./places/pages/UpdatePlace'))
const Auth = React.lazy(()=>import('./user/pages/Auth'))

const App = () => {
  const { token, login, logout, userId } =useAuth()

  let routes 

  if(token){
    routes=(
      <Switch>
        <Route path='/' exact component={Users}/>
        <Route path='/:userId/places' exact component={UserPlaces}/>
        <Route path='/places/new' exact component={NewPlaces}/>
        <Route path='/places/:placeId' /*exact*/ component={UpdatePlace}/>  {/*--- ovo mora da bude ispod ove gore rute da ga se ne bi prikazivala samo ova ruta*/}
        
        <Redirect to='/' /> 
      </Switch>
    )
  }
  else{
    routes = (
      <Switch>
        <Route path='/' exact component={Users}/>
        <Route path='/:userId/places' exact component={UserPlaces}/>
        <Route path='/auth' exact component={Auth} />
        <Redirect to='/auth' />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider value={{ 
        IsLoggedIn:!!token, 
        token:token,
        userId:userId, 
        login:login, 
        logout:logout 
      }}>
      <Router>
        <MainNavigation />
        <main>
          <Suspense 
            fallback={
              <div className='center'>
                <LoadingSpinner />
              </div>}>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
