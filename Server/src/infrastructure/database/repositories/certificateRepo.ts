import { ICertificate } from "../../../domain/entities/Certificate";
import CertificateModel from "../models/certificateModel";

export interface ICertificateRepository {
  create(certificate: ICertificate): Promise<ICertificate>;
}

export class CertificateRepository implements ICertificateRepository {
  async create(certificate: ICertificate): Promise<ICertificate> {
    try {
      const newCertificate = new CertificateModel(certificate);
      return await newCertificate.save();
    } catch (error) {
      console.error("Error creating certificate:", error);
      throw error;
    }
  }
}
