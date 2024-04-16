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
    } catch (e: any) {
      return useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  };

  return {
    update,
  };
};
