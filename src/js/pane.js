

export class Pane {
  name;
  contents;

  constructor(name, targetElement) {
    this.name = name;
    this.initContents();
  }

  initContents() {
    this.contents = document.querySelector(`.pane#${this.name}`);
  }

  show() {
    // this.contents.classList.add('active');
    this.isActive(/* state= */ true);
  }

  isActive(state) {
    this.state = state;
    if (state) {
      this.contents.classList.add('active');
    } else {
      this.contents.classList.remove('active');
    }
  }
}