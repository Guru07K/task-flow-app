interface TaskItemProps {
  task: any;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: "todo" | "in_progress" | "done") => void;
  isUpdatingStatus: boolean;
}

const statusLabels: Record<string, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const TaskItem = ({ task, onEdit, onDelete, onStatusChange, isUpdatingStatus }: TaskItemProps) => {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="wrap-break-word font-semibold text-gray-900">{task.title}</h3>

          {task.description && <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm text-gray-600">{task.description}</p>}
        </div>

        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={onEdit} className="rounded border px-3 py-1 text-sm hover:bg-gray-50">
            Edit
          </button>

          <button type="button" onClick={onDelete} className="rounded border px-3 py-1 text-sm text-red-600 hover:bg-red-50">
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>

        <select
          value={task.status}
          disabled={isUpdatingStatus}
          onChange={(event) => onStatusChange(event.target.value as "todo" | "in_progress" | "done")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-gray-100 px-2 py-1">Priority: {task.priority}</span>

        <span className="rounded bg-gray-100 px-2 py-1">Assigned: {task.assignedTo?.name ?? "Unassigned"}</span>
      </div>

      {task.dueDate && <p className="mt-3 text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
    </div>
  );
};

export default TaskItem;
