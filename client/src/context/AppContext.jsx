import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth', { withCredentials: true });
            setIsLoggedin(data.success);
            getUserData();
        } catch (err) {
            toast.error(err.message);
        }
    };

    axios.defaults.withCredentials = true;

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data', { withCredentials: true });
            
            data.success ? setUserData(data.userData) : toast.error(data.message)
        }catch (err) {
            toast.error(err.message);
        }

    }

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};