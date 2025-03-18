const Parallax = require('parallax-js');
const { Blob } = require('./home_blob');
const { gsap } = require('gsap');

export class Home {
	// Selectors
	introBtn = '.introBtn';
	introSection = '.intro';
	introBubble = '.intro path';
  scrollMoreSection = '.scrollMore';

  parallaxInstance;

  constructor() {}

  init() {
		this.initParallax();

		this.showHeroText();
		this.initBlob();
		this.showBlob();
		this.initScrollButtonBounce();

		document.querySelector(this.introBtn).addEventListener('click', (e) => {
			e.preventDefault();
			this.showSliders();
		});
	}

	showHeroText() {
		const heroTextLine = ".intro .line";
		// Unblur using the CSS var
		gsap.from(heroTextLine, {
			"--header-blur": "15px",
			duration: 1.75,
			stagger: {
				each: 0.5,
			},
		});
	}

	initParallax() {
		this.parallaxInstance = new Parallax(
			document.querySelector(this.introSection),
			{
				relativeInput: true,
				hoverOnly: true,
				selector: '.bg, h1',
				pointerEvents: true,
			}
		);
	}

  getParallaxInstance() {
    return this.parallaxInstance;
  }

	initBlob() {
		const introBlob = new Blob(this.introBubble, /* points= */ 7);
		introBlob.startAnimation();
	}

	showBlob() {
		gsap.from('.scrollMore', {
			delay: 1,
			duration: 2,
			bottom: '-10vh',
		})
	}

	initScrollButtonBounce() {
		const maxScale = 1.2;
		const minScale = 1.0;

		const scrollButtonBounceTimeline = gsap.timeline({
			repeat: -1,
			repeatDelay: 1,
		});
		scrollButtonBounceTimeline.to(this.introBtn, {
			scale: minScale,
			duration: 0,
		});
		scrollButtonBounceTimeline.to(this.introBtn, {
			scale: maxScale,
			duration: .5,
			ease: "power1.out",
		});
		scrollButtonBounceTimeline.to(this.introBtn, {
			scale: minScale,
			duration: 1.75,
			ease: "bounce.out",
		});
	}
}