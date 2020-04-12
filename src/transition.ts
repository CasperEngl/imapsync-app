interface Slide {
  transform: string;
  transformOrigin: string;
  opacity: number;
  height: string | number;
}

interface SlideUp {
  from: Slide;
  enter: Slide;
  leave: Slide;
}

interface Fade {
  opacity: number;
  height: string | number;
}

interface FadeIn {
  from: Fade;
  enter: Fade;
  leave: Fade;
}

export const slideUp: SlideUp = {
  from: {
    transform: 'translate3d(0, 20px, 0)',
    transformOrigin: '50% 0',
    opacity: 0.5,
    height: 0,
  },
  enter: {
    transform: 'translate3d(0, 0, 0)',
    transformOrigin: '50% 0',
    opacity: 1,
    height: 'auto',
  },
  leave: {
    transform: 'translate3d(0, 20px, 0)',
    transformOrigin: '50% 0',
    opacity: 0,
    height: 0,
  },
}

export const fadeIn: FadeIn = {
  from: {
    opacity: 0,
    height: 0,
  },
  enter: {
    opacity: 1,
    height: 'auto',
  },
  leave: {
    opacity: 0,
    height: 0,
  },
}

export default {
  slideUp,
  fadeIn,
}
