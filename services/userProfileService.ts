import { Club, Deal } from '../types';

export interface UserProfileData {
  displayName: string;
  email: string;
  photoURL?: string;
  rollNumber?: string;
  branch?: string;
  year?: string;
  section?: string;
  bio?: string;
  phone?: string;
  targetGpa?: string;
}

const PROFILE_KEY = 'alfa_user_profile';
const JOINED_CLUBS_KEY = 'alfa_joined_clubs';
const LOCAL_DEALS_KEY = 'alfa_local_deals';

export const userProfileService = {
  // User Profile
  getProfile: (): UserProfileData => {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse profile data', e);
    }
    return {
      displayName: 'LPU Student',
      email: 'student@lpu.in',
      rollNumber: '12201942',
      branch: 'B.Tech CSE',
      year: '3rd Year',
      section: 'K22GK',
      bio: 'Enthusiastic LPU CSE student interested in Full-Stack Development, AI, and campus technical clubs.',
      phone: '+91 98765 43210',
      targetGpa: '8.5'
    };
  },

  saveProfile: (profile: UserProfileData) => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      window.dispatchEvent(new Event('alfa_profile_updated'));
    } catch (e) {
      console.error('Failed to save profile data', e);
    }
  },

  // Joined / Registered Clubs
  getJoinedClubs: (): Club[] => {
    try {
      const data = localStorage.getItem(JOINED_CLUBS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse joined clubs', e);
    }
    return [];
  },

  isClubJoined: (clubIdOrName: string): boolean => {
    const clubs = userProfileService.getJoinedClubs();
    return clubs.some(c => c.id === clubIdOrName || c.name === clubIdOrName);
  },

  toggleJoinClub: (club: Club): boolean => {
    const clubs = userProfileService.getJoinedClubs();
    const clubKey = club.id || club.name;
    const exists = clubs.some(c => (c.id && c.id === club.id) || c.name === club.name);
    let updated: Club[];

    if (exists) {
      updated = clubs.filter(c => (c.id ? c.id !== club.id : c.name !== club.name));
    } else {
      updated = [club, ...clubs];
    }

    try {
      localStorage.setItem(JOINED_CLUBS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('alfa_profile_updated'));
    } catch (e) {
      console.error('Failed to save joined clubs', e);
    }
    return !exists;
  },

  // Local Posted Marketplace Deals
  getPostedDeals: (): Deal[] => {
    try {
      const data = localStorage.getItem(LOCAL_DEALS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse local deals', e);
    }
    return [];
  },

  deletePostedDeal: (dealId: string): Deal[] => {
    const deals = userProfileService.getPostedDeals();
    const updated = deals.filter(d => d.id !== dealId);
    try {
      localStorage.setItem(LOCAL_DEALS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('alfa_profile_updated'));
    } catch (e) {
      console.error('Failed to delete deal', e);
    }
    return updated;
  },

  toggleDealSoldStatus: (dealId: string): Deal[] => {
    const deals = userProfileService.getPostedDeals();
    const updated = deals.map(d => {
      if (d.id === dealId) {
        const isSold = (d as any).isSold;
        return { ...d, isSold: !isSold };
      }
      return d;
    });
    try {
      localStorage.setItem(LOCAL_DEALS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('alfa_profile_updated'));
    } catch (e) {
      console.error('Failed to update deal status', e);
    }
    return updated;
  }
};
