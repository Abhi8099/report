// "use client"

// import React, { useEffect, useState } from 'react'
// import { FaPlus } from 'react-icons/fa6'
// import { useSession, signIn, signOut } from "next-auth/react"
// import { Modal, Form, Input, Button } from 'antd'
// import { useProjectContext } from '@/helpers/ProjectContext'
// import { useGoogleSearchConsoleData } from "@/helpers/GoogleSearchConsoleDataContext"
// import { useGoogleAnalyticsData } from "@/helpers/GoogleAnalyticsDataContext"
// import { usePathname } from 'next/navigation'
// import dayjs from 'dayjs'

// export default function ProjectHeader() {
//   const [form] = Form.useForm()
//   const { data: session, status } = useSession()
//   const [sites, setSites] = useState([])
//   const [selectedSite, setSelectedSite] = useState("")
//   const [data, setData] = useState(null)
//   const [error, setError] = useState(null)
//   const [accessTokenGoogle, setaccessTokenGoogle] = useState("")
//   const {
//     projects,
//     isModalVisible,
//     loading,
//     showModal,
//     handleCancel,
//     createProject,
//     fetchProjects,
//     selectedProject,
//     setSelectedProject,
//     updateProject,
//     setSelectedButtonId,
//     selectedButtonId,
//     createdId
//   } = useProjectContext()

//   const pathname = usePathname()
//   const { fetchGSCData } = useGoogleSearchConsoleData()
//   const { fetchAnalyticsData } = useGoogleAnalyticsData()

//   console.log(projects);
//   const filteredProjects = projects.filter((project) => {
//     if (pathname === "/google-console") {
//       return project.project_type === "console";
//     } else if (pathname === "/analytics") {
//       return project.project_type === "analytics";
//     }
//     return false;
//   });
//   console.log(filteredProjects);

//   useEffect(() => {
//     console.log("Session status:", status)
//     console.log("Session data:", session)


//     if (session) {
//       fetchSites()
//       fetchGA4Properties()
//       localStorage.setItem('accessTokenGoogle',session?.accessToken );
//       setaccessTokenGoogle(session?.accessToken)
//       console.log("Retrieved access token:", session.accessToken);
//     }
//   }, [session, status])

//   const fetchSites = async () => {

//     setError(null)
//     console.log("Fetching sites...")
//     try {
//       const res = await fetch('/api/search-console?action=getSites')
//       console.log("Sites API response status:", res.status)
//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`)
//       }
//       const data = await res.json()
//       console.log("Sites data:", data)
//       setSites(data.siteEntry || [])
//     } catch (error) {
//       console.error('Error fetching sites:', error)
//       setError(`Failed to fetch sites: ${error.message}`)
//     } finally {

//     }
//   }

//   useEffect(() => {
//     fetchProjects()
//     const storedButtonId = localStorage.getItem("selectedProjectId")
//     if (storedButtonId) {
//       setSelectedButtonId(storedButtonId)
//     }
//   }, [])

//   useEffect(() => {
//     console.log(selectedProject);

//     if (selectedProject) {
//       form.setFieldsValue({
//         projectName: selectedProject.project_name,
//         projectId: selectedProject.project_id,
//         projectUrl: selectedProject.project_url,
//       })
//     } else {
//       form.resetFields()
//     }
//   }, [selectedProject, form])

//   const handleFinish = async (values) => {
//     const { projectName, projectId, projectUrl } = values;

//     const today = dayjs();
//     const startDate = today.subtract(7, 'days').format('YYYY-MM-DD');
//     const endDate = today.format('YYYY-MM-DD');

//     const postDataGsc = {
//       project_name: projectName,
//       // project_id: projectId,
//       project_url: projectUrl,
//   };
//   const postDataAnalytics = {
//       project_name: fetchedProject?.displayName,
//       project_id: projectId,
//       // project_url: projectUrl,
//   };
//   console.log(postDataAnalytics);

//   let updatedProjectId;

//   if (selectedProject) {
//     // Update project based on the pathname
//     if (pathname === "/google-console") {
//         await updateProject(selectedProject.id, postDataGsc);
//     } else if (pathname === "/analytics") {
//         await updateProject(selectedProject.id, postDataAnalytics);
//     }
//     updatedProjectId = selectedProject.id;
// } else {
//     // Create project based on the pathname
//     let newProject;
//     if (pathname === "/google-console") {
//         newProject = await createProject(postDataGsc);
//     } else if (pathname === "/analytics") {
//         newProject = await createProject(postDataAnalytics);
//     }

//     updatedProjectId = newProject?.id;
// }

//   if (pathname === "/analytics") {
//       fetchAnalyticsData(accessTokenGoogle, projectId, [startDate, endDate]);
//   } else if (pathname === "/google-console") {
//       fetchGSCData(accessTokenGoogle, projectUrl, [startDate, endDate]);
//   }

