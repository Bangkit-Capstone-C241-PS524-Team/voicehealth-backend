import { MailService } from './mail.service';

describe('Test email service', () => {
    let mailService: MailService;
    beforeEach(() => {
        mailService = new MailService();
    });

    it(
        'should send mail',
        async () => {
            await mailService.sendEmail(
                'wisnuyeahfaizal@gmail.com',
                'Email Testing',
                'https://youtube.com',
            );
        },
        3000 * 1000,
    );
});
