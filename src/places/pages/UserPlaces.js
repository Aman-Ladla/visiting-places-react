import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/componenets/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/componenets/UIElements/LoadingSpinner";
import useHttpClient from "../../shared/hooks/http-hook";
import PlacesList from "../components/PlacesList";

const UserPlaces = () => {
    const userId = useParams().userId;

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchUserPlaces = async () => {
            try {
                const resData = await sendRequest(
                    `http://localhost:8080/api/places/user/${userId}`
                );
                setPlaces(resData.places);
            } catch (error) {}
        };
        fetchUserPlaces();
    }, [sendRequest, userId]);

    const deletePlaceHandler = (placeId) => {
        setPlaces(places.filter((place) => place.id !== placeId));
    };

    const userPlaces = places.filter((place) => place.creator === userId);
    return (
        <Fragment>
            {error && <ErrorModal error={error} onClear={clearError} />}
            {isLoading && <LoadingSpinner />}
            {!isLoading && places && (
                <PlacesList items={userPlaces} onDelete={deletePlaceHandler} />
            )}
        </Fragment>
    );
};

export default UserPlaces;
