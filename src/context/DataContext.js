import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("https://workasana-gamma.vercel.app/projects")
      .then((res) => res.json())
      .then(setProjects);

    fetch("https://workasana-gamma.vercel.app/tags")
      .then((res) => res.json())
      .then(setTags);
  }, [token]);

  const authHeader = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const addProject = async (project) => {
    const res = await fetch("https://workasana-gamma.vercel.app/projects", {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify(project),
    });
    setProjects([...projects, await res.json()]);
  };

  return (
    <DataContext.Provider value={{ projects, tags, addProject }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
