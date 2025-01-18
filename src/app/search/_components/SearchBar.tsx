import { useRef } from 'react';

import useFilterStore from '@/store/filterStore';
import useFocusStore from '@/store/focusStore';
import useSearchStore from '@/store/keywordStore';
import useResults from '@/store/resultStore';
import useSortStore from '@/store/selectStore';

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    triggerFetch,
    isFiltered,
    resetFilters,
    setIsFiltered,
    setTriggerFetch,
    setValues,
  } = useFilterStore();
  const { keyword, setKeyword, setSearchTriggerFetch, resetSearchStore } =
    useSearchStore();
  const { isSearchFocus, setIsSearchFocuse, resetStates } = useFocusStore();
  const { clearResults } = useResults();
  const { selectedSort, setSelectedSort } = useSortStore();
  const handleReset = () => {
    resetStates(); // 저장된 정보 삭제
    resetFilters(); // 필터값 리셋
    setIsFiltered(false); // 필터 상태정보
    setIsSearchFocuse(false);
    resetSearchStore(); // keyword 지우기
    setValues([1, 3]);
    setSelectedSort('alphabetical'); // 초기값 세팅
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newKeyword = inputRef.current?.value || ''; // 혹시 모를 || '' 도 체크
      setKeyword(newKeyword);
      clearResults();
      setTriggerFetch(false);
      setIsSearchFocuse(true);
      setSearchTriggerFetch(true);
      setSelectedSort('alphabetical');
      // 여기서 검색결과 저장 api 요청을 여기서 보내면 되는데
      // setIsSearchFocuse로 true 보내야지만 useEffect에서 그제서야 확인하고
      // 요청을 하는 것이라 -> 여기서 요청을 바로 진행하면 된다.
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={`${
        isSearchFocus || isFiltered ? 'mt-0' : 'mt-40'
      } mx-auto flex max-w-md items-center bg-white px-4 py-2 transition-all duration-300`}
    >
      <div
        className={`flex flex-1 items-center rounded-full px-4 py-2 shadow-sm transition ${
          isSearchFocus || isFiltered
            ? 'border-2 border-green-500 bg-white'
            : 'bg-gray-100'
        }`}
      >
        <svg
          className={`h-5 w-5 ${
            triggerFetch ? 'text-green-500' : 'text-gray-500'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 16l4-4-4-4m5 4h7"
          />
        </svg>
        <input
          type="text"
          name="search"
          value={value}
          onChange={handleInputChange}
          placeholder="무엇을 찾으시나요?"
          className="w-full bg-transparent pl-2 text-sm text-gray-700 outline-none"
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          ref={inputRef}
          onKeyDown={handleKeyDown}
        />
      </div>
      {isSearchFocus || isFiltered ? (
        <button className="ml-2 text-sm text-green-500" onClick={handleReset}>
          취소
        </button>
      ) : null}
    </div>
  );
};

export default SearchBar;
