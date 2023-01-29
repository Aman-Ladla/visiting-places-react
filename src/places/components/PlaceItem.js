import { Fragment, useContext, useState } from "react";
import Button from "../../shared/componenets/FormElements/Button";
import Card from "../../shared/componenets/UIElements/Card";
import ErrorModal from "../../shared/componenets/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/componenets/UIElements/LoadingSpinner";
import Modal from "../../shared/componenets/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import useHttpClient from "../../shared/hooks/http-hook";

import "./PlaceItem.css";

const PlaceItem = (props) => {
    const [showMap, setShowMap] = useState(false);

    const authCtx = useContext(AuthContext);

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const showConfirmModalHandler = () => {
        setShowConfirmModal(true);
    };

    const hideConfirmModalHandler = () => {
        setShowConfirmModal(false);
    };

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);

        try {
            await sendRequest(
                `http://localhost:8080/api/places/${props.id}`,
                "DELETE",
                null,
                {
                    Authorization: "Bearer " + authCtx.token,
                }
            );
            props.onDelete(props.id);
        } catch (error) {}
    };

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>Close</Button>}
            >
                <div className="map-container">
                    <h2>The Map</h2>
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={hideConfirmModalHandler}
                header="Are you sure?"
                footerClass="place-item__actions"
                footer={
                    <Fragment>
                        <Button inverse onClick={hideConfirmModalHandler}>
                            CANCEL
                        </Button>
                        <Button danger onClick={confirmDeleteHandler}>
                            DELETE
                        </Button>
                    </Fragment>
                }
            >
                <p>Are you sure you want to delete it? It can't be undone</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img
                            src={`http://localhost:8080/${props.image}`}
                            alt={props.title}
                        />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>
                            VIEW ON MAP
                        </Button>
                        {authCtx.userId === props.creatorId && (
                            <Button to={`/places/${props.id}`}>EDIT</Button>
                        )}
                        {authCtx.userId === props.creatorId && (
                            <Button danger onClick={showConfirmModalHandler}>
                                DELETE
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
        </Fragment>
    );
};

export default PlaceItem;
