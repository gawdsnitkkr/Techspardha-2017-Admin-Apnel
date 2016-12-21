import { Admin } from './admin.interface';

export interface Event {
    Name: string;
    Description: string;
    Venue: string;
    Start: string;
    End: string;
    Rules: string;
    CurrentRound: number;
    MaxContestants: number;
    Status: string;
    Pdf: string;
    CategoryId: number;
    SocietyId: number;
    Rounds: number;
}
