// TODO: Use Babel to transform Classes into something that IE11 can interpret

var last_known_scroll_position;
var isIntroFrozen; // freezes the intro screen in place
var isShowingContents;

var intro; 	// intro section
var introBtn; // ScrollDown button on the intro pane
var shutters;
var introTimeLine;
var sectionTimeLine;
var navLinks; // main content links

// var hamburgerLinks; // menu links
var sections; // all the content sections
var currentSection;

// var shutterLinks; // both the shutterLinks and the hamburgerLinks


function initIntro () {
	intro = document.querySelector('.intro');
	introBtn = document.querySelector('.introBtn');
	isIntroFrozen = false;

	introBtn.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		// Scroll the window. This triggers the intro 
		// animation as if the user had scrolled themselves
		TweenLite.to(window, 0.5, {scrollTo:{y:'100'}});
	});

	window.addEventListener('scroll', function(e) {
		if(!isIntroFrozen) {
			if ( last_known_scroll_position < window.scrollY ) {
				history.pushState({ section: '#main' }, "Main", "#main");
				introTimeLine.play();
			} else {
				history.pushState({ section: '#home'}, "Home", "/");
				introTimeLine.reverse();
			}

			last_known_scroll_position = window.scrollY;
		}
	});
}


function initNav() {
	isShowingContents = false;
	// hamburger = document.querySelector('.nav-hamburger');
	navLinks = document.querySelectorAll('nav>a');
	shutters = document.querySelectorAll('.shutters');
	sections = document.querySelectorAll('section>.pane');
	introTimeLine = new TimelineLite();
	// sections = document.querySelectorAll('nav>a');

	// Hide the intro and retract  the shutters
	introTimeLine.add( TweenMax.to(intro, 0.8, { ease: Expo.easeInOut, y:'-100vh' }) );
	introTimeLine.add( TweenMax.staggerTo(shutters, 0.5, { ease: Expo.easeInOut, left:'100%' }, 0.08) );
	introTimeLine.stop();


	// Check if there's a historic state to resume to
	initState();


	for( let i = 0; i < navLinks.length; i++) {
		navLinks[i].addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			setState(e.target);

			sectionTimeLine = new TimelineLite();

			// If we're inside of a section, backout of it
			if (isShowingContents && currentSection) {
				sectionTimeLine.add( TweenMax.to(window, 0.3, {
					scrollTo: 0,
					onComplete: deactivateLinks
				}) );
			}

			// TODO: Hookup hamburger nav to these animations
			sectionTimeLine.add( TweenMax.to(navLinks, 0.8, {
				ease: Expo.easeInOut,
				flex:'1'
			}) );
			sectionTimeLine.add( TweenMax.to(e.target, 0.8, {
				ease: Expo.easeInOut,
				flex:'30',
				onStart: makeLinkActive,
				onStartParams: [e.target],
				onComplete: showContents,
				onCompleteParams: [e.target],
			}) );

			currentSection = document.querySelector(e.target.hash);
		});
	}


	// TODO: hook up hamburger
	// hamburger.addEventListener('click', function(e) {
	// 	let nav = document.querySelector('nav');
	// 	nav.classList.toggle('visible');
	// })
}

function makeLinkActive(target) {
	// console.log(target);
	// let contents = target.querySelector('.contents');
	isIntroFrozen = true;
	isShowingContents = true;
	// TweenLite.to(window, 0.1, {scrollTo:{y:'100'}}).progress(1);
	// var domScroll = $(domId).offset().top;
	// console.log( window.offset().top );
	window.scrollTo(0,0);
	// document.querySelector('body').classList.toggle('showContents');

	// sections.classList.toggle('')
	for(let i = 0; i < sections.length; i++) {
		s = sections[i];

		if(s.id === target.hash.substr(1)) {
			s.classList.add('active');
		} else {
			s.classList.remove('active');
		}
	}
}
function deactivateLinks() {
	for(let i = 0; i < navLinks.length; i++)
	{
		// console.log('resetting');
		navLinks[i].classList.remove('active');
		navLinks[i].classList.remove('hide');
	}

}

function showContents(target) {
	// console.log('showContents');

	target.classList.toggle('active');
	target.classList.toggle('hide');
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
	var parallaxInstance = new Parallax(scene, {
	  	relativeInput: true,
	  	hoverOnly: true,
	  	selector: '.bg, h1',
	  	pointerEvents: true
	});
}


window.addEventListener('DOMContentLoaded', function() {
	initIntro();
	initNav();
	initParallax();
	// initState(); // This is called in initIntro -- AFTER the timelines are defined
	// console.log('DOM loaded')
});

window.onload = function() {
	console.log('all contents loaded');
};
