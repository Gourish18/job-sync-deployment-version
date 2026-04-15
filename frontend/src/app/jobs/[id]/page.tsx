

"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { job_service, useAppData } from "@/context/AppContext";
import { Application, Job } from "@/type";
import axios from "axios";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import JobCard from "@/components/job-card";

const JobPage = () => {
  const { id } = useParams();
  const { user, applyJob, applications, btnLoading } = useAppData();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");

  // 🔥 FIX: per-row dropdown state
  const [statusMap, setStatusMap] = useState<{ [key: number]: string }>({});

  const token = Cookies.get("token");

  // ✅ Check applied
  useEffect(() => {
    if (applications && id) {
      const isApplied = applications.some(
        (item: any) => item.job_id.toString() === id,
      );
      setApplied(isApplied);
    }
  }, [applications, id]);

  const applyJobHandler = (id: number) => {
    applyJob(id);
  };

  // ✅ Fetch job
  const fetchSingleJob = async () => {
    try {
      const { data } = await axios.get(`${job_service}/api/job/${id}`);
      setJob(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleJob();
  }, [id]);

  // ✅ Fetch applications (recruiter only)
  const fetchJobApplications = async () => {
    try {
      const { data } = await axios.get(
        `${job_service}/api/job/application/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setJobApplications(data?.applications || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && job && user.user_id === job.posted_by_recruiter_id) {
      fetchJobApplications();
    }
  }, [user, job]);

  // ✅ Filter logic
  const filteredApplications =
    filterStatus === "All"
      ? jobApplications
      : jobApplications.filter((app) => app.status === filterStatus);

  // ✅ Update handler
  const updateApplicationHandler = async (id: number, status: string) => {
    if (!status) return toast.error("Please select status");

    try {
      await axios.put(
        `${job_service}/api/job/application/update/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Application updated successfully");
      fetchJobApplications();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {loading ? (
        <Loading />
      ) : (
        <>
          {job && (
            <div className="max-w-5xl mx-auto px-4 py-8">
              <Button
                variant="ghost"
                className="mb-6 gap-2"
                onClick={() => router.back()}
              >
                <ArrowRight size={18} /> Back to jobs
              </Button>

              <Card className="overflow-hidden shadow-lg border-2 mb-6">
                <div className="bg-blue-600 p-8 border-b">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* LEFT */}
                    <div className="flex-1">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          job.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {job.is_active ? "Open" : "Closed"}
                      </span>

                      <h1 className="text-3xl md:text-4xl font-bold mt-3 text-white">
                        {job.title}
                      </h1>

                      <div className="flex items-center gap-2 text-white mt-2 opacity-80">
                        <Building2 size={18} />
                        <span>Company Name</span>
                      </div>
                    </div>

                    {/* RIGHT */}
                    {user && user.role === "jobseeker" && (
                      <div>
                        {applied ? (
                          <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-100 text-green-600">
                            <CheckCircle2 size={20} />
                            Already Applied
                          </div>
                        ) : (
                          job.is_active && (
                            <Button
                              onClick={() => applyJobHandler(job.job_id)}
                              disabled={btnLoading}
                            >
                              <Briefcase size={18} />
                              {btnLoading ? "Applying..." : "Easy Apply"}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-8 space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex gap-3 p-4 border rounded-lg">
                      <MapPin />
                      <div>
                        <p className="text-xs opacity-70">Location</p>
                        <p>{job.location}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 border rounded-lg">
                      <DollarSign />
                      <div>
                        <p className="text-xs opacity-70">Salary</p>
                        <p>₹{job.salary}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 border rounded-lg">
                      <Users />
                      <div>
                        <p className="text-xs opacity-70">Openings</p>
                        <p>{job.openings}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold flex gap-2 items-center">
                      <Briefcase /> Description
                    </h2>
                    <p className="mt-2 whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {/* 🔥 APPLICATIONS SECTION */}
      {user && job && user.user_id === job.posted_by_recruiter_id && (
        <div className="w-[90%] md:w-2/3 mx-auto mt-8 mb-8">
          {/* FILTER */}
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Applications</h2>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="All">All</option>
              <option value="Submitted">Submitted</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* LIST */}
          {jobApplications.length === 0 ? (
            <p className="text-center py-8">No applications yet</p>
          ) : filteredApplications.length === 0 ? (
            <p className="text-center py-8">
              No application with status {filterStatus}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div key={app.application_id}>
                  <select
                    value={statusMap[app.application_id] || ""}
                    onChange={(event) =>
                      setStatusMap({
                        ...statusMap,
                        [app.application_id]: event.target.value,
                      })
                    }
                  >
                    <option value="">Update</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <Button
                    onClick={() =>
                      updateApplicationHandler(
                        app.application_id,
                        statusMap[app.application_id],
                      )
                    }
                  >
                    Update
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobPage;
