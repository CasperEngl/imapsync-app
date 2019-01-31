interface Slide {
  transform: string;
  opacity: number;
  height: string | number;
}

interface SlideUp {
  from: Slide | Slide[];
	enter: Slide | Slide[];
	leave: Slide | Slide[];
}

interface Fade {
	opacity: number;
	height: string | number;
}

interface FadeIn {
  from: Fade | Fade[];
  enter: Fade | Fade[];
  leave: Fade | Fade[];
}

export const slideUp: SlideUp = {
	from: {
		transform: 'translate3d(0, 40px, 0)',
		opacity: 0,
		height: 0,
	},
	enter: {
		transform: 'translate3d(0, 0, 0)',
		opacity: 1,
		height: 'auto',
	},
	leave: {
		transform: 'translate3d(0, 40px, 0)',
		opacity: 0,
		height: 0,
	},
};

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
};

export default {
	slideUp,
	fadeIn,
};
