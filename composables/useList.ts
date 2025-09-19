import type { ListDocument } from "~/server/models/List.model";

export const useList = (boardId: string) => {
  const handleSort = async (e: any, lists: ListDocument[]) => {
    await $fetch(`/api/boards/${boardId}`, {
      method: "PUT",
      body: {
        lists: lists.flatMap((item) => item._id),
      },
    });
  };

  const destroy = async (listId: string) => {
    try {
      await $fetch(`/api/lists/${listId}`, {
        method: "delete",
      });

      useToast().add({
        title: "List deleted",
      });
    } catch (e: any) {
      return useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  };

  const update = async (listId: string, data: Partial<ListDocument>) => {
    try {
      await $fetch(`/api/lists/${listId}`, {
        method: "PUT",
        body: data,
      });
    } catch (e: any) {
      return useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  };

  return {
    handleSort,
    destroy,
    update,
  };
};
