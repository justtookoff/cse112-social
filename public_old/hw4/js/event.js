const TeamSnip = { currentEventFeed : undefined };

class EventFeed {

    constructor() {
        this.events = [];     
    }

    addEvent(name,eventType) {
        let event = new Event(name,eventType);
        this.events.push(event);
    }

    render() {
        console.log(TeamSnip.currentEventFeed.events.length);
        let template = document.querySelector('#events');
        let markup = "<ul>";
        for (let i=0, len = TeamSnip.currentEventFeed.events.length; i < len; i++) {
            markup += TeamSnip.currentEventFeed.events[i].render(); 
        }
        markup += '</ul>';

        template.content.querySelector('#eventList').innerHTML = markup;
    
        let clonedTemplate = document.importNode(template.content, true);
        
        let view = document.querySelector('#view');
        view.innerHTML = "";
        view.appendChild(clonedTemplate);

    }
}

class Event {

    constructor(name, event) {
        this.name = name;
        this.event = event;
    }

    render() {
        let MARKUP = '';
        if (!this.archived) {
        MARKUP = `<li class="event btn">
            ${this.name}, ${this.event}
            </li>`;
        }
        return MARKUP;
    }

}

function submitEvent() {
    var e = document.getElementById('event_types');
    var eToAdd = e.options[e.selectedIndex].value;
    var n = document.getElementById('player_name');
    var nToAdd = n.options[n.selectedIndex].textContent;
    var pId = n.options[n.selectedIndex].id;
    console.log(nToAdd, eToAdd);
    TeamSnip.currentEventFeed.addEvent(nToAdd,eToAdd);
    TeamSnip.currentEventFeed.render();

    // update player stats
    var out = JSON.parse(window.localStorage['roster']);
    if(eToAdd == 'Goal') {
        for(let i = 0; i < out.length; i++) {
            if(out[i].playerId == pId) {
                out[i].goals++;
            }
        }
    }

    window.localStorage['roster'] = JSON.stringify(out);
    
    var out = JSON.parse(window.localStorage['roster']);
    console.log(out);
    window.localStorage['events'] = JSON.stringify(TeamSnip.currentEventFeed.events);
}

window.addEventListener('DOMContentLoaded', function() {
    //read in from localStorage
    if(window.localStorage['loaded']) {
        var out = JSON.parse(window.localStorage['roster']);
        let markup = '';
        for (let i = 0; i < out.length; i++) {
            //TeamSnip.currentRoster.addPlayer(out[i].name,out[i].number,out[i].position);
            // console.log(out[i].name,out[i].number,out[i].position);
            markup += "<option id=" + out[i].playerId + ">" + out[i].name + "</option>";
        } 
        document.querySelector("#player_name").innerHTML = markup;
    }

    TeamSnip.currentEventFeed = new EventFeed();    
    if(window.localStorage['events']) {
        var out = JSON.parse(window.localStorage['events']);
        for(let i=0; i < out.length; i++) {
            TeamSnip.currentEventFeed.addEvent(out[i].name,out[i].event);
        }
    }
    TeamSnip.currentEventFeed.render();
}
, false);