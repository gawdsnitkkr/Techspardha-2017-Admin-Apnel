/**
 * Created by varun on 1/11/16.
 */
import { Admin } from './admin.interface';

export interface Event {
    name: string;
    description: string;
    venue: string;
    date: string;
    time: string;
    status: string;
    coordinators: Admin[]
}