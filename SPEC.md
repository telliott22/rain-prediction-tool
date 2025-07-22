# Project Specification & Planning Walkthrough

Transform your brainstorm into actionable plans using AI collaboration


## Spec Prompt Template
Copy and customize this prompt to help define what you're building:

```
Create or update the # Current Spec section of @SPEC.md based on @BRAINSTORM.md and the following:
- My app is for ordirinary people to let them the problem of knowing if they should take wet weather gear (an umbrella or rain coat) with them when they leave their house 
- The fidelity of my application right now will b a personal tool
- The form factor of my app will be a web app
- The most important features of my application are: 
    - a simple screen that will tell me if it will rain in my exact location in the next hour
    - information about the next time it will rain
    - A map showing the weather patterns in my exact location   
- change the styling of the entire website based on the weather, to make it obvious from a glance what it is. For example, background raining animation when it's raining, sun shinging when its sunny, snow when it's snowy etc
- Some key technology choices for my app are:
    - Programming language and framework based on form factor and preference:
        - React, Typescript, Tailwind, Shadcn UI
        - Next.JS 
        - Vercel
    - Cloud services I've already researched:
        - supabase, we should use this if we need an actual backend,not sure if we do

Create the spec so that it's ready for an AI coding agent to begin breaking it down into a phased task list. Don't include code or specific timelines or phases in the spec.
```

### If you need help brainstorming users and needs:

Try this exploration prompt:
```
I'm trying to decide who my users are and what they really need for my project in BRAINSTORM.md.

Help me think through:
- Who are the people that would actually use this? (be specific - not just "everyone")
- What are they trying to accomplish in their daily life/work?
- What's frustrating them right now about how they handle this?
- When and where would they use my solution?
- What would success look like from their perspective?
- Are there different types of users with different needs?
- What do they care about most: speed, simplicity, power, cost, etc.?

Ask me questions to help me get clearer on who I'm building for and what they really need.
```

### If you need help brainstorming application fidelity:

Try this exploration prompt:
```
I'm trying to decide what fidelity level to target for my project in BRAINSTORM.md.

Help me understand the different levels:
- Prototype: Just proving the concept works, rough around the edges
- Personal tool: Works well enough for me to use regularly
- Alpha: Good enough for friends/colleagues who know it's early
- Beta: Polished enough for strangers to try and give feedback
- Production: Ready for anyone to use and rely on

For each level, help me think through:
- How much time/effort would this require?
- What quality standards do I need to meet?
- How much testing and polish is needed?
- What happens if things break or don't work perfectly?
- What's my real goal - learning, solving my own problem, or building something others will use?

Based on my situation and goals, what fidelity level makes the most sense to start with?
```

### If you need help brainstorming form factors:

Try this exploration prompt:
```
I'm trying to decide what form factor would work best for BRAINSTORM.md. Take into account my application application fidelity will be [fidelity].

Walk me through the main options:
- Web application (and whether it needs to work offline)
- Mobile app (native vs web-based)
- Desktop application 
- Command line tool
- API/service that others can build on
- Browser extension
- Something else I might not have considered

For each option, help me think through:
- Who would use it and in what context?
- What are the unique advantages of this format?
- What would be challenging about building it this way?
- How would people discover and start using it?

Ask me clarifying questions about my users and use cases to help narrow it down.
```

### If you need help brainstorming important features:

Try this exploration prompt:
```
I'm trying to decide what the most important features should be for my project in BRAINSTORM.md.

Help me think through:
- What's the core action users need to take? (the one thing this must do well)
- What would the simplest version look like that still solves the problem?
- What features do I think are important vs. what users actually need?
- What would users expect to be able to do based on similar tools they've used?
- What features could wait for version 2?
- Are there any features that seem obvious but might actually be distracting?

Walk me through prioritizing features from "must have" to "nice to have" and help me question my assumptions about what's really needed.
```

### If you need help brainstorming key technology choices:

