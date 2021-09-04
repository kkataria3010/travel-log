import { Redirect, Route } from "react-router";

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                localStorage.getItem("accessToken") ? (
                    <Component {...props} />
                ) : (<Redirect to="/home"/>)
            }
        />
    ) ;
};


export default PrivateRoute;