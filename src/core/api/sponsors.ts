import { get } from './httpClient'

interface Sponsor {
  id: string
  name: string
  bannerUrl: string
  linkUrl: string
  isActive: boolean
  displayOrder: number
  createdAt: string
}

export function fetchSponsors(): Promise<Sponsor[]> {
  return get<Sponsor[]>('/sponsors')
}
