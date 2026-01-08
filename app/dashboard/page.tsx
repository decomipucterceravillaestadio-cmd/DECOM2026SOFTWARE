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
        <Card className="bg-gradient-to-r from-decom-primary to-decom-primary/80 text-white">
          <h2 className="text-2xl font-bold mb-2">Mis Solicitudes</h2>
          <p className="text-decom-secondary text-sm">
            {userRole === "decom_admin"
              ? "Administra todas las solicitudes de comunicación"
              : "Gestiona tus solicitudes de material publicitario"}
          </p>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-2">
          <Link href="/new-request" className="flex-1 sm:flex-none">
            <Button fullWidth variant="secondary" size="sm">
              Nueva Solicitud
            </Button>
          </Link>
          {userRole === "decom_admin" && (
            <Link href="/admin" className="flex-1 sm:flex-none">
              <Button fullWidth variant="outline" size="sm">
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
        <Card className="bg-decom-bg-light border-l-4 border-decom-secondary">
          <h3 className="font-bold text-decom-text-dark mb-2">Consejo</h3>
          <p className="text-sm text-decom-text-light">
            Crea solicitudes con al menos 7 días antes de tu evento para que DECOM 
            tenga tiempo suficiente de preparación.
          </p>
        </Card>
      </div>
    </Layout>
  );
}
