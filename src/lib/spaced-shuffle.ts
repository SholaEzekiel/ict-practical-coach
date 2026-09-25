function shuffle<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function spacedShuffle<T>(items: T[], keyForItem: (item: T) => string) {
  const groups = new Map<string, T[]>();
  items.forEach((item) => {
    const key = keyForItem(item);
    groups.set(key, [...(groups.get(key) || []), item]);
  });

  groups.forEach((group, key) => groups.set(key, shuffle(group)));

  const ordered: T[] = [];
  let previousKey = "";

  while (ordered.length < items.length) {
    const roundKeys = shuffle([...groups.entries()].filter(([, group]) => group.length).map(([key]) => key));
    if (roundKeys.length > 1 && roundKeys[0] === previousKey) {
      const swapIndex = roundKeys.findIndex((key) => key !== previousKey);
      [roundKeys[0], roundKeys[swapIndex]] = [roundKeys[swapIndex], roundKeys[0]];
    }

    roundKeys.forEach((key) => {
      const item = groups.get(key)?.pop();
      if (item !== undefined) {
        ordered.push(item);
        previousKey = key;
      }
    });
  }

  return ordered;
}
