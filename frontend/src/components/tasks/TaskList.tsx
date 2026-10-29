import TaskItem from "./TaskItem";

type TaskStatus = "todo" | "in_progress" | "done";

interface TaskListProps {
  tasks: any[];
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  updatingTaskId: string | null;
}

const columns: { status: TaskStatus; title: string; color: string }[] = [
  {
    status: "todo",
    title: "Todo",
    color: "border-t-gray-400",
  },
  {
    status: "in_progress",
    title: "In Progress",
    color: "border-t-blue-500",
  },
  {
    status: "done",
    title: "Done",
    color: "border-t-green-500",
  },
];

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange, updatingTaskId }: TaskListProps) => {
  return (
    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <section key={column.status} className={`min-w-0 rounded-lg border border-gray-200 border-t-4 bg-gray-50 p-3 ${column.color}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{column.title}</h3>

              <span className="rounded-full bg-white px-2.5 py-1 text-sm font-medium text-gray-600">{columnTasks.length}</span>
            </div>

            <div className="space-y-3">
              {columnTasks.length === 0 ? (
                <p className="rounded-md border border-dashed border-gray-300 px-3 py-6 text-center text-sm text-gray-500">No tasks</p>
              ) : (
                columnTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onEdit={() => onEdit(task)}
                    onDelete={() => onDelete(task._id)}
                    onStatusChange={(status) => onStatusChange(task._id, status)}
                    isUpdatingStatus={updatingTaskId === task._id}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default TaskList;
