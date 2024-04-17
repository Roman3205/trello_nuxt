import type { CardDocument } from "~/server/models/Card.model";

export const useCard = () => {
  const update = async (
    listId: string,
    cardId: string,
    data: Partial<CardDocument>
  ) => {
    try {
      await $fetch(`/api/lists/${listId}/cards/${cardId}`, {
        method: "PUT",
        body: data,
      });

      return useToast().add({
        title: "Card updated",
      });
    } catch (e: any) {
      return useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  };

  const destroy = async (listId: string, cardId: string) => {
    try {
      await $fetch(`/api/lists/${listId}/cards/${cardId}`, {
        method: "DELETE",
      });

      return useToast().add({
        title: "Card deleted",
      });
    } catch (e: any) {
      return useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  };

  return {
    update,
    destroy,
  };
};
