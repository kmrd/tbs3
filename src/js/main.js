const Parallax = require('parallax-js');
const { gsap } = require('gsap');
const { Home } = require('./home');
const { Shutters } = require('./shutters');

class Page {
	// Track states
	isHome;
	transitionTimeline = gsap.timeline();

	// "Components"
	home = new Home();
	shutters = new Shutters();

	homeScrollingDeadzone = '100'; //px

	constructor() { }

	init() {
		this.isHome = true;

		this.initHomeSection();
		// this.navigateToShutters(); // debugging only
		// this.initShutters();
	}

	initHomeSection() {
		// Set the callback for when the scroll button is clicked
		this.home.setScrollBtnCallback(this.navigateToShutters.bind(this));

		this.centerScrollableRegion();

		window.addEventListener('scroll', (e) => {
			// Monitor when the scroll hits the top -- then 
			// // Scroll the window. This triggers the intro 
			// // animation as if the user had scrolled themselves
			// const maxHeight = Math.max(
			//   document.body.scrollHeight, document.body.offsetHeight,
			//   document.documentElement.clientHeight, document.documentElement.scrollHeight,
			//   document.documentElement.offsetHeight);
			// if (window.scrollY == maxHeight) {
			//   window.scrollTo(0, 0);
			// }

			if (this.isHome) {
				// this.navigateToShutters();
				// 	if (last_known_scroll_position < window.scrollY) {
				// 		// history.pushState({ section: '#main' }, "Main", "#main");
				// 		this.home.getParallaxInstance().disable();

				// 		// introTimeLine.play();
				// 		// document.querySelector('body').classList.add('main');
				// 	} else {
				// 		// history.pushState({ section: '#home'}, "Home", "/");
				// 		this.home.getParallaxInstance().enable();
				// 		introTimeLine.reverse();
				// 		// document.querySelector('body').classList.remove('main');
				// 	}

				// 	last_known_scroll_position = window.scrollY;
			}
		});
	}

	centerScrollableRegion() {
		const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

		window.scrollTo({
			top: viewportHeight / 2,
			behavior: "instant",
		});
	}

	navigateToShutters() {
		this.isHome = false;
		this.home.hide(this.transitionTimeline);
		this.shutters.show(this.transitionTimeline);
	}
}

let isShowingContents; // if the nav sections are showing their content
let last_known_scroll_position;

let parallaxInstance;

let navShutters;
let introTimeLine;
let sectionTimeLine;
let navLinks; // main content links

// let hamburgerLinks; // menu links
let sections; // all the content sections
let currentSection;


// function initIntro() {
// 	const intro = document.querySelector('.intro');
// 	const introBtn = document.querySelector('.introBtn');

// 	introBtn.addEventListener('click', (e) => {
// 		e.preventDefault();
// 		e.stopPropagation();

// 		// Scroll the window. This triggers the intro 
// 		// animation as if the user had scrolled themselves
// 		const maxHeight = Math.max(
// 			document.body.scrollHeight, document.body.offsetHeight,
// 			document.documentElement.clientHeight, document.documentElement.scrollHeight,
// 			document.documentElement.offsetHeight);
// 		if (window.scrollY == maxHeight) {
// 			window.scrollTo(0, 0);
// 		}
// 		gsap.to(window, 0.5, { scrollTo: { y: '100' } });
// 	});

// window.addEventListener('scroll', (e) => {
// 	if (!isShowingContents) {

// 		if (last_known_scroll_position < window.scrollY) {
// 			// history.pushState({ section: '#main' }, "Main", "#main");
// 			parallaxInstance.disable();

// 			introTimeLine.play();
// 			// document.querySelector('body').classList.add('main');
// 		} else {
// 			// history.pushState({ section: '#home'}, "Home", "/");
// 			parallaxInstance.enable();
// 			introTimeLine.reverse();
// 			// document.querySelector('body').classList.remove('main');
// 		}

// 		last_known_scroll_position = window.scrollY;
// 	}
// });

