"use client"
import { AppContextType, Application, AppProviderProps, User } from '@/type';
import React, { createContext, useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useCallback } from "react";
// export const utils_service="http://localhost:5001";
// export const auth_service="http://localhost:5000";
// export const user_service="http://localhost:5002";
// export const job_service="http://localhost:5003";
// export const payment_service="http://localhost:5004";
export const utils_service = process.env.NEXT_PUBLIC_UTILS_URL!;
export const auth_service = process.env.NEXT_PUBLIC_AUTH_URL!;
export const user_service = process.env.NEXT_PUBLIC_USER_URL!;
export const job_service = process.env.NEXT_PUBLIC_JOB_URL!;
export const payment_service = process.env.NEXT_PUBLIC_PAYMENT_URL!;
const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const token=Cookies.get("token");
const fetchUser = useCallback(async () => {
  try {
    const { data } = await axios.get(`${user_service}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(data);
    setIsAuth(true);
  } catch (error) {
    setIsAuth(false);
  } finally {
    setLoading(false);
  }
}, [token]);
async function updateProfilePic(formData: FormData) {
  setLoading(true);
  try {
    const { data } = await axios.put(
      `${user_service}/api/user/update/pic`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(data.message);
    fetchUser();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } else {
      toast.error("Unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
}


async function updateUser(
  name: string,
  phoneNumber: string,
  bio: string
): Promise<void> {
  setBtnLoading(true);
  

  try {
    const token = Cookies.get("token");
    const { data } = await axios.put(
      `${user_service}/api/user/update/profile`,
      { name, phoneNumber, bio },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(data.message);
    fetchUser(); 
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } else {
      toast.error("Unexpected error occurred");
    }
  }finally{
    setBtnLoading(false);
  }
}

async function addSkill(skill: string,setSkill:React.Dispatch<React.SetStateAction<string>>): Promise<void> {
  setBtnLoading(true);
 

  try {
     const token = Cookies.get("token");
    const { data } = await axios.post(
      `${user_service}/api/user/skill/add`, 
      { skillName:skill },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(data.message);
    setSkill("");
    fetchUser(); 
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Failed to add skill");
    } else {
      toast.error("Unexpected error occurred");
    }
  }finally{
    setBtnLoading(false);
  }
}

async function removeSkill(skill: string): Promise<void> {
  try {
     const token = Cookies.get("token");
    const { data } = await axios.put(
      `${user_service}/api/user/skill/delete`, 
      { skillName:skill },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(data.message);
    fetchUser(); 
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Failed to add skill");
    } else {
      toast.error("Unexpected error occurred");
    }
  }
}

async function updateResume(formData: FormData) {
  setLoading(true);
  try {
    const { data } = await axios.put(
      `${user_service}/api/user/update/resume`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(data.message);
    fetchUser();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } else {
      toast.error("Unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
}
async function applyJob(job_id: number) {
  setBtnLoading(true);
  try {
    const { data } = await axios.post(
      `${user_service}/api/user/apply/job`,
      { job_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(data.message);
    fetchApplications();
  } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
    finally{
      setBtnLoading(false);
    }
}
async function logoutUser() {
  Cookies.set("token", "");
  setUser(null);
  setIsAuth(false);
  toast.success("Logout successful");
}
const [applications, setApplications] = useState<Application[] >([]);

const fetchApplications = useCallback(async () => {
  try {
    const { data } = await axios.get(
      `${user_service}/api/user/application/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setApplications(data);
  } catch (error) {
    console.log(error);
  }
}, [token]);

useEffect(() => {
  if (token) {
    fetchUser();
    fetchApplications();
  } else {
    setLoading(false);
  }
}, [token, fetchUser, fetchApplications]);


  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        setUser,
        isAuth,
        setIsAuth,
        setLoading,
        logoutUser,
        updateProfilePic,
        updateResume,
        updateUser,
        addSkill,
        removeSkill,
        applyJob,
        applications,
        fetchApplications
      }}
    >
      {children}
      <Toaster/>
    </AppContext.Provider>
  );
};
export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }

  return context; 
};