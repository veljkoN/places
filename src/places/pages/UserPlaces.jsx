import React, { useEffect, useState } from 'react'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import PlaceList from '../components/PlaceList'

const UserPlaces = (props) => {
    const { isLoading, error, sendRequest, clearError} = useHttpClient()
    const [ loadedPlaces, setLoadedPlaces] = useState()
    const userId = props.match.params.userId
    useEffect(()=>{
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `https://place-app-mern.herokuapp.com/api/places/user/${userId}`
                    )
                setLoadedPlaces(responseData.places)
            } catch (err) {}
            
        }
        fetchPlaces()
    },[sendRequest, userId]) //ovo se nikad nece rerendovati jer sam koristio useCallback
    
    const placeDeletedHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces=>prevPlaces.filter(place=>place.id !== deletedPlaceId))
    }
    return (
        <React.Fragment>
            <ErrorModal error={error}  onClear={clearError} />
            {isLoading && 
                <div>
                    <LoadingSpinner />
                </div>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
        </React.Fragment>
    )
}

export default UserPlaces
