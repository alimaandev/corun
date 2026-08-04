import { initSession, updatePlayerName, PlayerProfile } from './leaderboard'

export interface GuestProfile extends PlayerProfile {
  ready: boolean
}

export function getGuestName(): string {
  return localStorage.getItem('corun_player_name') || ''
}

export function setGuestName(name: string) {
  try {
    localStorage.setItem('corun_player_name', name)
  } catch {}
}

export async function initProfile(): Promise<PlayerProfile | null> {
  return initSession()
}

export async function renameProfile(profileId: string, name: string): Promise<boolean> {
  return updatePlayerName(profileId, name)
}
