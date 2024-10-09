"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
    analyticsData: GoogleAnalyticsData[];
    dateAnalyticsData: GoogleAnalyticsData[];
    countryAnalyticsData: GoogleAnalyticsData[];
    pageAnalyticsData: GoogleAnalyticsData[];
    fetchAnalyticsData: (projectId: string, projectUrl: string, dateRange: [string, string]) => void;
    Analyticsloading: boolean;
}

const GoogleAnalyticsDataContext = createContext<GoogleAnalyticsContextProps | undefined>(undefined);

export const GoogleAnalyticsDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [Analyticsloading, setAnalyticsloading] = useState<boolean>(false);
    const [analyticsData, setAnalyticsData] = useState<GoogleAnalyticsData[]>([]);
    const [dateAnalyticsData, setDateAnalyticsData] = useState<GoogleAnalyticsData[]>([]);
    const [countryAnalyticsData, setCountryAnalyticsData] = useState<GoogleAnalyticsData[]>([]);
    const [pageAnalyticsData, setPageAnalyticsData] = useState<GoogleAnalyticsData[]>([]);

    const fetchAnalyticsData = async (projectId: string, projectUrl: string, dateRange: [string, string]) => {
        setAnalyticsloading(true); // Show loader during fetching
        try {
            const response = await axios.post('http://192.168.211.33:8000/api/google-analytics-data/', {
                project_id: projectId,
                url: projectUrl,
                start_date: dateRange[0],
                end_date: dateRange[1],
            });
            toast.success('Fetched Google Analytics Data');
            setAnalyticsData(response.data);
            setDateAnalyticsData(response.data.date_data);
            setCountryAnalyticsData(response.data.country_data);
            setPageAnalyticsData(response.data.page_data);
            console.log('Google Analytics Data:', response);
        } catch (error: any) {
            console.error('Error fetching Google Analytics data:', error);
            toast.error('Error fetching analytics data');
        } finally {
            setAnalyticsloading(false);
        }
    };

    return (
        <GoogleAnalyticsDataContext.Provider value={{ analyticsData, fetchAnalyticsData, Analyticsloading, dateAnalyticsData, countryAnalyticsData, pageAnalyticsData }}>
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
