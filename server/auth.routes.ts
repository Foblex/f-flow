import { Router } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

authRouter.get('/auth/github', (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=read:user%20user:email`;
  res.redirect(redirectUrl);
});

authRouter.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code as string;

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });

    const user = userRes.data;

    const jwtToken = jwt.sign(
      { id: user.id, login: user.login, avatar: user.avatar_url },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect('/');
  } catch (err) {
    console.error('GitHub Auth Error:', err);
    res.status(500).send('Authentication failed');
  }
});
