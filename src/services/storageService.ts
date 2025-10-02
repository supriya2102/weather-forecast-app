import { RecentSearch } from '../types/weather';

const RECENT_SEARCHES_KEY = 'weatherApp_recentSearches';
const MAX_RECENT_SEARCHES = 5;

export const storageService = {
  getRecentSearches(): RecentSearch[] {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      return [];
    }
  },

  addRecentSearch(search: Omit<RecentSearch, 'timestamp'>): void {
    try {
      const searches = this.getRecentSearches();

      const existingIndex = searches.findIndex(
        s => s.city.toLowerCase() === search.city.toLowerCase()
      );

      if (existingIndex !== -1) {
        searches.splice(existingIndex, 1);
      }

      const newSearch: RecentSearch = {
        ...search,
        timestamp: Date.now()
      };

      searches.unshift(newSearch);

      const limitedSearches = searches.slice(0, MAX_RECENT_SEARCHES);

      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limitedSearches));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  },

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  }
};
