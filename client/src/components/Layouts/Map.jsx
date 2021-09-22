import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import {get} from '../../utils/requests'; 
import Spinner from "../Extras/Spinner";
import './Map.css';
// import './location-pin.svg';
function Map(props) { 
  const [logEntries, setLogEntries] = useState([]);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 3,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] =useState(true);
  const getEntries = async () => {
    const {data:{logEntries}} = await get('/public/getLogEntries');
    // console.log(logEntries);
    setLogEntries(logEntries);
  }
  useEffect(() => {
    setLoading(true);
    getEntries();
    setLoading(false);
  }, []); 
  return (
  <>
    {loading?<Spinner/>:null}
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker
            latitude={entry.latitude}
            longitude={entry.longitude}
          >
            <div
              onClick={()=>setShowPopup({
                showPopup,
                [entry._id]:true
              })}
            
            >
              <svg 
                className="marker" 
                style={{
                  height:`${6*viewport.zoom}px`,
                  width: `${6*viewport.zoom}px`,
                  fill: entry.owner.color,
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                >
                <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
              </svg>
              
            </div>
          </Marker>
          {
            showPopup[entry._id]?(
            <Popup
            latitude={entry.latitude}
            longitude={entry.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}

            onClose={() => setShowPopup({showPopup,[entry._id]:false})}
            anchor="top">
          <div  className="popup">
            <h3>{entry.title}</h3>
            <p>{entry.comments}</p>
            {entry.rating!==0 && <p>Rating: {entry.rating}</p>}
            <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
            {entry.image && <img src={entry.image} alt={entry.title}/>}
            <p style={{textAlign:"right"}}>Created By {entry.owner.username}</p>
          </div>
        </Popup>):null}
        </React.Fragment>
      ))}
      {props.children}
    </ReactMapGL>
    </>
  );
}

export default Map;
