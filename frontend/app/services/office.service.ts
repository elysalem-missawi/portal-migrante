export type OfficePermission =
  | "view_dashboard"
  | "view_tasks"
  | "create_tasks"
  | "edit_tasks"
  | "view_meetings"
  | "create_meetings"
  | "view_projects"
  | "manage_funding"
  | "view_documents"
  | "view_members"
  | "manage_volunteers"
  | "view_finance"
  | "manage_contacts"
  | "publish_activities"
  | "view_reports"
  | "manage_settings";

export type OfficeRole =
  | "visitor"
  | "user"
  | "volunteer"
  | "partner_manager"
  | "board_member"
  | "secretary"
  | "treasurer"
  | "project_manager"
  | "president"
  | "platform_admin"
  | "admin"
  | "super_admin";

export type OfficeTask = {
  id: string;
  title: string;
  owner: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  status: "todo" | "doing" | "done" | "late";
  project?: string;
  description?: string;
};

export type OfficeMeeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
  status: "scheduled" | "draft_minutes" | "approved";
};

export type OfficeProject = {
  id: string;
  name: string;
  status: "study" | "active" | "waiting" | "completed";
  progress: number;
  owner: string;
  funder?: string;
  updatedAt: string;
};

export type FundingApplication = {
  id: string;
  title: string;
  program: string;
  amount: number;
  status: "draft" | "submitted" | "review" | "approved" | "rejected";
  deadline: string;
};

export type OfficeDocument = {
  id: string;
  title: string;
  category: string;
  owner: string;
  updatedAt: string;
  access: "board" | "team" | "finance";
};

export const officeRolePermissions: Record<OfficeRole, OfficePermission[]> = {
  visitor: [],
  user: [],
  volunteer: ["view_dashboard", "view_tasks"],
  partner_manager: ["view_dashboard", "view_projects", "view_documents"],
  board_member: [
    "view_dashboard",
    "view_tasks",
    "view_meetings",
    "view_projects",
    "manage_funding",
    "view_documents",
    "view_members",
    "view_reports",
  ],
  secretary: [
    "view_dashboard",
    "view_tasks",
    "create_tasks",
    "edit_tasks",
    "view_meetings",
    "create_meetings",
    "view_documents",
    "view_members",
    "manage_contacts",
    "view_reports",
  ],
  treasurer: [
    "view_dashboard",
    "view_projects",
    "manage_funding",
    "view_documents",
    "view_finance",
    "view_reports",
  ],
  project_manager: [
    "view_dashboard",
    "view_tasks",
    "create_tasks",
    "edit_tasks",
    "view_meetings",
    "view_projects",
    "manage_funding",
    "view_documents",
    "view_reports",
  ],
  president: [
    "view_dashboard",
    "view_tasks",
    "create_tasks",
    "edit_tasks",
    "view_meetings",
    "create_meetings",
    "view_projects",
    "manage_funding",
    "view_documents",
    "view_members",
    "manage_volunteers",
    "view_finance",
    "manage_contacts",
    "publish_activities",
    "view_reports",
    "manage_settings",
  ],
  platform_admin: [
    "view_dashboard",
    "view_tasks",
    "create_tasks",
    "edit_tasks",
    "view_meetings",
    "create_meetings",
    "view_projects",
    "manage_funding",
    "view_documents",
    "view_members",
    "manage_volunteers",
    "view_finance",
    "manage_contacts",
    "publish_activities",
    "view_reports",
    "manage_settings",
  ],
  admin: [
    "view_dashboard",
    "view_tasks",
    "create_tasks",
    "edit_tasks",
    "view_meetings",
    "create_meetings",
    "view_projects",
    "manage_funding",
    "view_documents",
    "view_members",
    "manage_volunteers",
    "view_finance",
    "manage_contacts",
    "publish_activities",
    "view_reports",
    "manage_settings",
  ],
  super_admin: [
    "view_dashboard",
    "view_tasks",
    "create_tasks",
    "edit_tasks",
    "view_meetings",
    "create_meetings",
    "view_projects",
    "manage_funding",
    "view_documents",
    "view_members",
    "manage_volunteers",
    "view_finance",
    "manage_contacts",
    "publish_activities",
    "view_reports",
    "manage_settings",
  ],
};

