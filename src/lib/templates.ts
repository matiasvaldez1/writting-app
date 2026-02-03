export type ProjectTemplate = {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: string;
  documents: {
    title: string;
    description: string;
    content: string;
  }[];
};

export const templates: ProjectTemplate[] = [
  {
    id: "novel",
    labelKey: "novel",
    descriptionKey: "novelDescription",
    icon: "📖",
    documents: [
      {
        title: "Chapter 1",
        description: "The beginning",
        content: "",
      },
      {
        title: "Chapter 2",
        description: "Rising action",
        content: "",
      },
      {
        title: "Chapter 3",
        description: "The turning point",
        content: "",
      },
    ],
  },
  {
    id: "essay",
    labelKey: "essay",
    descriptionKey: "essayDescription",
    icon: "📝",
    documents: [
      {
        title: "Introduction",
        description: "Thesis and context",
        content: "",
      },
      {
        title: "Development",
        description: "Arguments and evidence",
        content: "",
      },
      {
        title: "Conclusion",
        description: "Summary and closing",
        content: "",
      },
    ],
  },
  {
    id: "blog",
    labelKey: "blog",
    descriptionKey: "blogDescription",
    icon: "💻",
    documents: [
      {
        title: "Post 1",
        description: "First entry",
        content: "",
      },
    ],
  },
  {
    id: "journal",
    labelKey: "journal",
    descriptionKey: "journalDescription",
    icon: "📓",
    documents: [
      {
        title: "Entry 1",
        description: "Today's thoughts",
        content: "",
      },
    ],
  },
  {
    id: "freeform",
    labelKey: "freeform",
    descriptionKey: "freeformDescription",
    icon: "✨",
    documents: [
      {
        title: "Document 1",
        description: "Start writing",
        content: "",
      },
    ],
  },
];
