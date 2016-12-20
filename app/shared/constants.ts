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
    pdfs: 'http://localhost:3000/api/admin/upload'
};
