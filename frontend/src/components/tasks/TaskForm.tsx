import React from "react";
import z from "zod";
import type { CreateTaskInput, UpdateTaskInput } from "../../services/task.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const TaskSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 character"),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof TaskSchema>;

interface ProjectMember {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: string;
}

interface TaskFormProp {
  members: ProjectMember[];
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void;
  isSubmitting: boolean;
}

const TaskForm = ({ members, initialData, onSubmit, isSubmitting }: TaskFormProp) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      assignedTo: initialData?.assignedTo ?? "",
      status: initialData?.status ?? "todo",
      priority: initialData?.priority ?? "medium",
      dueDate: initialData?.dueDate ?? "",
    },
  });

  const submitHandler = (data: TaskFormData) => {
    onSubmit({
      ...data,
      assignedTo: data.assignedTo || null,
      dueDate: data.dueDate || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label className="block mb-1">Title</label>
        <input {...register("title")} className="w-full rounded border px-3 py-2" placeholder="Enter task title" />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <textarea {...register("description")} className="w-full rounded border px-3 py-2" rows={4} placeholder="Enter task description" />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block mb-1">Assign To</label>

        <select {...register("assignedTo")} className="w-full rounded border px-3 py-2">
          <option value="">Unassgined</option>

          {members.map((member) => (
            <option key={member.user._id} value={member.user._id}>
              {member.user.name} ({member.role})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Status</label>

        <select {...register("status")} className="w-full rounded border px-3 py-2">
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Priority</label>

        <select {...register("priority")} className="w-full rounded border px-3 py-2">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Due Date</label>
        <input type="date" {...register("dueDate")} className="w-full rounded border px-3 py-2" />
      </div>

      <button type="submit" disabled={isSubmitting} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {isSubmitting ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
};

export default TaskForm;
