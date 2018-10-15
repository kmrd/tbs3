// TODO: Make ES6 style classes? Use () => {} notation (needs transpiling)
// TODO: Use Babel to transform Classes into something that IE11 can interpret?

// var last_known_scroll_position;
// var isIntroFrozen; // freezes the intro screen in place
var isShowingContents; // if the nav sections are showing their content

// var intro; 	// intro section
// var introBtn; // ScrollDown button on the intro pane
var parallaxInstance;

var navShutters;
var introTimeLine;
var sectionTimeLine;
var navLinks; // main content links

// var hamburgerLinks; // menu links
var sections; // all the content sections
var currentSection;

// var shutterLinks; // both the shutterLinks and the hamburgerLinks


function initIntro () {
	let intro = document.querySelector('.intro');
	let introBtn = document.querySelector('.introBtn');
	let last_known_scroll_position;
	// isIntroFrozen = false;

	introBtn.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		// Scroll the window. This triggers the intro 
		// animation as if the user had scrolled themselves
		TweenLite.to(window, 0.5, {scrollTo:{y:'100'}});
	});

	window.addEventListener('scroll', function(e) {
		if(!isShowingContents) {

			// console.log(parallaxInstance);

			if ( last_known_scroll_position < window.scrollY ) {
				history.pushState({ section: '#main' }, "Main", "#main");
  				parallaxInstance.disable();

				introTimeLine.play();
			} else {
				history.pushState({ section: '#home'}, "Home", "/");
  				parallaxInstance.enable();
				introTimeLine.reverse();
			}

			last_known_scroll_position = window.scrollY;
		}
	});
}


function initNav() {
	isShowingContents = false;
	let intro = document.querySelector('.intro');
	navLinks = document.querySelectorAll('nav>a');
	navShutters = document.querySelectorAll('.shutters');
	sections = document.querySelectorAll('section>.pane');
	introTimeLine = new TimelineLite();

	// Hide the intro and retract  the navShutters
	introTimeLine.add( TweenMax.to(intro, 0.8, { ease: Expo.easeInOut, y:'-100vh' }) );
	introTimeLine.add( TweenMax.staggerTo(navShutters, 0.5, { ease: Expo.easeInOut, left:'100%' }, 0.08) );
	introTimeLine.stop();

	// Check if there's a historic state to resume to
	initState();


	for( let i = 0; i < navLinks.length; i++) {
		
		navLinks[i].addEventListener('mouseover', function(e) {
			if ( !isShowingContents ) {
				TweenMax.to(navLinks, 0.5, {
					flex:'1'
				});
				TweenMax.killTweensOf(e.target, { flex: true });
				TweenMax.to(e.target, 0.5, {
					// ease: Expo.easeInOut,
					flex: '1.3'
				});
			}
		});

		// TODO: Hookup hamburger nav to these animations
		navLinks[i].addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			setState(e.target);

			sectionTimeLine = new TimelineLite();

			// If we're inside of a section, backout of it
			if (isShowingContents && currentSection) {
				console.log('backingout');
				sectionTimeLine.add( TweenMax.to(window, 0.3, {
					scrollTo: 0,
					onComplete: setStateNav
				}) );
			}

			sectionTimeLine.add("startTransition");

			sectionTimeLine.add( TweenMax.to(navLinks, 0.8, {
				ease: Expo.easeInOut,
				flex:'1'
			}), "startTransition" );
			TweenMax.killTweensOf(e.target, { flex: true });
			sectionTimeLine.add( TweenMax.to(e.target, 0.8, {
				ease: Expo.easeInOut,
				flex:'30',
				onStart: setTransitionStateToContents,
				onStartParams: [e.target],
				onComplete: setStateContents,
				onCompleteParams: [e.target],
			}), "startTransition" );

			currentSection = document.querySelector(e.target.hash);
		});
	}


	// TODO: hook up hamburger
	// hamburger.addEventListener('click', function(e) {
	// 	let nav = document.querySelector('nav');
	// 	nav.classList.toggle('visible');
	// })
}
/*
function makeLinkActive(target) {
	// isIntroFrozen = true;
	isShowingContents = true;

	window.scrollTo(0,0);

	// for(let i = 0; i < sections.length; i++) {
	// 	s = sections[i];
	// console.log(target.hash.substr(1));
	console.log(target);
	target.classList.add('active');
	// 	if(s.id === target.hash.substr(1)) {
	// 		s.classList.add('active');
	// 	} else {
	// 		s.classList.remove('active');
	// 	}
	// }
}*/

// Do this to get back to 3 shutters layout
function setStateNav(params) {
	// console.log(params);
	deactivateLinks(params);
	deactivateContentPanes(params);
}
function deactivateLinks() {
	for(let i = 0; i < navLinks.length; i++)
	{
		navLinks[i].classList.remove('active');
	}
}
function deactivateContentPanes() {
	for(let i = 0; i < sections.length; i++)
	{
		sections[i].classList.remove('active');
	}
}


// Do this to get back to show some Contents
function setTransitionStateToContents(target) {
	isShowingContents = true;

	// undo the scrolling needed for the intro
	window.scrollTo(0,0);
	
	// get the content ready to reveal in the background
	let content = document.querySelector(target.hash);
	content.classList.add('active');
}
function setStateContents(params) {
	console.log(params);
	showContent(params);
}
function showContent(target) {
	// console.log('showContents');
	// console.log(target);
	let link = target;
	link.classList.add('active');
	// console.log('hash', target.hash) ;
	// console.log('href', target.href);
	// .classList.toggle('active');
	// target.classList.toggle('hide');
	// console.log(target);
	// document.querySelectorAll('.pane').
	// document.querySelector(target.href).
	// document.querySelector(target.href).
	// document.querySelector('main').style.height='auto';
	// document.querySelector('main').style.position='relative';

	// console.log(contents.attributes);
	// console.log(contents.getBoundingClientRect());
}

// Expects the <a> element
// - needs href="#alpha"; title=""
function setState(el) {
	var stateObj = { section: el.target.hash };
	history.pushState(stateObj, el.target.title, el.target.href);
}

function initState() {
	// if null -- this is the first visit
	if ( history.state !== null ) {
		switch( history.state.section ) {
			case "#design":
				console.log('design only');
				introTimeLine.play();
				// TweenLite.to(window, 0.1, {scrollTo:{y:'100'}});
				break;
			case "#dev":
				console.log('dev only');
				introTimeLine.play();
				// TweenLite.to(window, 0.1, {scrollTo:{y:'100'}});
				break;
			case "#about":
				introTimeLine.play();
				// TweenLite.to(window, 0.1, {scrollTo:{y:'100'}});
				console.log('about only');
				break;
			case '#main':
				introTimeLine.play();
				// TweenLite.to(window, 0.1, {scrollTo:{y:'100'}});
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
	var scene = document.querySelector('.intro');
	parallaxInstance = new Parallax(scene, {
	  	relativeInput: true,
	  	hoverOnly: true,
	  	selector: '.bg, h1',
	  	pointerEvents: true
	});
}


window.addEventListener('DOMContentLoaded', function() {
	initParallax();
	initIntro();
	initNav();
	// initState(); // This is called in initIntro -- AFTER the timelines are defined
	// console.log('DOM loaded')
});

window.onload = function() {
	console.log('all contents loaded');
};
