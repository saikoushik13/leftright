export const categories = {
    numbers: Array.from({ length: 10 }, (_, i) => ({
      category: 'numbers' as const,
      value: (i + 1).toString(),
      isOdd: (i + 1) % 2 !== 0
    })),
    words: [
      { category: 'words' as const, value: 'Rock', isLiving: false },
      { category: 'words' as const, value: 'Chair', isLiving: false },
      { category: 'words' as const, value: 'Car', isLiving: false },
      { category: 'words' as const, value: 'Building', isLiving: false },
      { category: 'words' as const, value: 'Clock', isLiving: false },
      { category: 'words' as const, value: 'Cat', isLiving: true },
      { category: 'words' as const, value: 'Tree', isLiving: true },
      { category: 'words' as const, value: 'Bird', isLiving: true },
      { category: 'words' as const, value: 'Human', isLiving: true },
      { category: 'words' as const, value: 'Fish', isLiving: true }
    ],
    emojis: [
      { category: 'emojis' as const, value: '😊', isGoodFeeling: true },
      { category: 'emojis' as const, value: '🤩', isGoodFeeling: true },
      { category: 'emojis' as const, value: '😎', isGoodFeeling: true },
      { category: 'emojis' as const, value: '🥳', isGoodFeeling: true },
      { category: 'emojis' as const, value: '❤️', isGoodFeeling: true },
      { category: 'emojis' as const, value: '😢', isGoodFeeling: false },
      { category: 'emojis' as const, value: '😓', isGoodFeeling: false },
      { category: 'emojis' as const, value: '😱', isGoodFeeling: false },
      { category: 'emojis' as const, value: '💔', isGoodFeeling: false },
      { category: 'emojis' as const, value: '😰', isGoodFeeling: false }
    ]
  };
  