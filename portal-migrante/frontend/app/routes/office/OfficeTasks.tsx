import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import type { OfficeTask } from "../../services/office.service";
import { officeTasks } from "../../services/office.service";
import type { User } from "../../services/users.service";
import { usersService } from "../../services/users.service";
import { hasOfficePermission } from "../guards/ProtectedOfficeRoute";
import { OfficeCard, OfficePageHeader, StatusBadge, officeText } from "../../components/office/OfficeUi";

type TaskForm = Pick<OfficeTask, "title" | "owner" | "priority" | "dueDate" | "status"> & {
  project: string;
};

const emptyTask: TaskForm = {
  title: "",
  owner: "",
  priority: "medium",
  dueDate: "",
  status: "todo",
  project: "",
};

function taskStatus(locale: string, status: OfficeTask["status"]) {
  const labels: Record<OfficeTask["status"], [string, string, string]> = {
    todo: ["Pendiente", "قيد الانتظار", "slate"],
    doing: ["En curso", "قيد الإنجاز", "blue"],
    done: ["Completada", "مكتملة", "green"],
    late: ["Atrasada", "متأخرة", "red"],
  };
  const label = labels[status];
  return { text: officeText(locale, label[0], label[1]), tone: label[2] };
}

export default function OfficeTasks() {
  const { locale } = useI18n();
  const [tasks, setTasks] = useState<OfficeTask[]>(officeTasks);
  const [form, setForm] = useState<TaskForm>(emptyTask);
  const [currentUser, setCurrentUser] = useState<User | null>(() => usersService.getCurrentUser());

  useEffect(() => {
    return usersService.onCurrentUserChange(() => setCurrentUser(usersService.getCurrentUser()));
  }, []);

  const canCreate = useMemo(() => hasOfficePermission(currentUser, "create_tasks"), [currentUser]);
  const canEdit = useMemo(() => hasOfficePermission(currentUser, "edit_tasks"), [currentUser]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canCreate || !form.title.trim() || !form.owner.trim() || !form.dueDate) return;

    const next: OfficeTask = {
      id: `task-${Date.now()}`,
      title: form.title.trim(),
      owner: form.owner.trim(),
      priority: form.priority,
      dueDate: form.dueDate,
      status: form.status,
      project: form.project.trim() || undefined,
    };
    setTasks((current) => [next, ...current]);
    setForm(emptyTask);
  };

  const updateStatus = (id: string, status: OfficeTask["status"]) => {
    if (!canEdit) return;
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  return (
    <section>
      <OfficePageHeader
        eyebrow={officeText(locale, "Trabajo diario", "العمل اليومي")}
        title={officeText(locale, "Gestión de tareas", "إدارة المهام")}
        description={officeText(
          locale,
          "Organiza responsabilidades, fechas límite y prioridades del equipo de la asociación.",
          "تنظيم المسؤوليات والمواعيد النهائية وأولويات فريق الجمعية."
        )}
      />

      {canCreate && (
        <OfficeCard className="mb-6">
          <form onSubmit={submit} className="grid gap-4 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-black text-slate-700">
                {officeText(locale, "Título", "العنوان")}
              </label>
              <input
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-emerald-500"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                {officeText(locale, "Responsable", "المسؤول")}
              </label>
              <input
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-emerald-500"
                value={form.owner}
                onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                {officeText(locale, "Fecha límite", "آخر أجل")}
              </label>
              <input
                type="date"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-emerald-500"
                value={form.dueDate}
                onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                {officeText(locale, "Prioridad", "الأولوية")}
              </label>
              <select
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-emerald-500"
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({ ...current, priority: event.target.value as OfficeTask["priority"] }))
                }
              >
                <option value="high">{officeText(locale, "Alta", "عالية")}</option>
                <option value="medium">{officeText(locale, "Media", "متوسطة")}</option>
                <option value="low">{officeText(locale, "Baja", "منخفضة")}</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-emerald-700 px-5 text-sm font-black text-white transition hover:bg-emerald-800"
              >
                {officeText(locale, "Añadir", "إضافة")}
              </button>
            </div>
          </form>
        </OfficeCard>
      )}

      <div className="grid gap-4">
        {tasks.map((task) => {
          const status = taskStatus(locale, task.status);
          return (
            <OfficeCard key={task.id}>
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatusBadge tone={status.tone}>{status.text}</StatusBadge>
                    <StatusBadge tone={task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "green"}>
                      {officeText(locale, "Prioridad", "أولوية")}: {task.priority}
                    </StatusBadge>
                  </div>
                  <h3 className="m-0 text-2xl font-black text-slate-950">{task.title}</h3>
                  <p className="m-0 mt-2 text-sm font-semibold text-slate-500">
                    {officeText(locale, "Responsable", "المسؤول")}: {task.owner} · {officeText(locale, "Fecha", "التاريخ")}:{" "}
                    {task.dueDate}
                    {task.project ? ` · ${task.project}` : ""}
                  </p>
                  {task.description && <p className="mt-3 text-base leading-relaxed text-slate-600">{task.description}</p>}
                </div>
                {canEdit && (
                  <select
                    className="h-12 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-700"
                    value={task.status}
                    onChange={(event) => updateStatus(task.id, event.target.value as OfficeTask["status"])}
                  >
                    <option value="todo">{officeText(locale, "Pendiente", "قيد الانتظار")}</option>
                    <option value="doing">{officeText(locale, "En curso", "قيد الإنجاز")}</option>
                    <option value="done">{officeText(locale, "Completada", "مكتملة")}</option>
                    <option value="late">{officeText(locale, "Atrasada", "متأخرة")}</option>
                  </select>
                )}
              </div>
            </OfficeCard>
          );
        })}
      </div>
    </section>
  );
}
