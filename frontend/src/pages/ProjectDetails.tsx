import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProject, useDeleteProject, useGetProjectMembers } from "../queries/project.queries";
import { useCreateTask, useDeleteTask, useProjectTasks, useUpdateTask } from "../queries/task.queries";

import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import AddMemberForm from "../components/members/AddMemberForm";
import MemberList from "../components/members/MemberList";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id!;

  const navigate = useNavigate();

  const { data: project, isLoading, isError } = useGetProject(projectId);

  const deleteProject = useDeleteProject();

  // Project members
  const { data: members = [], isLoading: membersLoading, isError: membersError } = useGetProjectMembers(projectId);

  // Tasks
  const { data: tasks = [], isLoading: tasksLoading, isError: tasksError } = useProjectTasks(projectId);

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (isError || !project) {
    return <div className="p-6">Project not found.</div>;
  }

  const handleDelete = () => {
    if (!window.confirm("Delete this project?")) {
      return;
    }

    deleteProject.mutate(project._id, {
      onSuccess: () => {
        navigate("/projects");
      },
    });
  };

  const handleCreateTask = (data: any) => {
    createTaskMutation.mutate(
      {
        projectId,
        input: data,
      },
      {
        onSuccess: () => {
          setShowTaskForm(false);
        },
      },
    );
  };

  const handleUpdateTask = (data: any) => {
    if (!editingTask) return;

    updateTaskMutation.mutate(
      {
        projectId,
        taskId: editingTask._id,
        input: data,
      },
      {
        onSuccess: () => {
          setEditingTask(null);
        },
      },
    );
  };

  const handleDeleteTask = (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    deleteTaskMutation.mutate({
      projectId,
      taskId,
    });
  };

  const handleStatusChange = (taskId: string, status: "todo" | "in_progress" | "done") => {
    const task = tasks.find((item: any) => item._id === taskId);

    if (!task || task.status === status || updatingTaskId) {
      return;
    }

    setUpdatingTaskId(taskId);

    updateTaskMutation.mutate(
      {
        projectId,
        taskId,
        input: { status },
      },
      {
        onSettled: () => {
          setUpdatingTaskId(null);
        },
      },
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{project.name}</h1>

      <p className="mt-2 text-gray-600">{project.description}</p>

      <div className="mt-6 flex gap-2">
        <button onClick={() => navigate(`/projects/${project._id}/edit`)} className="rounded border px-4 py-2">
          Edit
        </button>

        <button onClick={handleDelete} disabled={deleteProject.isPending} className="rounded border px-4 py-2 disabled:opacity-50">
          {deleteProject.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Project member section */}
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Project Members</h2>

        <AddMemberForm projectId={projectId} />

        {membersLoading ? (
          <p>Loading members...</p>
        ) : membersError ? (
          <p className="text-red-600">Failed to load project members.</p>
        ) : (
          <MemberList projectId={projectId} members={members} ownerId={project.owner} />
        )}
      </section>

      {/* Tasks */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tasks</h2>

          <button
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm((prev) => !prev);
            }}
            className="rounded bg-black px-4 py-2 text-white"
          >
            {showTaskForm ? "Cancel" : "Create Task"}
          </button>
        </div>

        {/* Create task form */}
        {showTaskForm && (
          <div className="mb-6 rounded-lg border p-4">
            <TaskForm members={members} onSubmit={handleCreateTask} isSubmitting={createTaskMutation.isPending} />
          </div>
        )}

        {/* Edit task form */}
        {editingTask && (
          <div className="mb-6 rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Edit Task</h3>

            <TaskForm
              members={members}
              initialData={{
                title: editingTask.title,
                description: editingTask.description ?? "",
                assignedTo: editingTask.assignedTo?._id ?? "",
                status: editingTask.status,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
              }}
              onSubmit={handleUpdateTask}
              isSubmitting={updateTaskMutation.isPending}
            />

            <button type="button" onClick={() => setEditingTask(null)} className="mt-3 rounded border px-4 py-2">
              Cancel Edit
            </button>
          </div>
        )}

        {/* Task list */}
        {tasksLoading ? (
          <p>Loading tasks...</p>
        ) : tasksError ? (
          <p className="text-red-500">Failed to load tasks.</p>
        ) : (
          <TaskList
            tasks={editingTask ? tasks.filter((task: any) => task._id !== editingTask._id) : tasks}
            onEdit={(task) => {
              setShowTaskForm(false);
              setEditingTask(task);
            }}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            updatingTaskId={updatingTaskId}
          />
        )}
      </section>
    </div>
  );
};

export default ProjectDetails;
