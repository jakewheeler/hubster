import { RateLimitedError } from '../errors';
import { RateLimitResponse, SearchResults } from '../types';

export async function isSearchRateLimited(): Promise<boolean> {
    const url = 'https://api.github.com/rate_limit';
    try {
      const resp = await fetch(url);
      const data: RateLimitResponse = await resp.json();
      return data.resources.search.remaining <= 0;
    } catch (e) {
      console.error('Could not check rate limit status.');
    }
    return true;
  }
  
  export async function fetchSearchResults(
    searchText: string,
    currentPage: number
  ): Promise<SearchResults> {
    // free tier API only allows 1000 first results from search
    const maxPages = 100;
    const showPerPage = 10;
  
    // check if we're rate limited before doing anything
    const isRateLimited = await isSearchRateLimited();
    if (isRateLimited) {
      throw new RateLimitedError('Rate limited');
    }
  
    const searchUserEndpoint = 'https://api.github.com/search/users?';
    const endpointWithQuery = `${searchUserEndpoint}q=${searchText}+in:login+type:user&page=${currentPage}&per_page=${showPerPage}`;
    const resp = await fetch(endpointWithQuery);
  
    if (!resp.ok) {
      throw new Error('Something went wrong.');
    }
  
    const searchData: SearchResults = await resp.json();
  
    return searchData;
  }