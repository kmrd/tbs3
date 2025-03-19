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
    window.addEventListener('scroll', this.updateContentParallax.bind(this));
  }

  updateContentParallax() {
    if (!this.isActive) {
      return;
    }

    const parallaxFactor = this.calcParallaxFactor();
    const backgroundParallaxFactor = parallaxFactor / 2;

    let h1 = this.contents.querySelector('h1');
    gsap.to(h1, {
      duration: "0.8",
      ease: "expo.easeOut",
      bottom: `${15 + (parallaxFactor / 3)}vh`,
    });

    gsap.to(this.feature, {
      duration: "0.8",
      ease: "expo.easeOut",
      backgroundPosition: `50% ${50 + backgroundParallaxFactor}%`,
    });
  }

  /**
   * We don't want to scroll the image off, so we set a bound for parallax
   */
  calcParallaxFactor() {
    const availableDelta =
      this.feature.getBoundingClientRect().bottom -
      this.details.getBoundingClientRect().top;
    const maxRange = window.innerHeight;
    return window.pageYOffset * availableDelta / maxRange;
  }
}