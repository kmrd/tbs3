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

  // Execute this callbck when Scroll More button is called
  scrollBtnCallback = () => { };

  constructor() {
    this.init();
  }

  init() {
    this.initParallax();
    this.initScrollButton();
    this.initBlob();
    this.initScrollButtonBounce();

    this.showHeroText();
    this.showBlob();
  }

  initScrollButton() {
    document.querySelector(this.introBtn).addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollBtnCallback();
    })
  }

  setScrollBtnCallback(callback) {
    this.scrollBtnCallback = callback;
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

  /**
   * @param timeline the timeline to include this animation into.
   * @return timeline returns the same timeline or none if none was provided.
   */
  hide(timeline = null) {

    const animationObject = timeline ?? gsap;
    animationObject.to(this.introSection, {
      duration: 0.4,
      ease: "power3.out",
      y: '-100vh',
      onComplete: () => {
        this.disableParallax();
      }
    });
    return timeline;
  }

  show() {

  }

  disableParallax() {
    this.parallaxInstance.disable();
  }

  enableParallax() {
    this.parallaxInstance.enable();
  }

  initBlob() {
    const introBlob = new Blob(this.introBubble, /* points= */ 7);
    introBlob.startAnimation();
  }

  showBlob() {
    gsap.from('.scrollMore', {
      delay: 0,
      duration: 0,
      bottom: '-10vh',
    })
    // gsap.from('.scrollMore', {
    // 	delay: 1,
    // 	duration: 2,
    // 	bottom: '-10vh',
    // })
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