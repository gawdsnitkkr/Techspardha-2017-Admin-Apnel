var base = "http://localhost:3000/api/";

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
    pdfs: 'STATIC PDF PATH'
};
