import { useEffect } from "react";

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `Inventory Management System | ${title}`;
  }, [title]);
};

export default useDocumentTitle;
