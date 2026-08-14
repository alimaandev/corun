import { Difficulty, Topic } from '../../types'

export interface StoryLine {
  speaker: string
  text: string
}

export interface StoryLevelNode {
  id: string
  index: number
  title: string
  subtitle: string
  accent: string
  topic: Topic
  difficulty: Difficulty
  questions: number
  intro: StoryLine[]
  boss?: boolean
}

export const STORY_ACCENTS = {
  cell: '#8faf2f',
  vents: '#7aa2ff',
  core: '#ff7a7a',
  warden: '#ffd700',
} as const

export const STORY_NODES: StoryLevelNode[] = [
  {
    id: 'cell',
    index: 0,
    title: 'THE CELL',
    subtitle: 'Strings & Variables',
    accent: STORY_ACCENTS.cell,
    topic: 'javascript',
    difficulty: 'easy',
    questions: 6,
    intro: [
      { speaker: 'ELENA', text: "You're awake. They rebooted the grid while you were out." },
      {
        speaker: 'ELENA',
        text: 'This is the Cell — where they keep runaway code. Every junction tests what you know.',
      },
      {
        speaker: 'ELENA',
        text: 'Run the pipes, answer the junction queries, and reach the exit. I will cover you.',
      },
    ],
  },
  {
    id: 'vents',
    index: 1,
    title: 'THE VENTS',
    subtitle: 'Arrays & Loops',
    accent: STORY_ACCENTS.vents,
    topic: 'python',
    difficulty: 'medium',
    questions: 8,
    intro: [
      { speaker: 'ELENA', text: 'The Vents recycle everything — old data, old code, old guards.' },
      {
        speaker: 'ELENA',
        text: 'Arrays and loops keep the airflow alive. If you can loop, you can breathe down here.',
      },
      {
        speaker: 'ELENA',
        text: 'Watch the patrol drones. They follow the same code every cycle. Predict them.',
      },
    ],
  },
  {
    id: 'core',
    index: 2,
    title: 'THE CORE',
    subtitle: 'Objects & Functions',
    accent: STORY_ACCENTS.core,
    topic: 'typescript',
    difficulty: 'hard',
    questions: 10,
    intro: [
      {
        speaker: 'ELENA',
        text: "The Core is the Warden's own memory. It thinks in objects and functions.",
      },
      { speaker: 'ELENA', text: 'One wrong step here and it will notice us. Stay sharp.' },
    ],
  },
  {
    id: 'warden',
    index: 3,
    title: 'THE WARDEN',
    subtitle: 'Algorithms — Final Fight',
    accent: STORY_ACCENTS.warden,
    topic: 'algorithms',
    difficulty: 'hard',
    questions: 12,
    boss: true,
    intro: [
      { speaker: 'WARDEN', text: 'So. You crawled through my pipes and ate my memory.' },
      { speaker: 'WARDEN', text: 'Cute. Now let me show you what an algorithm can really do.' },
      { speaker: 'ELENA', text: 'He is taunting you. Do not stop moving. Do not stop solving.' },
    ],
  },
]

export function getStoryNode(id: string): StoryLevelNode | undefined {
  return STORY_NODES.find((n) => n.id === id)
}

export function getStoryTopicLabel(topic: Topic): string {
  const labels: Record<Topic, string> = {
    javascript: 'JS',
    python: 'PY',
    typescript: 'TS',
    web: 'WEB',
    databases: 'DB',
    general: 'GEN',
    algorithms: 'ALGO',
  }
  return labels[topic]
}
