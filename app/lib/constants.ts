export const COMMITTEES = [
  { id: "1", name: "Comunicaciones" },
  { id: "2", name: "Música" },
  { id: "3", name: "Jóvenes" },
  { id: "4", name: "Evangelismo" },
  { id: "5", name: "Educación" },
  { id: "6", name: "Diáconos" },
  { id: "7", name: "Otro" },
];

export const MATERIAL_TYPES = [
  { value: "Póster", emoji: "🖼️" },
  { value: "Video", emoji: "🎬" },
  { value: "Otro", emoji: "📦" },
];

export const REQUEST_STATUSES = {
  pendiente: {
    label: "Pendiente",
    color: "pending",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
  },
  en_planificacion: {
    label: "En Planificación",
    color: "planning",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  en_diseño: {
    label: "En Diseño",
    color: "design",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  lista: {
    label: "Lista",
    color: "ready",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  entregada: {
    label: "Entregada",
    color: "completed",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
};

export type MaterialType = typeof MATERIAL_TYPES[number]['value'];
export type RequestStatus = keyof typeof REQUEST_STATUSES;
