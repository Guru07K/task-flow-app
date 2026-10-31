import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../components/projects/ProjectForm";
import { useGetProject, useUpdateProject } from "../queries/project.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading } = useGetProject(id!);
  const mutation = useUpdateProject();

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading project...</div>;
  }
  if (!project) {
    return <div className="p-6 text-muted-foreground">Project not found.</div>;
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
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Workspace</p>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Project</CardTitle>
          </CardHeader>

          <CardContent>
            <ProjectForm initialData={project} onSubmit={handleSubmit} isPending={mutation.isPending} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProject;
