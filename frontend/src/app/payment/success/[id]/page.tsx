"use client";

import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import React from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const PaymentVerification = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30">
      <Card className="max-w-md w-full p-8 text-center shadow-lg border-2">
        
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="text-base opacity-70 mb-4">
          Your subscription is now active.
        </p>

        {/* Transaction ID */}
        <p className="text-sm text-gray-500">
          Transaction ID: {id}
        </p>
        <Link href={"/account"}>Go to account page</Link>
      </Card>
    </div>
  );
};

export default PaymentVerification; 