"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '@/utils/api';
import toast from 'react-hot-toast';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {


    const [projects, setProjects] = useState([]);
    // console.log(projects.length);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
// console.log(selectedProject);

    const [loading, setLoading] = useState(false);
    const [createdId, setCreatedId] = useState("")
    const [selectedButtonId, setSelectedButtonId] = useState(null)
    const [lastProject, setLastProject] = useState("")
    // console.log(createdId);
    // console.log(lastProject);
    

    const fetchProjects = async () => {
        setLoading(true);
        const token = Cookies.get("login_access_token_report");
        try {
            const response = await axios.get(`${BASE_URL}project/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setProjects(response.data);
            // console.log("Fetched Projects: ", response.data);
            const fetchedProjects = response.data;
            setLastProject(fetchedProjects[fetchedProjects.length - 1])
            // console.log(lastProject);
            setIsModalVisible(false);

        } catch (error) {
            console.error("Error fetching projects: ", error);
        } finally {
            setLoading(false);


        }
    };

    const createProject = async (postData) => {
        // console.log(lastProject);
        
        const token = Cookies.get("login_access_token_report");
        try {
            const response = await axios.post(`${BASE_URL}project/`, postData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            // console.log("Project created successfully: ", response.data);
    
            const newProject = response.data; // Get the new project data
            setCreatedId(newProject.project_id); // Update the state with the new project ID
            localStorage.setItem("selectedProjectId", newProject.project_id);
            setSelectedButtonId(newProject.project_id)
            fetchProjects(); 
            setSelectedProject(lastProject);
    toast.success("Project Created")

        }catch (error) {
            console.error("Error creating project: ", error);
            const errorMessage = error.response?.data?.project_url || "An unknown error occurred.";
            toast.error(errorMessage);
        }
         finally {
            handleCancel(); // Always execute handleCancel
        }
    };
    
    useEffect(() => {
        localStorage.setItem("selectedProjectId", createdId);
    },[createdId])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);

    };
    const updateProject = async (projectId, postData2) => {
        // console.log(projectId);
        // console.log(postData2);
        
        const token = Cookies.get("login_access_token_report");
        try {
            const response = await axios.put(`${BASE_URL}project/${projectId}/`, postData2, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            // console.log("Project updated successfully: ", response.data);
    toast.success("Project Updated")
            fetchProjects(); // Refresh projects after update
        } catch (error) {
            console.error("Error updating project: ", error);
            const errorMessage = error.response?.data?.project_url || "An unknown error occurred.";
            toast.error(errorMessage);
        } finally {
            handleCancel();
        }
    };
    
 

    return (
        <ProjectContext.Provider
            value={{
                projects,
                isModalVisible,
                loading,
                showModal,
                handleCancel,
                fetchProjects,
                createProject,
                selectedProject,
                setSelectedProject,
                updateProject,
                setSelectedButtonId,
                selectedButtonId,
                createdId
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjectContext = () => {
    return useContext(ProjectContext);
};
