import { Request, Response } from "express";

export interface IInterviewerController{
    getInterviewerProfile(request: Request, response: Response): Promise<void>;
    updateInterviewerProfile(request: Request, response: Response): Promise<void>;
}