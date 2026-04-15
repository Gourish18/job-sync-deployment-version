"use client";

import useRazorpay from "@/components/scriptLoader";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { payment_service, useAppData } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown } from "lucide-react";
import Loading from "@/components/loading";

const SubscriptionPage = () => {
  const razorpayLoaded = useRazorpay();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { setUser } = useAppData();

  const handleSubscribe = async () => {
    
    if (loading) return;

    const token = Cookies.get("token");
    setLoading(true);

    try {
      const {
        data: { order },
      } = await axios.post(
        `${payment_service}/api/payment/checkout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: "rzp_test_SdocVZRWKs9BQ7",
        amount: order.amount,
        currency: "INR",
        name: "Job Sync",
        description: "Find job easily",
        order_id: order.id,

        // ❌ REMOVE THIS (very important)
        // callback_url: "http://localhost:3000/payment-success",

        prefill: {
          name: "Gaurav Kumar",
        },

        handler: async function (response: any) {
          const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          } = response;

          try {
            const { data } = await axios.post(
              `${payment_service}/api/payment/verify`,
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success(data.message);
            setUser(data.updatedUser);

            router.push(`/payment/success/${razorpay_payment_id}`);
          } catch (error: any) {
            toast.error(
              error?.response?.data?.message ||
                "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },

        theme: {
          color: "#F37254",
        },
      };

      if (!razorpayLoaded) {
        toast.error("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30">
      <Card className="max-w-md w-full p-8 text-center shadow-lg border-2">
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Crown size={28} className="text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
        <p className="text-sm opacity-70 mb-6">
          Boost your job search
        </p>

        <div className="mb-6">
          <p className="text-5xl font-bold text-blue-600">₹119</p>
          <p className="text-sm opacity-60 mt-1">Per month</p>
        </div>

        <div className="space-y-3 mb-8 text-left">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-0.5" />
            <p className="text-sm">
              Your application will be shown first to recruiters
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-0.5" />
            <p className="text-sm">Priority support</p>
          </div>
        </div>

        <Button
          onClick={handleSubscribe}
          disabled={!razorpayLoaded || loading}
          className="w-full h-12 text-base gap-2"
        >
          <Crown size={18} />
          {loading ? "Processing..." : "Subscribe Now"}
        </Button>
      </Card>
    </div>
  );
};

export default SubscriptionPage;