export const officeStats = [
  { key: "lateTasks", labelEs: "Tareas atrasadas", labelAr: "المهام المتأخرة", value: 3, tone: "red" },
  { key: "doneTasks", labelEs: "Completadas este mes", labelAr: "المهام المكتملة هذا الشهر", value: 18, tone: "green" },
  { key: "meetings", labelEs: "Próximas reuniones", labelAr: "الاجتماعات القادمة", value: 2, tone: "blue" },
  { key: "projects", labelEs: "Proyectos activos", labelAr: "المشاريع النشطة", value: 2, tone: "emerald" },
  { key: "funding", labelEs: "Financiaciones en estudio", labelAr: "طلبات التمويل قيد الدراسة", value: 2, tone: "orange" },
  { key: "members", labelEs: "Miembros activos", labelAr: "الأعضاء النشطون", value: 9, tone: "slate" },
];

export const officeTasks: OfficeTask[] = [
  {
    id: "task-1",
    title: "Completar memoria del proyecto Zubia Social",
    owner: "Secretaría",
    priority: "high",
    dueDate: "2026-06-28",
    status: "doing",
    project: "Plataforma Zubia Social",
    description: "Revisar objetivos, impacto esperado y presupuesto.",
  },
  {
    id: "task-2",
    title: "Revisar documentación de financiación",
    owner: "Tesorería",
    priority: "high",
    dueDate: "2026-06-25",
    status: "late",
    project: "Solicitud de financiación",
  },
  {
    id: "task-3",
    title: "Preparar reunión con entidades colaboradoras",
    owner: "Presidencia",
    priority: "medium",
    dueDate: "2026-07-02",
    status: "todo",
    project: "Alianzas institucionales",
  },
  {
    id: "task-4",
    title: "Actualizar listado de voluntariado",
    owner: "Coordinación",
    priority: "low",
    dueDate: "2026-07-05",
    status: "done",
  },
];

export const officeMeetings: OfficeMeeting[] = [
  {
    id: "meeting-1",
    title: "Reunión de coordinación semanal",
    date: "2026-06-26",
    time: "18:00",
    place: "Online",
    status: "scheduled",
  },
  {
    id: "meeting-2",
    title: "Seguimiento de financiación y sede",
    date: "2026-07-01",
    time: "17:30",
    place: "Vitoria-Gasteiz",
    status: "draft_minutes",
  },
];

export const officeProjects: OfficeProject[] = [
  {
    id: "project-1",
    name: "Plataforma Zubia Social",
    status: "study",
    progress: 68,
    owner: "Equipo digital",
    funder: "Solicitud presentada",
    updatedAt: "2026-06-23",
  },
  {
    id: "project-2",
    name: "Solicitud de local compartido",
    status: "waiting",
    progress: 35,
    owner: "Junta directiva",
    updatedAt: "2026-06-20",
  },
];

export const fundingApplications: FundingApplication[] = [
  {
    id: "funding-1",
    title: "Financiación plataforma digital",
    program: "Integración y participación social",
    amount: 18000,
    status: "review",
    deadline: "2026-07-15",
  },
  {
    id: "funding-2",
    title: "Apoyo para sede y actividades",
    program: "Apoyo asociativo local",
    amount: 9500,
    status: "submitted",
    deadline: "2026-07-30",
  },
];

export const officeDocuments: OfficeDocument[] = [
  {
    id: "doc-1",
    title: "Propuesta plataforma personas migrantes Euskadi",
    category: "Proyecto",
    owner: "Presidencia",
    updatedAt: "2026-06-22",
    access: "board",
  },
  {
    id: "doc-2",
    title: "Acta reunión constitutiva",
    category: "Actas",
    owner: "Secretaría",
    updatedAt: "2026-06-18",
    access: "team",
  },
  {
    id: "doc-3",
    title: "Resumen presupuesto inicial",
    category: "Finanzas",
    owner: "Tesorería",
    updatedAt: "2026-06-19",
    access: "finance",
  },
];
