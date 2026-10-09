"use client";

import { useEffect, useState } from "react";

export function useShuffledOptions<T>(questionId: string, items: T[]) {
  const signature = JSON.stringify(items);
  const key = questionId + ":" + signature;
  const [state, setState] = useState<{ key: string; order: number[] }>({ key: "", order: [] });

  useEffect(() => {
    const source = JSON.parse(signature) as T[];
    const indices = source.map((_, index) => index);
    const storageKey = "peak-option-order:" + questionId;
    let previous: { signature: string; order: number[] } | null = null;
    try {
      previous = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    } catch {
      previous = null;
    }
    for (let index = indices.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [indices[index], indices[other]] = [indices[other], indices[index]];
    }
    if (previous?.signature === signature && previous.order.length === indices.length &&
        indices.length > 1 && previous.order.some((index, position) => index === indices[position])) {
      const offset = 1 + Math.floor(Math.random() * (indices.length - 1));
      indices.splice(0, indices.length, ...previous.order.slice(offset), ...previous.order.slice(0, offset));
    }
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ signature, order: indices }));
    } catch {
      // Randomisation still works when browser storage is unavailable.
    }
    setState({ key, order: indices });
  }, [key, questionId, signature]);

  return state.key === key ? state.order.map(index => ({ option: items[index], index })) : [];
}
