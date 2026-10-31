import type { CreateTaskInput, UpdateTaskInput } from "../../services/task.service";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

// Radix-style selects cannot use an empty string as an item value, so "unassigned" stands in for "no assignee"
const UNASSIGNED = "unassigned";

const statusOptions = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const TaskForm = ({ members, initialData, onSubmit, isSubmitting }: TaskFormProp) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      assignedTo: initialData?.assignedTo || UNASSIGNED,
      status: initialData?.status ?? "todo",
      priority: initialData?.priority ?? "medium",
      dueDate: initialData?.dueDate ?? "",
    },
  });

  const submitHandler = (data: TaskFormData) => {
    onSubmit({
      ...data,
      assignedTo: data.assignedTo === UNASSIGNED ? null : data.assignedTo,
      dueDate: data.dueDate || undefined,
    });
  };

  const assigneeOptions = [
    { value: UNASSIGNED, label: "Unassigned" },
    ...members.map((member) => ({ value: member.user._id, label: `${member.user.name} (${member.role})` })),
  ];

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="task-title">Title</Label>
        <Input id="task-title" {...register("title")} placeholder="Enter task title" aria-invalid={!!errors.title} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          {...register("description")}
          rows={4}
          placeholder="Enter task description"
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Assign To</Label>
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <Select items={assigneeOptions} value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assigneeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select items={statusOptions} value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select items={priorityOptions} value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-due-date">Due Date</Label>
          <Input id="task-due-date" type="date" {...register("dueDate")} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