// 		// TODO: Hookup hamburger nav to these animations
// 		navLinks[i].addEventListener('click', (e) => {
// 			e.preventDefault();
// 			e.stopPropagation();

// 			setState(e);

// 			sectionTimeLine = gsap.timeline();

// 			// If we're inside of a section, backout of it
// 			if (isShowingContents && currentSection) {
// 				// console.log('backingout');
// 				sectionTimeLine.add(gsap.to(window, 0.3, {
// 					scrollTo: 0,
// 					onComplete: setStateNav
// 				}));
// 			}

// 			sectionTimeLine.add("startTransition");

// 			sectionTimeLine.add(gsap.to(navLinks, 0.8, {
// 				ease: "expo.easeInOut",
// 				flex: '1'
// 			}), "startTransition");
// 			gsap.killTweensOf(e.target, { flex: true });
// 			sectionTimeLine.add(gsap.to(e.target, 0.8, {
// 				ease: "expo.easeInOut",
// 				flex: '30',
// 				onStart: setTransitionStateToContents,
// 				onStartParams: [e.target],
// 				onComplete: setStateContents,
// 				onCompleteParams: [e.target],
// 				onReverseComplete: unsetStateContents
// 			}), "startTransition");

// 			currentSection = document.querySelector(e.target.hash);
// 		});
// 	}


// // TODO: hook up hamburger
// const hamburger = document.querySelector('.nav-hamburger');
// hamburger.addEventListener('click', (e) => {
// 	hideContent();
// 	sectionTimeLine.reverse();
// })
// }


// Do this to get back to 3 shutters layout
function setStateNav(params) {
	// console.log(params);
	deactivateLinks(params);
	deactivateContentPanes(params);
}
function deactivateLinks() {
	for (let i = 0; i < navLinks.length; i++) {
		navLinks[i].classList.remove('active');
	}
}
function deactivateContentPanes() {
	for (let i = 0; i < sections.length; i++) {
		sections[i].classList.remove('active');
	}
}


// Do this to get back to show some Contents
function setTransitionStateToContents(target) {
	isShowingContents = true;

	// undo the scrolling needed for the intro
	window.scrollTo(0, 0);

	// get the content ready to reveal in the background
	let content = document.querySelector(target.hash);

	content.classList.add('active');

	document.querySelector('body').classList.add('main');
}
function unsetTransitionStateToContents() {
	// give some space to allow for scrolling up into the intro
	const maxHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight,
		document.documentElement.clientHeight, document.documentElement.scrollHeight,
		document.documentElement.offsetHeight);
	if (window.scrollY == 0) {
		last_known_scroll_position = 0;
		window.scrollTo(0, maxHeight);
	}

	isShowingContents = false;

	const panes = document.querySelectorAll('.pane.active');

	for (let i = 0; i < panes.length; i++) {
		panes[i].classList.remove('active');
	}

	document.querySelector('body').classList.remove('main');
}
function setStateContents(params) {
	showContent(params);
}
function unsetStateContents() {
	hideContent();
	unsetTransitionStateToContents();
}
function showContent(target) {
	let link = target;
	link.classList.add('active');
	// console.log(target);
}
function hideContent() {
	const links = document.querySelectorAll('a.section-link.active');
	for (let i = 0; i < links.length; i++) {
		links[i].classList.remove('active');
	}
}


// Expects the <a> element
// - needs href="#alpha"; title=""
function setState(el) {
	// const stateObj = { section: el.target.hash };
	// history.pushState(stateObj, el.target.title, el.target.href);
}

