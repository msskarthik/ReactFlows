import { Link } from "react-router-dom";
import './appheader.css';


const AppHeader = () => {
    return (
        <div className="header">
            <Link to="/home" className="spanHeader">SC WorkFlows</Link>
        </div>
    )
}

export default AppHeader;