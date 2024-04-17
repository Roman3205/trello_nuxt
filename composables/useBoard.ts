export const useBoard = () => {
  const destroy = async (boardId: string) => {
    try {
      await $fetch(`/api/boards/${boardId}`, {
        method: "delete",
      });

      useToast().add({
        title: "Board deleted",
      });
    } catch (e: any) {
      return useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  };

  return {
    destroy,
  };
};
