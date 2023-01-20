import type Media from '@server/entity/Media';
import type { MediaResultsResponse } from '@server/interfaces/api/mediaInterfaces';
import useSWRInfinite from 'swr/infinite';

export interface BaseSearchResult<T> {
  page: number;
  totalResults: number;
  totalPages: number;
  results: T[];
}

interface MediaResult {
  isLoadingInitialData: boolean;
  isLoadingMore: boolean;
  fetchMore: () => void;
  isEmpty: boolean;
  isReachingEnd: boolean;
  error: unknown;
  titles: Media[];
  firstResultData?: MediaResultsResponse;
}

const useMedia = (
  endpoint: string,
  options?: Record<string, unknown>
): MediaResult => {
  const pageSize = (options?.pageSize as number) ?? 20;
  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<MediaResultsResponse>(
      (pageIndex: number, previousPageData) => {
        if (
          previousPageData &&
          pageIndex + 1 > previousPageData.pageInfo.pages
        ) {
          return null;
        }

        const params: Record<string, unknown> = {
          skip: pageIndex * pageSize,
          ...options,
        };

        const finalQueryString = Object.keys(params)
          .map((paramKey) => `${paramKey}=${params[paramKey]}`)
          .join('&');

        return `${endpoint}?${finalQueryString}`;
      },
      {
        initialSize: 3,
      }
    );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 &&
      !!data &&
      typeof data[size - 1] === 'undefined' &&
      isValidating);

  const fetchMore = () => {
    setSize(size + 1);
  };

  const titles = (data ?? []).reduce(
    (a, v) => [...a, ...v.results],
    [] as Media[]
  );

  const isEmpty = !isLoadingInitialData && titles?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (!!data && (data[data?.length - 1]?.results.length ?? 0) < pageSize);

  return {
    isLoadingInitialData,
    isLoadingMore,
    fetchMore,
    isEmpty,
    isReachingEnd,
    error,
    titles,
    firstResultData: data?.[0],
  };
};

export default useMedia;
