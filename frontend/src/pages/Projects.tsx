import { useNavigate } from "react-router-dom";
import { useDeleteProject, useGetProjects } from "../queries/project.queries";

const Projects = () => {
  const navigate = useNavigate();

  const deleteProject = useDeleteProject();
  const { data: projects, isLoading, isError } = useGetProjects();

  if (isLoading) {
    return <div>Loading projects...</div>;
  }
  if (isError) {
    return <div>Failed to load projects.</div>;
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    deleteProject.mutate(id);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        <button className="rounded bg-black px-4 py-2 text-white" onClick={() => navigate("/projects/create")}>
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <div className="grid gap-4">
          {projects?.map((project: any) => (
            <div key={project._id} className="rounded border p-4">
              <h2 className="font-semibold">{project.name}</h2>

              <p className="text-gray-600">{project.description}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="rounded border px-3 py-1 hover:bg-black hover:text-white"
                >
                  View
                </button>

                <button
                  onClick={() => navigate(`/projects/${project._id}/edit`)}
                  className="rounded border px-3 py-1 hover:bg-black hover:text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(project._id)}
                  disabled={deleteProject.isPending}
                  className="rounded border px-3 py-1 hover:bg-black hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
