import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../components/projects/ProjectForm";
import { useGetProject, useUpdateProject } from "../queries/project.queries";

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading } = useGetProject(id!);
  const mutation = useUpdateProject();

  if (isLoading) {
    return <div>Loading project...</div>;
  }
  if (!project) {
    return <div>Project not found.</div>;
  }

  const handleSubmit = (data: { name: string; description: string }) => {
    mutation.mutate(
      {
        id: id!,
        input: data,
      },
      {
        onSuccess: () => {
          navigate(`/projects/${id}`);
        },
      },
    );
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Project</h1>

      <ProjectForm initialData={project} onSubmit={handleSubmit} isPending={mutation.isPending} />
    </div>
  );
};

export default EditProject;
