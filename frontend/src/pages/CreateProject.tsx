import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/projects/ProjectForm";
import { useCreateProject } from "../queries/project.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Workspace</p>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-2xl">Create Project</CardTitle>
          </CardHeader>

          <CardContent>
            <ProjectForm onSubmit={handleSubmit} isPending={mutation.isPending} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProject;
