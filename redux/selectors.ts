import { useSelector } from "react-redux";
import { RootState } from "./store";

export const useFilteredAndSortedUsers = () => {
  const { users, searchTerm, sortOrder } = useSelector((state: RootState) => state.users);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return sortedUsers;
};

export const useFilteredAndSortedTasks = () => {
  const { tasks, searchTerm, sortOrder } = useSelector((state: RootState) => state.tasks);

  const filteredTasks = tasks?.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedTasks = filteredTasks?.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return sortedTasks;
};
