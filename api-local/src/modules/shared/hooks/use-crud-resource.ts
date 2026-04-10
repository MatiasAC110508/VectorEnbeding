"use client";

import { useEffect, useState } from "react";

interface CrudResourceOptions<TEntity, TPayload> {
  fetchAll: () => Promise<TEntity[]>;
  createOne: (payload: TPayload) => Promise<TEntity>;
  updateOne: (id: string, payload: TPayload) => Promise<TEntity>;
  deleteOne: (id: string) => Promise<void>;
}

export function useCrudResource<TEntity extends { id: string }, TPayload>(
  options: CrudResourceOptions<TEntity, TPayload>,
) {
  const { fetchAll, createOne, updateOne, deleteOne } = options;
  const [items, setItems] = useState<TEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadItems() {
      try {
        setError(null);
        setIsLoading(true);
        const resources = await fetchAll();

        if (isMounted) {
          setItems(resources);
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "The resource list could not be loaded.";

        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadItems();

    return () => {
      isMounted = false;
    };
  }, [fetchAll, refreshToken]);

  async function createItem(payload: TPayload) {
    setIsSubmitting(true);

    try {
      setError(null);
      const createdItem = await createOne(payload);
      setItems((currentItems) => [createdItem, ...currentItems]);
    } catch (actionError) {
      const message =
        actionError instanceof Error
          ? actionError.message
          : "The item could not be created.";

      setError(message);
      throw actionError;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateItem(id: string, payload: TPayload) {
    setIsSubmitting(true);

    try {
      setError(null);
      const updatedItem = await updateOne(id, payload);
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === id ? updatedItem : item)),
      );
    } catch (actionError) {
      const message =
        actionError instanceof Error
          ? actionError.message
          : "The item could not be updated.";

      setError(message);
      throw actionError;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteItem(id: string) {
    setIsSubmitting(true);

    try {
      setError(null);
      await deleteOne(id);
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    } catch (actionError) {
      const message =
        actionError instanceof Error
          ? actionError.message
          : "The item could not be deleted.";

      setError(message);
      throw actionError;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    items,
    isLoading,
    isSubmitting,
    error,
    refresh: () => setRefreshToken((currentValue) => currentValue + 1),
    createItem,
    updateItem,
    deleteItem,
  };
}
