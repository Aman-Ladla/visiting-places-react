import { Fragment, useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../shared/componenets/FormElements/Button";
import ImageUpload from "../../shared/componenets/FormElements/ImageUpload";
import Input from "../../shared/componenets/FormElements/Input";
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

const NewPlace = () => {
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
            address: {
                value: "",
                isValid: false,
            },
            image: {
                value: "",
                isValid: false,
            },
        },
        isValid: false,
    };

    const [formState, inputHandler] = useForm(initialValues);

    const authCtx = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const history = useHistory();

    const placeSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            formData.append("title", formState.inputs.title.value);
            formData.append("description", formState.inputs.description.value);
            formData.append("address", formState.inputs.address.value);
            formData.append("image", formState.inputs.image.value);

            await sendRequest(
                "http://localhost:8080/api/places",
                "POST",
                formData,
                {
                    Authorization: "Bearer " + authCtx.token,
                }
            );
            history.push("/");
        } catch (error) {}
    };

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    errorText="Please enter a valid input!"
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    label="Description"
                    errorText="Please enter a valid input (atleast 6 characters!"
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    type="text"
                    label="Address"
                    errorText="Please enter a valid addres!"
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                />
                <ImageUpload
                    id="image"
                    onInput={inputHandler}
                    errorText={"Please provide an image!"}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    Submit
                </Button>
            </form>
        </Fragment>
    );
};

export default NewPlace;
