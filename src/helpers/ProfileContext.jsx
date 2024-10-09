
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '@/utils/api';


// Create the Profile Context
const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch profile
    const fetchProfile = async () => {
        setLoading(true);
        const token = Cookies.get("login_access_token");
        try {
            const response = await axios.get(`${BASE_URL}api/current_user/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setProfile(response.data);
            console.log("Fetched Profile: ", response.data);
        } catch (err) {
            console.error("Error fetching profile: ", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileContext.Provider value={{ profile, loading, error, fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};
