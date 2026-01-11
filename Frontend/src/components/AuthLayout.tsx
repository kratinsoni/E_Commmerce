import React, { useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function authLayout({children}: {children: React.ReactNode}) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    const getUser = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users/me`, {
                withCredentials: true,
            });
            console.log('User data:', response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.log('Error fetching user data:', error);
            setIsAuthenticated(false);
            navigate("/auth/login")
        }
    }

    useEffect(() => {
        getUser();
    }, []);

  return (
    <div>
        {isAuthenticated && children}
    </div>
  )
}

export default authLayout
