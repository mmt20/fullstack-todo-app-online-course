import { useState, ChangeEvent, FormEvent } from "react";
import Button from "./ui/Button";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import axIosinstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton ";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });
  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });
  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todoList", `${todoToEdit.id}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // ** Handlers

  const onCloseAddModal = () => {
    setTodoToAdd({
      title: "",
      description: "",
    });
    setIsOpenAddModal(false);
  };
  const onOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const onCloseEditModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsEditModalOpen(false);
  };
  const onOpenEditModal = (todo: ITodo) => {
    setIsEditModalOpen(true);
    setTodoToEdit(todo);
  };

  const closeConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsOpenConfirmModal(false);
  };
  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true);
  };
  const onChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value, name } = event.target;
    setTodoToEdit({ ...todoToEdit, [name]: value });
  };

  const onChangeAddTodoHandler = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value, name } = event.target;
    setTodoToAdd({ ...todoToAdd, [name]: value });
  };

  const onRemove = async () => {
    try {
      const { status } = await axIosinstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      if (status === 200) {
        setTodoToEdit({
          id: 0,
          title: "",
          description: "",
        });
        closeConfirmModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdating(true);
    const { title, description } = todoToEdit;
    try {
      const res = await axIosinstance.put(
        `/todos/${todoToEdit.id}`,
        {
          data: {
            title,
            description,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      console.log(res);
      if (res.status === 200) {
        onCloseEditModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
    console.log(todoToEdit);
  };

  const submitAddTodoHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdating(true);
    const { title, description } = todoToAdd;
    try {
      const res = await axIosinstance.post(
        `/todos`,
        {
          data: {
            title,
            description,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      console.log(res);
      if (res.status === 200) {
        onCloseAddModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
    console.log(todoToEdit);
  };

  if (isLoading)
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

  return (
    <div className="space-y-1 ">
      <div className="flex w-fit mx-auto my-10 gap-x-2">
        <Button variant="default" size={"sm"} onClick={onOpenAddModal}>
          Post new todo
        </Button>
      </div>

      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">
              {todo.id} - {todo.title}
            </p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button
                variant={"danger"}
                size={"sm"}
                onClick={() => openConfirmModal(todo)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todos yet!</h3>
      )}
      {/* Add Todo modal */}
      <Modal
        isOpen={isOpenAddModal}
        closeModal={onCloseAddModal}
        description=""
        title="Add New Todo"
      >
        <form className="space-y-3" onSubmit={submitAddTodoHandler}>
          <Input
            name="title"
            value={todoToAdd.title}
            onChange={onChangeAddTodoHandler}
          />
          <Textarea
            name="description"
            value={todoToAdd.description}
            onChange={onChangeAddTodoHandler}
          />
          <div className="flex items-center space-x-3 mt-4">
            <Button
              isLoading={isUpdating}
              className="bg-indigo-700 hover:bg-indigo-800 "
            >
              Done
            </Button>
            <Button variant={"cancel"} onClick={onCloseAddModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* Edit Todo modal */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={onCloseEditModal}
        description=""
        title="Edit this todo"
      >
        <form className="space-y-3" onSubmit={submitHandler}>
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeHandler}
          />
          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={onChangeHandler}
          />
          <div className="flex items-center space-x-3 mt-4">
            <Button
              isLoading={isUpdating}
              className="bg-indigo-700 hover:bg-indigo-800 "
            >
              Update
            </Button>
            <Button variant={"cancel"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete todo Modal */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this todo from your store ?"
        description="Deleting this todo will remove it permenantly from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3 mt-4">
          <Button variant="danger" onClick={onRemove}>
            Yes , Remove
          </Button>
          <Button variant="cancel" onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;

// ** S.O.L.I.D
// Single responsiblaty
