import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/projects/ProjectForm";
import { useCreateProject } from "../queries/project.queries";

const CreateProject = () => {
  const navigate = useNavigate();

  const mutation = useCreateProject();

  const handleSubmit = (data: { name: string; description: string }) => {
    mutation.mutate(data, {
      onSuccess: () => {
        navigate("/projects");
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Create Project</h1>

      <ProjectForm onSubmit={handleSubmit} isPending={mutation.isPending} />
    </div>
  );
};

export default CreateProject;
