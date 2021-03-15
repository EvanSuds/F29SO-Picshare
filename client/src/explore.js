import React, {useState, useEffect}       from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "./explore.css"
import { NONAME } from "dns";
import Axios from 'axios';
import Navbar from './components/Navbar/NavBar';
import SideDrawer from './components/SideDrawer/SideDrawer';
import Backdrop from './components/Backdrop/Backdrop'
//credintials for get, using axios
Axios.defaults.withCredentials = true;




const libraries = ["places"];
const mapContainerStyle = { // set width/height of the map container
  width: '100vw',
  height: '100vh',
};
const center = { // set initial position of map 
  lat: 55.909549,
  lng: -3.318807,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
}

export default function Explore() {

  


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAhlnlgHa_2GfJVSbupAcK_aIMxlc7DSoI", // api key stored in .env.local file
    libraries,
  });

  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [sideDrawer, setSideDrawer] = React.useState(null);
  const [backDrop, setBackDrop] = React.useState(null);


  const [sideDrawerOpen, setSideDrawerOpen] = React.useState(false)
  

  const drawerToggleClick = () => { 
    console.log(sideDrawerOpen)
    setSideDrawerOpen(!sideDrawerOpen);
  };
      
  const backdropClick = () => {
      setSideDrawerOpen(false)
  };

  
    
  



  const onMapClick = React.useCallback((event) => { // setting event on click of map
    setMarkers(current => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    }])
  }, []); // stores events in array

  const mapRef = React.useRef(); //keeping track of reference to map so we can pan
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({lat,lng}) => {  //panning function that takes lat+lng of search selection and pans map to it
    mapRef.current.panTo({lat,lng});
    mapRef.current.setZoom(14);
    panTo({lat,lng});
  }, []);
  

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";


  return ( 
  
  
  
  <div>
     <Navbar drawerClickedHandler={drawerToggleClick} />
     
      {sideDrawerOpen?
      <SideDrawer />
      
      :null }

    {sideDrawerOpen?
          <Backdrop click={backdropClick} />
          
    :null }



    <Search panTo={panTo} />
    <Locate panTo={panTo} />

    <GoogleMap //map info
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      options={options}
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      {markers.map((marker) => (
        <Marker //marker info
          key={marker.time.toISOString()}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => {
            setSelected(marker);
          }}
        />
      ))}

      {selected ? (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => {
            setSelected(null);
          }}
        >
          <div>
            <h2>Example</h2>
            <p>Added {formatRelative(selected.time, new Date())}</p>
          </div>
        </InfoWindow>) : null}


    </GoogleMap>
  </div>
  );
}


function Locate ({panTo}){
  return <button className="Locate" onClick={() => {
    navigator.geolocation.getCurrentPosition((position) => {
      panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }, () => null);
  }}>
    <img src="favicon.ico" alt="locate me"/>
    </button>
}



function Search({panTo}) {


   

  const [searchTerm, setSearchTerm] = useState('');
  const [response, setResponse] = useState([]);
  const [interests, setInterestList] = useState([]);

  const filteredInterest = 
          interests.filter(interest => {
          return interest.toLowerCase().includes(searchTerm);
      })

  const printInterest = 
    
    filteredInterest.slice(0,10).map((item) => 
    <li className="mapresult" >{item}, </li> 
    
  );
  
  
  

  const getInterests = () => {
    Axios.get('http://localhost:3001/getInterest', {
        
    }).then((response) => {
        setResponse(response);
        
        initInterests();
  
    })
  }
  
  
  
  const initInterests = () => {
    setInterestList([]);
    console.log(response)
    if(typeof response.data !== 'undefined'){
        for(var i = 0; i < response.data.length; i++){
            setInterestList(interests => [...interests,response.data[i].InterestsName])
        }
    }
    
  }
  


  const [Userresponse, setResponseUser] = useState([]);
  const [users, setUserList] = useState([]);

  const filteredUsers = 
          
          users.filter(user => {
          return user.toLowerCase().includes(searchTerm);
      })

  const printUsers =  filteredUsers.slice(0,10).map((item) => 
  <li className="mapresult" > {item}, </li>
    
  );

  const getUsers = () => {
    Axios.get('http://localhost:3001/getUsers', {
        
    }).then((response) => {
        setResponseUser(response);
        
        initUsers();
  
    })
  }
  
  
  
  const initUsers = () => {
    setUserList([]);
    console.log(Userresponse)
    if(typeof Userresponse.data !== 'undefined'){
        for(var i = 0; i < Userresponse.data.length; i++){
            setUserList(users => [...users,Userresponse.data[i].Username])
        }
    }
    
  }





   









  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 55.909549, lng: () => -3.318807 },   //setting prefered location suggestions to around HW Campus
      radius: 100 * 1000,
    },
  });



  return (
         

    <div className="search">
      <Combobox onSelect={async (address) => { 
        setValue(address, false);
        clearSuggestions();

        try {   //awaiting a selection to then get its lat+lng for panning
          const results = await getGeocode({address});
          const {lat, lng} = await getLatLng(results[0]);
          panTo({lat, lng});
        } catch(error){
          console.log("error!")
        }
        }}
        >  
        <ComboboxInput value={value} onChange={(e) => {
          getInterests();
          getUsers();
          setSearchTerm(e.target.value);
          setValue(e.target.value);
        }}
          disabled={!ready}
          placeholder="Enter Address"
        />
        <ComboboxPopover className="list"> 
        <ComboboxList>
          <h1 className="searchTitles">Locations</h1>
            {status === "OK" && 
              data.map(({id, description}) => (<ul className="searchList"><ComboboxOption className="mapresult" key={id} value={description} /> </ul>
            ))}
          <h1 className="searchTitles">Users</h1>
          <ul className="searchList"> {printUsers} </ul>
          <h1 className="searchTitles">Interests</h1>
          <ul className="searchList"> {printInterest} </ul>
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}