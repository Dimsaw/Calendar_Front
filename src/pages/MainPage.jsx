import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';

import { authGoogle } from 'redux/auth/operations';
import { Header, Description, ReviewsSlider } from 'components/Main';
import { MainWrapper } from './MainPage.styled';
import { fetchReviews } from '../redux/reviews/operations';

const useFetchReviewsOnScroll = (ref) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;

      if (scrollPosition >= 50) {
        dispatch(fetchReviews());
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch]);
};
const MainPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const descriptionRef = useRef(null);

  useFetchReviewsOnScroll(descriptionRef);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    dispatch(authGoogle(token));
  }, [location.search, dispatch]);

  return (
    <>
      <Header />
      <MainWrapper>
        <Description ref={descriptionRef} />
        <ReviewsSlider />
      </MainWrapper>
    </>
  );
};

export default MainPage;
