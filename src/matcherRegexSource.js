/**
 * @member Autolinker
 * @private
 * @property {RegExp} matcherRegex
 * 
 * The regular expression that matches URLs, email addresses, and Twitter handles.
 * 
 * Capturing groups:
 * 
 * 1. Group that is used to determine if there is a match at all. The regex ignores anchor tags including their innerHTML,
 *    so we check this to see if it is defined to see if the match is legitimate.
 * 2. Group that is used to determine if there is a Twitter handle match (i.e. @someTwitterUser). Simply check for its existence
 *    to determine if there is a Twitter handle match. The next couple of capturing groups give information about the Twitter 
 *    handle match.
 * 3. The whitespace character before the @sign in a Twitter handle. This is needed because there are no lookbehinds in JS regular
 *    expressions.
 * 4. The Twitter handle itself in a Twitter handle match.
 */
(function() {
	var anchorTagRegex = /<a\b[^<>]*>[\s\S]*?<\/a>/,        // for matching an anchor tag from <a> to </a>, so we don't auto-link any urls found within text that is already linked
	    
	    twitterRegex = /(^|\s)@(\w{1,15})/,                 // For matching a twitter handle. Ex: @gregory_jacobs
	    
	    protocolRegex = /(?:[A-Za-z]{3,9}:(?:\/\/)?)/,      // match protocol, allow in format http:// or mailto:
	    emailRegex = /(?:[\-;:&=\+\$,\w]+@)?/,              // allow something@ for email addresses
	    domainNameRegex = /[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/,  // anything looking at all like a domain, non-unicode domains, not ending in a period
	    
	    wwwRegex = /(?:www\.|[\-;:&=\+\$,\w]+@)/,           // starting with something@ or www.
	    
	    tldRegex = /\.(?:com|org|net|gov|edu|mil|us|info|biz|ws|name|mobi|cc|tv|co\.uk|de|ru|hu|fr|br)/,   // match our known top level domains (TLDs)
	    
	    pathRegex = /(?:\/[\+~%\/\.\w\-]*)?/,               // allow optional /path
	    queryStringRegex = /(?:\?[\-\+=&;%@\.\w]*)?/,       // allow optional query string starting with ? 
	    hashRegex = /(?:#[\-\.\!\/\\\w%]*)?/;               // allow optional hash anchor #anchor 
	
	return new RegExp( [
		anchorTagRegex.source,
		
		'|',  // An anchor tag including its innerHTML text (above), OR a real match. We'll text the $1 variable in code to see if we got an actual match from the first capturing group
		
		'(',  // *** Capturing group $1, which will be checked to see if we have a legitimate match
			'(',  // *** Capturing group $2, which can be used to check for a twitter handle
				// *** Capturing group $3, which matches the whitespace character before the '@' sign (because of no lookbehinds), and 
				// $4, which matches the actual twitter handle
				twitterRegex.source,  
			')',
			
			'|',
			
			'(?:', // parens to cover match for protocol (optional), and domain
				'(?:',  // non-capturing paren for a protocol or email address url 
					protocolRegex.source,
					emailRegex.source,
					domainNameRegex.source,
				')',
				'|',  // or instead of above
				'(?:',  // non-capturing paren for a 'www.' url
					wwwRegex.source,
					domainNameRegex.source,
				')',
				'|',
				'(?:',  // non-capturing paren for known a TLD url
					domainNameRegex.source,
					tldRegex.source,
				')',
			')',
			
			'(?:',  // parens to cover match for path, query string, and hash anchor
				pathRegex.source,
				queryStringRegex.source,
				hashRegex.source,
			')?',  // make this section optional
		')'
	].join( "" ), 'g' );
})();