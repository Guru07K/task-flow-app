import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const projectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(500, "Description cannot exceed 500 characters"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: {
    name: string;
    description?: string;
  };

  onSubmit: (data: ProjectFormData) => void;

  isPending?: boolean;
}

const ProjectForm = ({ initialData, onSubmit, isPending }: ProjectFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),

    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description ?? "",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div>
        <input {...register("name")} placeholder="Project name" className="w-full rounded border p-2" />

        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <textarea {...register("description")} placeholder="Project description" className="w-full rounded border p-2" />

        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <button type="submit" disabled={isPending} className="rounded bg-black px-4 py-2 text-white">
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default ProjectForm;
