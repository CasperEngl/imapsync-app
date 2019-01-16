export const slideUp = {
  from: {
    transform: 'translate3d(0, 40px, 0)',
    opacity: 0,
    height: 0,
  },
  enter: [
    {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1,
      height: 'auto',
    },
  ],
  leave: [
    {
      transform: 'translate3d(0, 40px, 0)',
      opacity: 0,
      height: 0,
    },
  ],
};

export const fadeIn = {
  from: {
    opacity: 0,
  },
  enter: [
    {
      opacity: 1,
    },
  ],
  leave: [
    {
      opacity: 0,
    },
  ],
};

export default {
  slideUp,
  fadeIn,
};
