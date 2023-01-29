import { Fragment, useContext, useState } from "react";
import Button from "../../shared/componenets/FormElements/Button";
import ImageUpload from "../../shared/componenets/FormElements/ImageUpload";
import Input from "../../shared/componenets/FormElements/Input";
import Card from "../../shared/componenets/UIElements/Card";
import ErrorModal from "../../shared/componenets/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/componenets/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import useHttpClient from "../../shared/hooks/http-hook";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import "./Auth.css";

const Auth = () => {
    const initialValues = {
        inputs: {
            email: {
                value: "",
                isValid: false,
            },
            password: {
                value: "",
                isValid: false,
            },
        },
        isValid: false,
    };

    const authCtx = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const resData = await sendRequest(
                    "http://localhost:8080/api/users/login",
                    "POST",
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        "Content-Type": "application/json",
                    }
                );
                authCtx.login(resData.userId, resData.token);
            } catch (error) {}
        } else {
            try {
                const formData = new FormData();
                formData.append("name", formState.inputs.name.value);
                formData.append("email", formState.inputs.email.value);
                formData.append("password", formState.inputs.password.value);
                formData.append("image", formState.inputs.image.value);

                const resData = await sendRequest(
                    "http://localhost:8080/api/users/signup",
                    "POST",
                    formData
                );
                console.log(resData);
                authCtx.login(resData.userId, resData.token);
            } catch (error) {}
        }
    };

    const setIsLoginModeHandler = () => {
        if (!isLoginMode) {
            // delete formState.inputs.name;
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false,
                    },
                    image: {
                        value: null,
                        isValid: false,
                    },
                },
                false
            );
        }
        setIsLoginMode((prevMode) => !prevMode);
    };

    const [formState, inputHandler, setFormData] = useForm(initialValues);

    return (
        <Fragment>
            {error && <ErrorModal error={error} onClear={clearError} />}
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required!</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            id="name"
                            element="input"
                            type="text"
                            label="Name"
                            errorText="Please enter a valid input!"
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && (
                        <ImageUpload
                            center
                            id="image"
                            onInput={inputHandler}
                            errorText={"Please provide an image!"}
                        />
                    )}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email"
                        errorText="Please enter a valid input!"
                        validators={[VALIDATOR_EMAIL()]}
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        label="Password"
                        type="password"
                        errorText="Please enter a valid password (atleast 6 characters!)"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? "Login" : "Signup"}
                    </Button>
                </form>
                <Button inverse onClick={setIsLoginModeHandler}>
                    Switch to {isLoginMode ? "Signup" : "Login"}
                </Button>
            </Card>
        </Fragment>
    );
};

export default Auth;
