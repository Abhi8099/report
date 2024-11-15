"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '@/utils/api';

interface GoogleSearchConsoleData {
    id: number;
    site: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    date: any;
    query: any;
    page: any;
    country: any;
}

interface GoogleSearchConsoleContextProps {
    data: GoogleSearchConsoleData[];
    dateData: GoogleSearchConsoleData[];
    pageData: GoogleSearchConsoleData[];
    queryData: GoogleSearchConsoleData[];
    countryData: GoogleSearchConsoleData[];
    fetchGSCData: ( accessTokenGoogle:string , projectUrl: string, dateRange: [string, string]) => void;
    loading: boolean;
    predefinedDays: number | null; // Updated type
    setpredefinedDays: React.Dispatch<React.SetStateAction<number | null>>;
}

const GoogleSearchConsoleDataContext = createContext<GoogleSearchConsoleContextProps | undefined>(undefined);

export const GoogleSearchConsoleDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<GoogleSearchConsoleData[]>([]);
    const [dateData, setdateData] = useState<GoogleSearchConsoleData[]>([]);
    const [countryData, setcountryData] = useState<GoogleSearchConsoleData[]>([]);
    const [pageData, setPageData] = useState<GoogleSearchConsoleData[]>([]);
    const [queryData, setQueryData] = useState<GoogleSearchConsoleData[]>([]);
    const [predefinedDays, setpredefinedDays] = useState<number | null>(null); // Updated state type

    const fetchGSCData = async ( accessTokenGoogle:string , projectUrl: string, dateRange: [string, string]) => {
        console.log(accessTokenGoogle);
        console.log(projectUrl);
        console.log(dateRange[0]);
        console.log(dateRange[1]);
        
        setLoading(true); // Show loader during fetching
        try {
            const response = await axios.post(`${BASE_URL}api/gsc-data/`, {
                // id: projectId,
                "site_url": projectUrl,
                "access_token": accessTokenGoogle ,
                "start_date": dateRange[0],
                "end_date": dateRange[1]
            });
            toast.success(`Fetched Google Search Console Data `);
            setData(response.data);
            setdateData(response.data.date_data);
            setcountryData(response.data.country_data);
            setPageData(response.data.page_data);
            setQueryData(response.data.query_data);
            console.log('GSC Data:', response);
        } catch (error: any) {
            console.error('Error fetching Google Search Console data:', error);
            toast.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GoogleSearchConsoleDataContext.Provider value={{ 
            data, 
            fetchGSCData, 
            loading, 
            dateData, 
            countryData, 
            queryData, 
            pageData, 
            setpredefinedDays, 
            predefinedDays 
        }}>
            {children}
        </GoogleSearchConsoleDataContext.Provider>
    );
};

export const useGoogleSearchConsoleData = () => {
    const context = useContext(GoogleSearchConsoleDataContext);
    if (context === undefined) {
        throw new Error('useGoogleSearchConsoleData must be used within a GoogleSearchConsoleDataProvider');
    }
    return context;
};
