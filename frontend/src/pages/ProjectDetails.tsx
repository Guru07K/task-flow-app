import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { useGetProject, useGetProjectMembers } from "../queries/project.queries";
import { useCreateTask, useDeleteTask, useProjectTasks, useUpdateTask } from "../queries/task.queries";

import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import AddMemberForm from "../components/members/AddMemberForm";
import MemberList from "../components/members/MemberList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id!;

  const { data: project, isLoading, isError } = useGetProject(projectId);

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

  const [membersOpen, setMembersOpen] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading project...</div>;
  }

  if (isError || !project) {
    return <div className="p-6 text-muted-foreground">Project not found.</div>;
  }

  const memberCountLabel = membersLoading ? "Loading members..." : `${members.length} member${members.length === 1 ? "" : "s"}`;

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
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Project header */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Project</p>
        <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">{project.name}</h1>
        {project.description && <p className="max-w-2xl break-words text-muted-foreground">{project.description}</p>}
      </div>

      {/* Project members */}
      <Card>
        <CardHeader>
          <CardTitle>Project Members</CardTitle>
          <CardDescription>{memberCountLabel}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          <Dialog open={membersOpen} onOpenChange={setMembersOpen}>
            <DialogTrigger render={<Button variant="outline" />}>
              <Users />
              View Members
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Project Members</DialogTitle>
                <DialogDescription>{memberCountLabel}</DialogDescription>
              </DialogHeader>

              {membersLoading ? (
                <p className="text-sm text-muted-foreground">Loading members...</p>
              ) : membersError ? (
                <Alert variant="destructive">
                  <AlertDescription>Failed to load project members.</AlertDescription>
                </Alert>
              ) : (
                <MemberList projectId={projectId} members={members} ownerId={project.owner} />
              )}
            </DialogContent>
          </Dialog>

          <AddMemberForm projectId={projectId} />
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Track work across Todo, In Progress and Done.</CardDescription>
          <CardAction>
            <Button
              variant={showTaskForm ? "outline" : "default"}
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm((prev) => !prev);
              }}
            >
              {!showTaskForm && <Plus />}
              {showTaskForm ? "Cancel" : "Create Task"}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Create task form */}
          {showTaskForm && (
            <div className="rounded-lg border bg-muted/40 p-4 sm:p-5">
              <TaskForm members={members} onSubmit={handleCreateTask} isSubmitting={createTaskMutation.isPending} />
            </div>
          )}

          {/* Edit task form */}
          {editingTask && (
            <div className="space-y-4 rounded-lg border bg-muted/40 p-4 sm:p-5">
              <h3 className="font-semibold">Edit Task</h3>

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

              <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>
                Cancel Edit
              </Button>
            </div>
          )}

          {(showTaskForm || editingTask) && <Separator />}

          {/* Task list */}
          {tasksLoading ? (
            <p className="text-sm text-muted-foreground">Loading tasks...</p>
          ) : tasksError ? (
            <Alert variant="destructive">
              <AlertDescription>Failed to load tasks.</AlertDescription>
            </Alert>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
