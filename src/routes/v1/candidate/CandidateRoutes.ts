import { Router } from "express";
import { CandidateService } from "../../../services/candidate/CandidateService";
import { CandidateRepository } from "../../../repositories/candidate/CandidateRepository";
import { CandidateController } from "../../../controllers/candidate/CanidateController";

const router=Router()

const candidateRepository=new CandidateRepository();
const candidateService=new CandidateService(candidateRepository)
const candidateController=new CandidateController(candidateService)

router.post('/login',candidateController.login.bind(candidateController))




export default router