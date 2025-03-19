const { gsap } = require('gsap');

export class Modal {

  buttonEl;
  modals = document.querySelector('#modals');
  bubble = document.querySelector('#modal-bubble');

  constructor(buttonEl) {
    this.buttonEl = buttonEl;

    this.initEvents();
  }

  initEvents() {
    this.buttonEl.addEventListener('click', (e) => {
      e.preventDefault();

      this.showModal();
    });
  }

  showModal() {
    // put the right image into the bubble
    const imgSrc = this.buttonEl.style.backgroundImage.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
    this.bubble.querySelector('img').setAttribute('src', imgSrc);

    // name of contents we want (eg. #design-stopsign)
    const targetHref = this.buttonEl.dataset.contents;
    // console.log('a.modal-btn class:', this.buttonEl.dataset.class);

    // Setup the correct modal SECTION to show
    const modalSection = document.getElementById(targetHref)

    // Setup the correct modal configuration
    if (this.buttonEl.dataset.class == 'design') {
      this.modals.classList.add('design');
      this.modals.classList.remove('dev');
    }
    else if (this.buttonEl.dataset.class == 'develop') {
      this.modals.classList.add('dev');
      this.modals.classList.remove('design');
    }

    // Show the modal, but behind the contents
    modalSection.classList.add('show');
    this.modals.classList.add('renderBehind');
    this.modals.scrollTo(0, 0);

    // get the final position
    const targetImg = modalSection.querySelector('img');
    const targetCoords = targetImg.getBoundingClientRect();

    // Animate a surrogate image from the current clicked position to the new desired position
    // Hide the originall clicked button to avoid double vision
    this.bubble.classList.add('show');

    const coords = this.buttonEl.getBoundingClientRect();
    const scrolled = window.scrollY;
    this.bubble.style.top = coords.top + scrolled + 'px';
    this.bubble.style.left = coords.left + 'px';
    this.bubble.style.width = coords.width + 'px';
    this.bubble.style.height = coords.height + 'px';

    gsap.to(this.bubble, {
      duration: .75,
      ease: "expo.inOut",
      top: targetCoords.top + scrolled + 'px',
      left: targetCoords.x,
      width: targetCoords.width,
      height: targetCoords.height,
      onStart: () => {
        this.buttonEl.classList.add('hide');
      },
      onComplete: () => {
        this.modals.classList.add('show');
      }
    });
  }
}