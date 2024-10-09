"use client"

import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { Modal, Form, Input, Button } from 'antd'
import { useProjectContext } from '@/helpers/ProjectContext'
import { useGoogleSearchConsoleData } from "@/helpers/GoogleSearchConsoleDataContext"
import { useGoogleAnalyticsData } from "@/helpers/GoogleAnalyticsDataContext"
import { usePathname } from 'next/navigation'
import dayjs from 'dayjs'

export default function ProjectHeader() {
  const [form] = Form.useForm()
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
        fetchGSCData(projectId, projectUrl, [startDate, endDate]);
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

  return (
    <div className='w-full bg-white rounded-[10px] px-4 py-3 flex gap-3 overflow-x-auto'>
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
      {projects.map((project) => (
        <button
          key={project.id}
          className={`flex min-w-fit gap-2 items-center border border-2 text-base font-medium px-6 py-1.5 rounded-full smooth1  ${
            selectedButtonId === project.id
              ? "bg-primary text-white border-primary"
              : "bg-gray-200 text-black border-gray hover:border-primary hover:text-white hover:bg-primary"
          }`}
          onClick={() => handleProjectClick(project)}
        >
          {project.project_name}
        </button>
      ))}

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

    <Form.Item
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
    </Form.Item>

    <Form.Item
      label="Project URL"
      name="projectUrl"
      rules={[
        { required: true, message: 'Please enter the Project URL!' },
        { type: 'url', message: 'Please enter a valid URL!' }
      ]}
    >
      <Input
        className='py-2 px-4 '
        disabled={!!selectedProject} 
      />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" className='bg-primary py-2'>
        {selectedProject ? 'Update And Get Report' : loading ? 'Loading...' : 'Get Report'}
      </Button>
    </Form.Item>
  </Form>
</Modal>

    </div>
  )
}