Try this exploration prompt:
```
I'm trying to decide on the technology stack for my project in BRAINSTORM.md.

I plan to use an AI code generation agent, so in general I want to optimize for that. Take into account my application application fidelity will be [fidelity].

Help me think through:
- Do I actually care which programming language is used (e.g. is there already existing code or libraries I need to work with)? What language would best suit the AI?
- Given my form factor choice, what are the standard/recommended frameworks?
- What's my software development experience level? Are there choices that might be more or less well suited to my background?
- Are there specific packages that I might want to consider that would influence my technology choices?
- What kind of interactions will there be between different users of the application, if any?
- Do I need a database? What kind of data am I storing?
- Where will this be hosted/deployed? What are my options?
- Are there any specific requirements (performance, integrations, etc.) that point to certain technologies?
- What would let me build fastest vs. what would be most maintainable long-term?

Suggest a simple tech stack that matches my skill level, project needs, and application fidelity and explain the trade-offs.
```

---

# Current Spec

## Application Overview

**Rain Prediction Tool** - A lightweight, shareable web application that helps ordinary people decide whether to take wet weather gear (umbrella or rain coat) when leaving their house.

## Target Users

**Primary User**: Person with keys in hand, about to leave the house, who needs an instant yes/no answer about rain in the next hour at their exact location.

**Core Use Case**: "Should I bring an umbrella/delay leaving right now?" moment - wants to know if it will rain (or stop raining) within the next hour at their precise location.

**Secondary Use Case**: Sharing specific location forecasts with friends via shareable links with location parameters.

## Application Fidelity

Personal tool - Works well enough for regular personal use with basic functionality and reliability. Optimized for simplicity and shareability.

## Form Factor

Static web application - lightweight, fast-loading, and easily shareable. No backend required unless absolutely necessary for core functionality.

## Core Features

### Primary Features (Must Have)

**Core Rain Information:**
- **Current Rain Status**: "It's raining now" or "It's not raining now" 
- **Next Hour Prediction**: "It will rain in X minutes" OR "It will stop raining in X minutes"
- **Weather Delay Suggestion**: "It will stop raining in X hours" (when currently raining)
- **Current Conditions**: When not raining, show "It's sunny/cloudy/etc."

**Location & Sharing:**
- **IP-Based Location**: Automatic location detection using IP geolocation for maximum precision
- **Query String Location Sharing**: Support `?lat=X&lng=Y` parameters to share specific location forecasts
- **Shareable Links**: Generate URLs that friends can use to see weather for a specific location

**Visual Design:**
- **Dynamic Weather-Based Styling**: Entire website appearance changes based on current weather conditions (rain animations for rainy weather, sun effects for sunny conditions, etc.)
- **Glanceable Interface**: Immediate visual clarity about whether to bring weather protection

### Location Detection Strategy
- Primary: IP geolocation for user's current location
- Secondary: URL parameters (`?lat=X&lng=Y`) for shared specific locations
- Focus on precision - neighborhood/block level accuracy

### User Experience Requirements
- Glanceable information - weather conditions should be obvious at first sight
- Simple, uncluttered interface prioritizing essential information
- Fast loading and responsive design

## Technology Stack

### Frontend Framework
- **React** with **TypeScript** for type safety and component architecture
- **Next.js** for full-stack React framework with server-side rendering capabilities
- **Tailwind CSS** for utility-first styling
- **Shadcn UI** for consistent, accessible component library

### Hosting & Deployment
- **Vercel** for seamless Next.js deployment and hosting

### Weather Data
- **Open-Meteo API** - Selected for client-side integration due to:
  - Full CORS support (no proxy needed)
  - No API key required
  - Excellent hourly precipitation data
  - Free for non-commercial use
  - Fast response times (<10ms)
- No backend database - all data fetched directly from weather APIs on the client side

## Technical Considerations

- Client-side weather data integration (no backend required)
- Static site generation for maximum performance and shareability
- Responsive design for multiple device types
- Performance optimization for fast loading
- Location privacy and user consent handling
- Weather animation and visual effects implementation
- URL sharing capability for easy friend sharing

## Success Criteria

**Primary Success**: User with keys in hand can instantly know:
- Whether to bring an umbrella (will it rain in the next hour?)
- Whether to delay leaving (will it stop raining soon?)
- Current conditions when not raining (sunny, cloudy, etc.)

**Secondary Success**: 
- Precise location-based predictions using IP geolocation
- Easy URL sharing for specific locations via query parameters
- Friends can instantly check weather for shared locations without setup

**User Experience Success**:
- Immediate visual feedback about current and upcoming rain
- Zero clicks required for core information
- Obvious visual distinction between rain/no-rain states

