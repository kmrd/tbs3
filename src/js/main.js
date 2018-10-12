// TODO: Use Babel to transform Classes into something that IE11 can interpret

var last_known_scroll_position;
var intro;
var introBtn;
var shutters;
var introTimeLine;
var freezeIntro; // freezes the intro screen in place
var sLinks;

function initIntro () {
	intro = document.querySelector('.intro');
	introBtn = document.querySelector('.introBtn');
	shutters = document.querySelectorAll('.shutters');
	freezeIntro = false;
	introTimeLine = new TimelineLite();

	introBtn.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		// Scroll the window. This triggers the intro 
		// animation as if the user had scrolled themselves
		TweenLite.to(window, 0.5, {scrollTo:{y:'100'}});
	});

	introTimeLine.add( TweenMax.to(intro, 0.8, { ease: Expo.easeInOut, y:'-100vh' }) );
	introTimeLine.add( TweenMax.to(shutters, 0.5, { ease: Expo.easeInOut, left:'100%' }) );
	introTimeLine.stop();

	initState();

	window.addEventListener('scroll', function(e) {
		if ( last_known_scroll_position < window.scrollY ) {
			history.pushState({ section: '#main' }, "Main", "#main");
			introTimeLine.play();
		} else {
			history.pushState({ section: '#home'}, "Home", "/");
			introTimeLine.reverse();
		}

		last_known_scroll_position = window.scrollY;
	});
}

function initNav() {
	sLinks = document.querySelectorAll('.section-link');

	// TODO: check if there's a history state to resume to.

	for( let i = 0; i < sLinks.length; i++) {
		sLinks[i].addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			var stateObj = { section: e.target.hash };
			history.pushState(stateObj, e.target.title, e.target.href);
		});
	}

}

function initState() {
	// if null -- this is the first visit
	if ( history.state !== null ) {
		switch( history.state.section ) {
			case "#design":
				console.log('design only');
				introTimeLine.play();
				break;
			case "#dev":
				console.log('dev only');
				introTimeLine.play();
				break;
			case "#about":
				introTimeLine.play();
				console.log('about only');
				break;
			case '#main':
				introTimeLine.play();
				break;
			case '#home':
			default:
				// Do nothing
				console.log('doing nothing');
				break;
		}
	}
}


window.addEventListener('DOMContentLoaded', function() {
	initIntro();
	initNav();
	// initState(); // This is called in initIntro -- AFTER the timelines are defined
	// console.log('DOM loaded')
});

window.onload = function() {
	console.log('all contents loaded');
};