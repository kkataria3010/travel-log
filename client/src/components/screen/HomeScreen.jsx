import { Link } from "react-router-dom";
const HomeScreen = () => {
    return (
        <div id="HomeScreen">
            <Link to="/login">
                <button className='btn nav-btn' style={{right:'185px'}}>LOGIN</button>
            </Link>
            <Link to="/register">
                <button className='btn nav-btn' style={{right:'40px'}}>REGISTER</button>
            </Link>
        </div>
    );
}

export default HomeScreen;