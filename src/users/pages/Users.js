import { Fragment, useEffect, useState } from "react";
import UserList from "../../places/components/UserList";
import ErrorModal from "../../shared/componenets/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/componenets/UIElements/LoadingSpinner";
import useHttpClient from "../../shared/hooks/http-hook";

const Users = () => {
    const [users, setUsers] = useState();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const resData = await sendRequest(
                    "http://localhost:8080/api/users"
                );

                setUsers(resData.users);
            } catch (error) {}
        };
        fetchUsers();
    }, [sendRequest]);

    return (
        <Fragment>
            {error && <ErrorModal error={error} onCancel={clearError} />}
            {isLoading && <LoadingSpinner />}
            {!isLoading && users && <UserList items={users} />}
        </Fragment>
    );
};

export default Users;