//     localStorage.setItem("selectedProjectId", updatedProjectId);
//     await fetchProjects(); // Ensure the projects list is updated
//     handleCancel();
// };

//   const handleProjectClick = (project) => {
//     console.log(project);

//     localStorage.setItem("selectedProjectId", project.project_id)
//     setSelectedButtonId(project.project_id)
//     setSelectedProject(project)
//     showModal()
//   }

//   const [properties, setProperties] = useState([])
//   const [isLoading, setIsLoading] = useState(false)

//   const fetchGA4Properties = async () => {
//     console.log("Fetching GA4 properties...")
//     setIsLoading(true)

//     try {
//       const res = await fetch('/api/analytics?action=getGA4Properties' , {
//         cache:'force-cache'
//       })
//       console.log("GA4 Properties API response status:", res.status)

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`)
//       }

//       const data = await res.json()
//       console.log("GA4 Properties data:", data)

//       setProperties(data.properties || [])
//     } catch (error) {
//       console.error('Error fetching GA4 properties:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }
// const [fetchedProject, setfetchedProject] = useState()
//   useEffect(() => {
//     if (fetchedProject) {
//       form.setFieldsValue({
//         fetchedProject: fetchedProject.name,
//         projectId: fetchedProject.name.split('/')[1], // Prefill Project ID
//         projectUrl: fetchedProject.displayName, // Prefill Project URL
//       });
//     } else {
//       form.resetFields(); // Reset fields when no project is fetched
//     }
//   }, [fetchedProject, form]); // Update when fetchedProject changes

//   const handleProjectChange = (e) => {
//     const fetchedProject = properties.find(p => p.name === e.target.value);
//     setfetchedProject(fetchedProject);
//   };

//   return (
//     <div className='w-full bg-white dark:bg-gray-800 dark:shadow-gray-700 dark:text-white rounded-[10px] px-4 pt-2 pb-3 flex flex-col gap-2'>
//     <p className='text-sm font-medium text-primary'>Create a new project Or select an existing project!</p>

//     <div className=' flex gap-3 overflow-x-auto'>
//       <button
//         className='flex gap-2 items-center border border-2 border-primary px-6 py-1.5 text-primary rounded-full'
//         onClick={() => {
//           setSelectedProject(null)
//           showModal()
//         }}
//       >
//         Project <FaPlus className='text-xl' />
//       </button>
//       <div className='w-[1px] border bg-gray-6 '></div>

//       {filteredProjects.length > 0 ? (
//         filteredProjects.map((project) => (
//           <button
//           key={project.project_id}
//           className={`flex min-w-fit gap-2 items-center border text-base font-medium px-6 py-1.5 rounded-full smooth1 ${
//               selectedButtonId === project.project_id
//                   ? "bg-primary text-white border-primary"
//                   : "bg-gray-200 text-black border-gray hover:border-primary hover:text-white hover:bg-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
//           }`}
//           onClick={() => handleProjectClick(project)}
//       >
//           {project.project_name}
//       </button>
//         ))
//       ) : (
//         <span className="w-full flex items-center text-red font-medium">
//           Please Add Your First Project
//         </span>
//       )}



//       {/* Analytics Modal */}
//       {pathname === "/analytics" && (
//     <Modal
//     title={selectedProject ? "Edit Project" : "Create Project"}
//     open={isModalVisible}
//     onCancel={handleCancel}
//     footer={null}
//   >

//     <Form
//       layout="vertical"
//       form={form}
//       onFinish={handleFinish}
//     >
//       {/* Select Project Dropdown */}
//       {selectedProject?
//             <Form.Item
//             label="Project Name"
//             name="projectName"
//             rules={[{ required: true, message: 'Please enter the Project Name!' }]}
//           >
//             <Input className='py-2 px-4' />
//           </Form.Item>
//       :
//             <Form.Item
//             label="Select Project"
//             name="fetchedProject"
//             rules={[{ required: true, message: 'Please select a Project!' }]}
//           >
//             <select
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={fetchedProject ? fetchedProject.name : ""}
//               onChange={handleProjectChange}
//             >
//               <option value="">Select a project</option>
//               {properties.map((project) => (
//                 <option key={project.name} value={project.name}>
//                   {project.displayName} ({project.name.split('/')[1]})
//                 </option>
//               ))}
//             </select>
//           </Form.Item>
//       }




//       {/* Project ID */}
//       <Form.Item label="Project ID" name="projectId">
//         <Input disabled className='py-2 px-4' />
//       </Form.Item>

//       {!selectedProject && 
//             <Form.Item label="Project URL" name="projectUrl">
//             <Input disabled className='py-2 px-4' />
//           </Form.Item>
//       }


//       <Form.Item>
//       <Button type="primary" htmlType="submit" className='bg-primary py-2'>
//           {selectedProject ? 'Update And Get Report' : loading ? 'Loading...' : 'Get Report'}
//         </Button>
//       </Form.Item>
//     </Form>
//   </Modal>
//       )}

//       {/* GSC Modal */}
//       {pathname === "/google-console" && (
//     <Modal
//     title={selectedProject ? "Edit Project" : "Create Project"}
//     open={isModalVisible}
//     onCancel={handleCancel}
//     footer={null}
//   >
//     <Form
//       form={form}
//       layout="vertical"
//       onFinish={handleFinish}
//     >
//       <Form.Item
//         label="Project Name"
//         name="projectName"
//         rules={[{ required: true, message: 'Please enter the Project Name!' }]}
//       >
//         <Input className='py-2 px-4' />
//       </Form.Item>

//       {/* <Form.Item
//         label="Project ID"
//         name="projectId"
//         rules={[
//           { required: true, message: 'Please enter the Project ID!' },
//           { pattern: /^[0-9]*$/, message: 'Project ID must be a number!' }
//         ]}
//       >
//         <Input
//           className='py-2 px-4'
//           disabled={!!selectedProject} 
//           onInput={(e) => {
//             e.target.value = e.target.value.replace(/[^0-9]/g, '');
//           }}
//         />
//       </Form.Item> */}

//       <Form.Item
//     label="Project URL"
//     name="projectUrl"
//     rules={[{ required: true, message: 'Please select a Project URL!' }]}
//   >
//     <select
//       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200"
//       value={selectedSite}
//       onChange={(e) => setSelectedSite(e.target.value)}
//       disabled={!!selectedProject} // Keeps the dropdown disabled if a project is selected
//     >
//       <option value="">Select a site</option>
//       {sites.map((site) => (
//         <option key={site.siteUrl} value={site.siteUrl}>
//           {site.siteUrl}
//         </option>
//       ))}
//     </select>
//   </Form.Item>


//       <Form.Item>
//         <Button type="primary" htmlType="submit" className='bg-primary py-2'>
//           {selectedProject ? 'Update And Get Report' : loading ? 'Loading...' : 'Get Report'}
//         </Button>
//       </Form.Item>
//     </Form>
//   </Modal>
//       )}


//     </div>
//     </div>
//   )
// }


'use client'

import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { Modal, Input, Select } from 'antd';
import { useProjectContext } from '@/helpers/ProjectContext';
import { useSession } from "next-auth/react"
import dayjs from 'dayjs'
import { useGoogleAnalyticsData } from '@/helpers/GoogleAnalyticsDataContext';
import { useGoogleSearchConsoleData } from '@/helpers/GoogleSearchConsoleDataContext';
import { usePathname } from 'next/navigation';
import { AiTwotoneEdit } from "react-icons/ai";

import toast from 'react-hot-toast';

const { Option } = Select;

export default function ProjectHeader() {
  const { data: session, status } = useSession()
  const [accessTokenGoogle, setAccessTokenGoogle] = useState("")
  const {
    projects,
    createProject,
    fetchProjects,
    selectedProject,
    setSelectedProject,
    updateProject,
  } = useProjectContext();
  const pathname = usePathname()
  const { fetchGSCData } = useGoogleSearchConsoleData()
  const { fetchAnalyticsData } = useGoogleAnalyticsData()

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (session) {
      setAccessTokenGoogle(session?.accessToken)
    }
  }, [session, status])

  useEffect(() => {
    const loadProjects = async () => {
      await fetchProjects();
      setLoading(false);
    };

    loadProjects();

    fetchGA4Properties();
  }, []);

  useEffect(() => {
    if (!loading) {
      setIsModalVisible(projects.length === 0);
    }
  }, [projects]);

  const isValidUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const handleUrlChange = (e) => {
    setProjectUrl(e.target.value);
  };

  const showModal = () => {
    setIsModalVisible(true);
    setProjectName('');
    setProjectUrl('');
    setPropertyId('');
    setEditingProjectId(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setProjectName('');
    setProjectUrl('');
    setPropertyId('');
    setEditingProjectId(null);
  };

  const handleOk = () => {
    const postData = {
      project_name: projectName,
      project_url: projectUrl,
      project_id: propertyId
    };

    if (editingProjectId) {
      updateProject(editingProjectId, postData);

    } else {
      createProject(postData);
    }
    handleCancel();
  };

  const handleEdit = (project) => {
    setProjectName(project.project_name);
    setProjectUrl(project.project_url);
    setPropertyId(project.project_id);
    setEditingProjectId(project.id);
    setIsModalVisible(true);
  };

  const handleData = async ({ projectName, projectId, projectUrl }) => {
    console.log(projectName);
    console.log(projectId);
    console.log(projectUrl);

    if (!projectId && pathname === '/analytics') {
      setProjectName(projectName);
      setProjectUrl(projectUrl);
      setPropertyId(projectId);
      // setEditingProjectId(project.id);
      setIsModalVisible(true);
      toast((t) => (
        <span className=''>
          Please Select Property ID
          <button className='border border-red-500 text-red-500 px-2 py-1 rounded-[10px] ml-2' onClick={() => toast.dismiss(t.id)}>
            Dismiss
          </button>
        </span>
      ),
        {
          icon: '⚠️'
        },
        {
          duration: 10000,
        });
      return
    }
    try {
      const today = dayjs();
      const startDate = today.subtract(7, 'days').format('YYYY-MM-DD');
      const endDate = today.format('YYYY-MM-DD');

      // if (pathname === "/analytics") {
      await fetchAnalyticsData(accessTokenGoogle, projectId, [startDate, endDate]);
      // } else if (pathname === "/google-console") {
      await fetchGSCData(accessTokenGoogle, projectUrl, [startDate, endDate]);
      // }

      localStorage.setItem("selectedProjectId", projectId);
      await fetchProjects();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchGA4Properties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analytics?action=getGA4Properties', {
        cache: 'force-cache'
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log(data);

      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching GA4 properties:', error);
      toast.error('Error fetching GA4 properties: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyChange = (value) => {
    setPropertyId(value);
  };

  return (
    <div className='w-full bg-white dark:bg-gray-800 dark:shadow-gray-700 dark:text-white rounded-[10px] px-4 pt-2 pb-3 flex flex-col gap-2'>
      <p className='text-sm font-medium text-primary'>
        Create a new project or select an existing project!
      </p>

      <div className='flex gap-3 overflow-x-auto'>
        <button
          onClick={showModal}
          className='flex gap-2 items-center border-2 border-primary px-6 py-1.5 text-primary rounded-full'
        >
          Project <FaPlus className='text-xl' />
        </button>

        {projects.map((project) => (
          <div key={project.id} className='flex items-center gap-2'>
            <div
              className={`flex items-center gap-4 justify-center border-2 px-4 py-1.5 rounded-full group hover:bg-primary hover:text-white smooth3 ${selectedProject?.id === project.id
                  ? 'bg-primary text-white border-primary'
                  : 'border-primary text-primary'
                }`}
            >
              <button
                className={`group-hover:text-white ${selectedProject?.id === project.id ? 'text-white' : 'text-primary'}`}
                onClick={() => {
                  setSelectedProject(project);
                  handleData({
                    projectName: project.project_name,
                    projectId: project.project_id,
                    projectUrl: project.project_url,
                  });
                }}
              >
                {project.project_name}
              </button>

              <AiTwotoneEdit
                className={` cursor-pointer text-2xl bg-gray-2  rounded-full smooth3 p-0.5 ${selectedProject?.id === project.id ? 'text-primary' : 'text-primary'
                  }`}
                onClick={() => {
                  handleEdit(project)
                    ;
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={
          projects.length === 0
            ? 'Start by adding a project first'
            : editingProjectId
              ? 'Edit Project'
              : 'Add Project'
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        okButtonProps={{
          disabled: !projectName || !projectUrl,
          style: {
            backgroundColor: !projectName || !projectUrl ? '#cccccc' : '#006BD7',
            color: '#fff',
            borderColor: !projectName || !projectUrl ? '#cccccc' : '#006BD7',
          },
        }}
        cancelButtonProps={{
          style: { backgroundColor: '#f44336', color: '#fff', borderColor: '#f44336' },
        }}
      >
        <div className='mb-4'>
          <label htmlFor="projectName" className='block mb-1'>Project Name</label>
          <Input
            id="projectName"
            placeholder='Project Name'
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className='py-2 px-4'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="projectUrl" className='block mb-1'>Project URL</label>
          <Input
            id="projectUrl"
            placeholder='Project URL'
            value={projectUrl}
            onChange={handleUrlChange}
            className='py-2 px-4'
          />
          {!isValidUrl(projectUrl) && projectUrl && (
            <p className="text-red-500 mt-2">Please enter a valid URL.</p>
          )}
        </div>
        {pathname === '/analytics' &&
          <div className='mb-4'>
            <label htmlFor="propertyId" className='block mb-1'>Property ID</label>
            {propertyId ? (
              <Input
                id="propertyId"
                disabled
                placeholder='Property ID'
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className='py-2 px-4'
              />
            ) : (
              <Select
                id="propertyId"
                className="custom-select"
                placeholder="Select a property"
                onChange={handlePropertyChange}
                loading={isLoading}
                value={propertyId}
              >
                {properties.map((property) => (
                  <Option key={property.name} value={property.name.split('/')[1]}>
                    {property.displayName} ({property.name.split('/')[1]})
                  </Option>
                ))}
              </Select>
            )}
          </div>
        }

      </Modal>
    </div>
  );
} 