"use client";

import { Card } from "@/components/ui/card";
import { AccountProps } from "@/type";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Crown,
  Edit,
  FileText,
  Mail,
  NotepadText,
  Phone,
  RefreshCcw,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Info: React.FC<AccountProps> = ({ user, isYourAccount }) => {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const editRef = useRef<HTMLButtonElement | null>(null);
  const resumeRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");

  const { updateProfilePic, updateResume, btnLoading, updateUser } =
    useAppData();

  // ✅ FIX: handle Date.now() safely
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (user.subscription) {
      const active =
        new Date(user.subscription).getTime() > Date.now();
      setIsActive(active);
    }
  }, [user.subscription]);

  const handleClick = () => inputRef.current?.click();
  const handleResumeClick = () => resumeRef.current?.click();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      updateProfilePic(formData);
    }
  };

  const handleEditClick = () => {
    editRef.current?.click();
    setName(user.name);
    setPhoneNumber(user.phone_number);
    setBio(user.bio || "");
  };

  const updateProfileHandler = () => {
    updateUser(name, phoneNumber, bio);
  };

  const changeResume = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a pdf file");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      updateResume(formData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="overflow-hidden shadow-lg border-2">

        {/* HEADER */}
        <div className="h-32 bg-blue-500 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 overflow-hidden bg-background">
                <img
                  src={user.profile_pic || "/user.png"}
                  className="w-full h-full object-cover"
                />
              </div>

              {isYourAccount && (
                <>
                  <Button
                    size="icon"
                    onClick={handleClick}
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    <Camera size={18} />
                  </Button>
                  <input
                    type="file"
                    hidden
                    ref={inputRef}
                    onChange={changeHandler}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="pt-20 pb-8 px-8">

          {/* NAME */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{user.name}</h1>

            {isYourAccount && (
              <Button size="icon" onClick={handleEditClick}>
                <Edit size={16} />
              </Button>
            )}
          </div>

          <p className="text-sm opacity-70 mt-1">{user.role}</p>

          {/* SUBSCRIPTION */}
          {isYourAccount && user.role === "jobseeker" && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold flex gap-2 items-center">
                <Crown className="text-blue-600" />
                Subscription Status
              </h2>

              <div className="p-6 rounded-lg mt-4 border">

                {/* ❌ NO SUBSCRIPTION */}
                {!user.subscription ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">No Active Subscription</p>
                      <p className="text-sm opacity-70">
                        Subscribe to unlock premium features
                      </p>
                    </div>

                    <Button onClick={() => router.push("/subscribe")}>
                      Subscribe
                    </Button>
                  </div>

                ) : isActive ? (

                  /* ✅ ACTIVE */
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-600 font-semibold">
                        Active Subscription
                      </p>
                      <p className="text-sm opacity-70">
                        Valid till:{" "}
                        {new Date(user.subscription).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-full">
                      <CheckCircle2 size={16} />
                      Active
                    </div>
                  </div>

                ) : (

                  /* ❌ EXPIRED */
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-red-600 font-semibold">
                        Subscription Expired
                      </p>
                      <p className="text-sm opacity-70">
                        Expired on:{" "}
                        {new Date(user.subscription).toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => router.push("/subscribe")}
                    >
                      <RefreshCcw size={16} />
                      Renew
                    </Button>
                  </div>

                )}

              </div>
            </div>
          )}

        </div>
      </Card>
    </div>
  );
};

export default Info;