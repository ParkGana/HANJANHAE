import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getPopularDrinks } from '@/app/actions/filter';
import useFilterStore from '@/store/filterStore';
import useSearchStore from '@/store/keywordStore';
import useSortStore from '@/store/selectStore';

const useFilterLikedResults = () => {
  const { resetFilters, setTriggerFetch, setIsFiltered } = useFilterStore();
  const { resetSearchStore, setSearchTriggerFetch } = useSearchStore();
  const { selectedSort } = useSortStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ['filterDrinks', selectedSort === 'liked'],
      queryFn: ({ pageParam = 1 }) => getPopularDrinks({ page: pageParam }),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextPage : null,
      initialPageParam: 1,
      enabled: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });
  // triggerFetch true일 때 refetch 호출
  useEffect(() => {
    if (selectedSort === 'liked') {
      refetch(); // enabled false를 이용한 트리거
      setTriggerFetch(false);
      setSearchTriggerFetch(false);
    }
  }, [selectedSort]);

  const totalCount = data?.pages[0]?.totalCount || 0;

  return {
    likedData: data?.pages.flatMap((page) => page.likedDrinks) || [],
    isLoading,
    isError,
    totalCount,
    fetchNextPage,
    hasNextPage,
  };
};

export default useFilterLikedResults;
