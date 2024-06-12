import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private generalTemplate: handlebars.TemplateDelegate;

    constructor() {
        this.transporter = nodemailer.createTransport(
            {
                host: process.env.MAIL_HOST,
                port: Number(process.env.MAIL_PORT),
                secure: process.env.MAILER_SECURE === 'true',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            {
                from: {
                    name: 'No-reply',
                    address: process.env.MAIL_FROM,
                },
            },
        );

        this.generalTemplate = this.loadTemplate('general.hbs');
    }

    private loadTemplate(templateName: string): handlebars.TemplateDelegate {
        const templatesFolderPath = path.join(
            __dirname,
            './../../../templates/',
        );
        const templatePath = path.join(templatesFolderPath, templateName);

        const templateSource = fs.readFileSync(templatePath, 'utf8');
        return handlebars.compile(templateSource);
    }

    public async sendEmail(
        to: string,
        subject: string,
        verificationUrl: string,
    ): Promise<void> {
        const htmlContent = this.generalTemplate({
            verificationUrl,
            year: new Date().getFullYear().toString(),
        });

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: to,
            subject: subject,
            html: htmlContent,
            header: 'Welcome to Our Service!',
            message:
                'Thank you for signing up. We are excited to have you on board.',
            year: new Date().getFullYear().toString(),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email: ', error);
        }
    }
}
