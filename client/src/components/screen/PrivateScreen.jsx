import * as React from "react";
import { useState, useEffect } from "react";
import {useHistory} from "react-router-dom";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import {userGet,userPost} from '../../utils/requests'; 
import './PrivateScreen.css';
import LogEntryForm from '../Extras/LogEntryForm';
// import './location-pin.svg';
function Map() { 
  const history = useHistory();
  const [logEntries, setLogEntries] = useState([]);
  const [onlyMyEntries,setOnlyMyEntries] =useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 3,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  useEffect(() => {
    (async () => {
      try {
      const {data:{logEntries}} = await userGet('/user/getLogEntries',history);
      // console.log(logEntries);
      setLogEntries(logEntries);
      }catch(error){console.log(error)}
    })();
  }, [history]); 
  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    })
  };
  const handleLogout= async ()=> {
    try{
      await userPost('/auth/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      history.push('/');
    }catch(err){
      console.log(err);
    }
  
  }
  const deleteEntry= async (id)=>{
    try{
      await userPost('/user/deleteLogEntry',{logId:id});
      setLogEntries(logEntries.filter(entry=>entry._id!==id));
    }catch(err){
      console.log(err);
    }
  }  
  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        !(onlyMyEntries && !entry.isOwner) &&
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
            <p style={{textAlign:"right"}}>Created By {entry.isOwner?'You':entry.owner.username}</p>
            {entry.isOwner && <button className="btn btn-primary" onClick={()=>deleteEntry(entry._id)}>Delete</button>}
          </div>
        </Popup>):null}
        </React.Fragment>
      ))}
      {
        addEntryLocation ? (
          <>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
            anchor="top">
          <div className="popup">
            <LogEntryForm onClose={()=>{
              setAddEntryLocation(null);
            }} location={addEntryLocation}
              addLogEntry = {(entry)=>{setLogEntries([...logEntries,entry]);}}
            />           
          </div>
        </Popup>
        <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            draggable={true} onDrag={(e)=>{setAddEntryLocation({longitude:e.lngLat[0],latitude:e.lngLat[1]})}}
          >
            <div>
              <svg 
                className="marker" 
                style={{
                  height:`${6*viewport.zoom}px`,
                  width: `${6*viewport.zoom}px`,
                  fill: 'red',
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                >
                <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
              </svg>
            </div>
          </Marker>
          </>
        ) : null 
      }
      <button className="btn nav-btn" onClick={()=>setOnlyMyEntries(!onlyMyEntries)} style={{right:"150px"}}>{onlyMyEntries?'All Entries':'Your Entries'}</button>
      <button className="btn nav-btn" onClick={handleLogout} style={{right:"30px"}}>LOGOUT</button>
    </ReactMapGL>
  );
}

export default Map;
