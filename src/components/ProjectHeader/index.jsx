"use client"

import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { useSession, signIn, signOut } from "next-auth/react"
import { Modal, Form, Input, Button } from 'antd'
import { useProjectContext } from '@/helpers/ProjectContext'
import { useGoogleSearchConsoleData } from "@/helpers/GoogleSearchConsoleDataContext"
import { useGoogleAnalyticsData } from "@/helpers/GoogleAnalyticsDataContext"
import { usePathname } from 'next/navigation'
import dayjs from 'dayjs'

export default function ProjectHeader() {
  const [form] = Form.useForm()
  const { data: session, status } = useSession()
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState("")
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [accessTokenGoogle, setaccessTokenGoogle] = useState("")
  const {
    projects,
    isModalVisible,
    loading,
    showModal,
    handleCancel,
    createProject,
    fetchProjects,
    selectedProject,
    setSelectedProject,
    updateProject,
    setSelectedButtonId,
    selectedButtonId,
    createdId
  } = useProjectContext()

  console.log(projects);
  
  useEffect(() => {
    console.log("Session status:", status)
    console.log("Session data:", session)


    if (session) {
      fetchSites()
      fetchGA4Properties()
      localStorage.setItem('accessTokenGoogle',session?.accessToken );
      setaccessTokenGoogle(session?.accessToken)
      console.log("Retrieved access token:", session.accessToken);
    }
  }, [session, status])

  const fetchSites = async () => {

    setError(null)
    console.log("Fetching sites...")
    try {
      const res = await fetch('/api/search-console?action=getSites')
      console.log("Sites API response status:", res.status)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      console.log("Sites data:", data)
      setSites(data.siteEntry || [])
    } catch (error) {
      console.error('Error fetching sites:', error)
      setError(`Failed to fetch sites: ${error.message}`)
    } finally {

    }
  }

  const pathname = usePathname()
  const { fetchGSCData } = useGoogleSearchConsoleData()
  const { fetchAnalyticsData } = useGoogleAnalyticsData()


  useEffect(() => {
    fetchProjects()
    const storedButtonId = localStorage.getItem("selectedProjectId")
    if (storedButtonId) {
      setSelectedButtonId(storedButtonId)
    }
  }, [])

  useEffect(() => {
    if (selectedProject) {
      form.setFieldsValue({
        projectName: selectedProject.project_name,
        projectId: selectedProject.project_id,
        projectUrl: selectedProject.project_url,
      })
    } else {
      form.resetFields()
    }
  }, [selectedProject, form])

  const handleFinish = async (values) => {
    const { projectName, projectId, projectUrl } = values;

    const today = dayjs();
    const startDate = today.subtract(7, 'days').format('YYYY-MM-DD');
    const endDate = today.format('YYYY-MM-DD');

    const postData = {
        project_name: projectName,
        project_id: projectId,
        project_url: projectUrl,
    };

    let updatedProjectId;

    if (selectedProject) {
        await updateProject(selectedProject.id, postData);
        updatedProjectId = selectedProject.id;
    } else {
        const newProject = await createProject(postData);

  

    }

    if (pathname === "/analytics") {
        fetchAnalyticsData(projectId, projectUrl, [startDate, endDate]);
    } else if (pathname === "/google-console") {
        fetchGSCData(accessTokenGoogle, projectUrl, [startDate, endDate]);
    }

    localStorage.setItem("selectedProjectId", updatedProjectId);
    await fetchProjects(); // Ensure the projects list is updated
    handleCancel();
};

  const handleProjectClick = (project) => {
    localStorage.setItem("selectedProjectId", project.id)
    setSelectedButtonId(project.id)
    setSelectedProject(project)
    showModal()
  }

  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchGA4Properties = async () => {
    console.log("Fetching GA4 properties...")
    setIsLoading(true)

    try {
      const res = await fetch('/api/analytics?action=getGA4Properties')
      console.log("GA4 Properties API response status:", res.status)

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      console.log("GA4 Properties data:", data)

      setProperties(data.properties || [])
    } catch (error) {
      console.error('Error fetching GA4 properties:', error)
    } finally {
      setIsLoading(false)
    }
  }
const [fetchedProject, setfetchedProject] = useState()
  useEffect(() => {
    if (fetchedProject) {
      form.setFieldsValue({
        fetchedProject: fetchedProject.name,
        projectId: fetchedProject.name.split('/')[1], // Prefill Project ID
        projectUrl: fetchedProject.displayName, // Prefill Project URL
      });
    } else {
      form.resetFields(); // Reset fields when no project is fetched
    }
  }, [fetchedProject, form]); // Update when fetchedProject changes

  const handleProjectChange = (e) => {
    const fetchedProject = properties.find(p => p.name === e.target.value);
    setfetchedProject(fetchedProject);
  };

  return (
    <div className='w-full bg-white dark:bg-gray-800 dark:shadow-gray-700 dark:text-white rounded-[10px] px-4 py-3 flex gap-3 overflow-x-auto'>
      <button
        className='flex gap-2 items-center border border-2 border-primary px-6 py-1.5 text-primary rounded-full'
        onClick={() => {
          setSelectedProject(null)
          showModal()
        }}
      >
        Project <FaPlus className='text-xl' />
      </button>
      <div className='w-[1px] border bg-gray-6 '></div>

      {projects.length > 0  ?
            projects.map((project) => (
              <button
                key={project.id}
                className={`flex min-w-fit gap-2 items-center border border-2 text-base font-medium px-6 py-1.5 rounded-full smooth1  ${
                  selectedButtonId === project.id
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-200 text-black border-gray hover:border-primary hover:text-white hover:bg-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                }`}
                onClick={() => handleProjectClick(project)}
              >
                {project.project_name}
              </button>
            ))
      : <span className='w-full flex items-center text-red font-medium'>Please Add Your First Project</span>}


      {/* Analytics Modal */}
      {pathname === "/analytics" && (
    <Modal
    title={selectedProject ? "Edit Project" : "Create Project"}
    open={isModalVisible}
    onCancel={handleCancel}
    footer={null}
  >
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
    >
      {/* Select Project Dropdown */}
      <Form.Item
        label="Select Project"
        name="fetchedProject"
        rules={[{ required: true, message: 'Please select a Project!' }]}
      >
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={fetchedProject ? fetchedProject.name : ""}
          onChange={handleProjectChange}
        >
          <option value="">Select a project</option>
          {properties.map((project) => (
            <option key={project.name} value={project.name}>
              {project.displayName} ({project.name.split('/')[1]})
            </option>
          ))}
        </select>
      </Form.Item>

      {/* Project ID */}
      <Form.Item label="Project ID" name="projectId">
        <Input disabled className='text-black' />
      </Form.Item>

      {/* Project URL */}
      <Form.Item label="Project URL" name="projectUrl">
        <Input disabled className='text-black' />
      </Form.Item>

      <Form.Item>
      <Button type="primary" htmlType="submit" className='bg-primary py-2'>
          {selectedProject ? 'Update And Get Report' : loading ? 'Loading...' : 'Get Report'}
        </Button>
      </Form.Item>
    </Form>
  </Modal>


      )}

      {/* GSC Modal */}
      {pathname === "/google-console" && (
    <Modal
    title={selectedProject ? "Edit Project" : "Create Project"}
    open={isModalVisible}
    onCancel={handleCancel}
    footer={null}
  >
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Project Name"
        name="projectName"
        rules={[{ required: true, message: 'Please enter the Project Name!' }]}
      >
        <Input className='py-2 px-4' />
      </Form.Item>
  
      {/* <Form.Item
        label="Project ID"
        name="projectId"
        rules={[
          { required: true, message: 'Please enter the Project ID!' },
          { pattern: /^[0-9]*$/, message: 'Project ID must be a number!' }
        ]}
      >
        <Input
          className='py-2 px-4'
          disabled={!!selectedProject} 
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
          }}
        />
      </Form.Item> */}
  
      <Form.Item
    label="Project URL"
    name="projectUrl"
    rules={[{ required: true, message: 'Please select a Project URL!' }]}
  >
    <select
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={selectedSite}
      onChange={(e) => setSelectedSite(e.target.value)}
      disabled={!!selectedProject} // Keeps the dropdown disabled if a project is selected
    >
      <option value="">Select a site</option>
      {sites.map((site) => (
        <option key={site.siteUrl} value={site.siteUrl}>
          {site.siteUrl}
        </option>
      ))}
    </select>
  </Form.Item>
  
  
      <Form.Item>
        <Button type="primary" htmlType="submit" className='bg-primary py-2'>
          {selectedProject ? 'Update And Get Report' : loading ? 'Loading...' : 'Get Report'}
        </Button>
      </Form.Item>
    </Form>
  </Modal>
      )}


    </div>
  )
}