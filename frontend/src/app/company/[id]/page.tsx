"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import axios from "axios";
import { job_service, useAppData } from "@/context/AppContext";
import { Company, Job } from "@/type";
import toast from "react-hot-toast";

const CompanyPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const token = Cookies.get("token");
  const { user } = useAppData();

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  const addModalRef = useRef<HTMLButtonElement>(null);

  // form states
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [role, setrole] = useState("");
  const [salary, setsalary] = useState("");
  const [location, setlocation] = useState("");
  const [openings, setopenings] = useState("");

  // 🔥 FETCH COMPANY
  async function fetchCompany() {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${job_service}/api/job/company/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompany(data);
    } catch (error) {
      toast.error("Failed to load company");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 ADD JOB
  const addJobHandler = async () => {
    // ✅ validation
    if (!title || !description || !role || !location) {
      toast.error("Please fill all required fields");
      return;
    }

    setBtnLoading(true);

    try {
      const jobData = {
        title,
        description,
        role,
        salary: salary ? Number(salary) : null,
        location,
        openings: openings ? Number(openings) : null,
        company_id: id,
      };

      console.log("Sending jobData:", jobData);

      await axios.post(`${job_service}/api/job/new`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job posted successfully");
      fetchCompany();

      // clear inputs
      settitle("");
      setdescription("");
      setrole("");
      setsalary("");
      setlocation("");
      setopenings("");

      addModalRef.current?.click();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  // 🔥 DELETE JOB
  const deleteHandler = async (jobId: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      await axios.delete(`${job_service}/api/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job deleted");
      fetchCompany();
    } catch {
      toast.error("Delete failed");
    }
  };

  // 🔥 FIXED useEffect
  useEffect(() => {
    if (id && token) {
      fetchCompany();
    }
  }, [id, token]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen p-6">
      {company && (
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">{company.name}</h1>
          <p className="mb-4">{company.description}</p>

          <Link href={company.website} target="_blank">
            <Button>Visit Website</Button>
          </Link>

          {/* JOB FORM */}
          <div className="mt-6 space-y-3">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              placeholder="Role"
              value={role}
              onChange={(e) => setrole(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              placeholder="Salary"
              value={salary}
              onChange={(e) => setsalary(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              placeholder="Location"
              value={location}
              onChange={(e) => setlocation(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              placeholder="Openings"
              value={openings}
              onChange={(e) => setopenings(e.target.value)}
              className="border p-2 w-full"
            />

            <Button onClick={addJobHandler} disabled={btnLoading}>
              {btnLoading ? "Posting..." : "Post Job"}
            </Button>
          </div>

          {/* JOB LIST */}
          <div className="mt-6">
            {company.jobs?.map((job) => (
              <Card key={job.job_id} className="p-4 mb-2">
                <h3>{job.title}</h3>
                <p>{job.role}</p>

                <Button
                  onClick={() => deleteHandler(job.job_id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CompanyPage;

// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import Cookies from "js-cookie";
// import { Card } from "@/components/ui/card";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Loading from "@/components/loading";
// import axios from "axios";
// import { job_service, useAppData } from "@/context/AppContext";
// import { Company, Job } from "@/type";
// import toast from "react-hot-toast";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Briefcase,
//   Building2,
//   CheckCircle,
//   Clock,
//   DollarSign,
//   Eye,
//   FileText,
//   Globe2,
//   Image,
//   Laptop,
//   MapPin,
//   Pencil,
//   Plus,
//   Trash2,
//   Users,
//   XCircle,
// } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const CompanyPage = () => {
//   const params = useParams();
//   const id = params?.id as string; // ✅ FIX

//   const token = Cookies.get("token");
//   const { user } = useAppData();

//   const [loading, setLoading] = useState(false);
//   const [btnLoading, setBtnLoading] = useState(false);
//   const [company, setCompany] = useState<Company | null>(null);

//   // ✅ FIX: missing states
//   const [selectedJob, setSelectedJob] = useState<Job | null>(null);
//   const [isUpdatedModalOpen, setIsUpdatedModalOpen] = useState(false);
//   const addModalRef = useRef<HTMLButtonElement>(null);

//   // form states
//   const [title, settitle] = useState("");
//   const [description, setdescription] = useState("");
//   const [role, setrole] = useState("");
//   const [salary, setsalary] = useState("");
//   const [location, setlocation] = useState("");
//   const [openings, setopenings] = useState("");
//   const [job_type, setjob_type] = useState("");
//   const [work_location, setwork_location] = useState("");
//   const [is_active, setis_active] = useState(true);

//   const clearInput = () => {
//     settitle("");
//     setdescription("");
//     setrole("");
//     setsalary("");
//     setlocation("");
//     setopenings("");
//     setjob_type("");
//     setwork_location("");
//     setis_active(true);
//   };

//   // ✅ ADD JOB
//   const addJobHandler = async () => {
//     setBtnLoading(true);

//     try {
//       const jobData = {
//         title,
//         description,
//         role,
//         salary: Number(salary) || 0,
//         location,
//         openings: Number(openings) || 0,
//         job_type,
//         work_location,
//         company_id: id,
//       };

//       await axios.post(`${job_service}/api/job/new`, jobData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("New job posted successfully");
//       fetchCompany();
//       clearInput();
//       addModalRef.current?.click();
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "Something went wrong");
//       } else {
//         toast.error("Something went wrong");
//       }
//     } finally {
//       setBtnLoading(false);
//     }
//   };

//   // ✅ DELETE JOB
//   const deleteHandler = async (jobId: number) => {
//     if (!confirm("Are you sure you want to delete this job?")) return;

//     setBtnLoading(true);

//     try {
//       await axios.delete(`${job_service}/api/job/${jobId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("Job has been deleted");
//       fetchCompany();
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "Something went wrong");
//       } else {
//         toast.error("Something went wrong");
//       }
//     } finally {
//       setBtnLoading(false);
//     }
//   };

//   // ✅ FETCH COMPANY
//   async function fetchCompany() {
//     try {
//       setLoading(true);

//       const { data } = await axios.get(`${job_service}/api/job/company/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setCompany(data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ✅ OPEN UPDATE MODAL
//   const handleOpenUpdateModal = (job: Job) => {
//     setSelectedJob(job);
//     settitle(job.title);
//     setdescription(job.description);
//     setrole(job.role);
//     setsalary(String(job.salary || ""));
//     setlocation(job.location || "");
//     setopenings(String(job.openings));
//     setjob_type(job.job_type);
//     setwork_location(job.work_location);
//     setis_active(job.is_active);
//     setIsUpdatedModalOpen(true);
//   };

//   // ✅ CLOSE UPDATE MODAL
//   const handleCloseUpdateModal = () => {
//     setIsUpdatedModalOpen(false);
//     setSelectedJob(null);
//     clearInput();
//   };
//   const updateJobHandler = async () => {
//     if (!selectedJob) return;

//     setBtnLoading(true);

//     try {
//       const updateData = {
//         title,
//         description,
//         role,
//         salary: Number(salary) || 0,
//         location,
//         openings: Number(openings) || 0,
//         job_type,
//         work_location,
//         is_active,
//       };

//       await axios.put(
//         `${job_service}/api/job/${selectedJob.job_id}`,
//         updateData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       toast.success("Job updated successfully");

//       fetchCompany(); // refresh data
//       handleCloseUpdateModal(); // close modal + clear form
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "Something went wrong");
//       } else {
//         toast.error("Something went wrong");
//       }
//     } finally {
//       setBtnLoading(false);
//     }
//   };

// useEffect(() => {
//   if (id && token) {
//     fetchCompany();
//   }
// }, [id, token]);

//   const isRecruiterOwner =
//     user && company && user.user_id === company.recruiter_id;
//   if (loading) return <Loading />;
//   return (
//     <div className="min-h-screen bg-secondary/30">
//       {company && (
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <Card className="overflow-hidden shadow-lg border-2 mb-8">
//             <div className="h-32 bg-blue-600"></div>

//             <div className="px-8 pb-8">
//               <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16">
//                 <div className="w-32 h-32 rounded-2xl border-4 border-background overflow-hidden shadow-xl bg-background shrink-0">
//                   <img
//                     src={company.logo}
//                     alt="company-logo"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="flex-1 md:mb-4">
//                   <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
//                   <p className="text-base opacity-80 max-w-3xl">
//                     {company.description}
//                   </p>
//                 </div>

//                 <Link href={company.website} target="_blank">
//                   <Button>Visit Website</Button>
//                 </Link>
//               </div>
//             </div>
//           </Card>

//           <Dialog>
//             {/* Job section */}
//             <Card className="shadow-lg border-2 overflow-hidden">
//               <div className="bg-blue-600 border-b p-6">
//                 <div className="flex items-center justify-between flex-wrap gap-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
//                       <Briefcase size={20} className="text-blue-600" />
//                     </div>

//                     <div>
//                       <h2 className="text-2xl font-bold text-white">
//                         Open Positions
//                       </h2>
//                       <p className="text-sm opacity-70 text-white">
//                         {company.jobs?.length || 0} active job
//                         {company.jobs?.length !== 1 ? "s" : ""}
//                       </p>
//                     </div>
//                   </div>

//                   {isRecruiterOwner && (
//                     <>
//                       <DialogTrigger asChild>
//                         <Button className="gap-2">
//                           <Plus size={18} />
//                           Post New Job
//                         </Button>
//                       </DialogTrigger>

//                       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//                         <DialogHeader>
//                           <DialogTitle className="text-2xl flex items-center gap-2">
//                             Post a new Job
//                           </DialogTitle>
//                         </DialogHeader>

//                         {/* 🔽 FORM GOES HERE */}

//                         {/* Add your form inputs here */}
//                         <div className="space-y-5 py-4">
//                           {/* Company Name */}
//                           <div className="space-y-2">
//                             <Label
//                               htmlFor="title"
//                               className="text-sm font-medium flex items-center gap-2"
//                             >
//                               <Briefcase size={16} />
//                               Job Title
//                             </Label>

//                             <Input
//                               id="title"
//                               type="text"
//                               placeholder="Enter job title"
//                               className="h-11"
//                               value={title}
//                               onChange={(e) => settitle(e.target.value)}
//                             />
//                           </div>

//                           {/* Description */}
//                           <div className="space-y-2">
//                             <Label
//                               htmlFor="description"
//                               className="text-sm font-medium"
//                             >
//                               <FileText size={16} />
//                               Description
//                             </Label>

//                             <Input
//                               id="description"
//                               type="text"
//                               placeholder="Enter company description"
//                               value={description}
//                               onChange={(e) => setdescription(e.target.value)}
//                             />
//                           </div>

//                           {/* Website */}
//                           <div className="space-y-2">
//                             <Label
//                               htmlFor="role"
//                               className="text-sm font-medium"
//                             >
//                               <Building2 size={16} />
//                               Role/Department
//                             </Label>

//                             <Input
//                               id="role"
//                               type="text"
//                               placeholder="Enter job role"
//                               value={role}
//                               onChange={(e) => setrole(e.target.value)}
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <Label
//                               htmlFor="salary"
//                               className="text-sm font-medium"
//                             >
//                               <DollarSign size={16} />
//                               Salary
//                             </Label>

//                             <Input
//                               id="salary"
//                               type="number"
//                               placeholder="Enter job salary"
//                               className="h-11 cursor-pointer"
//                               value={salary}
//                               onChange={(e) => setsalary(e.target.value)}
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label
//                               htmlFor="location"
//                               className="text-sm font-medium"
//                             >
//                               <MapPin size={16} />
//                               Location
//                             </Label>

//                             <Input
//                               id="location"
//                               type="text"
//                               placeholder="Enter job location"
//                               className="h-11 cursor-pointer"
//                               value={location}
//                               onChange={(e) => setlocation(e.target.value)}
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label
//                               htmlFor="salary"
//                               className="text-sm font-medium"
//                             >
//                               <DollarSign size={16} />
//                               Salary
//                             </Label>

//                             <Input
//                               id="salary"
//                               type="text"
//                               placeholder="Enter job salary"
//                               className="h-11 cursor-pointer"
//                               value={salary}
//                               onChange={(e) => setsalary(e.target.value)}
//                             />
//                           </div>
//                           <div className="grid md:grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                               <Label
//                                 htmlFor="job_type"
//                                 className="text-sm font-medium flex items-center gap-1"
//                               >
//                                 <Clock size={16} /> Job Type
//                               </Label>

//                               <Select
//                                 value={job_type}
//                                 onValueChange={setjob_type}
//                               >
//                                 <SelectTrigger className="h-11">
//                                   <SelectValue placeholder="Select job type" />
//                                 </SelectTrigger>

//                                 <SelectContent>
//                                   <SelectItem value="Full-time">
//                                     Full-time
//                                   </SelectItem>
//                                   <SelectItem value="Part-time">
//                                     Part-time
//                                   </SelectItem>
//                                   <SelectItem value="Contract">
//                                     Contract
//                                   </SelectItem>
//                                   <SelectItem value="Internship">
//                                     Internship
//                                   </SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>

//                             <div className="space-y-2">
//                               <Label
//                                 htmlFor="work_location"
//                                 className="text-sm font-medium flex items-center gap-1"
//                               >
//                                 <Laptop size={16} /> Work Location
//                               </Label>

//                               <Select
//                                 value={work_location}
//                                 onValueChange={setwork_location}
//                               >
//                                 <SelectTrigger className="h-11">
//                                   <SelectValue placeholder="Select Work Location" />
//                                 </SelectTrigger>

//                                 <SelectContent>
//                                   <SelectItem value="On-site">
//                                     On-site
//                                   </SelectItem>
//                                   <SelectItem value="Remote">Remote</SelectItem>
//                                   <SelectItem value="Hyybrid">
//                                     Hybrid
//                                   </SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </div>
//                         </div>
//                         <DialogFooter>
//                           <DialogClose asChild>
//                             <Button ref={addModalRef} variant="outline">
//                               Cancel
//                             </Button>
//                           </DialogClose>

//                           <Button
//                             disabled={btnLoading}
//                             onClick={addJobHandler}
//                             className="gap-2"
//                           >
//                             {btnLoading ? "Posting..." : "Post Job"}
//                           </Button>
//                         </DialogFooter>
//                       </DialogContent>
//                     </>
//                   )}
//                   <div className="p-6">
//                     {company.jobs && company.jobs.length > 0 ? (
//                       <div className="space-y-4">
//                         {company.jobs.map((j) => (
//                           <div
//                             key={j.job_id}
//                             className="p-5 rounded-lg border-2 hover:border-blue-500 transition-all bg-background"
//                           >
//                             <div className="flex items-start justify-between gap-4 flex-wrap">
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center gap-3 mb-3 flex-wrap">
//                                   <h3 className="text-xl font-semibold">
//                                     {j.title}
//                                   </h3>

//                                   {/* Status Badge */}
//                                   <span
//                                     className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
//                                       j.is_active
//                                         ? "bg-green-100 dark:bg-green-900/30 text-green-600"
//                                         : "bg-gray-100 dark:bg-gray-800 text-gray-600"
//                                     }`}
//                                   >
//                                     {j.is_active ? (
//                                       <CheckCircle size={14} />
//                                     ) : (
//                                       <XCircle size={14} />
//                                     )}

//                                     {j.is_active ? "Active" : "Inactive"}
//                                   </span>
//                                 </div>
//                                 <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
//                                   {/* Role */}
//                                   <div className="flex items-center gap-2 opacity-70">
//                                     <Building2 size={16} />
//                                     <span>{j.role}</span>
//                                   </div>

//                                   {/* Salary */}
//                                   <div className="flex items-center gap-2 opacity-70">
//                                     <DollarSign size={16} />
//                                     <span>
//                                       {j.salary
//                                         ? `₹ ${Number(j.salary).toLocaleString()}`
//                                         : "Not Disclosed"}
//                                     </span>
//                                   </div>

//                                   {/* Location */}
//                                   <div className="flex items-center gap-2 opacity-70">
//                                     <MapPin size={16} />
//                                     <span>{j.location}</span>
//                                   </div>

//                                   {/* Work Type */}
//                                   <div className="flex items-center gap-2 opacity-70">
//                                     <Laptop size={16} />
//                                     <span>
//                                       {j.work_location} ({j.job_type})
//                                     </span>
//                                   </div>

//                                   {/* Openings */}
//                                   <div className="flex items-center gap-2 opacity-70">
//                                     <Users size={16} />
//                                     <span>{j.openings} openings</span>
//                                   </div>
//                                 </div>

//                                 {/* Actions */}
//                                 <div className="flex items-center gap-2 mt-4">
//                                   {/* View */}
//                                   <Link href={`/jobs/${j.job_id}`}>
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       className="gap-2"
//                                     >
//                                       <Eye size={16} /> View
//                                     </Button>
//                                   </Link>

//                                   {/* Recruiter Actions */}
//                                   {isRecruiterOwner && (
//                                     <>
//                                       {/* Edit */}
//                                       <Button
//                                         onClick={() => handleOpenUpdateModal(j)}
//                                         variant="outline"
//                                         size="sm"
//                                         className="gap-2"
//                                       >
//                                         <Pencil size={16} /> Edit
//                                       </Button>
//                                     </>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <>
//                         <div className="text-center py-12">
//                           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
//                             <Briefcase size={32} className="opacity-40" />
//                           </div>

//                           <p className="text-base opacity-70 mb-2">
//                             No jobs posted yet
//                           </p>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </Dialog>
//           <Dialog>
//             <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle className="text-2xl flex items-center gap-2">
//                   Update Job
//                 </DialogTitle>
//               </DialogHeader>

//               {/* 🔽 FORM GOES HERE */}

//               {/* Add your form inputs here */}
//               <div className="space-y-5 py-4">
//                 {/* Company Name */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="title"
//                     className="text-sm font-medium flex items-center gap-2"
//                   >
//                     <Briefcase size={16} />
//                     Job Title
//                   </Label>

//                   <Input
//                     id="title"
//                     type="text"
//                     placeholder="Enter job title"
//                     className="h-11"
//                     value={title}
//                     onChange={(e) => settitle(e.target.value)}
//                   />
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-2">
//                   <Label htmlFor="description" className="text-sm font-medium">
//                     <FileText size={16} />
//                     Description
//                   </Label>

//                   <Input
//                     id="description"
//                     type="text"
//                     placeholder="Enter company description"
//                     value={description}
//                     onChange={(e) => setdescription(e.target.value)}
//                   />
//                 </div>

//                 {/* Website */}
//                 <div className="space-y-2">
//                   <Label htmlFor="role" className="text-sm font-medium">
//                     <Building2 size={16} />
//                     Role/Department
//                   </Label>

//                   <Input
//                     id="role"
//                     type="text"
//                     placeholder="Enter job role"
//                     value={role}
//                     onChange={(e) => setrole(e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="salary" className="text-sm font-medium">
//                     <DollarSign size={16} />
//                     Salary
//                   </Label>

//                   <Input
//                     id="salary"
//                     type="number"
//                     placeholder="Enter job salary"
//                     className="h-11 cursor-pointer"
//                     value={salary}
//                     onChange={(e) => setsalary(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="location" className="text-sm font-medium">
//                     <MapPin size={16} />
//                     Location
//                   </Label>

//                   <Input
//                     id="location"
//                     type="text"
//                     placeholder="Enter job location"
//                     className="h-11 cursor-pointer"
//                     value={location}
//                     onChange={(e) => setlocation(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="salary" className="text-sm font-medium">
//                     <DollarSign size={16} />
//                     Salary
//                   </Label>

//                   <Input
//                     id="salary"
//                     type="text"
//                     placeholder="Enter job salary"
//                     className="h-11 cursor-pointer"
//                     value={salary}
//                     onChange={(e) => setsalary(e.target.value)}
//                   />
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="job_type"
//                       className="text-sm font-medium flex items-center gap-1"
//                     >
//                       <Clock size={16} /> Job Type
//                     </Label>

//                     <Select value={job_type} onValueChange={setjob_type}>
//                       <SelectTrigger className="h-11">
//                         <SelectValue placeholder="Select job type" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         <SelectItem value="Full-time">Full-time</SelectItem>
//                         <SelectItem value="Part-time">Part-time</SelectItem>
//                         <SelectItem value="Contract">Contract</SelectItem>
//                         <SelectItem value="Internship">Internship</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="work_location"
//                       className="text-sm font-medium flex items-center gap-1"
//                     >
//                       <Laptop size={16} /> Work Location
//                     </Label>

//                     <Select
//                       value={work_location}
//                       onValueChange={setwork_location}
//                     >
//                       <SelectTrigger className="h-11">
//                         <SelectValue placeholder="Select Work Location" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         <SelectItem value="On-site">On-site</SelectItem>
//                         <SelectItem value="Remote">Remote</SelectItem>
//                         <SelectItem value="Hyybrid">Hybrid</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="update-is_active"
//                       className="text-sm font-medium flex items-center gap-2"
//                     >
//                       {is_active ? (
//                         <CheckCircle size={16} className="text-green-600" />
//                       ) : (
//                         <XCircle size={16} className="text-gray-500" />
//                       )}
//                       Status
//                     </Label>
//                      <Select value={is_active?"true":"false"} onValueChange={(value)=>setis_active(value==="true")}>
//                       <SelectTrigger className="h-11">
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         <SelectItem value="true">Active</SelectItem>
//                         <SelectItem value="false">Inactive</SelectItem>
                       
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <DialogClose asChild>
//                   <Button ref={addModalRef} variant="outline">
//                     Cancel
//                   </Button>
//                 </DialogClose>

//                 <Button
//                   disabled={btnLoading}
//                   onClick={updateJobHandler}
//                   className="gap-2"
//                 >
//                   {btnLoading ? "Updatin..." : "Updated Job"}
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyPage;
