const { gsap } = require('gsap');

export class Shutters {
  /** @type {int|null} */
  activeShutter = null;
  enableActions = false;

  // shutters cover the links
  shutters = document.querySelectorAll('.shutters');
  nav = document.querySelector('nav.shutterContainer');

  highlightedShutter;

  shutterRevealDuration = 0.5;
  shutterWidthFat = 1.5;
  shutterWidthMin = 1;

  intro = document.querySelector('.intro');
  navLinks = document.querySelectorAll('nav>a');
  sections = document.querySelectorAll('section>.pane');

  constructor() {
    this.initShutterEvents();
  }

  initShutterEvents() {
    this.navLinks.forEach((el, key) => {
      el.addEventListener('mouseenter', (e) => {
        // Save the currently moused over shutter to use to set initial state.
        this.highlightedShutter = e.target;
        if (!this.allowShutterAnimation_()) {
          return;
        }
        this.expandShutter(el);
        this.shrinkShutters(this.navLinks, [el]);
      });

      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectShutter(el);
      });
    });

    // If we leave the site entirely, go back to idle.
    this.nav.addEventListener('mouseleave', (e) => {
      if (!this.allowShutterAnimation_()) {
        return;
      }
      this.shrinkShutters(this.navLinks);
    });
  }

  allowShutterAnimation_() {
    if (!this.enableActions) {
      return false;
    }
    if (this.activeShutter !== null) {
      return false;
    }
    return true;
  }

  expandShutter(shutter) {
    gsap.killTweensOf(this.navLinks);
    gsap.to(shutter, {
      duration: this.shutterRevealDuration,
      ease: "power4.out",
      flex: this.shutterWidthFat,
    });
  }

  shrinkShutters(shutters, excludedShutters = [], timelineOptions = {}) {
    shutters.forEach((el, index) => {
      if (!excludedShutters.includes(el))
        gsap.to(el, {
          ...timelineOptions,
          flex: this.shutterWidthMin
        });
    })
  }

  selectShutter(shutter) {
    const startLabel = "start";
    const timelineOptions = {
      duration: 0.8,
      ease: "expo.easeInOut",
    };

    const timeline = gsap.timeline();
    timeline.addLabel(startLabel);
    timeline.to(shutter, {
      ...timelineOptions,
      flex: "30",
      onStart: () => {
        this.activeShutter = shutter;
      },
      onComplete: () => {
        this.showPane();
      }
    }, startLabel);

    this.shrinkShutters(this.navLinks, [shutter], timelineOptions);
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
          if (this.highlightedShutter) {
            this.expandShutter(this.highlightedShutter);
          }
        },
      }));
  }

}