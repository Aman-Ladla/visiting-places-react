import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../shared/componenets/FormElements/Button";
import Input from "../../shared/componenets/FormElements/Input";
import Card from "../../shared/componenets/UIElements/Card";
import ErrorModal from "../../shared/componenets/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/componenets/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import useHttpClient from "../../shared/hooks/http-hook";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import "./PlaceForm.css";

const UpdatePlace = () => {
    const placeId = useParams().placeId;

    const initialValues = {
        inputs: {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
        },
        isValid: false,
    };

    const [formState, inputHandler, setFormData] = useForm(initialValues);

    const [place, setPlace] = useState();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const authCtx = useContext(AuthContext);

    const history = useHistory();

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const resData = await sendRequest(
                    `http://localhost:8080/api/places/${placeId}`
                );

                setPlace(resData.place);

                if (resData.place) {
                    setFormData(
                        {
                            title: {
                                value: resData.place.title,
                                isValid: true,
                            },
                            description: {
                                value: resData.place.description,
                                isValid: true,
                            },
                        },
                        true
                    );
                }
            } catch (error) {}
        };

        fetchPlaces();
    }, [placeId, sendRequest, setFormData]);

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!place && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    const placeUpdateSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            await sendRequest(
                `http://localhost:8080/api/places/${placeId}`,
                "PATCH",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authCtx.token,
                }
            );

            history.push(`/${authCtx.userId}/places`);
        } catch (error) {}
    };

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && place && (
                <form
                    className="place-form"
                    onSubmit={placeUpdateSubmitHandler}
                >
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter valid value!"
                        onInput={inputHandler}
                        initialValue={place.title}
                        initialValid={true}
                    />
                    <Input
                        id="description"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter valid description of min 6 characters!"
                        onInput={inputHandler}
                        initialValue={place.description}
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                    </Button>
                </form>
            )}
        </Fragment>
    );
};

export default UpdatePlace;
