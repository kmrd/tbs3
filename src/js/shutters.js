const { gsap } = require('gsap');

export class Shutters {
  /** @type {int|null} */
  activeShutter = null;
  enableActions = false;

  // shutters cover the links
  shutters = document.querySelectorAll('.shutters');
  nav = document.querySelector('nav.shutterContainer');

  shutterRevealDuration = 0.5;
  shutterWidthFat = 1.4;
  shutterWidthMin = 1;

  // isShowingContents = false;
  intro = document.querySelector('.intro');
  navLinks = document.querySelectorAll('nav>a');
  sections = document.querySelectorAll('section>.pane');
  introTimeLine = gsap.timeline();

  constructor() {
    this.init();
  }

  init() {
    this.initShutterEvents();
  }

  initShutterEvents() {
    this.navLinks.forEach((el, key) => {
      el.addEventListener('mouseenter', (e) => {
        this.expandShutter(el);
        this.shrinkShutters(this.navLinks, [el]);
      });
    });

    // If we leave the site entirely, go back to idle.
    this.nav.addEventListener('mouseleave', (e) => {
      this.shrinkShutters(this.navLinks);
    });
  }

  expandShutter(shutter) {
    if (!this.enableActions || this.activeShutter !== null) {
      return;
    }
    gsap.killTweensOf(this.navLinks);
    gsap.to(shutter, {
      duration: this.shutterRevealDuration,
      ease: "power4.out",
      flex: this.shutterWidthFat,
    });
  }

  shrinkShutters(shutters, excludedShutters = []) {
    if (!this.enableActions || this.activeShutter !== null) {
      return;
    }
    shutters.forEach((el, index) => {
      if (!excludedShutters.includes(el))
      gsap.to(el, { flex: this.shutterWidthMin });
    })
  }

  show(timeline = null) {
    const animationObject = timeline ?? gsap;

    animationObject.add(
      gsap.to(this.shutters, {
        duration: 0.5,
        ease: "expo.easeInOut",
        left: '100%',
        stagger: 0.08,
        onComplete: () => {
          this.enableActions = true;
        },
      }));
  }

}