import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useDeleteProject, useGetProjects } from "../queries/project.queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Projects = () => {
  const navigate = useNavigate();

  const deleteProject = useDeleteProject();
  const { data: projects, isLoading, isError } = useGetProjects();

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading projects...</div>;
  }
  if (isError) {
    return <div className="p-6 text-destructive">Failed to load projects.</div>;
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    deleteProject.mutate(id);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Workspace</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Projects</h1>
          </div>

          <Button onClick={() => navigate("/projects/create")}>
            <Plus />
            Create Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-background p-10 text-center">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project: any) => (
              <Card key={project._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
                </CardContent>

                <CardFooter className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => navigate(`/projects/${project._id}`)}>
                    View
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project._id}/edit`)}>
                    <Pencil />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(project._id)}
                    disabled={deleteProject.isPending}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
