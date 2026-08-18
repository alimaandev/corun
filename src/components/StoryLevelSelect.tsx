import { useState } from 'react'
import GlassButton from './GlassButton'
import { STORY_NODES, StoryLevelNode, getStoryTopicLabel } from '../game/engine/story/levels'
import {
  StoryProgress,
  isStoryLevelUnlocked,
  starsForNode,
  storyStarsTotal,
} from '../game/engine/story/progress'
import { colors, fonts, alpha, glassPanel, transition, shadows } from '../lib/theme'
import { t } from '../lib/i18n'

interface Props {
  progress: StoryProgress
  onPlay: (node: StoryLevelNode) => void
  onBack: () => void
}

function Stars({ filled, accent }: { filled: number; accent: string }) {
  return (
    <span style={{ color: filled > 0 ? accent : alpha(0.15), fontSize: 14, letterSpacing: 2 }}>
      {[0, 1, 2].map((i) => (i < filled ? '\u2605' : '\u2606')).join('')}
    </span>
  )
}

export default function StoryLevelSelect({ progress, onPlay, onBack }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const totalStars = storyStarsTotal(progress)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        zIndex: 100,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 900, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 6,
              color: colors.accentBright,
              fontFamily: fonts.heading,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {t('story.title')}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 2,
              color: colors.fg,
              fontFamily: fonts.heading,
            }}
          >
            ESCAPE THE WARDEN
          </div>
          <div
            style={{
              fontSize: 13,
              color: alpha(0.4),
              fontFamily: fonts.body,
              letterSpacing: 2,
              marginTop: 8,
            }}
          >
            {t('story.stars', { n: totalStars })}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 14,
          }}
        >
          {STORY_NODES.map((node) => {
            const unlocked = isStoryLevelUnlocked(node, progress)
            const stars = starsForNode(node, progress)
            const hover = hovered === node.id
            return (
              <div
                key={node.id}
                onMouseEnter={() => unlocked && setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => unlocked && onPlay(node)}
                style={{
                  ...glassPanel,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  opacity: unlocked ? 1 : 0.45,
                  borderColor: hover ? node.accent : undefined,
                  boxShadow: hover ? shadows.md : undefined,
                  transform: hover ? 'translateY(-2px)' : undefined,
                  transition,
                  position: 'relative',
                }}
              >
                {node.boss && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      color: node.accent,
                      fontSize: 14,
                      letterSpacing: 2,
                      fontFamily: fonts.heading,
                      fontWeight: 700,
                    }}
                  >
                    {t('story.boss')}
                  </span>
                )}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 6,
                    background: node.accent,
                    color: '#05030f',
                    fontFamily: fonts.heading,
                    fontWeight: 800,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}
                >
                  {node.index + 1}
                </div>
                <div
                  style={{ color: node.accent, fontSize: 13, letterSpacing: 3, fontWeight: 600 }}
                >
                  {getStoryTopicLabel(node.topic)} · {node.difficulty.toUpperCase()}
                </div>
                <div
                  style={{
                    color: colors.fg,
                    fontFamily: fonts.heading,
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: 1,
                  }}
                >
                  {node.title}
                </div>
                <div
                  style={{
                    color: alpha(0.5),
                    fontSize: 13,
                    fontFamily: fonts.body,
                    lineHeight: 1.5,
                    flex: 1,
                  }}
                >
                  {node.subtitle}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: 6,
                  }}
                >
                  <Stars filled={stars} accent={node.accent} />
                  <span style={{ color: alpha(0.3), fontSize: 13, fontFamily: fonts.body }}>
                    {unlocked
                      ? stars > 0
                        ? 'REPLAY'
                        : 'PLAY'
                      : `\uD83D\uDD12 ${t('story.locked')}`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <GlassButton size="sm" variant="secondary" onClick={onBack}>
            ← {t('story.back')}
          </GlassButton>
        </div>
      </div>
    </div>
  )
}
