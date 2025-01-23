'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { fetchLikesByUser } from '@/app/actions/like';
import Modal from '@/components/common/Modal';
import ProductCard from '@/components/common/ProductCard';
import Toast from '@/components/common/Toast';
import { useMultipleLike } from '@/hooks/like/useMultipleLike';
import { useAuthStore } from '@/store/authStore';

import SkeletonPage from './SkeletonPage';

const LikesContent = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const userId = user?.id || '';

  const {
    data: likesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['likes', user?.id],
    queryFn: ({ pageParam = 1 }) =>
      fetchLikesByUser({ userId: user.id, pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: undefined,
    enabled: !!user,
  });

  const allLikes = likesData?.pages.flatMap((page) => page.data) || [];
  const allDrinkIds = allLikes.map((item) => item.drink_id);

  const {
    isLoading,
    likeMap,
    toggleItem,
    isModalOpen,
    closeModal,
    toastMessage,
    closeToast,
  } = useMultipleLike(userId, allDrinkIds);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isPending) {
    return <SkeletonPage />;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log('lieksdata: ', likesData);

  return (
    <div className="px-[20px]">
      {likesData.pages[0].data.length > 0 ? (
        <div className="grid w-full grid-cols-2 justify-items-center gap-[8px]">
          {allLikes.map((like) => {
            const isLiked = likeMap[like.drink_id] || false;
            return (
              <ProductCard
                key={like.id}
                id={like.drink_id}
                name={like.drinks.name}
                imageUrl={like.drinks.image}
                isLiked={isLiked}
                onToggleLike={() => toggleItem(like.drink_id)}
                width="163px"
                height="241px"
                marginBottom="20px"
                imgHeight="207px"
              />
            );
          })}

          <div
            ref={observerRef}
            className="col-span-2 flex h-6 items-center justify-center"
          >
            {isFetchingNextPage && (
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-grayscale-300 border-t-grayscale-600"></div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-[160px] flex w-full flex-col items-center">
          <img src="/Character.svg" />
          <p className="mt-[36px] h-[22px] text-title-mb text-grayscale-500">
            좋아요 한 전통주가 없습니다
          </p>
        </div>
      )}
      {/* 로그인 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="좋아요를 하시겠어요?"
        content="좋아요 기능을 사용하려면\n로그인을 해야 해요."
        secondaryAction={{
          text: '돌아가기',
          onClick: closeModal,
        }}
        primaryAction={{
          text: '로그인하기',
          onClick: () => {
            router.push('/signin');
            closeModal();
          },
        }}
      />

      {/* 토스트 */}
      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
    </div>
  );
};

export default LikesContent;
