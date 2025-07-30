import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {showLoader, hideLoader, resetLoader} from '../redux/loaderSlice';

export const useLoader = () => {
  const dispatch = useDispatch();
  const {isLoading, message} = useSelector((state: RootState) => state.loader);

  const startLoading = (message?: string) => {
    dispatch(showLoader(message || 'Loading...'));
  };

  const stopLoading = () => {
    dispatch(hideLoader());
  };

  const resetLoading = () => {
    dispatch(resetLoader());
  };

  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    resetLoading,
  };
}; 