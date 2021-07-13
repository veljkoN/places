import React, { useState, useContext } from 'react'
import Button from '../../shared/components/FormElements/Button'
import Card from '../../shared/components/UIElements/Card'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import Map from '../../shared/components/UIElements/Map'
import Modal from '../../shared/components/UIElements/Modal'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'

import './PlaceItem.css'

const PlaceItem = props => {
    const { isLoading, error, sendRequest, clearError} = useHttpClient()
    const auth = useContext(AuthContext)
    const [ showMap, setShowMap ] = useState(false)
    const [ showConfirmModal, setShowConfirmModal ] = useState(false)
    const openMapHandler = () =>setShowMap(true)
    const closeMapHandler = () =>setShowMap(false)
    //modal za potvrdu za brisanje
    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true)
    }
    const cancleDeleteHandler = () => {
        setShowConfirmModal(false)
    }
    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false)
        try {
            await sendRequest(
                `https://place-app-mern.herokuapp.com/api/places/${props.id}`,
                'DELETE',
                null,   //body je null
                {
                    Authorization: 'Bearer ' + auth.token  //ovo je header
                }
                )
            props.onDelete(props.id)
        } catch (err) {}
        
    }
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal 
                show={showMap} 
                onCancel={closeMapHandler} 
                header={props.address} 
                contentClass='place-item__modal-content'
                footerClass='place-item__modal-actions'
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className='map-container'>
                    <Map />
                </div>
            </Modal>
            <Modal 
                show={showConfirmModal}
                onCancel={cancleDeleteHandler}
                header="Are you sure?" 
                footerClass='place-item__modal-actions' 
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancleDeleteHandler}>CANCLE</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>   {/* ovo inverse i danger je klasa*/}
                    </React.Fragment>
            }>
                <h2>Do you want to preside and delete this place</h2>
            </Modal>
            <li className='place-item'>
                <Card className='place-item__content'>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className='place-item__image'>
                        <img src={`https://place-app-mern.herokuapp.com/${props.image}`} alt={props.title}/>
                    </div>
                    <div className='place-item__info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>
                            VIEW ON MAP
                        </Button>
                        {auth.userId===props.creatorId &&
                        <Button to={`/places/${props.id}`}>
                            EDIT
                        </Button>}
                        {auth.userId===props.creatorId &&
                        <Button danger onClick={showDeleteWarningHandler}>
                            DELETE
                        </Button>}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    )
}

export default PlaceItem
