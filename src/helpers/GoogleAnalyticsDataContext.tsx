"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '@/utils/api';

// Define the structure for Google Analytics data
interface GoogleAnalyticsData {
    id: number;
    sessions: number;
    users: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    date: any;
    country: any;

    pagePath: any;
}

interface GoogleAnalyticsContextProps {
    analyticsData: any;
    dateAnalyticsData: GoogleAnalyticsData[];
    countryAnalyticsData: GoogleAnalyticsData[];
    pageAnalyticsData: GoogleAnalyticsData[];
    fetchAnalyticsData: (accessTokenGoogle:string, propertyId: string, dateRange: [string, string]) => void;
    Analyticsloading: boolean;
    predefinedDays: number | null; // Updated type
    setpredefinedDays: React.Dispatch<React.SetStateAction<number | null>>;
}

const GoogleAnalyticsDataContext = createContext<GoogleAnalyticsContextProps | undefined>(undefined);

export const GoogleAnalyticsDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [Analyticsloading, setAnalyticsloading] = useState<boolean>(false);
    const [analyticsData, setAnalyticsData] = useState<GoogleAnalyticsData[]>([]);
    const [dateAnalyticsData, setDateAnalyticsData] = useState<GoogleAnalyticsData[]>([]);
    const [countryAnalyticsData, setCountryAnalyticsData] = useState<GoogleAnalyticsData[]>([]);
    const [pageAnalyticsData, setPageAnalyticsData] = useState<GoogleAnalyticsData[]>([]);
    const [predefinedDays, setpredefinedDays] = useState<number | null>(null); 

    const fetchAnalyticsData = async (accessTokenGoogle:string, propertyId: string, dateRange: [string, string]) => {

        console.log(accessTokenGoogle);
        console.log(propertyId);
        console.log(dateRange[0]);
        console.log(dateRange[1]);
        setAnalyticsloading(true); // Show loader during fetching
        try {
            const response = await axios.post(`${BASE_URL}api/analytics/`, {
                "access_token": accessTokenGoogle,
                "property_id": propertyId,
                "start_date": dateRange[0],
                "end_date": dateRange[1],
            });
            toast.success('Fetched Google Analytics Data');
            setAnalyticsData(response.data);
            setDateAnalyticsData(response.data.date_data);
            setCountryAnalyticsData(response.data.country_data);
            setPageAnalyticsData(response.data.page_data);
            console.log('Google Analytics Data:', response);
        } catch (error: any) {
            console.error('Error fetching Google Analytics data:', error);
            if(error.response.status === 400){
                toast.error('Please connect to Google');
                }else{
                    toast.error('Error fetching Google Analytics data');
                }
        } finally {
            setAnalyticsloading(false);
        }
    };

    return (
        <GoogleAnalyticsDataContext.Provider value={{ analyticsData, fetchAnalyticsData, Analyticsloading, dateAnalyticsData, countryAnalyticsData, pageAnalyticsData,setpredefinedDays, predefinedDays  }}>
            {children}
        </GoogleAnalyticsDataContext.Provider>
    );
};

export const useGoogleAnalyticsData = () => {
    const context = useContext(GoogleAnalyticsDataContext);
    if (context === undefined) {
        throw new Error('useGoogleAnalyticsData must be used within a GoogleAnalyticsDataProvider');
    }
    return context;
};
