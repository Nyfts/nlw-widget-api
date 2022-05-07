import express from 'express';
import nodemailer from 'nodemailer';
import { prisma } from './prisma';

const app = express();

app.use(express.json());

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "29603024d157dc",
    pass: "cc32da7315f24e"
  }
});

app.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const feedback = await prisma.feedback.create({
    data: {
      comment,
      type,
      screenshot
    }
  });

  await transport.sendMail({
    from: 'Equipe Feedget <oi@feedget.com>',
    to: 'Luan Teixeira <luan.todos@gmail.com>',
    subject: 'Novo feedback',
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
      `<p>Tipo do feedback: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `</div>`,
    ].join('\n')
  });

  return res.status(201).json({ data: feedback });
})

app.listen(3333, () => {
  console.log('Http server running!');
});
