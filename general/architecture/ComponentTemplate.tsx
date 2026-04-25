import { useState, useRef, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function ComponentName() {
  // QueryClient
  const queryClient = useQueryClient();

  // Router
  const router = useRouter();

  // Context
  // const { example } = useContext(ExampleContext);

  // Constants
  const ITEMS_PER_PAGE = 10;

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // States
  const [isOpen, setIsOpen] = useState(false);

  // Effects
  useEffect(() => {
    if (!isOpen) console.log("Modal closed");
  }, [isOpen]);

  // Hooks
  // const form = useForm();
  // const [scrollRef] = useInfiniteScroll(...);

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      // your fetch function
    }
  });

  // Mutations
  const updateItem = useMutation({
    mutationFn: async () => {
      // your mutation function
    },
  });

  // Functions
  const handleSubmit = () => {
    updateItem.mutate();
  };

  // Computed
  const canSubmit = isOpen && !isLoading;
  const isPending = updateItem.isPending;

  return (
    <div>
      {isPending ? "Saving..." : "Ready"}
    </div>
  );
}
