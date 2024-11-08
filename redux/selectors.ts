import { useSelector } from "react-redux";
import { RootState } from "./store";

export const useFilteredAndSortedUsers = () => {
  const { users, searchTerm, sortOrder } = useSelector((state: RootState) => state.users);
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return sortedUsers;
};
