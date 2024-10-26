'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ProjectHeader from '@/components/ProjectHeader';
import { Modal, Form, Input, DatePicker, Button, Select } from 'antd';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleAnalyticsData } from '@/helpers/GoogleAnalyticsDataContext';
import { useProjectContext } from '@/helpers/ProjectContext';
import dayjs from 'dayjs';
import { Skeleton } from '@mui/material';
import ChartAnalytics from '@/components/Charts/ChartAnalytics';
import WorldMap from '@/components/Charts/WorldMap';
import UserAcquisitionChart from '@/components/Charts/UserAcquisitionChart';


const { RangePicker } = DatePicker;
const { Option } = Select;

interface AnalyticsDataItem {
    date: string;
    sessionMedium: string;
    sessionPrimaryChannelGroup: string;
    Totalusers: number;
    Newusers: number;
    engagedSessions: number;
    activeUsers: number;
    userEngagementDuration: number;
    Eventcount: number;
    Returningusers: number;
    Averageengagementtimeperactiveuser: number;
    Engagedsessionsperactiveuser: number;
}

export default function Analytics() {

    const formatDate = (dateStr: any) => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const formattedDate = new Date(`${year}-${month}-${day}`);
        return formattedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Function to format numbers with commas
    const formatNumber = (number: any) => {
        return number.toLocaleString();
    };

    // Function to format decimal numbers to two decimal places
    const formatDecimal = (number: any) => {
        return number.toFixed(2);
    };

    const groupByDate = (data: AnalyticsDataItem[]): Record<string, AnalyticsDataItem[]> => {
        const groupedData: Record<string, AnalyticsDataItem[]> = {};
        data.forEach((item: AnalyticsDataItem) => {
            if (!groupedData[item.date]) {
                groupedData[item.date] = [];
            }
            groupedData[item.date].push(item);
        });
        return groupedData;
    };


    const { data: session, status } = useSession();
    const [accessTokenGoogle, setAccessTokenGoogle] = useState("");
    const [form] = Form.useForm();
    const [showRangePicker, setShowRangePicker] = useState(false);

    const today = dayjs();

    useEffect(() => {
        console.log("Session status:", status)
        console.log("Session data:", session)

        if (session) {
            localStorage.setItem('accessTokenGoogle', session?.accessToken);
            setAccessTokenGoogle(session?.accessToken)
            console.log("Retrieved access token:", session.accessToken);
        }
    }, [session, status])

    // Set default date range to last 7 days
    useEffect(() => {
        const defaultRange = [today.subtract(7, 'days').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];
        form.setFieldsValue({ dateRange: defaultRange });
    }, []);

    const handleDateChange = (dates: any) => {
        if (dates) {
            const startDate = dates[0];
            const endDate = dates[1];
            fetchAnalyticsData(accessTokenGoogle, selectedProject?.project_id, [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]);
        }
    };


    const handlePredefinedRangeChange = (value: number) => {
        setShowRangePicker(value === 30);
        setpredefinedDays(value);

        const startDate = dayjs(today.subtract(value, 'days'));
        const endDate = dayjs(today);
        form.setFieldsValue({ dateRange: [startDate, endDate] });
        fetchAnalyticsData(accessTokenGoogle, selectedProject?.project_id, [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]);
    };



    const { selectedProject } = useProjectContext();
    console.log(selectedProject);

    const { analyticsData, setpredefinedDays, predefinedDays, fetchAnalyticsData, Analyticsloading } = useGoogleAnalyticsData();
    console.log(analyticsData);

    const groupedData = groupByDate(analyticsData?.user_acquisition_data || []);

    const pathname = usePathname();
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            fetchGA4Properties();
        }
    }, [session]);

    useEffect(() => {
        // Listen for messages from the popup
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'signin-successful') {
                window.location.reload(); // Reload the page to update the session
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const fetchGA4Properties = async () => {
        console.log("Fetching GA4 properties...");
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/analytics?action=getGA4Properties', {
                cache: 'force-cache',
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setProperties(data.properties || []);
        } catch (error: any) {
            console.error('Error fetching GA4 properties:', error.message);
            setError(`Failed to fetch GA4 properties: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const [isSigningIn, setIsSigningIn] = useState(false)

    const handleConnect = async () => {
        setIsSigningIn(true)
        console.log("Opening Google login popup...")

        try {
            const result = await signIn('google', {
                callbackUrl: `${window.location.origin}${window.location.pathname}`,
                redirect: false,
                prompt: 'select_account'
            })

            if (result?.error) {
                console.error("Sign-in error:", result.error)
                alert(`Sign-in failed: ${result.error}`)
            } else if (result?.url) {
                console.log("Sign-in successful")
                // You can redirect here if needed
                // window.location.href = result.url
            }
        } catch (error) {
            console.error("Sign-in error:", error)
            alert('An error occurred during sign-in. Please try again.')
        } finally {
            setIsSigningIn(false)
        }
    }



    if (status === "loading") {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <span className="ml-2 text-primary">Loading session...</span>
                </div>
            </DefaultLayout>
        );
    }

    if (!session) {
        return (
            <DefaultLayout>
                <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">Connect to Google Analytics</h1>
                    <button
                        onClick={handleConnect}
                        className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Connect with <FcGoogle className="text-2xl bg-white rounded-full" />
                    </button>
                </div>
            </DefaultLayout>
        );
    }

    // if (isLoading) {
    //   return (
    //     <DefaultLayout>
    //       <div className="flex justify-center items-center min-h-[80vh]">
    //         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    //         <span className="ml-2 text-primary">Loading properties...</span>
    //       </div>
    //     </DefaultLayout>
    //   );
    // }


    return (
        <DefaultLayout>
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-black">Google Analytics Dashboard</h1>
                    <button
                        onClick={() => {
                            console.log("Signing out...");
                            signOut({ callbackUrl: pathname });
                        }}
                        className="bg-primary hover:bg-red-500 text-white font-bold py-1.5 px-4 rounded-md flex gap-2 items-center transition duration-300"
                    >
                        Disconnect From Google {session?.user?.name}
                        <Image
                            src={session?.user?.image ?? '/images/user/user-20.png'}
                            width={30}
                            height={30}
                            alt="user avatar"
                            className="rounded-full"
                        />
                    </button>
                </div>

                <div className="mb-4 w-full md:mt-6">
                    <ProjectHeader />
                </div>

                <div className='w-full rounded-[10px] flex flex-col px-10 py-7.5 bg-white'>

                    <div className='flex justify-between '>
                        <div className='flex flex-[4] gap-8'>
                            {Analyticsloading ? (
                                // Show skeletons while loading
                                <>
                                    <div className='flex flex-col gap-3'>
                                        <Skeleton variant="text" width={100} height={30} className="rounded-[5px]" />
                                        <Skeleton variant="rectangular" animation="wave" width={170} height={50} className="rounded-[10px]" />
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <Skeleton variant="text" width={100} height={30} className="rounded-[5px]" />
                                        <Skeleton variant="rectangular" animation="wave" width={170} height={50} className="rounded-[10px]" />
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <Skeleton variant="text" width={100} height={30} className="rounded-[5px]" />
                                        <Skeleton variant="rectangular" animation="wave" width={170} height={50} className="rounded-[10px]" />
                                    </div>

                                </>
                            ) : (
                                // Show actual analytics data after loading
                                <>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-sm font-medium text-primary bg-[#F8F8F8] rounded-[5px] px-1 py-1'>Active Users</h3>
                                        <h3 className='text-primary font-normal text-3xl'>{analyticsData?.sum_active_users || 0}</h3>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-sm font-medium text-primary bg-[#F8F8F8] rounded-[5px] px-1 py-1'>New Users</h3>
                                        <h3 className='text-primary font-normal text-3xl'>{analyticsData?.sum_new_users || 0}</h3>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-sm font-medium text-primary bg-[#F8F8F8] rounded-[5px] px-1 py-1'>Page Views</h3>
                                        <h3 className='text-primary font-normal text-3xl'>{analyticsData?.PageViews || 0}</h3>
                                    </div>
                                    {/* <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-medium text-primary bg-[#F8F8F8] rounded-[5px] px-1 py-1'>Total Sessions</h3>
        <h3 className='text-primary font-normal text-3xl'>{analyticsData?.total_sessions || 0}</h3>
      </div> */}
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-sm font-medium text-primary bg-[#F8F8F8] rounded-[5px] px-1 py-1'>Event Count</h3>
                                        <h3 className='text-primary font-normal text-3xl'>{analyticsData?.event_Count || 0}</h3>
                                    </div>
                                    {/* <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-medium text-primary bg-[#F8F8F8] rounded-[5px] px-1 py-1'>Total Users</h3>
        <h3 className='text-primary font-normal text-3xl'>{analyticsData?.total_Users || 0}</h3>
      </div> */}
                                </>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col justify-start">
                            <Form layout="vertical" form={form} onFinish={() => { }}>
                                <div className="flex flex-col ">
                                    <Form.Item name="predefinedRange" className='border-black border rounded-[6px]'>
                                        <Select defaultValue={7} onChange={handlePredefinedRangeChange}>
                                            <Option value={7}>Last 7 days</Option>
                                            <Option value={15}>Last 15 days</Option>
                                            <Option value={30}>Last 30 days</Option>
                                        </Select>
                                    </Form.Item>

                                    {showRangePicker && (
                                        <Form.Item label="Date Range" name="dateRange">
                                            <RangePicker onChange={handleDateChange} />
                                        </Form.Item>
                                    )}
                                </div>
                            </Form>
                        </div>
                    </div>



                    <div className=''>
                        <ChartAnalytics />
                    </div>


                </div>

                <h2 className=' text-black font-semibold'>Suggested for you:</h2>
                <div className='flex gap-4 h-[50vh] '>
                    {/* Left Div for session_medium_by_session */}
                    <div className='w-1/3 rounded-[10px] flex flex-col px-10 py-7.5 bg-white overflow-auto'>
                        <h2 className='text-lg font-semibold mb-4 text-primary'>Session Medium by Session</h2>
                        {Analyticsloading ? (
                            <div>
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className='flex flex-col '>
                                        <Skeleton variant="text" width={270} height={30} className="rounded-[5px]" />
                                        <Skeleton variant="text" width={270} height={30} className="rounded-[5px]" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <table className='w-full text-left'>
                                <thead>
                                    <tr>
                                        <th className='py-2 border-b text-black'>MEDIUM</th>
                                        <th className='py-2 border-b text-black'>SESSIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.session_medium_by_session &&
                                        Object.entries(analyticsData.session_medium_by_session).map(([medium, sessionCount], index) => (
                                            <tr key={index}>
                                                <td className='py-2  border-b text-base font-medium'>{medium}</td>
                                                <td className='py-2  border-b text-base font-medium'>{sessionCount as React.ReactNode}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Right Div for views_by_page_title */}
                    <div className='w-2/3 rounded-[10px] flex flex-col px-10 py-7.5 bg-white overflow-auto  '>
                        <h2 className='text-lg font-semibold mb-4 text-primary '>Views by Page Title</h2>
                        {Analyticsloading ? (
                            <div>
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className='flex flex-col '>
                                        <Skeleton variant="text" width={770} height={30} className="rounded-[5px]" />
                                        <Skeleton variant="text" width={770} height={30} className="rounded-[5px]" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <table className='w-full text-left'>
                                <thead className=''>
                                    <tr className=''>
                                        <th className='py-2 border-b text-black'>PAGE TITLE</th>
                                        <th className='py-2 border-b text-black'>VIEWS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.views_by_page_title &&
                                        Object.entries(analyticsData.views_by_page_title).map(([pageTitle, views], index) => (
                                            <tr key={index}>
                                                <td className='py-2  border-b text-base font-medium'>{pageTitle}</td>
                                                <td className='py-2  border-b text-base font-medium'>{views as React.ReactNode}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className='flex gap-4 h-[50vh]'>
                    <div className=' bg-white flex gap-4 w-full '>

                        {/* First Div: World Map based on active_users_by_country */}
                        <div className='w-1/2 rounded-[10px] flex flex-col px-10 py-7.5 bg-white'>
                            <h2 className='text-lg font-semibold mb-4 text-primary'>Active Users by Country</h2>
                            {Analyticsloading ? (
                                <Skeleton variant="rectangular" animation="wave" width="100%" height={300} className="rounded-[10px]" />
                            ) : (
                                <WorldMap activeUsersData={analyticsData?.active_users_by_country} />
                            )}
                        </div>

                        {/* Second Div: Table based on active_users_by_country */}
                        <div className='w-1/2 rounded-[10px] flex flex-col px-10 py-7.5 bg-white overflow-auto'>
                            <h2 className='text-lg font-semibold mb-4 text-primary'>Active Users by Country Table</h2>
                            {Analyticsloading ? (
                                <div>
                                    <Skeleton variant="text" width={100} height={30} className="rounded-[5px]" />
                                    <Skeleton variant="rectangular" animation="wave" width="100%" height={200} className="rounded-[10px]" />
                                </div>
                            ) : (
                                <table className='w-full text-left'>
                                    <thead>
                                        <tr>
                                            <th className='py-2 border-b text-black'>Country</th>
                                            <th className='py-2 border-b text-black'>Active Users</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analyticsData.active_users_by_country &&
                                            Object.entries(analyticsData.active_users_by_country).map(([country, activeUsers], index) => (
                                                <tr key={index}>
                                                    <td className='py-2  border-b text-base font-medium'>{country}</td>
                                                    <td className='py-2  border-b text-base font-medium'>{activeUsers as React.ReactNode}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                    {/* Third Div: Event Counts by Event Name */}
                    <div className='w-1/3 rounded-[10px] flex flex-col  px-10 py-7.5 bg-white overflow-auto'>
                        <h2 className='text-lg font-semibold mb-4 text-primary'>Browser Data </h2>
                        {Analyticsloading ? (
                            <div>
                                <Skeleton variant="text" width={100} height={30} className="rounded-[5px]" />
                                <Skeleton variant="rectangular" animation="wave" width="100%" height={200} className="rounded-[10px]" />
                            </div>
                        ) : (
                            <table className='w-full text-left'>
                                <thead>
                                    <tr>
                                        <th className='py-2 border-b text-black'>Browser Name</th>
                                        <th className='py-2 border-b text-black'>Data Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.browser_data &&
                                        Object.entries(analyticsData.browser_data).map(([browserName, browserCount], index) => (
                                            <tr key={index}>
                                                <td className='py-2  border-b text-base font-medium'>{browserName}</td>
                                                <td className='py-2  border-b text-base font-medium'>{browserCount as React.ReactNode}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                        <h2 className='text-lg font-semibold mb-4 text-primary'>Device Data </h2>
                        {Analyticsloading ? (
                            <div>
                                <Skeleton variant="text" width={100} height={30} className="rounded-[5px]" />
                                <Skeleton variant="rectangular" animation="wave" width="100%" height={200} className="rounded-[10px]" />
                            </div>
                        ) : (
                            <table className='w-full text-left'>
                                <thead>
                                    <tr>
                                        <th className='py-2 border-b text-black'>Device Name</th>
                                        <th className='py-2 border-b text-black'>Data Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.device_data &&
                                        Object.entries(analyticsData.device_data).map(([deviceName, deviceCount], index) => (
                                            <tr key={index}>
                                                <td className='py-2  border-b text-base font-medium'>{deviceName}</td>
                                                <td className='py-2  border-b text-base font-medium'>{deviceCount as React.ReactNode}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <h2 className='text-black font-semibold'>User Acquisition:</h2>
                <div className='w-full rounded-[10px] flex flex-col px-10 py-7 bg-white'>
                    <UserAcquisitionChart data={analyticsData.user_acquisition_data} type={"user"} />
                    <div className='h-[50vh] overflow-auto'>
                        <table className='w-full text-left  '>
                            <thead className='relative'>
                                <tr className='sticky top-0 bg-white'>
                                    {/* <th className='py-3 border-b-2 border-gray-300 pr-2 text-black'>Date</th> */}
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Session Medium</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Channel Group</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Total Users</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>New Users</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Engaged Sessions</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Active Users</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Engagement Duration (min)</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Event Count</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Returning Users</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Avg Engagement Time/User (min)</th>
                                    <th className='py-3 border-b-2 text-base  pr-2 text-black'>Engaged Sessions/User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(groupedData).map((date) => (
                                    <React.Fragment key={date}>
                                        {/* Add a separator for each date group */}
                                        <tr className='bg-primary/10 '>
                                            <td colSpan={12} className='py-2 text-black font-semibold border-b-2 border-primary'>
                                                {formatDate(date)}
                                            </td>
                                        </tr>
                                        {groupedData[date].map((item, index) => (
                                            <tr
                                                key={`${date}-${index}`}
                                                className={index % 2 === 0 ? 'bg-white' : 'bg-white'} // Alternating row colors
                                            >
                                                {/* Empty cell for date group rows */}
                                                {/* <td className='py-2 text-base font-medium border-b border-gray-200'>
                {index === 0 ? formatDate(date) : ''}
              </td> */}
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>{item.sessionMedium}</td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>{item.sessionPrimaryChannelGroup}</td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>
                                                    {formatNumber(item.Totalusers)}
                                                </td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>
                                                    {formatNumber(item.Newusers)}
                                                </td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>
                                                    {formatNumber(item.engagedSessions)}
                                                </td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>
                                                    {formatNumber(item.activeUsers)}
                                                </td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>
                                                    {formatNumber(item.userEngagementDuration)}
                                                </td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>
                                                    {formatNumber(item.Eventcount)}
                                                </td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>
                                                    {formatNumber(item.Returningusers)}
                                                </td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>
                                                    {formatDecimal(item.Averageengagementtimeperactiveuser)}
                                                </td>
                                                <td className='py-2 text-base font-medium border-b border-gray-200'>
                                                    {formatDecimal(item.Engagedsessionsperactiveuser)}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2 className='text-black font-semibold'>Traffic Acquisition:</h2>
                <div className='w-full rounded-[10px] flex flex-col px-10 py-7 bg-white'>
                    <UserAcquisitionChart data={analyticsData.traffic_acquisition_data} type={"traffic"} />
                    <div className='h-[50vh] overflow-auto'>
                        <table className='w-full text-left '>
                            <thead className='relative'>
                                <tr className='sticky top-0 bg-white'>
                                    <th className='py-3 border-b-2 text-base pr-2 text-black'>Session Medium</th>
                                    <th className='py-3 border-b-2 text-base pr-2 text-black'>Channel Group</th>
                                    <th className='py-3 border-b-2 text-base pr-2 text-black'>Sessions</th>
                                    <th className='py-3 border-b-2 text-base pr-2 text-black'>Engaged Sessions</th>
                                    <th className='py-3 border-b-2 text-base pr-2 text-black'>Engagement Rate</th>
                                    <th className='py-3 border-b-2 text-base pr-2 text-black'>Avg. Engagement Time (s)</th>
                                    <th className='py-3 border-b-2 text-base pr-2 text-black'>Event Count</th>
                                    <th className='py-3 border-b-2 text-base pr-2 text-black'>Events per Session</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyticsData.traffic_acquisition_data && analyticsData.traffic_acquisition_data.length > 0 ? (
                                    Object.keys(
                                        analyticsData.traffic_acquisition_data.reduce((acc: { [key: string]: any[] }, item: { date: string; sessionMedium: string; sessionPrimaryChannelGroup: string; sessions: number; engagedSessions: number; engagementRate: number; averageEngagementTimePerSession: number; eventCount: number; eventsPerSession: number }) => {
                                            const dateKey = item.date;
                                            if (!acc[dateKey]) {
                                                acc[dateKey] = [];
                                            }
                                            acc[dateKey].push(item);
                                            return acc;
                                        }, {})
                                    ).map((date: string) => (
                                        <React.Fragment key={date}>
                                            {/* Add a separator for each date group */}
                                            <tr className='bg-primary/10'>
                                                <td colSpan={8} className='py-2 text-black font-semibold border-b-2 border-primary'>
                                                    {formatDate(date)}
                                                </td>
                                            </tr>
                                            {analyticsData.traffic_acquisition_data
                                                .filter((item: { date: string }) => item.date === date)
                                                .map((item: any, index: number) => (
                                                    <tr key={`${date}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-white'}>
                                                        <td className='py-2 text-base font-medium border-b border-gray-200'>{item.sessionMedium}</td>
                                                        <td className='py-2 text-base font-medium border-b border-gray-200'>{item.sessionPrimaryChannelGroup}</td>
                                                        <td className='py-2 text-base font-medium border-b border-gray-200'>{item.sessions}</td>
                                                        <td className='py-2 text-base font-medium border-b border-gray-200'>{item.engagedSessions}</td>
                                                        <td className='py-2 text-base font-medium border-b border-gray-200'>{(item.engagementRate * 100).toFixed(2)}%</td> {/* Convert to percentage */}
                                                        <td className='py-2 text-base font-medium border-b border-gray-200'>{item.averageEngagementTimePerSession.toFixed(2)}</td>
                                                        <td className='py-2 text-base font-medium border-b border-gray-200'>{item.eventCount}</td>
                                                        <td className='py-2 text-base font-medium border-b border-gray-200'>{item.eventsPerSession.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                    </tr>
                                )}
                            </tbody>


                        </table>
                    </div>
                </div>



            </div>
        </DefaultLayout>
    );
}
