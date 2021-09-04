import { Redirect, Route } from "react-router";

const PublicRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                !localStorage.getItem("accessToken") ? (
                    <Component {...props} />
                ) : (<Redirect to="/"/>)
            }
        />
    ) ;
};


export default PublicRoute;