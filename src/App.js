import './App.css';
import Select from "react-select";
import axios from "axios";
import { useEffect, useRef, useState } from 'react';

function App() {
  const [options, setOptions] = useState([{}]);
  const [terms, setTerms] = useState(false);
  const [value, setValue] = useState();
  const [warning, setWarning] = useState(false);
  const name = useRef();
  const checkbox = useRef();

  useEffect(() => {
    const fetchOptions = async () => {
        const res = await axios.get("https://form-api-lnkt.onrender.com/api/options");
        setOptions(res.data);
    }
    fetchOptions();
  },[]);
  
  const handleClick = async () => {
    if (name.current.value === "" || value === undefined || terms === false)
      setWarning(true);
    else {
      setWarning(false);
      const user = {
        name : name.current.value,
        sector : value,
        agreeToTerms : terms
      };
      const res = await axios.get(`https://form-api-lnkt.onrender.com/api/users/${user.name}`);
      if(res.data){
        const update = await axios.put(`https://form-api-lnkt.onrender.com/api/user/${res.data._id}`, user);
      } else {
        try {
          const response = await axios.post("https://form-api-lnkt.onrender.com/api/post", user);
        } catch (error) {
            console.log(error);
        }
      }
    }
  };

  return (
    <div className="App w-100 h-screen flex items-center justify-center">
      <div className=" bg-slate-300 rounded-md p-5">
        <p>Please enter your name and pick the Sectors you are currently involved in.</p>
        <div className="flex mt-3 items-center">
          <p className="mr-3"><b>Name:</b></p>
          <input type="text" className="border-slate-500 border-2 rounded-sm pl-1" ref={name} required></input>
        </div>
        <div className="flex mt-3 items-center">
          <p className="mr-3"><b>Sectors:</b></p>
          <Select options={options[0].Data} onChange={(input)=> setValue(input.label)} className=" w-60" required />
        </div>
        <div className="flex mt-3 items-center">
          <input type="checkbox" value={terms} onClick={()=>setTerms(!terms)} className="mr-3" ref={checkbox} required />
          <p>Agree to terms</p>
        </div>
        { warning ? <p className="text-red-500">Please fill out the form.</p> : "" }
        <button className=" bg-cyan-600 rounded-sm w-28 p-1" onClick={()=> handleClick()}>Save</button>
      </div>
    </div>
  );
}

export default App;




