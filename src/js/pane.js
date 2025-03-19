const Parallax = require('parallax-js');
const { gsap } = require('gsap');

export class Pane {
  name;
  contents;
  feature;
  details;
  isActive = false;

  constructor(name, targetElement) {
    this.name = name;
    this.initContents();
    this.initParallax();
  }

  initContents() {
    this.contents = document.querySelector(`.pane#${this.name}`);
    this.feature = this.contents.querySelector('.feature');
    this.details = this.contents.querySelector('.details');
  }

  show() {
    // this.contents.classList.add('active');
    this.setActive(/* state= */ true);
  }

  setActive(state) {
    this.isActive = state;
    if (state) {
      this.contents.classList.add('active');
    } else {
      this.contents.classList.remove('active');
    }
  }

  initParallax() {
    // window.addEventListener('scroll', updateContentParallax, scrollingListenerAbortSignal);
    window.addEventListener('scroll', this.updateContentParallax.bind(this));
  }

  updateContentParallax() {
    if (!this.isActive) {
      return;
    }
    // We don't want to scroll the image off, so we set a bound for parallax
    const availableDelta =
      this.feature.getBoundingClientRect().bottom -
      this.details.getBoundingClientRect().top;
      console.log(availableDelta);
    const maxRange = window.innerHeight;
    const parallaxFactor = window.pageYOffset * availableDelta / maxRange / 2;
    let scrolled = window.pageYOffset / window.innerHeight * 100;

    let h1 = this.contents.querySelector('h1');
    gsap.to(h1, {
      duration: "0.8",
      ease: "expo.easeOut",
      // bottom: 15 + (scrolled * 0.5) + 'vh',
      bottom: `${15 + (parallaxFactor / 3)}vh`,
    });

    // let feature = document.querySelectorAll('.contents .pane .feature')
    gsap.to(this.feature, {
      duration: "0.8",
      ease: "expo.easeOut",
      backgroundPosition: `50% ${50 + parallaxFactor}%`,
    });
  }
}