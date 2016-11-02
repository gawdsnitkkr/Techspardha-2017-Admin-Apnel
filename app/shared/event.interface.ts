/**
 * Created by varun on 1/11/16.
 */
import { Admin } from './admin.interface';

export interface Event {
    eventName: string;
    description: string;
    venue: string;
    time: string;
    status: string;
    coordinators: Admin[]
}