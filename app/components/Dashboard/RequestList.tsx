"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconAlertCircle } from "@tabler/icons-react";
import { Card } from "@/app/components/UI/Card";
import { Badge } from "@/app/components/UI/Badge";
import { Button } from "@/app/components/UI/Button";
import { Skeleton } from "@/app/components/UI/Skeleton";
import { EmptyState } from "@/app/components/UI";
import { formatDate, daysUntilEvent } from "@/app/lib/dateUtils";
import { MATERIAL_TYPES, REQUEST_STATUSES } from "@/app/lib/constants";
import type { Request } from "@/app/types/index";

type FilterStatus = "all" | "pendiente" | "en_planificacion" | "en_diseño" | "lista" | "entregada";
type SortOption = "event_date" | "priority_score" | "created_at";

interface RequestListProps {
  requests?: Request[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function RequestList({ 
  requests: initialRequests = [], 
  isLoading: initialLoading = true,
  error: initialError = null,
  onRetry
}: RequestListProps) {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(initialError);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("event_date");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        const requestsArray = Array.isArray(data.data) ? data.data : [];
        setRequests(requestsArray);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        console.error("Error fetching requests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (initialRequests.length === 0) {
      fetchRequests();
    }
  }, [initialRequests.length]);

  // Filter requests based on status
  const filteredRequests = requests.filter((request) => {
    if (filterStatus === "all") return true;
    return request.status.toLowerCase() === filterStatus;
  });

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case "event_date":
        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      case "priority_score":
        return (b.priority_score || 0) - (a.priority_score || 0);
      case "created_at":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  // Paginate
  const startIdx = (page - 1) * itemsPerPage;
  const paginatedRequests = sortedRequests.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);

  const getStatusVariant = (status: string): 'pending' | 'planning' | 'design' | 'ready' | 'delivered' | 'default' => {
    const statusLower = status.toLowerCase().trim();
    if (statusLower.includes('pendiente')) return 'pending';
    if (statusLower.includes('planificaci')) return 'planning';
    if (statusLower.includes('diseño')) return 'design';
    if (statusLower.includes('lista')) return 'ready';
    if (statusLower.includes('entregada')) return 'delivered';
    return 'default';
  };

  const getMaterialIcon = (materialType: string) => {
    const type = MATERIAL_TYPES.find(
      (m) => m.value.toLowerCase() === materialType.toLowerCase()
    );
    return type?.emoji || "📄";
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 p-6">
        <div className="text-center space-y-4">
          <div className="text-red-500">
            <IconAlertCircle size={48} />
          </div>
          <h3 className="text-red-700 font-bold">Error al cargar solicitudes</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (onRetry) {
                onRetry();
              } else {
                window.location.reload();
              }
            }}
          >
            Intentar nuevamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-decom-bg-light rounded-lg p-4 space-y-4">
        {/* Filters */}
        <div>
          <label className="block text-sm font-semibold text-decom-text-dark mb-3">
            Estado
          </label>
          <div className="flex flex-wrap gap-2">
            {(["all", "pendiente", "en_planificacion", "en_diseño", "lista", "entregada"] as FilterStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-decom-primary text-white"
                      : "bg-white text-decom-text-dark border border-decom-border hover:bg-decom-bg-light"
                  }`}
                >
                  {status === "all" ? "Todas" : status.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>

        {/* Sorting */}
        <div>
          <label className="block text-sm font-semibold text-decom-text-dark mb-2">
            Ordenar por
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setPage(1);
            }}
            className="w-full px-3 py-2 border border-decom-border rounded-lg bg-white text-decom-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-decom-primary"
          >
            <option value="event_date">Fecha del evento</option>
            <option value="priority_score">Prioridad</option>
            <option value="created_at">Más reciente</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="text-sm text-decom-text-light">
        Mostrando {paginatedRequests.length} de {sortedRequests.length} solicitudes
      </div>

      {/* Request Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="space-y-3">
                <Skeleton height={20} className="w-3/4" />
                <Skeleton height={16} className="w-1/2" />
                <div className="flex gap-2">
                  <Skeleton height={24} className="w-24" />
                  <Skeleton height={24} className="w-32" />
                </div>
              </Card>
            ))}
          </>
        ) : paginatedRequests.length === 0 ? (
          <EmptyState
            title={filterStatus === "all" ? "No hay solicitudes aún" : "No hay solicitudes con este filtro"}
            description={
              filterStatus === "all"
                ? "Todavía no has creado ninguna solicitud de material gráfico. ¡Comienza ahora y el comité DECOM te ayudará a promocionar tu evento!"
                : "No se encontraron solicitudes que coincidan con el filtro seleccionado. Intenta cambiar los filtros o crea una nueva solicitud."
            }
            actionLabel={filterStatus === "all" ? "Crear Mi Primera Solicitud" : "Crear Nueva Solicitud"}
            onAction={() => window.location.href = "/new-request"}
            variant={filterStatus === "all" ? "featured" : "default"}
          />
        ) : (
          paginatedRequests.map((request) => {
            const daysRemaining = daysUntilEvent(new Date(request.event_date));
            const isUrgent = daysRemaining <= 7;
            const isOverdue = daysRemaining < 0;

            return (
              <Link href={`/requests/${request.id}`} key={request.id}>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  interactive
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-decom-text-dark text-base">
                        {request.event_name}
                      </h3>
                      <p className="text-sm text-decom-text-light">
                        {request.committee_name || "Comité"}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">📅</span>
                      <span className="text-decom-text-dark">
                        {formatDate(new Date(request.event_date), "short")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{getMaterialIcon(request.material_type)}</span>
                      <span className="text-decom-text-light text-xs">
                        {request.material_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-semibold ${
                            isOverdue
                              ? "text-decom-danger"
                              : isUrgent
                              ? "text-decom-warning"
                              : "text-decom-success"
                          }`}
                        >
                          {daysRemaining < 0
                            ? `Vencida hace ${Math.abs(daysRemaining)} días`
                            : daysRemaining === 0
                            ? "¡Hoy!"
                            : `Faltan ${daysRemaining} días`}
                        </span>
                      </div>
                    </div>
                    {request.priority_score && (
                      <div className="text-right text-xs">
                        <div className="text-decom-text-light">Prioridad</div>
                        <div className="font-bold text-decom-primary">
                          {request.priority_score}/10
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-decom-text-light">
            Página {page} de {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