function initState() {
	// if null -- this is the first visit
	if (history.state !== null) {
		switch (history.state.section) {
			case "#design":
				console.log('design only');
				introTimeLine.play();
				document.querySelector('#design').click();
				// gsap.to(window, 0.1, {scrollTo:{y:'150'}});
				break;
			case "#dev":
				console.log('dev only');
				introTimeLine.play();
				// gsap.to(window, 0.1, {scrollTo:{y:'100'}});
				break;
			case "#about":
				introTimeLine.play();
				// gsap.to(window, 0.1, {scrollTo:{y:'100'}});
				console.log('about only');
				break;
			case '#main':
				introTimeLine.play();
				// gsap.to(window, 0.1, {scrollTo:{y:'100'}});
				break;
			case '#home':
			default:
				// Do nothing
				console.log('doing nothing');
				break;
		}
	}
}

function initParallax() {
	const scene = document.querySelector('.intro');
	parallaxInstance = new Parallax(scene, {
		relativeInput: true,
		hoverOnly: true,
		selector: '.bg, h1',
		pointerEvents: true
	});
}

function initModal() {
	let btns = document.querySelectorAll('.modal-btn');

	for (let i = 0; i < btns.length; i++) {
		const btn = btns[i];

		btn.addEventListener('click', function (e) {
			e.preventDefault();

			const clickedBtn = e.target.parentNode;
			const modal = document.getElementById('modals');
			const bubble = document.getElementById('modal-bubble');

			// put the right image into the bubble

			const imgSrc = clickedBtn.style.backgroundImage.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
			bubble.querySelector('img').setAttribute('src', imgSrc);

			// name of contents we want (eg. #design-stopsign)
			const targetHref = e.target.parentNode.dataset.contents;
			// console.log('a.modal-btn class:', e.target.parentNode.dataset.class);

			// Setup the correct modal SECTION to show
			const modalSection = document.getElementById(targetHref)

			// Setup the correct modal configuration
			if (clickedBtn.dataset.class == 'design') {
				modal.classList.add('design');
				modal.classList.remove('dev');
			}
			else if (clickedBtn.dataset.class == 'develop') {
				modal.classList.add('dev');
				modal.classList.remove('design');
			}

			// Show the modal, but behind the contents
			modalSection.classList.add('show');
			modal.classList.add('renderBehind');
			modal.scrollTo(0, 0);

			// get the final position
			const targetImg = modalSection.querySelector('img');
			const targetCoords = targetImg.getBoundingClientRect();
			// console.log('target coords:', targetImg.getBoundingClientRect());


			// Animate a surrogate image from the current clicked position to the new desired position
			// Hide the originall clicked button to avoid double vision
			bubble.classList.add('show');

			const coords = clickedBtn.getBoundingClientRect();
			// console.log('start coords:', coords);
			const scrolled = window.scrollY;
			bubble.style.top = coords.top + scrolled + 'px';
			bubble.style.left = coords.left + 'px';
			bubble.style.width = coords.width + 'px';
			bubble.style.height = coords.height + 'px';
			// console.log(window.scrollY);

			gsap.to(bubble, .75, {
				ease: "expo.easeInOut",
				top: targetCoords.top + scrolled + 'px',
				left: targetCoords.x,
				width: targetCoords.width,
				height: targetCoords.height,
				onStart: function () {
					clickedBtn.classList.add('hide');
				},
				onComplete: function () {

					// Bring the modal to the front
					modal.classList.add('show');
					// modal.style.zIndex = 500;
				}
			});
		});
	}

	let close = document.getElementById('close-btn').addEventListener('click', function (e) {

		const modalBtns = document.querySelectorAll('a.modal-btn.hide');
		for (let i = 0; i < modalBtns.length; i++) {
			modalBtns[i].classList.remove('hide');
		}

		const bubble = document.getElementById('modal-bubble');
		bubble.classList.remove('show');

		const modal = document.getElementById('modals')
		modal.classList.remove('show', 'renderBehind');

		const sections = document.querySelectorAll('#modals .section');
		for (let j = 0; j < sections.length; j++) {
			sections[j].classList.remove('show');
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const page = new Page();
	page.init();
});
window.addEventListener('DOMContentLoaded', function () {
	// new Page();
	// initParallax();
	// initIntro();
	// initNav();
	// initContentParallax();

	// initModal();
});
