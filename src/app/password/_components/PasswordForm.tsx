'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/auth/Button';
import InputField from '@/components/auth/InputField';
import Modal from '@/components/auth/Modal';
import useResetPassword from '@/hooks/auth/useResetPassword';

const PasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('code');

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { handleSubmit, register, onSubmit, errors } = useResetPassword({
    token,
    handleError: (message: string) => {
      setErrorMessage(message);
      setIsOpenModal(true);
    },
  });

  return (
    <>
      <form className="pb-10 xl:pb-[220px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[100px] flex flex-col gap-6 xl:mb-[80px]">
          <InputField
            id="password"
            label="비밀번호를 변경해주세요."
            type="password"
            register={register}
            error={errors.password?.message}
          />
          <InputField
            id="passwordConfirm"
            label="새 비밀번호를 확인해주세요."
            type="password"
            register={register}
            error={errors.passwordConfirm?.message}
          />
        </div>

        <Button label="완료" />
      </form>

      {isOpenModal && (
        <Modal
          title={errorMessage}
          content="다시 시도해주세요."
          button={{ text: '확인', onClick: () => setIsOpenModal(false) }}
        />
      )}
    </>
  );
};

export default PasswordForm;
