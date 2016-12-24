var base = "http://anshulmalik.me/api/";

export var apis = {
    login: base + 'admin/login',
    myEvent: base + 'admin/events',
    getParticipants : (eventId : number)=> {
        return base + 'event/' + eventId + '/participants';
    },
    getEvent: (eventId: number) => {
        return base + 'event/'+ eventId;
    },
    forwardParticipant: (eventId: number) => {
        return base + 'event/' + eventId + '/forward';
    },
    pdfs: base + 'admin/upload',
    notifyAll: (eventId: number) => {
        return base + 'event/' + eventId + '/notify/all';
    },
    notify: (eventId: number) => {
        return base + 'event/' + eventId + '/notify';
    }
};
