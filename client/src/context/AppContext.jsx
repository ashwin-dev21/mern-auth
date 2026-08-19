import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const api = axios.create({
        baseURL: backendUrl,
        withCredentials: true
    });

    const getAuthState = async () => {
        try {
            const { data } = await api.get('/api/auth/is-auth');

            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
            }

        } catch (error) {
            console.log("AUTH CHECK ERROR:", error.response?.data || error.message);
            setIsLoggedIn(false);
        }
    };

    const getUserData = async () => {
        try {
            const { data } = await api.get('/api/user/data');

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(
                "GET USER DATA ERROR:",
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        api,
        isLoggedIn,
        setIsLoggedIn,
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