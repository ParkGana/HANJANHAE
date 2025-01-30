'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { deleteUser } from '@/app/actions/auth';
import { useAuth } from '@/app/providers/AuthProvider';
import { useModal } from '@/app/providers/ModalProvider';
import ResetPasswordModal from '@/components/auth/ResetPasswordModal';
import OptimizedImage from '@/components/common/OptimizedImage';
import { useAuthStore } from '@/store/authStore';

const MyPageAccountOptions = () => {
  const [isOpenResetModal, setIsOpenResetModal] = useState<boolean>(false);
  const router = useRouter();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const { removeUser } = useAuthStore();

  const { openModal, closeModal } = useModal();

  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });

  const handleLogout = async () => {
    logout();
    queryClient.removeQueries({ queryKey: ['userProfile'] });
  };

  const handleDeleteUser = async () => {
    deleteUser();
    removeUser();
  };

  const openDeleteModal = () => {
    openModal({
      title: '회원 탈퇴를 하시겠어요?',
      content: '탈퇴 하시면 저장된 정보가 모두 사라집니다.',
      secondaryAction: {
        text: '회원으로 남기',
        onClick: closeModal,
      },
      primaryAction: {
        text: '탈퇴하기',
        onClick: () => {
          closeModal();
          handleDeleteUser();
        },
      },
    });
  };

  return (
    <>
      <div className="mt-6 w-full px-5">
        <div>
          {/* Password Reset */}
          <div
            className="flex max-w-[182px] cursor-pointer items-center"
            onClick={() =>
              isDesktop
                ? setIsOpenResetModal(true)
                : router.push('/password/check')
            }
          >
            <div className="flex h-12 w-12 items-center justify-center p-3">
              <OptimizedImage
                src="/assets/icons/key.svg"
                alt="Key Icon"
                className="h-6 w-6"
              />
            </div>
            <span className="ml-4 text-label-lm text-grayscale-900">
              비밀번호 재설정
            </span>
          </div>

          {/* Logout */}
          <div
            className="mt-6 flex cursor-pointer items-center"
            onClick={handleLogout}
          >
            <div className="flex h-12 w-12 items-center justify-center">
              <OptimizedImage
                src="/assets/icons/logout.svg"
                alt="Logout Icon"
                className="h-6 w-6"
              />
            </div>
            <span className="ml-4 text-label-lm text-grayscale-900">
              로그아웃
            </span>
          </div>
        </div>

        {/* Delete account section */}
        <div
          className={
            isDesktop
              ? 'relative mt-10 flex justify-center'
              : 'absolute bottom-[calc(68px+3rem)] left-0 right-0 flex justify-center'
          }
        >
          <button
            className="cursor-pointer p-3 text-body-mm text-grayscale-800 underline"
            onClick={openDeleteModal}
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      {isOpenResetModal && (
        <ResetPasswordModal handleClose={() => setIsOpenResetModal(false)} />
      )}
    </>
  );
};

export default MyPageAccountOptions;
