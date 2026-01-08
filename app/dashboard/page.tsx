"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/app/components/Layout";
import { Card } from "@/app/components/UI/Card";
import { Button } from "@/app/components/UI/Button";
import { RequestList } from "@/app/components/Dashboard/RequestList";
import Link from "next/link";

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage (set during login/auth)
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    setIsLoading(false);
  }, []);

  return (
    <Layout 
      title="Mi Dashboard" 
      showBackButton={false}
    >
      <div className="space-y-6 pb-20">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-[#15539C] via-[#16233B] to-[#0f3a6b] text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Mis Solicitudes</h2>
          <p className="text-[#F49E2C] text-base font-semibold">
            {userRole === "decom_admin"
              ? "Administra todas las solicitudes de comunicación"
              : "Gestiona tus solicitudes de material publicitario"}
          </p>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-2">
          <Link href="/new-request" className="flex-1 sm:flex-none">
            <Button fullWidth variant="secondary" size="sm" className="bg-gradient-to-r from-[#15539C] to-[#16233B] border-none text-white hover:shadow-lg">
              Nueva Solicitud
            </Button>
          </Link>
          {userRole === "decom_admin" && (
            <Link href="/admin" className="flex-1 sm:flex-none">
              <Button fullWidth variant="outline" size="sm" className="border-2 border-[#15539C] text-[#15539C] hover:bg-[#15539C] hover:text-white">
                Panel Admin
              </Button>
            </Link>
          )}
        </div>

        {/* Request List */}
        <div>
          <RequestList />
        </div>

        {/* Info Card */}
        <Card className="bg-[#F5F5F5] border-l-4 border-l-[#F49E2C]">
          <h3 className="font-bold text-[#16233B] mb-2 text-lg">Consejo</h3>
          <p className="text-gray-700 text-base font-medium">
            Crea solicitudes con al menos 7 días antes de tu evento para que DECOM 
            tenga tiempo suficiente de preparación.
          </p>
        </Card>
      </div>
    </Layout>
  );
}
