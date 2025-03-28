import { hash } from "bcryptjs";
import { IAdminRepository } from "../../repositories/admin/IAdminRepository";
import { IAdminService } from "./IAdminService";
import { comparePassword } from "../../utils/hash";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { Roles } from "../../constants/roles";
import { ICompany } from "../../models/company/Company";
import { ERROR_MESSAGES } from "../../constants/messages";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { storeRefreshToken } from "../../helper/handleRefreshToken";

export class AdminService implements IAdminService {
  constructor(private readonly _adminRepository: IAdminRepository) {}
  async getAllCompanies(status:string): Promise<ICompany[] | []> {
    try {
      const companies = await this._adminRepository.getAllCompanies(status);
      return companies;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getAllInterivewers(status:string): Promise<IInterviewer[] | []> {
    try {
      console.log(status)
      const interviewers = await this._adminRepository.getAllInterviewers(status);
      return interviewers;
    } catch (error) {
      console.log(error)
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      let admin = await this._adminRepository.findByEmail(email);
      let isPassMatch = admin?.password === password;
      console.log(admin?.password, password);
      console.log(isPassMatch);
      if (!admin || !isPassMatch) {
        throw new CustomError(
          "Invalid email or password",
          HttpStatus.BAD_REQUEST
        );
      }
      const accessToken = await generateAccessToken(
        admin._id as string,
        Roles.ADMIN
      );
      const refreshToken = await generateRefreshToken(
        admin._id as string,
        Roles.ADMIN
      );
      await storeRefreshToken(admin._id as string,refreshToken)
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateCompanyStatus(companyId: string): Promise<ICompany|null> {
    try {
     let updatedCompany= await this._adminRepository.updateCompanyStatus(companyId);
     return updatedCompany;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async updateInterviewerStatus(interviewerId: string): Promise<IInterviewer|null> {
    try {
     let updatedInviewer= await this._adminRepository.updateInterviewerStatus(interviewerId);
     return updatedInviewer;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

   async handleCompanyVerification(
    companyId: string,
    isApproved: boolean
  ): Promise<ICompany | null> {
    try {
       const updatedCompany=await this._adminRepository.updateCompanyVerificationStatus(companyId,isApproved)
      return updatedCompany;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
   async handleInterviewerVerification(
    interviewerId: string,
    isApproved: boolean
  ): Promise<IInterviewer | null> {
    try {
       const updatedInterviewer=await this._adminRepository.updateInterviewerVerificationStatus(interviewerId,isApproved)
      return updatedInterviewer;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
