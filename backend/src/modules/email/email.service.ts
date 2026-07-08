import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../../prisma/prisma.service';
import {
  appointmentCancelledTemplate,
  appointmentConfirmedTemplate,
  appointmentCreatedTemplate,
  appointmentRescheduledTemplate,
} from './templates';

export type EmailType = 'CREATED' | 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED';

interface SendAppointmentEmailParams {
  appointmentId: string;
  to: string;
  type: EmailType;
  data: {
    customerName: string;
    serviceName: string;
    date: string;
    startTime: string;
    managementUrl?: string;
    businessName: string;
  };
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
  }

  private renderTemplate(type: EmailType, data: SendAppointmentEmailParams['data']) {
    switch (type) {
      case 'CREATED':
        return { subject: 'Reservación recibida - ' + data.businessName, html: appointmentCreatedTemplate(data) };
      case 'CONFIRMED':
        return { subject: 'Tu cita fue confirmada - ' + data.businessName, html: appointmentConfirmedTemplate(data) };
      case 'CANCELLED':
        return { subject: 'Cita cancelada - ' + data.businessName, html: appointmentCancelledTemplate(data) };
      case 'RESCHEDULED':
        return { subject: 'Tu cita fue reagendada - ' + data.businessName, html: appointmentRescheduledTemplate(data) };
    }
  }

  async sendAppointmentEmail(params: SendAppointmentEmailParams) {
    const { appointmentId, to, type, data } = params;
    const { subject, html } = this.renderTemplate(type, data);

    let status = 'SENT';
    let error: string | null = null;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || `"${data.businessName}" <no-reply@barberflow.com>`,
        to,
        subject,
        html,
      });
    } catch (e) {
      status = 'FAILED';
      error = (e as Error).message;
      this.logger.error(`Error enviando correo (${type}) a ${to}: ${error}`);
    }

    await this.prisma.emailLog.create({
      data: { appointmentId, to, subject, type, status, error },
    });
  }
}
